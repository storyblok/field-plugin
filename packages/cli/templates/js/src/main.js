import { createFieldPlugin } from '@storyblok/field-plugin'
import { renderFieldPlugin, updateData } from './components'
import './style.css'

let rootElement = document.querySelector('#app')
if (!rootElement) {
  // In production, `#app` may or may not exist.
  rootElement = document.createElement('div')
  rootElement.id = 'app'
  document.body.appendChild(rootElement)
}

rootElement.innerHTML = `<span>Loading...</span>`
let previousType = 'loading'

// Establish communication with the Visual Editor
createFieldPlugin({
  enablePortalModal: true,
  validateContent: (content) => ({
    content: typeof content === 'number' ? content : 0,
  }),
  onUpdateState: (response) => {
    // Re-render the button element when messages
    const { data, actions, type } = response
    // #region DELETE THIS BOILERPLATE
    if (previousType === 'loading') {
      previousType = type
      if (type === 'error') {
        rootElement.innerHTML = `<span>Error</span>`
      } else if (type === 'loaded') {
        renderFieldPlugin({ data, actions, container: rootElement })
      }
    } else {
      updateData({ data, container: rootElement })
    }
    // #endregion
  },
})

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
