import { hasKey } from '../../../utils'
import { AssetSelectedMessage } from './AssetSelectedMessage'

export type Asset = {
  filename: string
  fieldtype: 'asset'
  name: string
  meta_data: Record<string, string>
  title: string
  copyright: string
  focus: string
  alt: string
  source: string
  is_private: boolean
}

export const isAsset = (data: unknown): data is Asset =>
  hasKey(data, 'filename') && typeof data.filename === 'string'

export const assetFromAssetSelectedMessage = (
  message: AssetSelectedMessage,
): Asset => {
  const {
    uid: _uid,
    action: _action,
    field: _field,
    callbackId: _callbackId,
    ...asset
  } = message
  return asset
}
