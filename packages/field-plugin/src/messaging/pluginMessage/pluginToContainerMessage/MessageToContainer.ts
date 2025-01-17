import { hasKey } from '../../../utils'

export type MessageToContainer<Event extends string> = {
  action: 'plugin-changed' | 'prompt-ai'
  uid: string
  event: Event
  callbackId?: string
}

export const isMessageToContainer = (
  obj: unknown,
): obj is MessageToContainer<string> =>
  hasKey(obj, 'action') &&
  (obj.action === 'plugin-changed' || obj.action === 'prompt-ai') &&
  hasKey(obj, 'uid') &&
  typeof obj.uid === 'string' &&
  hasKey(obj, 'event') &&
  typeof obj.event === 'string'
