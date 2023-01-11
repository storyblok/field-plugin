import { PluginState } from './PluginState'
import { PluginClient } from './PluginClient'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { createAutoResizer } from './createAutoResizer'
import { createPluginClient } from './createPluginClient'

export type CreatePlugin = (
  onUpdate: (state: PluginState) => void,
) => [PluginClient, () => void]

/**
 * @returns cleanup function
 */
// TODO rename to createPlugin
export const createFieldType: CreatePlugin = (onUpdateState) => {
  // TODO option to opt out from auto resizer
  const cleanupAutoResizeSideEffects = createAutoResizer()

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const [actions, cleanupPluginClientSideEffects] =
    createPluginClient(onUpdateState)

  const cleanup = () => {
    cleanupPluginClientSideEffects()
    cleanupAutoResizeSideEffects()
    cleanupStyleSideEffects()
  }

  return [actions, cleanup]
}
