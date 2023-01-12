export const createRootElement = (id?: string): HTMLElement => {
  /* eslint-disable functional/immutable-data */
  const rootElement = document.createElement('div')
  rootElement.id = id ?? 'app'
  return rootElement
}
