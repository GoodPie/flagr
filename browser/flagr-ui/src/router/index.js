import { createRouter, createWebHashHistory } from 'vue-router'
import Flags from '../components/Flag.vue'
import Flag from '../components/Flag.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Flags
    },
    {
      path: '/flags/:flagId',
      name: 'flag',
      component: Flag
    }
  ]
})
