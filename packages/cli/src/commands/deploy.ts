import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import { type Choice } from 'prompts'
import {
  betterPrompts,
  getPersonalAccessToken,
  isValidPackageName,
  promptName,
  runCommand,
} from '../utils'
import { Scope, StoryblokClient } from '../storyblok/storyblok-client'

const packageNameMessage =
  'How would you like to call the deployed field-plugin?\n  (Lowercase alphanumeric and dash are allowed.)'

export type FieldType = { id: number; name: string; body: string }

export type DeployArgs = {
  skipPrompts: boolean
  dir: string
  name: undefined | string
  token: undefined | string
  output: undefined | string
  dotEnvPath: undefined | string
  scope: undefined | Scope
}

type DeployFunc = (args: DeployArgs) => Promise<void>

type UpsertFieldPluginFunc = (args: {
  dir: string
  packageName: string
  skipPrompts?: boolean
  token: string
  output: string
  scope: Scope
}) => Promise<{ id: number }>

export const deploy: DeployFunc = async ({
  skipPrompts,
  token,
  name,
  dir,
  output,
  dotEnvPath,
  scope,
}) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  const result = await getPersonalAccessToken({ token, dotEnvPath })
  if (result.error === true) {
    console.error(red('[ERROR]'), result.message)
    console.error(
      'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
    )
    process.exit(1)
  }

  const packageName = await decidePackageName({ name, skipPrompts, dir })

  if (typeof packageName !== 'string' || packageName === '') {
    console.log(red('[ERROR]'), 'Package name is missing.')
    console.log(
      'Please provide a valid --name option value or type a valid one to the prompt.',
    )
    process.exit(1)
  }

  if (!scope && skipPrompts) {
    console.error(
      red('[ERROR]'),
      'Please provide a value for the --scope flag when using --skipPrompts.',
    )
    process.exit(1)
  }
  const apiScope = scope || (await selectApiScope(result.token))

  console.log(bold(cyan(`[info] Plugin name: \`${packageName}\``)))

  // path of the specific field-plugin package
  const defaultOutputPath = resolve(dir, 'dist', 'index.js')
  const outputPath =
    typeof output !== 'undefined' ? resolve(output) : defaultOutputPath

  if (!existsSync(outputPath)) {
    console.log(
      red('[ERROR]'),
      'The build output is not found at the following path:',
    )
    console.log(`  > ${outputPath}`)
    process.exit(1)
  }

  const outputFile = readFileSync(outputPath).toString()

  const { id: fieldPluginId } = await upsertFieldPlugin({
    dir,
    packageName,
    skipPrompts,
    token: result.token,
    output: outputFile,
    scope: apiScope,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin is deployed successfully.',
  )

  console.log('You can find the deployed plugin at the following URL:')
  if (apiScope === 'partner-portal') {
    console.log(
      `  > https://app.storyblok.com/#/partner/fields/${fieldPluginId}`,
    )
  } else {
    console.log(`  > https://app.storyblok.com/#/me/plugins/${fieldPluginId}`)
  }
  console.log(
    'You can also find it in "My account > My Plugins" at the bottom of the sidebar.',
  )
}

const decidePackageName = async ({
  name,
  skipPrompts,
  dir,
}: {
  name?: string
  skipPrompts: boolean
  dir: string
}) => {
  if (typeof name === 'string' && name.length > 0) {
    return name
  }

  const packageNameFromPackageJson = getPackageName(dir)

  if (skipPrompts) {
    if (isValidPackageName(packageNameFromPackageJson)) {
      return packageNameFromPackageJson
    } else {
      console.log(red('[ERROR]'), 'The package name is missing')
      console.log(
        'Use `--name <package-name>` or `--dir <path-to-package>` to specify the package name.',
      )
      process.exit(1)
    }
  }

  return await promptName({
    message: packageNameMessage,
    initialValue: packageNameFromPackageJson,
  })
}

