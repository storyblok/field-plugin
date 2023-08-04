// //  TODO post-process elm.js to include this line
// Elm.Main.init({ node: document.getElementById('app') })
import { Elm } from './src/Main.elm'
import { createFieldPlugin } from '@storyblok/field-plugin'
import './src/style.css'

const rootNode = document.createElement('div')
const appNode = document.createElement('div')
appNode.id = 'app'
appNode.append(rootNode)
document.body.append(appNode)
const app = Elm.Main.init({ node: rootNode })
app.ports.setCount.subscribe((content) => {
  state.actions.setContent(content)
})
app.ports.setModalOpen.subscribe((isOpen) => {
  state.actions.setModalOpen(isOpen)
})

let state
createFieldPlugin((newState) => {
  state = newState
  app.ports.contentChange.send(state.data)
})
