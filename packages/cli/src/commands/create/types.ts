import { Template } from '../add'
import { PackageManager } from '../types'

export type CreateArgs =
  | ({
      structure: 'monorepo'
    } & CreateMonorepoArgs)
  | ({
      structure: 'polyrepo'
    } & CreatePolyrepoArgs)

export type CreateFunc = (args: CreateArgs) => Promise<void>

export type CreateMonorepoArgs = {
  dir: string
  packageManager: PackageManager
  repoName?: string
  pluginName?: string
  template?: Template
}

export type CreateMonorepoFunc = (args: CreateMonorepoArgs) => Promise<void>

export type CreatePolyrepoArgs = {
  dir: string
  packageManager: PackageManager
  pluginName?: string
  template?: Template
}

export type CreatePolyrepoFunc = (args: CreatePolyrepoArgs) => Promise<void>
