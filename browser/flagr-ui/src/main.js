import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

// Autofocus certain fields
app.directive('focus', {
  mounted(el) {
    const input = el.querySelector('input')
    if (input) {
      input.focus()
    }
  }
})

app.mount('#app')
