import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

createApp(App)
  .use(createPinia())
  .use(Antd)
  .mount('#app')
  .$nextTick(window.removeLoading)
