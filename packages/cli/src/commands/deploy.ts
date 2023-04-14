import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import prompts, { type Choice } from 'prompts'
import { getPersonalAccessToken, promptName } from '../utils'
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

type GetFieldPluginToUpdateFunc = (args: {
  fieldType: FieldType
  skipPrompts?: boolean
  packageName: string
  output: string
  path: string
}) => Promise<{ id: number; field_type: { body: string } }>

type UpsertFieldPluginFunc = (args: {
  path: string
  packageName: string
  skipPrompts?: boolean
  token: string
  output: string
  scope: Scope
}) => Promise<number>

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

  const result = getPersonalAccessToken({ token, dotEnvPath })
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
      '--scope is missing while --skipPrompts is given.',
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

  const fieldPluginId = await upsertFieldPlugin({
    path: dir,
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

  if (skipPrompts) {
    return getPackageName(dir)
  }

  return await promptName({
    message: packageNameMessage,
    initialValue: getPackageName(dir),
  })
}

const upsertFieldPlugin: UpsertFieldPluginFunc = async (args) => {
  const { packageName, skipPrompts, token, output, path, scope } = args

  const storyblokClient = StoryblokClient({ token, scope })

  console.log(bold(cyan('[info] Fetching field plugins...')))

  const fieldTypes = await storyblokClient.fetchAllFieldTypes()

  const matchingFieldType = fieldTypes.find(
    (fieldType) => fieldType.name === packageName,
  )

  if (matchingFieldType) {
    const fieldPlugin = await getFieldPluginToUpdate({
      fieldType: matchingFieldType,
      path,
      packageName,
      skipPrompts,
      output,
    })
    await storyblokClient.updateFieldType(fieldPlugin)
    return fieldPlugin.id
  }

  console.log(
    bold(
      cyan(
        '[info] A matching field type is not found. So, we are creating a new field plugin in Storyblok.',
      ),
    ),
  )

  const createdFieldPlugin = await storyblokClient.createFieldType({
    name: packageName,
    body: output,
  })
  return createdFieldPlugin.id
}

const getFieldPluginToUpdate: GetFieldPluginToUpdateFunc = async (args) => {
  const { fieldType, skipPrompts, packageName, output, path } = args

  console.log(bold(cyan('[info] Found a matching field type.')))

  const mode = skipPrompts ? 'update' : await selectUpsertMode()
  if (mode === 'create') {
    const packageJsonPath = resolve(path, packageName, 'package.json')
    console.log(
      bold(red('[ERROR]')),
      'You cannot create a new field type because the same name already exists.',
    )
    console.log('You must rename the one in this repository first.')
    console.log(`  Rename \`name\` value at the following file:`)
    console.log(`  > ${packageJsonPath}`)
    process.exit(1)
  }

  return {
    id: fieldType.id,
    field_type: {
      body: output,
    },
  }
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
  const { mode } = (await prompts(
    [
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
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { mode: 'update' | 'create' }

  return mode
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
  const accessibleToMySpace = await StoryblokClient({
    token,
    scope: 'my-space',
  }).isAuthenticated()

  const accessibleToPartnerPortal = await StoryblokClient({
    token,
    scope: 'partner-portal',
  }).isAuthenticated()

  if (!accessibleToMySpace && !accessibleToPartnerPortal) {
    console.error(
      red('[ERROR]'),
      `The given token(\`${token}\`) seems to be invalid.`,
    )
    process.exit(1)
  }

  const { scope } = (await prompts(
    [
      {
        type: 'select',
        name: 'scope',
        message: 'Where to deploy the plugin?',
        choices: [
          accessibleToMySpace && {
            title: 'My Space',
            value: 'my-space',
          },
          accessibleToPartnerPortal && {
            title: 'Partner Portal',
            value: 'partner-portal',
          },
        ].filter(Boolean) as Choice[],
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { scope: Scope }

  return scope
}
