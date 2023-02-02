/**
 * @returns function for cleaning up side effects
 */
import { postSetHeight } from '../../actions'

export const createAutoResizer = () => {
  const handleResize = () => {
    postSetHeight(document.body.clientHeight)
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
    // window.removeEventListener('resize', handleResize, false)
  }
}
