import {
  isAssetSelectedMessage,
  isMessageToPlugin,
  isStateChangedMessage,
  OnAssetSelectedMessage,
  OnStateChangedMessage,
} from '../../../../plugin-api'

export const handlePluginMessage = (
  event: MessageEvent<unknown>,
  uid: string,
  onStateChange: OnStateChangedMessage,
  onAssetSelected: OnAssetSelectedMessage,
) => {
  const { data } = event

  if (!isMessageToPlugin(data)) {
    return
  }

  // TODO check origin https://app.storyblok.com/ in production mode, * in dev mode

  if (data.uid !== uid) {
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
