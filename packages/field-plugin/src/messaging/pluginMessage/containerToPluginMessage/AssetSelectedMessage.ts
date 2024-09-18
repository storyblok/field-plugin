import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'
import { AssetWrapper, isAsset } from './Asset'

export type AssetSelectedMessage = MessageToPlugin<'asset-selected'> & {
  field?: string
  callbackId: string
} & AssetWrapper &
  Record<string, unknown>

export const isAssetSelectedMessage = (
  data: unknown,
): data is AssetSelectedMessage =>
  isMessageToPlugin(data) &&
  data.action === 'asset-selected' &&
  hasField(data) &&
  isAsset(data)

export const hasField = (data: unknown) => {
  if (!hasKey(data, 'field') || typeof data.field === 'undefined') {
    // field is either omitted or set to undefined
    return true
  }
  return typeof data.field === 'string'
}
