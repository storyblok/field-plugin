import {
  isStateChangedMessage,
  pluginUrlParamsFromUrl,
  OnStateChangedMessage,
  isMessageToPlugin,
  isAssetSelectedMessage,
  OnAssetSelectedMessage,
} from '../../../../plugin-api'

export type CreatePluginMessageListener = (
  onStateChange: OnStateChangedMessage,
  onAssetSelected: OnAssetSelectedMessage,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  onStateChange,
  onAssetSelected,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    const fieldTypeParams = pluginUrlParamsFromUrl(window.location.search)
    if (typeof fieldTypeParams === 'undefined') {
      // Missing search params
      return
    }
    const { data } = event

    if (!isMessageToPlugin(data)) {
      return
    }

    if (data.uid !== fieldTypeParams.uid) {
      // Not intended for this field type
      return
    }

    if (isStateChangedMessage(data)) {
      onStateChange(data)
    }

    if (isAssetSelectedMessage(data)) {
      onAssetSelected(data)
    }
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
