import { PluginState } from './PluginState'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { createAutoResizer } from './createAutoResizer'
import { createPluginActions } from './createPluginActions'
import { PluginActions } from '../actions'

export type CreateFieldPlugin = (
  onUpdate: (state: PluginState) => void,
) => [PluginActions, () => void]

/**
 * @returns cleanup function
 */
// TODO rename to createPlugin
export const createFieldPlugin: CreateFieldPlugin = (onUpdateState) => {
  // TODO option to opt out from auto resizer
  const cleanupAutoResizeSideEffects = createAutoResizer()

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const [actions, cleanupPluginClientSideEffects] =
    createPluginActions(onUpdateState)

  const cleanup = () => {
    cleanupPluginClientSideEffects()
    cleanupAutoResizeSideEffects()
    cleanupStyleSideEffects()
  }

  return [actions, cleanup]
}
