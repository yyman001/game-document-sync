import { createRouter, createWebHashHistory } from "vue-router";

import Games from '../view/games/index.vue'
import Backup from '../view/backup/index.vue'
import Docs from '../view/docs/index.vue'
import Config from '../view/config/index.vue'

const routes = [
  { path: '/games', component: Games, alias: '/games'},
  { path: '/backup', component: Backup },
  { path: '/docs', component: Docs },
  { path: '/config', component: Config },
  // 不设置 根目录, 默认跳转到 游戏列表 页面
  { path: '/:pathMatch(.*)*', name: '404', redirect: '/games'}
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router