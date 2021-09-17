import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import Login from '@/components/Login'
import Calendar from '@/components/Calendar'
import Registration from '@/components/Registration'
import Events from '@/components/Events'


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'calendar',
    component: Calendar,
    beforeEnter: AuthGuard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    beforeEnter: AuthGuard
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
