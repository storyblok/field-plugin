import prompts from 'prompts'
import { createMonorepo } from './multiple'
import { createSinglePackageRepo } from './single'

export type CreateArgs = {
  dir?: string
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
  )) as { structure: 'single' | 'multiple' }
  return structure
}

export const create: CreateFunc = async (opts) => {
  const dir = opts.dir ?? '.'

  const structure = await selectRepositoryStructure()
  if (structure === 'single') {
    await createSinglePackageRepo({ dir })
  } else if (structure === 'multiple') {
    await createMonorepo({ dir })
  }
}
