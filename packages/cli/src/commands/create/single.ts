import { add } from '../add'
import { Template } from '../../main'
import { initializeNewRepo } from '../../utils'

type CreateSinglePackageRepoFunc = (args: {
  dir: string
  name?: string
  template?: Template
}) => Promise<void>

export const createSinglePackageRepo: CreateSinglePackageRepoFunc = async ({
  dir,
  name,
  template,
}) => {
  const { destPath } = await add({
    dir,
    name,
    template,
    structure: 'single',
  })
  await initializeNewRepo({ dir: destPath })
}
