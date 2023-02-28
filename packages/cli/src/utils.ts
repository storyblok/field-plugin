import dotenv from 'dotenv'
import { red } from 'kleur/colors'

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
export const validateToken = (token?: string): string | never => {
  if (token && token !== '') {
    return token
  }

  if (
    process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN &&
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
