import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './utils/DexieDB'
import VueCompositionAPI from '@vue/composition-api'
import antDesignVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { createPinia, PiniaVuePlugin } from 'pinia'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
const pinia = createPinia()
Vue.use(PiniaVuePlugin)
Vue.use(VueCompositionAPI)
Vue.use(ElementUI)
Vue.use(antDesignVue)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  pinia,
  template: '<App/>'
}).$mount('#app')
