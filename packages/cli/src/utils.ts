import dotenv from 'dotenv'

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
