// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import chart from '@/components/chart';
import Hello from '@/components/Hello';

Vue.use(VueRouter);

Vue.use(VueResource);
Vue.use(iView);
// Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: { App }
// })

// const router1 = new VueRouter({
//     mode:'history',
//     routes: [
//         {
//             path: '/Hello',
//             name: 'Hello',
//             component: Hello
//         },
//         {
//             path: '/chart',
//             name: 'chart',
//             component:chart
//         }
//     ]
// })

// mount
var vm = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
