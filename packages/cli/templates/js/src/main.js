import { createFieldPlugin } from '@storyblok/field-plugin'
import './style.css'

// This button is the only element in this application
const buttonEl = document.createElement('button')
buttonEl.classList.add('sb-button--primary')
document.body.appendChild(buttonEl)

// Establish communication with the Visual Editor
createFieldPlugin((response) => {
  // Re-render the button element when messages
  const { data, actions } = response
  buttonEl.textContent = `Increment: ${data.value ?? 0}`
  buttonEl.onclick = () => actions.setValue((data.value ?? 0) + 1)
})

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
