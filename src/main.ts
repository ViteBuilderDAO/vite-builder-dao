import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).Buffer = Buffer;
import { createApp, h, provide } from 'vue';
import App from '@/App.vue';
//import router from '@/router';
//import mixins from '@/mixins';
import i18n from '@/utils/i18n';
import '@/style.scss';
import { apolloClient } from '@/utils/apolloClient';
import { DefaultApolloClient } from '@vue/apollo-composable';
import VueTippy from 'vue-tippy';

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App)
})
  .use(i18n)
  //.use(router) // ZACH FIX ME
  .use(VueTippy, {
    defaultProps: { delay: [400, null] },
    directive: 'tippy' // => v-tippy
  })

  //.mixin(mixins); // ZACH FIX ME

app.mount('#app');

export default app;
