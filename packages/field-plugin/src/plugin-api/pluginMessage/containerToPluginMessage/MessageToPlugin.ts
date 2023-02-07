import { hasKey } from '../../../utils'
// TODO: add tests
export type MessageToPlugin<Action extends string> = {
  action: Action
  uid: string
}

export const isMessageToPlugin = (
  obj: unknown,
): obj is MessageToPlugin<string> =>
  hasKey(obj, 'action') &&
  typeof obj.action === 'string' &&
  hasKey(obj, 'uid') &&
  typeof obj.uid === 'string'
