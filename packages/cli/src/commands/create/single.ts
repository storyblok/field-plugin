import { add } from '../add'

type CreateSinglePackageRepoFunc = (args: { dir: string }) => Promise<void>

export const createSinglePackageRepo: CreateSinglePackageRepoFunc = async ({
  dir,
}) => {
  await add({ dir })
}
