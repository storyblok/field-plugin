import {
  isAssetSelectedMessage,
  isMessageToPlugin,
  isLoadedMessage,
  isPromptAIMessage,
  isContextRequestMessage,
  isUserContextRequestMessage,
} from '../../../messaging'
import { PluginMessageCallbacks } from './createPluginMessageListener'
import { isStateMessage } from '../../../messaging/pluginMessage/containerToPluginMessage/StateChangedMessage'
import { isPreviewDimensionResponse } from '../../../messaging/pluginMessage/containerToPluginMessage//PreviewDimensionResponseMessage'

export const handlePluginMessage = (
  data: unknown,
  uid: string,
  callbacks: PluginMessageCallbacks,
) => {
  if (!isMessageToPlugin(data)) {
    // Other kind of event, which this function does not handle
    return
  }

  // TODO check origin https://app.storyblok.com/ in production mode, * in dev mode

  if (data.uid !== uid) {
    // Not intended for this field plugin
    return
  }

  if (isLoadedMessage(data)) {
    callbacks.onLoaded(data)
  } else if (isStateMessage(data)) {
    callbacks.onStateChange(data)
  } else if (isContextRequestMessage(data)) {
    callbacks.onContextRequest(data)
  } else if (isUserContextRequestMessage(data)) {
    callbacks.onUserContextRequest(data)
  } else if (isAssetSelectedMessage(data)) {
    callbacks.onAssetSelect(data)
  } else if (isPromptAIMessage(data)) {
    callbacks.onPromptAI(data)
  } else if (isPreviewDimensionResponse(data)) {
    callbacks.onPreviewDimension(data)
  } else {
    callbacks.onUnknownMessage(data)
  }
}
