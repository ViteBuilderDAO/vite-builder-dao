import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/#',
  },
  {
    path: '/#',
    name: 'home',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/landing/About.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/gallery-test',
    name: 'gallery-test',
    component: () => import('@/views/proposals/test/GalleryTest.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/view-proposal-test',
    name: 'view-proposal-test',
    component: () => import('@/views/proposals/test/ViewProposalTest.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
