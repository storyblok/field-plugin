import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type ValueChangeMessage = MessageToContainer<'update'> & {
  model: unknown
}
export const isValueChangeMessage = (obj: unknown): obj is ValueChangeMessage =>
  isMessageToContainer(obj) && obj.event === 'update' && hasKey(obj, 'model')
