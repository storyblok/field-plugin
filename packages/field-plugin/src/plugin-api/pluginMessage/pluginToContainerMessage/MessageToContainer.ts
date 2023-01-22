import { hasKey } from '../../../utils'

export type MessageToContainer<Event extends string> = {
  action: 'plugin-changed'
  uid: string
  event: Event
}

export const isMessageToContainer = (
  obj: unknown,
): obj is MessageToContainer<string> =>
  hasKey(obj, 'action') &&
  obj.action === 'plugin-changed' &&
  hasKey(obj, 'uid') &&
  typeof obj.uid === 'string' &&
  hasKey(obj, 'event') &&
  typeof obj.event === 'string'
