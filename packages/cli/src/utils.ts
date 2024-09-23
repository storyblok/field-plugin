import os from 'os'
import dotenv from 'dotenv'
import prompts from 'prompts'
import { isAbsolute, relative, resolve } from 'path'
import { existsSync, appendFileSync } from 'fs'
import { bold, cyan } from 'kleur/colors'
import { TEMPLATES } from '../config'
import type { PackageManager, Structure } from './commands/types'

type RunCommandFunc = (
  command: string,
  options?: { spinnerMessage?: string } & import('execa').SyncOptions,
) => Promise<import('execa').ExecaSyncReturnValue>

export const runCommand: RunCommandFunc = async (
  command,
  { spinnerMessage, ...options } = {},
) => {
  const ora = (await import('ora')).default
  const spinner = spinnerMessage !== undefined ? ora(spinnerMessage) : undefined
  if (spinner) {
    spinner.start()
  }
  const execa = await import('execa')
  try {
    const result = await execa.execaCommand(command, options)
    if (spinner) {
      spinner.succeed()
    }
    return result
  } catch (err) {
    if (spinner) {
      spinner.fail()
    }
    throw err
  }
}

export const betterPrompts = async <Model>(
  questions: prompts.PromptObject | Array<prompts.PromptObject>,
  options?: prompts.Options,
): Promise<Model> => {
  // This fixes the wrong typing from `prompts` and adds `onCancel` by default.
  return (await prompts(questions, {
    onCancel: () => {
      process.exit(1)
    },
    ...options,
  })) as Promise<Model>
}

type GetPersonalAccessTokenFunc = (params: {
  token?: string
  dotEnvPath: string | undefined
  skipPrompts?: boolean
}) => Promise<
  { error?: false; token: string } | { error: true; message: string }
>

export const getPersonalAccessToken: GetPersonalAccessTokenFunc = async ({
  token,
  dotEnvPath,
  skipPrompts,
}) => {
  if (isTokenValid(token)) {
    return {
      token,
    }
  }

  if (isTokenValid(process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN)) {
    return { token: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN }
  }

  const defaultEnvPaths =
    typeof dotEnvPath === 'string' ? [dotEnvPath] : ['.env', '.env.local']

  const tokenFromEnvFiles = getTokenFromFiles(defaultEnvPaths)

  if (tokenFromEnvFiles !== undefined) {
    return {
      token: tokenFromEnvFiles,
    }
  }

  if (skipPrompts) {
    return {
      error: true,
      message: [
        `Couldn't find the environment variable \`STORYBLOK_PERSONAL_ACCESS_TOKEN\` at the following paths:`,
        ...defaultEnvPaths.map((path) => `  > ${resolve(path)}`),
      ].join('\n'),
    }
  }

  const inputToken = await inputPersonalAccessToken()
  await savePersonalAccessToken(inputToken, dotEnvPath)

  return { token: inputToken }
}

export const isValidPackageName = (name: string | undefined): name is string =>
  name !== undefined && new RegExp(/^[a-z0-9\\-]+$/).test(name)

export const promptName = async ({
  message,
  initialValue,
}: {
  message: string
  initialValue?: string
}): Promise<string | never> => {
  const { name } = await betterPrompts<{ name: string }>([
    {
      type: 'text',
      name: 'name',
      message,
      initial: initialValue,
      validate: isValidPackageName,
    },
  ])
  return name
}

export const filterPathsToInclude = (
  _directory: string,
  files: string[],
): string[] | Promise<string[]> =>
  files.filter(
    (file) =>
      file !== 'node_modules' &&
      file !== 'cache' &&
      file !== 'dist' &&
      file !== '.env.local',
  )

export const initializeNewRepo = async ({ dir }: { dir: string }) => {
  if (await checkIfInsideRepository({ dir })) {
    return
  }

  try {
    await runCommand('git init', { cwd: dir })
    await runCommand('git add .', { cwd: dir })
    await runCommand('git commit -m "chore: initial commit"', {
      shell: true,
      cwd: dir,
    })
  } catch (_err) {
    // ignore if git commands fail
  }
}

export const checkIfInsideRepository = async ({ dir }: { dir: string }) => {
  try {
    await runCommand('git rev-parse --is-inside-work-tree', { cwd: dir })
    return true
  } catch (_err) {
    return false
  }
}

export const checkIfSubDir = (parent: string, dir: string) => {
  const relativePath = relative(parent, dir)

  if (!relativePath) {
    return false
  }

  return !relativePath.startsWith('..') && !isAbsolute(relativePath)
}

