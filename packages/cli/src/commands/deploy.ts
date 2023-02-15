import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import prompts from 'prompts'
import walk from 'walkdir'
import { FIELD_PLUGINS_PATH } from '../../config'
import { runCommand, validateToken } from '../utils'
import { StoryblokClient } from '../storyblok/storyblok-client'

// TODO: it should receive an optional argument like `--chooseFrom "./field-plugins"`.
// If it's given, it should ask user to choose one of the field plugins.
// If not given, it should assume the current directory is a single package repository, and just proceed.
const REPO_ROOT_DIR = '.'

export type FieldType = { id: number; name: string; body: string }

export type DeployArgs =
  | {
      fieldPluginName?: string
      skipPrompts?: false
      token?: string
    }
  | {
      fieldPluginName: string
      skipPrompts: true
      token?: string
    }

type DeployFunc = (args: DeployArgs) => Promise<void>

type GetFieldPluginToUpdateFunc = (args: {
  fieldType: FieldType
  skipPrompts?: boolean
  packageName: string
  output: string
}) => Promise<{ id: number; field_type: { body: string } }>

export const deploy: DeployFunc = async ({
  fieldPluginName,
  skipPrompts,
  token,
}) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  const validatedToken = validateToken(token)

  const packageName = getPackageName(fieldPluginName) ?? (await selectPackage())
  const outputPath = await buildPackage(packageName)

  if (!existsSync(outputPath)) {
    console.log(
      red('[ERROR]'),
      'The build output is not found at the following path:',
    )
    console.log(`  > ${outputPath}`)
    process.exit(1)
  }

  const output = readFileSync(outputPath).toString()

  await upsertFieldPlugin({
    packageName,
    skipPrompts,
    token: validatedToken,
    output,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field-type is deployed successfully.',
  )
}

const upsertFieldPlugin = async ({
  packageName,
  skipPrompts,
  token,
  output,
}: {
  packageName: string
  skipPrompts?: boolean
  token: string
  output: string
}) => {
  const storyblokClient = StoryblokClient(token)

  console.log(bold(cyan('[info] Fetching field plugins...')))

  const fieldTypes = await storyblokClient.fetchAllFieldTypes()

  const matchingFieldType = fieldTypes.find(
    (fieldType) => fieldType.name === packageName,
  )

  if (matchingFieldType) {
    const fieldPlugin = await getFieldPluginToUpdate({
      fieldType: matchingFieldType,
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
  const createdFieldPlugin = await storyblokClient.createFieldType(packageName)
  await storyblokClient.updateFieldType({
    id: createdFieldPlugin.id,
    field_type: {
      body: output,
    },
  })
}

const getFieldPluginToUpdate: GetFieldPluginToUpdateFunc = async ({
  fieldType,
  skipPrompts,
  packageName,
  output,
}) => {
  console.log(bold(cyan('[info] Found a matching field type.')))

  const mode = skipPrompts ? 'update' : await selectUpsertMode()

  if (mode === 'create') {
    const packageJsonPath = resolve(
      REPO_ROOT_DIR,
      FIELD_PLUGINS_PATH,
      packageName,
      'package.json',
    )
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

const getPackageName = (fieldPluginName?: string): string | undefined => {
  if (!fieldPluginName) {
    return
  }

  const path = resolve(REPO_ROOT_DIR, FIELD_PLUGINS_PATH, fieldPluginName)

  if (!lstatSync(path).isDirectory()) {
    return
  }

  if (!isBuildable(path)) {
    return
  }

  return fieldPluginName
}

const selectPackage = async () => {
  const packages: string[] = []
  walk.sync(
    resolve(REPO_ROOT_DIR, FIELD_PLUGINS_PATH),
    { max_depth: 1 },
    (path, stat) => {
      if (!stat.isDirectory()) {
        return
      }

      if (!isBuildable(path)) {
        return
      }
      // eslint-disable-next-line functional/immutable-data
      packages.push(path)
    },
  )

  const { packageName } = (await prompts(
    [
      {
        type: 'select',
        name: 'packageName',
        message: 'Which field plugin?',
        choices: packages.map((path) => {
          const packageName = basename(path)
          return {
            title: packageName,
            value: packageName,
          }
        }),
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { packageName: string }

  return packageName
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
      `[info] ${FIELD_PLUGINS_PATH}${yellow(
        basename(path),
      )} doesn't have \`package.json\`.`,
    )
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const packageJson = JSON.parse(
    readFileSync(resolve(path, 'package.json')).toString(),
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!packageJson.scripts?.build) {
    console.log(
      `[info] ${FIELD_PLUGINS_PATH}${yellow(
        basename(path),
      )}/package.json doesn't have \`build\` script.`,
    )
    return false
  }

  return true
}

const buildPackage = async (packageName: string): Promise<string> => {
  console.log(bold(cyan(`[info] Building \`${packageName}\`...`)))

  try {
    console.log(
      (
        await runCommand(`yarn build ${packageName}`, {
          cwd: REPO_ROOT_DIR,
        })
      ).stdout,
    )
    console.log('')
  } catch (err) {
    console.log((err as Error).message)
    console.log(red('[ERROR]'), 'Build failed.')
    process.exit(1)
  }

  return resolve(
    REPO_ROOT_DIR,
    FIELD_PLUGINS_PATH,
    packageName,
    'dist',
    'index.js',
  )
}

export const validateDeployOptions = ({
  fieldPluginName,
  skipPrompts,
}: DeployArgs) => {
  //TODO: if single repo and no plugin name then this is fine
  if (skipPrompts && !fieldPluginName) {
    console.log(red('[ERROR]'), 'Cannot skip prompts without name.\n')
    console.log('Use --name option to define a plugin name!')
    process.exit(1)
  }
}
