import dotenv from 'dotenv'
import { red } from 'kleur/colors'
import prompts from 'prompts'

export const loadEnvironmentVariables = () => {
  dotenv.config({ path: '.env' })
  dotenv.config({ path: '.env.local' })
}

type RunCommandFunc = (
  command: string,
  options?: import('execa').SyncOptions,
) => Promise<import('execa').ExecaSyncReturnValue>

export const runCommand: RunCommandFunc = async (command, options) => {
  const execa = await import('execa')
  return execa.execaCommandSync(command, options)
}

//TODO testing
export const validateToken = (token?: string): string | undefined => {
  if (typeof token !== 'undefined' && token !== '') {
    return token
  }

  if (
    typeof process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN !== 'undefined' &&
    process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN !== ''
  ) {
    return process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN
  }

  console.log(red('[ERROR]'), 'Token to access Storyblok is undefined.')
  console.log(
    'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
  )
  process.exit(1)
}

export const promptName = async (message: string): Promise<string | never> => {
  const { name } = (await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message,
        validate: (name: string) => new RegExp(/^[a-z0-9\\-]+$/).test(name),
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { name: string }
  return name
}
