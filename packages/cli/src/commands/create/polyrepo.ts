import { add, Template } from '../add'
import { initializeNewRepo } from '../../utils'

type CreatePolyrepoFunc = (args: {
  dir: string
  name?: string
  template?: Template
}) => Promise<void>

export const createPolyrepo: CreatePolyrepoFunc = async ({
  dir,
  name,
  template,
}) => {
  const { destPath } = await add({
    dir,
    name,
    template,
    structure: 'polyrepo',
  })
  await initializeNewRepo({ dir: destPath })
}
