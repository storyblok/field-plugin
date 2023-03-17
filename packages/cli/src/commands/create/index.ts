import prompts from 'prompts'
import { createMonorepo } from './monorepo'
import { createPolyrepo } from './polyrepo'
import { Structure, Template } from '../add'

export type CreateArgs =
  | {
      structure: 'monorepo'
      dir: string
      repoName?: string
      packageName?: string
      template?: Template
    }
  | {
      structure: 'polyrepo'
      dir: string
      name?: string
      template?: Template
    }

export type CreateFunc = (args: CreateArgs) => Promise<void>

const selectRepositoryStructure = async () => {
  const { structure } = (await prompts(
    [
      {
        type: 'select',
        name: 'structure',
        message:
          'How many field plugins potentially do you want in this repository?',
        choices: [
          {
            title: 'Monorepo (multiple packages in one repo)',
            // description: 'some description if exists',
            value: 'monorepo',
          },
          {
            title: 'Polyrepo (one package in one repo)',
            // description: 'some description if exists',
            value: 'polyrepo',
          },
        ],
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { structure: Structure }
  return structure
}

export const create: CreateFunc = async (opts) => {
  const structure = opts.structure || (await selectRepositoryStructure())

  if (structure === 'polyrepo') {
    await createPolyrepo(opts)
  } else if (structure === 'monorepo') {
    await createMonorepo(opts)
  }
}
