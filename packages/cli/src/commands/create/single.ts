import { add } from '../add'
import { Template } from '../../main'

type CreateSinglePackageRepoFunc = (args: {
  dir: string
  packageName?: string
  template?: Template
}) => Promise<void>

export const createSinglePackageRepo: CreateSinglePackageRepoFunc = async ({
  dir,
  packageName,
  template,
}) => {
  await add({ dir, packageName, template, showInstructionFor: 'single' })
}
