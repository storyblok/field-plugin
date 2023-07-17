import { createMonorepo } from './monorepo'
import { createStandalone } from './standalone'
import { Structure } from '../add'
import {
  betterPrompts,
  isValidPackageManager,
  selectPackageManager,
} from '../../utils'
import { CreateFunc, CreateArgs } from './types'
import { PackageManager } from '../types'

export type { CreateArgs }

const selectRepositoryStructure = async () => {
  const { structure } = await betterPrompts<{ structure: Structure }>([
    {
      type: 'select',
      name: 'structure',
      message:
        'How many field plugins potentially do you want in this repository?',
      choices: [
        {
          title: 'Standalone (one plugin in one repo)',
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

const isValidStructure = (structure: string): structure is Structure => {
  return structure === 'monorepo' || structure === 'standalone'
}

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
