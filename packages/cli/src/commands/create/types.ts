import type { PackageManager, Template } from '../types'

export type CreateArgs =
  | ({
      structure: 'monorepo'
    } & CreateMonorepoArgs)
  | ({
      structure: 'standalone'
    } & CreateStandaloneArgs)

export type CreateFunc = (args: CreateArgs) => Promise<void>

export type CreateMonorepoArgs = {
  dir: string
  packageManager: PackageManager
  repoName?: string
  pluginName?: string
  template?: Template
}

export type CreateMonorepoFunc = (args: CreateMonorepoArgs) => Promise<void>

export type CreateStandaloneArgs = {
  dir: string
  packageManager: PackageManager
  pluginName?: string
  template?: Template
}

export type CreateStandaloneFunc = (args: CreateStandaloneArgs) => Promise<void>
