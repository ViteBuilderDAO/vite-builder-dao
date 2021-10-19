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
  },
  {
    path: '/typography',
    name: 'typography',
    component: () => import('@/views/typography/Typography.vue'),
  },
  {
    path: '/icons',
    name: 'icons',
    component: () => import('@/views/icons/Icons.vue'),
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/components/cards/Card.vue'),
  },
  {
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/tables/SimpleTable.vue'),
  },
  {
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/forms/FormLayouts.vue'),
  },
  {
    path: '/pages/user-settings',
    name: 'pages-user-settings',
    component: () => import('@/views/pages/user-settings/UserSettings.vue'),
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
  },
  {
    path: '/create-guild',
    name: 'create-guild',
    component: () => import('@/views/guilds/CreateGuild.vue'),
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
