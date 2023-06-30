import { add } from '../add'
import { initializeNewRepo } from '../../utils'
import { CreatePolyrepoFunc } from './types'

export const createPolyrepo: CreatePolyrepoFunc = async ({
  dir,
  packageManager,
  pluginName,
  template,
}) => {
  const { destPath } = await add({
    dir,
    packageManager,
    name: pluginName,
    template,
    structure: 'polyrepo',
  })
  await initializeNewRepo({ dir: destPath })
}
