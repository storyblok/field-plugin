/**
 * @returns function for cleaning up side effects
 */

export const createHeightChangeListener = (
  onChange: (height: number) => void,
) => {
  const handleResize = () => {
    onChange(document.body.clientHeight)
  }
  const observer = new ResizeObserver(handleResize)
  observer.observe(document.body)
  return () => observer.disconnect()
}
