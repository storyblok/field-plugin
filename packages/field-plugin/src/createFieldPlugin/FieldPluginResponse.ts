import { PluginState } from './PluginState'
import { PluginActions } from './PluginActions'

export type FieldPluginResponse =
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
      data: PluginState
      actions: PluginActions
    }
