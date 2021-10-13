import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).Buffer = Buffer;
import { createApp, h, provide } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import mixins from '@/mixins';
import i18n from '@/utils/translation/i18n';
import '@/style.scss';
import { apolloClient } from '@/utils/network/apolloClient';
import { DefaultApolloClient } from '@vue/apollo-composable';
import VueTippy from 'vue-tippy';

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App)
})
  .use(i18n)
  .use(router)
  .use(VueTippy, {
    defaultProps: { delay: [400, null] },
    directive: 'tippy' // => v-tippy
  })

  .mixin(mixins);

app.mount('#app');

export default app;
