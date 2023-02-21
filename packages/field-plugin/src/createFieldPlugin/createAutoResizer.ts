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
  const observer = new MutationObserver(handleResize)
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  })
  // window.addEventListener('resize', handleResize, false)
  return () => {
    observer.disconnect()
  }
}
