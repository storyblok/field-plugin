import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import prompts from 'prompts'
import { getPersonalAccessToken, promptName } from '../utils'
import { StoryblokClient } from '../storyblok/storyblok-client'

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
}) => Promise<void>

export const deploy: DeployFunc = async ({
  skipPrompts,
  token,
  name,
  dir,
  output,
  dotEnvPath,
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

  const packageName =
    typeof name === 'string' && name.length > 0
      ? name
      : await promptName({
          message: packageNameMessage,
          initialValue: getPackageName(dir),
        })

  if (typeof packageName !== 'string' || packageName === '') {
    console.log(red('[ERROR]'), 'Package name is missing.')
    console.log(
      'Please provide a valid --name option value or type a valid one to the prompt.',
    )
    process.exit(1)
  }

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

  await upsertFieldPlugin({
    path: dir,
    packageName,
    skipPrompts,
    token: result.token,
    output: outputFile,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin is deployed successfully.',
  )

  console.log('You can find the deployed plugin at the following URL:')
  console.log(`  > https://app.storyblok.com/#/me/plugins`)
  console.log(
    'You can also find it in "My account > My Plugins" at the bottom of the sidebar.',
  )
}

const upsertFieldPlugin: UpsertFieldPluginFunc = async (args) => {
  const { packageName, skipPrompts, token, output, path } = args

  const storyblokClient = StoryblokClient(token)

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
    return
  }

  console.log(
    bold(
      cyan(
        '[info] A matching field type is not found. So, we are creating a new field plugin in Storyblok.',
      ),
    ),
  )

  await storyblokClient.createFieldType({
    name: packageName,
    body: output,
  })
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
  const { mode } = (await prompts([
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
  ])) as { mode: 'update' | 'create' }

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
