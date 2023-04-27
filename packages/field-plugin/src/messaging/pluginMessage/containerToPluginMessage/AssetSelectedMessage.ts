import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'

export type AssetSelectedMessage = MessageToPlugin<'asset-selected'> & {
  field?: string
  filename: string
}

export const isAssetSelectedMessage = (
  obj: unknown,
): obj is AssetSelectedMessage =>
  isMessageToPlugin(obj) &&
  obj.action === 'asset-selected' &&
  hasKey(obj, 'filename') &&
  typeof obj.filename === 'string' &&
  hasField(obj)

export const hasField = (obj: unknown) => {
  if (!hasKey(obj, 'field') || typeof obj.field === 'undefined') {
    // field is either omitted or set to undefined
    return true
  }
  return typeof obj.field === 'string'
}
