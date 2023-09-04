import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type AssetModalChangeMessage = Omit<
  MessageToContainer<'showAssetModal'>,
  'callbackId'
> & {
  field?: string
  callbackId: string // required unlike others
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
  options: Pick<AssetModalChangeMessage, 'uid' | 'callbackId'>,
): AssetModalChangeMessage => ({
  action: 'plugin-changed',
  event: 'showAssetModal',
  ...options,
})
