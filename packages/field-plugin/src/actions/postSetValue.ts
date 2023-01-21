import { postPluginMessage } from './postPluginMessage'
import { SetValue } from './index'

/**
 * Instructs the parent window to update the content with a new value.
 * @param value a serializable value
 */
export const postSetValue: SetValue = (value) =>
  postPluginMessage({
    event: 'update',
    model: value,
  })
