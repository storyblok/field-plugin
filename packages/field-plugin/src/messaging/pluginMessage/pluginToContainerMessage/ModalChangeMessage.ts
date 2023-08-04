import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type ModalChangeMessage = MessageToContainer<'toggleModal'> & {
  status: boolean
  fullHeight?: boolean
}
export const isModalChangeMessage = (obj: unknown): obj is ModalChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'toggleModal' &&
  hasKey(obj, 'status') &&
  typeof obj.status === 'boolean' &&
  (!hasKey(obj, 'fullHeight') ||
    typeof obj.fullHeight === 'undefined' ||
    typeof obj.fullHeight === 'boolean')

export const modalChangeMessage = (
  uid: string,
  status: boolean,
): ModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'toggleModal',
  uid,
  status,
  // This propery signals to the container that we're using this newer feature
  fullHeight: true,
})
