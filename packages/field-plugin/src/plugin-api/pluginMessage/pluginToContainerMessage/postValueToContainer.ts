import { postMessageToContainer } from './postMessageToContainer'
import { SetValue } from './PluginToContainer'

/**
 * Instructs the parent window to update the content with a new value.
 * @param value a serializable value
 */
export const postValueToContainer: SetValue = (value) =>
  postMessageToContainer({
    event: 'update',
    model: value,
  })