export const getInstallCommand = (packageManager: PackageManager) => {
  return `${packageManager} install`
}

export const getMonorepoCommandByPackageManager = (args: {
  commandName: string
  packageManager: PackageManager
  packageName: string
}) => {
  const { commandName, packageManager, packageName } = args
  if (packageManager === 'yarn') {
    return `yarn workspace ${packageName} ${commandName}`
  } else if (packageManager === 'pnpm') {
    return `pnpm -F ${packageName} run ${commandName}`
  } else {
    return `npm run ${commandName} --workspace=${packageName}`
  }
}

export const getStandaloneCommandByPackageManager = (args: {
  commandName: string
  packageManager: PackageManager
}) => {
  return `${args.packageManager} run ${args.commandName}`
}

export const isValidPackageManager = (
  packageManager?: string,
): packageManager is PackageManager => {
  return (
    packageManager === 'npm' ||
    packageManager === 'yarn' ||
    packageManager === 'pnpm'
  )
}

export const selectPackageManager = async () => {
  const { packageManager } = await betterPrompts<{
    packageManager: PackageManager
  }>([
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you use?',
      choices: [
        {
          title: 'npm',
          value: 'npm',
        },
        {
          title: 'yarn',
          value: 'yarn',
        },
        {
          title: 'pnpm',
          value: 'pnpm',
        },
      ],
    },
  ])
  return packageManager
}

export const selectRepositoryStructure = async () => {
  const { structure } = await betterPrompts<{ structure: Structure }>([
    {
      type: 'select',
      name: 'structure',
      message:
        'How many field plugins potentially do you want in this repository?',
      choices: [
        {
          title:
            'Standalone (one plugin in one repo, also known as `polyrepo`)',
          // description: 'some description if exists',
          value: 'standalone',
        },
        {
          title: 'Monorepo (multiple plugins in one repo)',
          // description: 'some description if exists',
          value: 'monorepo',
        },
      ],
    },
  ])
  return structure
}

export const isValidStructure = (structure: string): structure is Structure => {
  return structure === 'monorepo' || structure === 'standalone'
}

export const selectTemplate = async () => {
  const { template } = await betterPrompts<{ template: string }>([
    {
      type: 'select',
      name: 'template',
      message: 'Which template?',
      choices: TEMPLATES,
    },
  ])
  return template
}

export const randomString = (length = 16) => {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789-'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export const expandTilde = (folderPath: string) => {
  const homedir = os.homedir()
  if (folderPath.startsWith('~')) {
    return homedir + folderPath.slice(1)
  }
  return folderPath
}

const getExistingEnvironmentFiles = (paths: string[]) =>
  paths.reduce((acc: string[], path: string) => {
    if (existsSync(path)) {
      return [...acc, path]
    }

    return acc
  }, [])

const isTokenValid = (token: unknown): token is string =>
  token !== undefined &&
  token !== null &&
  typeof token === 'string' &&
  token !== ''

const inputPersonalAccessToken = async () => {
  console.log(
    cyan(bold('[info]')),
    'Please enter your personal access token to deploy the field plugin.',
  )
  console.log('  > https://app.storyblok.com/#/me/account?tab=token')
  console.log('')
  const { token } = await betterPrompts<{ token: string }>({
    type: 'text',
    name: 'token',
    message: 'Personal access token:',
  })

  return token
}

const savePersonalAccessToken = async (
  token: string,
  location?: string,
): Promise<void> => {
  console.log(
    cyan(`Do you want to save this token in this file for future use?`),
  )
  console.log(`  > ${resolve(location ?? '.env.local')}`)
  const { save } = await betterPrompts<{ save: boolean }>({
    type: 'confirm',
    name: 'save',
    message: 'Save?',
    initial: true,
  })

  if (save) {
    appendFileSync(
      location ?? '.env.local',
      `\nSTORYBLOK_PERSONAL_ACCESS_TOKEN=${token}\n`,
    )
  }
}
const getTokenFromFiles = (envPaths: string[]): string | undefined => {
  const envPathsToLoad = getExistingEnvironmentFiles(envPaths)

  if (envPathsToLoad.length === 0) {
    return undefined
  }

  envPathsToLoad.forEach((path) => dotenv.config({ path }))

  const token = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN

  if (!isTokenValid(token)) {
    return undefined
  }

  return token
}
