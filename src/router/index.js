import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/typography',
    name: 'typography',
    component: () => import('@/views/typography/Typography.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/components/cards/Card.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/tables/SimpleTable.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/forms/FormLayouts.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/pages/user-settings',
    name: 'pages-user-settings',
    component: () => import('@/views/pages/user-settings/UserSettings.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/pages/login',
    name: 'pages-login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/register',
    name: 'pages-register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/explore-guilds',
    name: 'explore-guilds',
    component: () => import('@/views/guilds/ExploreGuilds.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/create-guild',
    name: 'create-guild',
    component: () => import('@/views/guilds/CreateGuild.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/guild-home',
    name: 'guild-home',
    component: () => import('@/views/guilds/GuildHome.vue'),
    meta: {
      layout: 'guild',
    },
  },
  {
    path: '/create-proposal',
    name: 'create-proposal',
    component: () => import('@/views/proposals/CreateProposal.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/view-proposal',
    name: 'view-proposal',
    component: () => import('@/views/proposals/ViewProposal.vue'),
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/proposal-gallery',
    name: 'proposal-gallery',
    component: () => import('@/views/proposals/ProposalGallery.vue'),
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
