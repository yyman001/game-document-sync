import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import router from './router/index'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(Antd)
  .mount('#app')
  .$nextTick(window.removeLoading)
