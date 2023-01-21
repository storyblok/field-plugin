import { hasKey } from '../../../utils'
import {
  isPluginToWrapperMessage,
  MessageToContainer,
} from './MessageToContainer'

export type HeightChangeMessage = MessageToContainer<'heightChange'> & {
  height: number
}
export const isHeightChangeMessage = (
  obj: unknown,
): obj is HeightChangeMessage =>
  isPluginToWrapperMessage(obj) &&
  obj.event === 'heightChange' &&
  hasKey(obj, 'height') &&
  typeof obj.height === 'number'
