import {
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnLoadedMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  isAssetSelectedMessage,
  isMessageToPlugin,
  isLoadedMessage,
} from '../../../messaging'
import { isContextRequestMessage } from '../../../messaging'
import { isStateMessage } from '../../../messaging/pluginMessage/containerToPluginMessage/StateChangedMessage'

export type PluginMessageCallbacks = {
  onStateChange: OnStateChangeMessage
  onLoaded: OnLoadedMessage
  onContextRequest: OnContextRequestMessage
  onAssetSelect: OnAssetSelectMessage
  onUnknownMessage: OnUnknownPluginMessage
}

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
  } else if (isAssetSelectedMessage(data)) {
    callbacks.onAssetSelect(data)
  } else {
    callbacks.onUnknownMessage(data)
  }
}
