<template>
  <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
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
  }
}
</script>

<style lang="scss" scoped></style>
