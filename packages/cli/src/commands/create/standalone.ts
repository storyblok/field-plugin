import { add } from '../add'
import { initializeNewRepo } from '../../utils'
import { CreateStandaloneFunc } from './types'

export const createStandalone: CreateStandaloneFunc = async ({
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
    structure: 'standalone',
  })
  await initializeNewRepo({ dir: destPath })
}
