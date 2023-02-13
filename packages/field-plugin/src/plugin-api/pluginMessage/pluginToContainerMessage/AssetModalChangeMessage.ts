import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type AssetModalChangeMessage = MessageToContainer<'showAssetModal'> & {
  field: string
}

export const isAssetModalChangeMessage = (
  obj: unknown,
): obj is AssetModalChangeMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'showAssetModal' &&
  hasKey(obj, 'field') &&
  typeof obj.field === 'string'

export const assetModalChangeMessage = (
  uid: string,
  field: string,
): AssetModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'showAssetModal',
  uid,
  field,
})
