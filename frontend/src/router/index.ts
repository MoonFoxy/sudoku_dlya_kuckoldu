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
    component: () => import(/* webpackChunkName: "about" */ '@/pages/About.vue'),
    name: 'about',
    path: '/about',
  },
  {
    component: () => import(/* webpackChunkName: "about" */ '@/pages/HowToPlay.vue'),
    name: 'how-to-play',
    path: '/howtoplay',
  },
  {
    component: NotFound,
    name: 'not-found',
    path: '/:catchAll(.*)',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
