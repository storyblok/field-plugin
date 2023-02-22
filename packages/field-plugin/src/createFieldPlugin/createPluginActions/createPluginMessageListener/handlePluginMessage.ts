import {
  isAssetSelectedMessage,
  isMessageToPlugin,
  isStateChangedMessage,
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnStateChangeMessage,
} from '../../../messaging'
import { isContextRequestMessage } from '../../../messaging/pluginMessage/containerToPluginMessage/ContextRequestMessage'

export const handlePluginMessage = (
  event: MessageEvent<unknown>,
  uid: string,
  onStateChange: OnStateChangeMessage,
  onContextRequest: OnContextRequestMessage,
  onAssetSelected: OnAssetSelectMessage,
) => {
  const { data } = event

  if (!isMessageToPlugin(data)) {
    return
  }

  // TODO check origin https://app.storyblok.com/ in production mode, * in dev mode

  if (data.uid !== uid) {
    // Not intended for this field type
    return
  } else if (isStateChangedMessage(data)) {
    onStateChange(data)
  } else if (isContextRequestMessage(data)) {
    onContextRequest(data)
  } else if (isAssetSelectedMessage(data)) {
    onAssetSelected(data)
  } else {
    console.debug(
      'Plugin received unknown message from plugin:',
      JSON.stringify(data),
    )
  }
}
