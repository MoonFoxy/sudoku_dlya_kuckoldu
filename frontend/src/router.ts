import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import VueCli from '@/views/VueCli.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/vue-cli',
      name: 'vue-cli',
      component: VueCli,
    },
    {
      path: '/about',
      name: 'about-page',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/AboutPage.vue'),
    },
  ],
});
