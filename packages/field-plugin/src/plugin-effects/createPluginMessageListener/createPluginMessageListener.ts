import { hasKey } from '../../utils'
import { originFromPluginParams } from '../../plugin-api/pluginUrlParams'
import { pluginUrlParamsFromUrl } from '../../plugin-api/pluginUrlParams'
import { OnMessageToPlugin } from '../../plugin-api/pluginMessage'
import { isMessageToPlugin } from '../../plugin-api/pluginMessage/containerToPluginMessage/MessageToPlugin'

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
    if (!hasKey(data, 'uid') || data.uid !== fieldTypeParams.uid) {
      // Not intended for this field type
      return
    }
    if (isMessageToPlugin(data)) {
      onStateChange(data)
    }
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
