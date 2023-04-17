import dotenv from 'dotenv'
import prompts from 'prompts'
import { resolve } from 'path'
import { existsSync } from 'fs'

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
}) => { error?: false; token: string } | { error: true; message: string }

export const getPersonalAccessToken: GetPersonalAccessTokenFunc = ({
  token,
  dotEnvPath,
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
  if (noneOfThemExists) {
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
  } else {
    return {
      error: true,
      message: [
        `Could't find the environment variable \`STORYBLOK_PERSONAL_ACCESS_TOKEN\` at the following paths:`,
        ...pathsToLoad.map((path) => `  > ${resolve(path)}`),
      ].join('\n'),
    }
  }
}

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
      validate: (name: string) => new RegExp(/^[a-z0-9\\-]+$/).test(name),
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
  await runCommand('git init', { cwd: dir })
  await runCommand('git add .', { cwd: dir })
  await runCommand('git commit -m "chore: initial commit"', {
    shell: true,
    cwd: dir,
  })
}
