import { createApp } from 'vue'
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(ElementPlus);
app.use(router);

// 注册所有图标（可选）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');