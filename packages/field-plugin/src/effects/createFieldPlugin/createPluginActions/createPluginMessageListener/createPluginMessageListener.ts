import {
  originFromPluginParams,
  isStateChangedMessage,
  pluginUrlParamsFromUrl,
  OnMessageToPlugin,
  isMessageToPlugin,
  isAssetSelectedMessage,
} from '../../../../plugin-api'

export type CreatePluginMessageListener = (
  onStateChange: OnMessageToPlugin,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  onStateChange,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    const fieldTypeParams = pluginUrlParamsFromUrl(window.location.search)
    if (typeof fieldTypeParams === 'undefined') {
      // Missing search params
      return
    }
    if (event.origin !== originFromPluginParams(fieldTypeParams)) {
      // Not intended for this field type
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
      console.log('is asset selected')
    }
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
