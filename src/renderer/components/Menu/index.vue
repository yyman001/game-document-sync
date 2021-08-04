<template>
  <el-aside width="200px">
      <el-menu
      :router="true"
      :default-active="activeIndex">
      <el-menu-item index="games">
        <i class="el-icon-menu"></i>
        <span slot="title">游戏存档管理</span>
      </el-menu-item>
      <el-menu-item index="backup">
        <i class="el-icon-document"></i>
        <span slot="title">存档备份管理</span>
      </el-menu-item>
      <el-menu-item index="doc">
        <i class="el-icon-setting"></i>
        <span slot="title">配置存档管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: this.$route.name
    }
  }
}
</script>

<style lang="scss" scoped>

</style>