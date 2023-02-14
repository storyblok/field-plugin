import { postPluginMessage } from './postPluginMessage'
import { SetHeight } from './index'

/**
 * Instructs the parent window to increase the height of this window's containing iframe.
 * @param heightPx the height in pixels.
 */
export const postSetHeight: SetHeight = (heightPx) =>
  postPluginMessage({
    event: 'heightChange',
    height: heightPx,
  })
