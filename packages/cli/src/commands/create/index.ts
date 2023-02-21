import prompts from 'prompts'
import { createMonorepo } from './multiple'
import { createSinglePackageRepo } from './single'
import { Structure, Template } from '../../main'

export type CreateArgs = {
  dir: string
  structure?: Structure
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
            title: 'Multiple (monorepo)',
            // description: 'some description if exists',
            value: 'multiple',
          },
          {
            title: 'Single',
            // description: 'some description if exists',
            value: 'single',
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
  const { dir, name, template } = opts

  const structure = opts.structure || (await selectRepositoryStructure())

  if (structure === 'single') {
    await createSinglePackageRepo({ dir, name, template })
  } else if (structure === 'multiple') {
    await createMonorepo({ dir, name, template })
  }
}
