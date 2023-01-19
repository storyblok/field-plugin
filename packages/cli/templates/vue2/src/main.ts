import Vue from 'vue';
import App from './App.vue';
import { initialModel } from './config';

  new Vue({
    render:(h) => h(App, {
      props: {
        initialModel,
      },
    })
  }).$mount('#plugin')

