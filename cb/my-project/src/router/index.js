import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Chart from '@/components/chart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/chart',
      name: 'chart',
      component: Chart
    }
  ]
})
