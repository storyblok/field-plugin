import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'

//TODO: tests
export type AssetSelectedMessage = MessageToPlugin<'asset-selected'> & {
  field: string
  filename: 'string'
}

export const isAssetSelectedMessage = (obj: unknown) =>
  isMessageToPlugin(obj) &&
  obj.action === 'asset-selected' &&
  hasKey(obj, 'field') &&
  typeof obj.field === 'string' &&
  hasKey(obj, 'filename') &&
  typeof obj.filename === 'string'
