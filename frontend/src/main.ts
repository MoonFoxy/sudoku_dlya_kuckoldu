// import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';

import '@/assets/styles/tailwind.css';

import '@/plugins/bootstrap-vue';
import '@/utils/registerServiceWorker';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
