import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type HeightChangeMessage = MessageToContainer<'heightChange'> & {
  height: number
}

export const isHeightChangeMessage = (
  obj: unknown,
): obj is HeightChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'heightChange' &&
  hasKey(obj, 'height') &&
  typeof obj.height === 'number'

export const heightChangeMessage = (
  uid: string,
  height: number,
): HeightChangeMessage => ({
  action: 'plugin-changed',
  event: 'heightChange',
  uid,
  height,
})
