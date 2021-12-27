import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/pages/Home.vue';
import NotFound from '@/pages/NotFound.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    component: Home,
    name: 'home',
    path: '/',
  },
  {
    // Dynamic import of component and dependency
    component: () => import(/* webpackChunkName: "about" */ '@/pages/About.vue'),
    name: 'about',
    path: '/about',
  },
  {
    // Dynamic import of component and dependency
    component: () => import(/* webpackChunkName: "how-to-play" */ '@/pages/HowToPlay.vue'),
    name: 'how-to-play',
    path: '/howtoplay',
  },
  {
    component: NotFound,
    name: 'not-found',
    path: '/:catchAll(.*)',
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
