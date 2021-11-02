import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import VueFormulate from '@braid/vue-formulate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

const UniqueId = require('vue-unique-id')

Vue.config.productionTip = false

// VueFormulate forms plugin
Vue.use(VueFormulate)

// VueUniqueID uid plugin
Vue.use(UniqueId)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
