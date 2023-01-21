/**
 * Actions that can be sent to the field type wrapper
 */

import { SetHeight, SetModalOpen, SetValue } from '../actions'

/**
 * All actions that are exposed to the plugin application.
 */
// TODO Use the Actions type
export type PluginClient = {
  // TODO open asset selector
  setHeight: SetHeight
  setModalOpen: SetModalOpen
  setValue: SetValue
}
