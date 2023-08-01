import { createMonorepo } from './monorepo'
import { createStandalone } from './standalone'
import {
  isValidPackageManager,
  selectPackageManager,
  selectRepositoryStructure,
  isValidStructure,
} from '../../utils'
import { CreateFunc, CreateArgs } from './types'

export type { CreateArgs }

export const create: CreateFunc = async (opts) => {
  const {
    structure: structureParam,
    packageManager: packageManagerParam,
    ...rest
  } = opts

  const packageManager = isValidPackageManager(packageManagerParam)
    ? packageManagerParam
    : await selectPackageManager()

  const structure = isValidStructure(structureParam)
    ? structureParam
    : await selectRepositoryStructure()

  if (structure === 'standalone') {
    await createStandalone({ packageManager, ...rest })
  } else if (structure === 'monorepo') {
    await createMonorepo({ packageManager, ...rest })
  }
}
