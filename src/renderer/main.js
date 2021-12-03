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

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(ElementUI)
Vue.use(antDesignVue)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
