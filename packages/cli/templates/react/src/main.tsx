import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { createRootElement } from './createRootElement'

const rootNode = createRootElement()
document.body.appendChild(rootNode)

createRoot(rootNode).render(<App />)
