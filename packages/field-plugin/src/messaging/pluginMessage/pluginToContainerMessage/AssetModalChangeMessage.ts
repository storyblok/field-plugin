import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type AssetModalChangeMessage = MessageToContainer<'showAssetModal'> & {
  field?: string
}

export const isAssetModalChangeMessage = (
  obj: unknown,
): obj is AssetModalChangeMessage =>
  isMessageToContainer(obj) && obj.event === 'showAssetModal' && hasField(obj)

const hasField = (
  obj: unknown,
): obj is Pick<AssetModalChangeMessage, 'field'> => {
  if (!hasKey(obj, 'field') || typeof obj.field === 'undefined') {
    // field is either omitted or set to undefined
    return true
  }
  return typeof obj.field === 'string'
}

export const assetModalChangeMessage = (
  uid: string,
  field?: string,
): AssetModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'showAssetModal',
  uid,
  field,
})
