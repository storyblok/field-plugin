import { createMonorepo, type CreateMonorepoArgs } from './monorepo'
import { createPolyrepo, type CreatePolyrepoArgs } from './polyrepo'
import { Structure } from '../add'
import { betterPrompts } from '../../utils'

export type CreateArgs =
  | ({
      structure: 'monorepo'
    } & CreateMonorepoArgs)
  | ({
      structure: 'polyrepo'
    } & CreatePolyrepoArgs)

export type CreateFunc = (args: CreateArgs) => Promise<void>

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
  const { structure: structureParam, ...rest } = opts
  const structure = isValidStructure(structureParam)
    ? structureParam
    : await selectRepositoryStructure()

  if (structure === 'polyrepo') {
    await createPolyrepo(rest)
  } else if (structure === 'monorepo') {
    await createMonorepo(rest)
  }
}
