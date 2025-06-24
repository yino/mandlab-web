// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import MLogin from '../pages/MLogin.vue';
import index from '../pages/index.vue';
import Assistant from '../pages/Assistant.vue';
const routes = [
  {
    path: '/Mlogin',
    name: 'MLogin',
    component: MLogin
  },
   {
     path: '/index',
     name: 'index',
     component: index,
   },
   {
     path: '/Assistant',
     name: 'Assistant',
     component: Assistant,
   },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;