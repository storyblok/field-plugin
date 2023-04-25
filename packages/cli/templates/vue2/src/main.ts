import Vue from 'vue'
import App from './App.vue'
import { initialModel } from './config'

new Vue({
  render: (h) =>
    h(App, {
      props: {
        initialModel,
      },
    }),
}).$mount('#plugin')

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
