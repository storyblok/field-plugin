/**
 * @returns function for cleaning up side effects
 */

export const createKeydownEscListener = (onPressed: () => void) => {
  const handleEsc = (event: KeyboardEvent) => {
    const key = event.key
    if (key === 'Escape') {
      onPressed()
    }
  }

  document.addEventListener('keydown', handleEsc)
  return () => document.removeEventListener('keydown', handleEsc)
}
