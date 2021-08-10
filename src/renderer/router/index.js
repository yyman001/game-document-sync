import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'games'
    },
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
      path: '/config',
      name: 'config',
      component: require('@/pages/config.vue').default
    }
  ]
})
