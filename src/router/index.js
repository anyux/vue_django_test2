import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [

  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/LoginView.vue')
  },
  {
    path: '/',
    // 重定向到登录页面
    redirect: {
      name: 'login',
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import( '../views/HomeView.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    redirect: {
      name: 'login',
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
