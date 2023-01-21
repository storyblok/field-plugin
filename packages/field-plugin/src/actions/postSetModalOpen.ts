import { postPluginMessage } from './postPluginMessage'
import { SetModalOpen } from './index'

/**
 * Instructs the parent window to open the filed type in a modal window.
 * @param isModal
 */
export const postSetModalOpen: SetModalOpen = (isModal) =>
  postPluginMessage({
    event: 'toggleModal',
    status: isModal,
  })
