/**
 * @returns function for cleaning up side effects
 */
import { postHeightToContainer } from './post-to-container'

export const createAutoResizer = () => {
  const handleResize = () => {
    postHeightToContainer(document.body.clientHeight)
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
