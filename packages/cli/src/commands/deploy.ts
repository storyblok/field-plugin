import { existsSync, readFileSync, lstatSync } from 'fs'
import { bold, cyan, red, yellow, green } from 'kleur/colors'
import { basename, resolve } from 'path'
import prompts from 'prompts'
import walk from 'walkdir'
import { loadEnvironmentVariables, runCommand, validateToken } from '../utils'
import { StoryblokClient } from '../storyblok/storyblok-client'

// TODO: it should receive an optional argument like `--chooseFrom "./field-plugins"`.
// If it's given, it should ask user to choose one of the field plugins.
// If not given, it should assume the current directory is a single package repository, and just proceed.

export type FieldType = { id: number; name: string; body: string }

//TODO: fix types
export type DeployArgs =
  | {
      token?: string
      skipPrompts?: false
      chooseFrom?: string
      dir: string
      output?: string
    }
  | {
      token: string
      skipPrompts: true
      dir: string
      chooseFrom: undefined
      output?: string
    }

type DeployFunc = (args: DeployArgs) => Promise<void>

type GetFieldPluginToUpdateFunc = (args: {
  fieldType: FieldType
  skipPrompts?: boolean
  packageName: string
  output: string
  path: string
}) => Promise<{ id: number; field_type: { body: string } }>

export const deploy: DeployFunc = async ({
  skipPrompts,
  token,
  chooseFrom,
  dir,
  output,
}) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  loadEnvironmentVariables()

  const validatedToken = validateToken(token)
  const rootPackagePath = chooseFrom ? resolve(dir, chooseFrom) : dir

  //TODO: if chooseFrom is defined then selection is possible otherwise take the name from package.json
  const packageName = chooseFrom
    ? await selectPackage(chooseFrom)
    : getPackageName(rootPackagePath)

  if (!packageName) {
    process.exit(1)
  }

  // path of the specific field-plugin package
  const packagePath = chooseFrom
    ? resolve(rootPackagePath, packageName)
    : rootPackagePath

  console.log(bold(cyan(`[info] Building \`${packageName}\`...`)))
  await buildPackage(packagePath)

  const defaultOutputPath = resolve(packagePath, 'dist', 'index.js')

  const outputPath = output ? resolve(output) : defaultOutputPath
  console.log('output', outputPath)

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
    path: packagePath,
    packageName,
    skipPrompts,
    token: validatedToken,
    output: outputFile,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin is deployed successfully.',
  )
}

const upsertFieldPlugin = async ({
  packageName,
  skipPrompts,
  token,
  output,
  path,
}: {
  path: string
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

const getFieldPluginToUpdate: GetFieldPluginToUpdateFunc = async ({
  fieldType,
  skipPrompts,
  packageName,
  output,
  path,
}) => {
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

const selectPackage = async (chooseFrom: string) => {
  const packages: string[] = []
  walk.sync(resolve(chooseFrom), { max_depth: 1 }, (path, stat) => {
    if (!stat.isDirectory()) {
      return
    }

    if (!isBuildable(path)) {
      return
    }
    // eslint-disable-next-line functional/immutable-data
    packages.push(path)
  })

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
      `[info] ${yellow(basename(path))} doesn't have \`package.json\`.`,
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
      `[info] ${yellow(
        basename(path),
      )}/package.json doesn't have \`build\` script.`,
    )
    return false
  }

  return true
}

const buildPackage = async (path: string): Promise<void> => {
  try {
    console.log(
      (
        await runCommand(`yarn build`, {
          cwd: path,
        })
      ).stdout,
    )
    console.log('')
  } catch (err) {
    console.log((err as Error).message)
    console.log(red('[ERROR]'), 'Build failed.')
    process.exit(1)
  }
}
