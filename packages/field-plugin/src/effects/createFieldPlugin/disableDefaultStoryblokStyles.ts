//  TODO this function will not be needed in future version of the plugin API. At that point, this function should be removed.
/**
 * @returns cleanup function
 */
export const disableDefaultStoryblokStyles = (): (() => void) => {
  const link = document?.querySelector(
    `link[href^="https://plugins.storyblok.com"]`,
  )

  link?.setAttribute('disabled', '')

  return () => {
    link?.removeAttribute('disabled')
  }
}
