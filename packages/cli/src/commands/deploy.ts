import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import prompts from 'prompts'
import walk from 'walkdir'
import { FIELD_PLUGINS_PATH } from '../../config'
import {
  createFieldType,
  fetchAllFieldTypes,
  updateFieldType,
  type FieldType,
} from '../field_types'
import { runCommand, loadEnvironmentVariables } from '../utils'

// TODO: it should receive an optional argument like `--chooseFrom "./field-plugins"`.
// If it's given, it should ask user to choose one of the field plugins.
// If not given, it should assume the current directory is a single package repository, and just proceed.
const REPO_ROOT_DIR = '.'

export type DeployArgs =
  | {
      fieldPluginName?: string
      skipPrompts?: false
    }
  | {
      fieldPluginName: string
      skipPrompts: true
    }

type DeployFunc = (args: DeployArgs) => Promise<void>

export const validateDeployOptions = ({
  fieldPluginName,
  skipPrompts,
}: DeployArgs) => {
  if (skipPrompts && !fieldPluginName) {
    console.log(red('[ERROR]'), 'Cannot skip prompts without name.\n')
    console.log('Use --name option to define a plugin name!')
    process.exit(1)
  }
}

type UpdateExistingFieldPluginFunc = (args: {
  fieldType: FieldType
  skipPrompts?: boolean
  packageName: string
  output: string
}) => Promise<boolean>

type CreateNewFieldPluginFunc = (args: {
  packageName: string
  output: string
}) => Promise<boolean>

const updateExistingFieldPlugin: UpdateExistingFieldPluginFunc = async ({
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

  return await updateFieldType({
    id: fieldType.id,
    field_type: {
      body: output,
    },
  })
}

const createNewFieldPlugin: CreateNewFieldPluginFunc = async ({
  packageName,
  output,
}) => {
  console.log(
    bold(
      cyan(
        '[info] A matching field type is not found. So, we are creating a new field type on Storyblok.',
      ),
    ),
  )

  const fieldType = await createFieldType(packageName)
  return await updateFieldType({
    id: fieldType.id,
    field_type: {
      body: output,
    },
  })
}

export const deploy: DeployFunc = async ({ fieldPluginName, skipPrompts }) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  loadEnvironmentVariables()
  if (!process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN) {
    console.log(
      red('[ERROR]'),
      'Cannot find an environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`.',
    )
    console.log(
      'Create .env file at the root of this repository and configure the variable.',
    )
    process.exit(1)
  }

  const packageName = getPackageName(fieldPluginName) ?? (await selectPackage())

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

  const outputPath = resolve(
    REPO_ROOT_DIR,
    FIELD_PLUGINS_PATH,
    packageName,
    'dist',
    'index.js',
  )
  if (!existsSync(outputPath)) {
    console.log(
      red('[ERROR]'),
      'The build output is not found at the following path:',
    )
    console.log(`  > ${outputPath}`)
    process.exit(1)
  }
  const output = readFileSync(outputPath).toString()

  console.log(bold(cyan('[info] Fetching field plugnis...')))
  const fieldTypes = await fetchAllFieldTypes()

  const matchingFieldType = fieldTypes.find(
    (fieldType) => fieldType.name === packageName,
  )

  const result = matchingFieldType
    ? await updateExistingFieldPlugin({
        fieldType: matchingFieldType,
        packageName,
        skipPrompts,
        output,
      })
    : await createNewFieldPlugin({
        packageName,
        output,
      })

  if (result) {
    console.log(
      bold(green('[SUCCESS]')),
      'The field-type is deployed successfully.',
    )
  } else {
    console.log(red('[ERROR]'), 'Failed to deploy the field-type.')
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
        message: 'Which field-type?',
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
      message: 'Update the existing field type?',
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
