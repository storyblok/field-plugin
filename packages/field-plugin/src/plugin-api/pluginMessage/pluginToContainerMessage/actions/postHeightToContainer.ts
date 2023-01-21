import { postMessageToContainer } from './postMessageToContainer'
import { SetHeight } from './index'

/**
 * Instructs the parent window to increase the height of this window's containing iframe.
 * @param heightPx the height in pixels.
 */
export const postHeightToContainer: SetHeight = (heightPx) =>
  postMessageToContainer({
    event: 'heightChange',
    height: heightPx,
  })
