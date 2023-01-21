import { hasKey } from '../../../utils'
import {
  isPluginToWrapperMessage,
  MessageToContainer,
} from './MessageToContainer'

export type ValueChangeMessage = MessageToContainer<'update'> & {
  model: unknown
}
export const isValueChangeMessage = (obj: unknown): obj is ValueChangeMessage =>
  isPluginToWrapperMessage(obj) &&
  obj.event === 'update' &&
  hasKey(obj, 'model')
