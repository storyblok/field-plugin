import { postPluginMessage } from './postPluginMessage'

/**
 * TODO: change
 * Instructs the parent window to open the filed type in a modal window.
 * @param field
 */
export const postSetAssetModalOpen: (field: string) => void = (field) =>
  postPluginMessage({
    event: 'showAssetModal',
    field,
  })
