import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import axios from 'axios'
import md5 from 'md5'

Vue.config.productionTip = false

new Vue({
  vuetify,
  axios,
  md5,
  render: h => h(App)
}).$mount('#app')
