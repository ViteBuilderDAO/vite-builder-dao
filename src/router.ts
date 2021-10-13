import { createRouter, createWebHashHistory, RouteLocation } from 'vue-router';
//import domains from '@/../guilds/channels/channels.json';

import Home from '@/views/home-views/Home.vue';
import Setup from '@/views/home-views/Setup.vue';
import Explore from '@/views/home-views/Explore.vue';

import GuildProposal from '@/views/guild-views/GuildProposal.vue';
import GuildCreate from '@/views/guild-views/GuildCreate.vue';
import GuildSettings from '@/views/guild-views/GuildSettings.vue';

const homeRoutes =
[
    {
      path: '/',
      name: 'home',
      component: Home
    }
];

const routes: any[] =
[
    ...homeRoutes,
    { path: '/setup', name: 'setup', component: Setup },
    { path: '/networks', name: 'networks', component: Explore }
];

const router = createRouter(
{
    history: createWebHashHistory(), routes
});
  
  export default router;
