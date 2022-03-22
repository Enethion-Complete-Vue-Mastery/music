import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import HomeView from '@/views/HomeView'
import ManageView from '@/views/ManageView'
import AboutView from '@/views/AboutView'
import SongView from '@/views/SongView.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView
  },
  {
    name: 'manage',
    path: '/manage-music',
    // alias: '/manage',
    meta: {
      requiresAuth: true
    },
    component: ManageView
    // beforeEnter: (to, from, next) => {
    //   // console.log('Global Guard speaking:')
    //   // console.log(to, from)\
    //   next()
    // }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    next()
    return
  }

  if (store.state.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router
