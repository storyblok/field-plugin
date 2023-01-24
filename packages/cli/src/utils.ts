import dotenv from 'dotenv'
import { resolve } from 'path'
import { REPO_ROOT_DIR } from './const'

export const loadEnvironmentVariables = () => {
  dotenv.config({ path: resolve(REPO_ROOT_DIR, '.env') })
  dotenv.config({ path: resolve(REPO_ROOT_DIR, '.env.local') })
}

type RunCommandFunc = (
  command: string,
  options?: import('execa').SyncOptions,
) => Promise<import('execa').ExecaSyncReturnValue>

export const runCommand: RunCommandFunc = async (command, options) => {
  const execa = await import('execa')
  return execa.execaCommandSync(command, options)
}
