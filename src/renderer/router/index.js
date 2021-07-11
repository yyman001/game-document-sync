import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/games',
      name: 'games',
      component: require('@/pages/games.vue').default
    },
    {
      path: '/backup',
      name: 'backup',
      component: require('@/pages/backup.vue').default
    },
    {
      path: '/doc',
      name: 'doc',
      component: require('@/components/Table/doc.vue').default
    },
    {
      path: '/404',
      name: '404',
      component: require('@/pages/404.vue').default
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
