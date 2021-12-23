import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';

import './plugins/bootstrap-vue';
import './assets/sass/globals.sass';
import './assets/tailwind.css';

import './utils/registerServiceWorker';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
