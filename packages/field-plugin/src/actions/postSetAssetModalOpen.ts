import { postPluginMessage } from './postPluginMessage'
import { SetAssetModalOpen } from './PluginToContainer'

/**
 * TODO: change
 * Instructs the parent window to open the filed type in a modal window.
 * @param field
 */
export const postSetAssetModalOpen: SetAssetModalOpen = (field) =>
  postPluginMessage({
    event: 'showAssetModal',
    field,
  })
