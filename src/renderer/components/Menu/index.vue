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
      selectedKeys: ['games-mod'],
      menuList: [
        {
          key: 'games-mod',
          icon: 'home',
          name: '游戏存档管理'
        },
        {
          key: 'back-mod',
          icon: 'save',
          name: '存档备份管理'
        },
        {
          key: 'docs-mod',
          icon: 'appstore',
          name: '配置存档管理'
        },
        {
          key: 'config-mod',
          icon: 'setting',
          name: '配置信息'
        }
      ]
    }
  },
  methods: {
    onMenuSelected (selectedItem) {
      this.$emit('onMenuChange', selectedItem.key)
    }
  }
}
</script>

<style lang="scss" scoped></style>
