import { add, Template } from '../add'
import { initializeNewRepo } from '../../utils'

export type CreatePolyrepoArgs = {
  dir: string
  pluginName?: string
  template?: Template
}

type CreatePolyrepoFunc = (args: CreatePolyrepoArgs) => Promise<void>

export const createPolyrepo: CreatePolyrepoFunc = async ({
  dir,
  pluginName,
  template,
}) => {
  const { destPath } = await add({
    dir,
    name: pluginName,
    template,
    structure: 'polyrepo',
  })
  await initializeNewRepo({ dir: destPath })
}
