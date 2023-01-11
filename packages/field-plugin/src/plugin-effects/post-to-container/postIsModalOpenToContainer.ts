import { postMessageToContainer } from './postMessageToContainer'
import { SetModalOpen } from '../../plugin-api/types'

/**
 * Instructs the parent window to open the filed type in a modal window.
 * @param isModal
 */
export const postIsModalOpenToContainer: SetModalOpen = (isModal) =>
  postMessageToContainer({
    event: 'toggleModal',
    status: isModal,
  })
