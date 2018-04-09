import Vue from 'vue'
import App from './App.vue'
import windComponents from '../packages'

Vue.use(windComponents)

new Vue({
  el: '#app',
  render: h => h(App)
})
