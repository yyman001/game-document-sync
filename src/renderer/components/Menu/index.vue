<template>
  <a-menu 
   mode="inline"
   v-model="selectedKeys"
   @select="onMenuSelected"
   >
    <a-menu-item v-for="item in menuList" :key="item.key">
      <a-icon :type="item.icon" />
      <span class="nav-text">{{item.name}}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data () {
    return {
      selectedKeys: ['games-list'],
      menuList: [
        {
          key: 'games-list',
          icon: 'home',
          name: '游戏存档管理'
        },
        {
          key: 'back-list',
          icon: 'save',
          name: '存档备份管理'
        },
        {
          key: 'docs-config',
          icon: 'appstore',
          name: '配置存档管理'
        },
        {
          key: 'config',
          icon: 'setting',
          name: '配置信息'
        }
      ]
    }
  },
  methods: {
    onMenuSelected (selectedItem) {
      console.log('onMenuSelected:', selectedItem)
      console.log('selectedKeys:', this.selectedKeys)
    }
  }
}
</script>

<style lang="scss" scoped></style>
