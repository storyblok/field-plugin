import dotenv from 'dotenv'
import prompts from 'prompts'
import { isAbsolute, relative, resolve } from 'path'
import { existsSync, appendFileSync, readFileSync, writeFileSync } from 'fs'
import { bold, cyan } from 'kleur/colors'
import { TEMPLATES } from '../config'
import type { PackageManager, Structure } from './commands/types'

type RunCommandFunc = (
  command: string,
  options?: import('execa').SyncOptions,
) => Promise<import('execa').ExecaSyncReturnValue>

export const runCommand: RunCommandFunc = async (command, options) => {
  const execa = await import('execa')
  return execa.execaCommandSync(command, options)
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
  if (typeof token !== 'undefined' && token !== '') {
    return {
      token,
    }
  }

  const pathsToLoad =
    typeof dotEnvPath === 'string' ? [dotEnvPath] : ['.env', '.env.local']

  const noneOfThemExists = pathsToLoad.every(
    (path: string) => !existsSync(path),
  )
  if (skipPrompts && noneOfThemExists) {
    return {
      error: true,
      message: [
        `Environment variable file doesn't exist at the following path:`,
        ...pathsToLoad.map((path) => `  > ${resolve(path)}`),
      ].join('\n'),
    }
  }

  pathsToLoad.forEach((path) => dotenv.config({ path }))

  const tokenFromEnvFiles = process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
  if (typeof tokenFromEnvFiles !== 'undefined' && tokenFromEnvFiles !== '') {
    return {
      token: tokenFromEnvFiles,
    }
  }

  if (skipPrompts) {
    return {
      error: true,
      message: [
        `Could't find the environment variable \`STORYBLOK_PERSONAL_ACCESS_TOKEN\` at the following paths:`,
        ...pathsToLoad.map((path) => `  > ${resolve(path)}`),
      ].join('\n'),
    }
  } else {
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

    console.log(
      cyan(`Do you want to save this token in this file for future use?`),
    )
    console.log(`  > ${resolve(dotEnvPath ?? '.env.local')}`)
    const { save } = await betterPrompts<{ save: boolean }>({
      type: 'confirm',
      name: 'save',
      message: 'Save?',
      initial: true,
    })

    if (save) {
      appendFileSync(
        dotEnvPath ?? '.env.local',
        `\nSTORYBLOK_PERSONAL_ACCESS_TOKEN=${token}\n`,
      )
    }

    return { token }
  }
}

export const isValidPackageName = (name: string | undefined): boolean =>
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
  directory: string,
  files: string[],
): string[] | Promise<string[]> =>
  files.filter((file) => file !== 'node_modules' && file !== 'cache')

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
  } catch (err) {
    // ignore if git commands fail
  }
}

export const checkIfInsideRepository = async ({ dir }: { dir: string }) => {
  try {
    await runCommand('git rev-parse --is-inside-work-tree', { cwd: dir })
    return true
  } catch (err) {
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
