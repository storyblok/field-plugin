/**
 * @returns function for cleaning up side effects
 */
import { heightChangeMessage } from '../messaging'

export const createAutoResizer = (
  uid: string,
  postToContainer: (message: unknown) => void,
  isEnabled: () => boolean,
) => {
  const handleResize = () => {
    if (!isEnabled()) {
      return
    }
    postToContainer(heightChangeMessage(uid, `${document.body.clientHeight}px`))
  }
  const observer = new ResizeObserver(handleResize)
  observer.observe(document.body)
  return () => observer.disconnect()
}
