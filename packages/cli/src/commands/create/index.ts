import { createMonorepo } from './monorepo'
import { createPolyrepo } from './polyrepo'
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
          title: 'Monorepo (multiple plugins in one repo)',
          // description: 'some description if exists',
          value: 'monorepo',
        },
        {
          title: 'Polyrepo (one plugin in one repo)',
          // description: 'some description if exists',
          value: 'polyrepo',
        },
      ],
    },
  ])
  return structure
}

const isValidStructure = (structure: string): structure is Structure => {
  return structure === 'monorepo' || structure === 'polyrepo'
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

  if (structure === 'polyrepo') {
    await createPolyrepo({ packageManager, ...rest })
  } else if (structure === 'monorepo') {
    await createMonorepo({ packageManager, ...rest })
  }
}
