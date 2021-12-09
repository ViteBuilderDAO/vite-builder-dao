import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/proposals/ProposalGallery.vue'),
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
    path: '/create-proposal',
    name: 'create-proposal',
    component: () => import('@/views/proposals/forms/FormCreateProposal.vue'),
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/view/:proposalID',
    name: 'view-proposal',
    component: () => import('@/views/proposals/ViewProposal.vue'),
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

  // {
  //   path: '/',
  //   redirect: '/#',
  // },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import('@/views/dashboard/Dashboard.vue'),
  //   meta: {
  //     layout: 'content',
  //   },
  // },
  // {
  //   path: '/proposal-gallery',
  //   name: 'proposal-gallery',
  //   component: () => import('@/views/proposals/ProposalGallery.vue'),
  //   meta: {
  //     layout: 'content',
  //   },
  // },
  // {
  //   path: '/view-proposal',
  //   name: 'view-proposal',
  //   component: () => import('@/views/proposals/ViewProposal.vue'),
  //   meta: {
  //     layout: 'content',
  //   },
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
