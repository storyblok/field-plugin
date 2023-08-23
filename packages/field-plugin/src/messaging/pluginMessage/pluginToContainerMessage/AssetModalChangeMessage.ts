import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type AssetModalChangeMessage = MessageToContainer<'showAssetModal'> & {
  callbackId: string

  // The `field` variable is not used in the Field Plugin SDK, but it is present here
  // because it was used in the legacy `<sb-asset-selector>` component,
  // and still exists in the Storyfront.
  // We are keeping it in this type for the sake of consistency and documentation purposes.
  field?: string
}

export const isAssetModalChangeMessage = (
  obj: unknown,
): obj is AssetModalChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'showAssetModal' &&
  hasField(obj) &&
  hasCallbackId(obj)

const hasCallbackId = (
  obj: unknown,
): obj is Pick<AssetModalChangeMessage, 'callbackId'> => {
  return hasKey(obj, 'callbackId') && typeof obj.callbackId === 'string'
}

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
  callbackId: string,
  field?: string,
): AssetModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'showAssetModal',
  uid,
  callbackId,
  field,
})
