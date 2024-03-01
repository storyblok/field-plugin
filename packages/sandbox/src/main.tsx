import { createRoot } from 'react-dom/client'
import { App } from './components/App'

const rootNode = document.getElementById('app')

if (rootNode) {
  createRoot(rootNode).render(<App />)
} else {
  console.error('Failed to locate root element for field type wrapper.')
}
