import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import MLogin from './pages/MLogin.vue'
import Application from './pages/Application.vue'
import index from './pages/index.vue'
import Assistant from './pages/Assistant.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  { path: '/MLogin', component: MLogin },
  { path: '/index', component: index },
  { path: '/Application', component: Application },
  { path: '/Assistant', component: Assistant },
]

// 读取.env 配置
const assetPrefix = import.meta.env.VITE_PUBLIC_PATH;
const router = createRouter({
  history: createWebHistory(assetPrefix),
  routes,
})

// 判断设备类型
function isMobileDevice() {
  // 通过窗口宽度来判断是否是移动端
  return window.innerWidth <= 768;
}

// 添加路由前置守卫
router.beforeEach((to, from, next) => {
  // 判断是否是访问 /login 路径
  if (to.path === '/login') {
    if (isMobileDevice()) {
      // 如果是移动端，重定向到 /MLogin
      next('/MLogin');
 } else {
      // 如果是桌面端，正常访问 /login
      next();
    }
  } else {
    next();
  }
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

// 注册所有图标（可选）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')