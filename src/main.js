import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import VueFormulate from '@braid/vue-formulate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueFormulate)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
