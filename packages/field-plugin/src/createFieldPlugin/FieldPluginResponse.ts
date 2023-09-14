import { FieldPluginData } from './FieldPluginData'
import { FieldPluginActions } from './FieldPluginActions'

export type FieldPluginResponse<Content> =
  | {
      type: 'loading'
      error?: never
      data?: never
      actions?: never
    }
  | {
      type: 'error'
      error: Error
      data?: never
      actions?: never
    }
  | {
      type: 'loaded'
      error?: never
      data: FieldPluginData<Content>
      actions: FieldPluginActions<Content>
    }
