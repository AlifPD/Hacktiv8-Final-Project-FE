import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PeminjamanView from '../views/PeminjamanView.vue'
import HistoryView from '@/views/HistoryView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistrationPage from '@/views/RegistrationPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/peminjaman',
      name: 'peminjaman',
      component: PeminjamanView
    },
    {
      path: '/histori',
      name: 'histori',
      component: HistoryView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }, 
    {
      path: '/register',
      name: 'register',
      component: RegistrationPage
    }
  ]
})

export default router
