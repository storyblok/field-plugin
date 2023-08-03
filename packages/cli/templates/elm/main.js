// //  TODO post-process elm.js to include this line
// Elm.Main.init({ node: document.getElementById('app') })
import { Elm } from './src/Main.elm'
import { createFieldPlugin } from '@storyblok/field-plugin'

const app = Elm.Main.init({ node: document.getElementById('app') })
app.ports.setCount.subscribe((count) => {
  state.actions.setContent(count)
  console.log(count)
})

let state
const cleanup = createFieldPlugin((newState) => {
  state = newState
  const { content } = newState.data
  console.log('content', content)
  app.ports.contentChange.send(typeof content === 'number' ? content : 0)
})
