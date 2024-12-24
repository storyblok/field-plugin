import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type ModalChangeMessage = MessageToContainer<'toggleModal'> & {
  status: boolean
  modalSize?: { width: string; height: string }
}
export const isModalChangeMessage = (obj: unknown): obj is ModalChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'toggleModal' &&
  hasKey(obj, 'status') &&
  typeof obj.status === 'boolean'

export const modalChangeMessage = (
  options: Pick<ModalChangeMessage, 'uid' | 'callbackId' | 'status' | 'modalSize'>,
): ModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'toggleModal',
  ...options,
})
