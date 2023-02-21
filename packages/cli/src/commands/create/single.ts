import { add } from '../add'
import { Template } from '../../main'

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
  await add({ dir, name, template, showInstructionFor: 'single' })
}
