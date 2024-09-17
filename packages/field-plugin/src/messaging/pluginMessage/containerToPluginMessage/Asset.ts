import { hasKey } from '../../../utils'
import { AssetSelectedMessage } from './AssetSelectedMessage'

export type AssetWrapper = {
  filename: string
  asset: Asset
}

export type Asset = {
  id: number
  fieldtype: 'asset'
  filename: string
  name: string
  meta_data?: Record<string, unknown>
  title: string
  copyright: string
  focus: string
  alt: string
  source?: string
  is_external_url?: boolean
  is_private?: boolean
  src?: string
  updated_at?: string
}

export const isAsset = (data: unknown): data is AssetWrapper =>
  hasKey(data, 'filename') &&
  typeof data.filename === 'string' &&
  hasKey(data, 'asset') &&
  typeof data.asset === 'object'

export const assetFromAssetSelectedMessage = (
  message: AssetSelectedMessage,
): Asset => {
  const { asset } = message
  return asset
}