const upsertFieldPlugin: UpsertFieldPluginFunc = async (args) => {
  const { packageName, skipPrompts, token, output, dir, scope } = args

  const storyblokClient = StoryblokClient({ token, scope })

  console.log(bold(cyan('[info] Fetching field plugins...')))
  const allFieldPlugins = await storyblokClient.fetchAllFieldTypes()
  const fieldPlugin = allFieldPlugins.find(
    (fieldPlugin) => fieldPlugin.name === packageName,
  )

  if (fieldPlugin) {
    // update flow
    const mode = skipPrompts ? 'update' : await selectUpsertMode()
    if (mode === 'update') {
      await storyblokClient.updateFieldType({
        id: fieldPlugin.id,
        field_type: {
          body: output,
        },
      })
      return { id: fieldPlugin.id }
    } else if (mode === 'create') {
      const newName = await promptNewName(allFieldPlugins)
      const newFieldPlugin = await storyblokClient.createFieldType({
        name: newName,
        body: output,
      })
      if (await confirmUpdatingName()) {
        await runCommand(`npm pkg set name=${newName}`, { cwd: dir })
      }
      return { id: newFieldPlugin.id }
    }
  }

  // create flow
  const create = skipPrompts
    ? true
    : await confirmCreatingFieldPlugin(packageName)
  if (!create) {
    console.log(cyan(bold('[info]')), 'Not creating a new field plugin.')
    process.exit(1)
  }
  const newFieldPlugin = await storyblokClient.createFieldType({
    name: packageName,
    body: output,
  })
  return { id: newFieldPlugin.id }
}

const getPackageName = (path: string): string | undefined => {
  if (!lstatSync(path).isDirectory()) {
    return
  }

  if (!isBuildable(path)) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: { name: string } = JSON.parse(
    readFileSync(resolve(path, 'package.json')).toString(),
  )

  if (!json.name) {
    return
  }

  return json.name
}

const selectUpsertMode = async () => {
  const { mode } = await betterPrompts<{ mode: 'update' | 'create' }>([
    {
      type: 'select',
      name: 'mode',
      message: 'Update the existing field plugin?',
      choices: [
        {
          title: 'Yes, update it.',
          value: 'update',
        },
        {
          title: 'No, create a new one.',
          value: 'create',
        },
      ],
    },
  ])

  return mode
}

const confirmCreatingFieldPlugin = async (name: string) => {
  const { create } = await betterPrompts<{ create: boolean }>({
    type: 'confirm',
    name: 'create',
    message: `You want to create a new field plugin \`${name}\`?`,
    initial: true,
  })
  return create
}

const confirmUpdatingName = async () => {
  const { update } = await betterPrompts<{ update: boolean }>({
    type: 'confirm',
    name: 'update',
    message: `Do you update the name in \`package.json\``,
    initial: false,
  })
  return update
}

const promptNewName = async (allFieldPlugins: FieldType[]) => {
  const { name } = await betterPrompts<{ name: string }>({
    type: 'text',
    name: 'name',
    message: 'Enter the new name of the field plugin:',
    validate: (name: string) => {
      if (!isValidPackageName(name)) {
        return false
      }
      return allFieldPlugins.every((plugin) => plugin.name !== name)
    },
  })
  return name
}

const isBuildable = (path: string) => {
  if (!existsSync(resolve(path, 'package.json'))) {
    console.log(
      `[info] ${yellow(basename(path))} doesn't have \`package.json\`.`,
    )
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const packageJson = JSON.parse(
    readFileSync(resolve(path, 'package.json')).toString(),
  )

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access
  if (!packageJson?.scripts?.build) {
    console.log(
      `[info] ${yellow(
        basename(path),
      )}/package.json doesn't have \`build\` script.`,
    )
    return false
  }

  return true
}

const selectApiScope = async (token: string): Promise<Scope> => {
  const accessibleToMyPlugins = await StoryblokClient({
    token,
    scope: 'my-plugins',
  }).isAuthenticated()

  const accessibleToPartnerPortal = await StoryblokClient({
    token,
    scope: 'partner-portal',
  }).isAuthenticated()

  if (!accessibleToMyPlugins && !accessibleToPartnerPortal) {
    console.error(
      red('[ERROR]'),
      `The token appears to be invalid as it does not have access to either My Plugins or the plugins on the Partner Portal.`,
    )
    process.exit(1)
  }

  const { scope } = await betterPrompts<{ scope: Scope }>([
    {
      type: 'select',
      name: 'scope',
      message: 'Where to deploy the plugin?',
      choices: [
        accessibleToMyPlugins && {
          title: 'My Plugins',
          value: 'my-plugins',
        },
        accessibleToPartnerPortal && {
          title: 'Partner Portal',
          value: 'partner-portal',
        },
      ].filter(Boolean) as Choice[],
    },
  ])

  return scope
}
