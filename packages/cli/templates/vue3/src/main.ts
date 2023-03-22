import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

if (!document.querySelector('#app')) {
  const rootElement = document.createElement('div')
  rootElement.id = 'app'
  document.body.appendChild(rootElement)
}
createApp(App).mount('#app')
