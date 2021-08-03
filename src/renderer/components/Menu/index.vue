<template>
  <el-aside width="200px">
      <el-menu
      :router="true"
      :default-active="activeIndex"
      text-color="#909399"
      background-color="#24282f"
      active-text-color="#ffd04b">
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
.el-aside {
  background-color: #24282f;
  color: #6d727d;
  text-align: left;
  line-height: 200px;
    .el-menu {
    border-right: none;
  }
}
</style>