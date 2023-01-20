/**
 * Actions that can be sent to the field type wrapper
 */

import { SetHeight, SetModalOpen, SetValue } from '../plugin-api/pluginMessage'

/**
 * All actions that are exposed to the plugin application.
 */
export type PluginClient = {
  // TODO open asset selector
  setHeight: SetHeight
  setModalOpen: SetModalOpen
  setValue: SetValue
}
