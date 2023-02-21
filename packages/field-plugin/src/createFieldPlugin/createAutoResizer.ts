/**
 * @returns function for cleaning up side effects
 */
import { heightChangeMessage } from '../messaging'

export const createAutoResizer = (
  uid: string,
  postToContainer: (message: unknown) => void,
) => {
  const handleResize = () => {
    postToContainer(heightChangeMessage(uid, document.body.clientHeight))
  }
  const observer = new ResizeObserver(handleResize)
  observer.observe(document.body)
  // window.addEventListener('resize', handleResize, false)
  return () => {
    observer.disconnect()
  }
}
