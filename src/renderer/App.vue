<!--
 * @Author: yyman001
 * @Date: 2020-07-22 20:22:17
 * @LastEditTime: 2021-06-12 19:16:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\App.vue
-->
<template>
  <div id="app" class="themes" :class="[`themes--${vx_themeName}`]">
  <el-container>
    <!-- 导航 -->
    <Menu/>
    <router-view></router-view>
  </el-container>
  </div>
</template>

<script>
import Menu from './components/Menu'
import {mapGetters} from 'vuex'
export default {
  name: 'game-document-sync',
  components: {Menu},
  computed: {
    ...mapGetters({
      vx_themeName: 'getThemeName'
    })
  }
}
</script>

<style lang="scss">
  /* CSS */
  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
    font-family: "Motiva Sans", Sans-serif;
  }

  #app {
    display: flex;
    height: 100%;
    overflow-y: hidden;
  }
  p {
    margin: 0;
  }
  @import './sass/themes.scss';
</style>
