import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'
import { createRootElement } from './createRootElement'

if (import.meta.env.DEV && window.self === window.top) {
  console.log('Redirecting to the Field Plugin Sandbox...')
  const url = `https://plugin-sandbox.storyblok.com/field-plugin?${new URLSearchParams({ url: location.href }).toString()}`
  location.href = url
}

const rootNode = createRootElement()
document.body.appendChild(rootNode)

createRoot(rootNode).render(<App />)

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
