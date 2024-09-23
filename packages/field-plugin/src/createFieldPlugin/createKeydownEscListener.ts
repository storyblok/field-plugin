/**
 * @returns function for cleaning up side effects
 */

export const createKeydownEscListener = (
  onChange: () => void,
) => {
  const handleEsc = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === "Escape") {
      onChange()
    }
  }

  document.addEventListener('keydown', handleEsc)
  return () => document.removeEventListener('keydown', handleEsc)
}
