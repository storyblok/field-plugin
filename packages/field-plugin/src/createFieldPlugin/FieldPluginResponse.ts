import { PluginState } from './PluginState'
import { PluginActions } from './PluginActions'

export type FieldPluginResponse =
  | {
      isLoading: true
      error?: never
      data?: never
      actions?: never
    }
  | {
      isLoading: false
      error: Error
      data?: never
      actions?: never
    }
  | {
      isLoading: false
      error?: never
      data: PluginState
      actions: PluginActions
    }
