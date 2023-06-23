import { hasKey } from '../../../utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { Property } from 'csstype'

export type HeightChangeMessage = MessageToContainer<'heightChange'> & {
  height: Property.Height<string | number>
}

export const isHeightChangeMessage = (
  obj: unknown,
): obj is HeightChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'heightChange' &&
  hasKey(obj, 'height') &&
  (typeof obj.height === 'number' || typeof obj.height === 'string')

export const heightChangeMessage = (
  uid: string,
  height: Property.Height<string | number>,
): HeightChangeMessage => ({
  action: 'plugin-changed',
  event: 'heightChange',
  uid,
  height,
})
