import { createRoot } from 'react-dom/client'
import { App } from './components/App'
import {createRootElement} from "./createRootElement";

const rootNode = createRootElement()
document.body.appendChild(rootNode)

createRoot(rootNode).render(<App />)