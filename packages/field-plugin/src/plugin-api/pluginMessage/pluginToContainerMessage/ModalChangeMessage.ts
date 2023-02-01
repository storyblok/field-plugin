import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type ModalChangeMessage = MessageToContainer<'toggleModal'> & {
  status: boolean
}
export const isModalChangeMessage = (obj: unknown): obj is ModalChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'toggleModal' &&
  hasKey(obj, 'status') &&
  typeof obj.status === 'boolean'
