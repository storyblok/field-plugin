import { hasKey } from '../../../utils'
import { AssetSelectedMessage } from './AssetSelectedMessage'

export type Asset = {
  filename: string
}
export const isAsset = (data: unknown): data is Asset =>
  hasKey(data, 'filename') && typeof data.filename === 'string'
export const assetFromAssetSelectedMessage = (
  message: AssetSelectedMessage,
): Asset => {
  const { uid: _uid, action: _action, field: _field, ...asset } = message
  return asset
}
