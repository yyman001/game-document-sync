import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import router from './router/index'
// import '@/utils/db/sql'
// 滚动条美化
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import './sass/catppuccin.scss'
// google 数据库
// import './utils/firebase'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// https://imengyu.top/pages/vue3-context-menu-docs/
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(Antd)
  .use(ElementPlus)
  .use(PerfectScrollbar)
  .use(ContextMenu)
  .mount('#app')
  .$nextTick(() => {
    window.removeLoading()
  })
