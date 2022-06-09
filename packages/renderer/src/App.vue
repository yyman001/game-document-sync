<template>
  <!-- <div class="static-public">
    Place static files into the <code>src/renderer/public</code> folder
    <img style="width:90px;" :src="'./images/node.png'" >
  </div> -->
  <a-layout>
    <a-layout-sider
      class="layout-sider"
      collapsed-width="0">
      <div class="logo" />
      <!-- 菜单导航 -->
      <Menu />

    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header>Header</a-layout-header> -->
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
      <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import Menu from './components/Menu/index.vue'

</script>

<style lang="scss">
// @import './sass/themes.scss';

body, html {
  padding: 0;
  margin: 0;
  height: 100%;
  font-family: "Motiva Sans", Sans-serif;
}

#app {
  display: flex;
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;

  /* 重写框架样式 */
  .ant-layout-sider {
    background: none;
  }
}

.logo {
  height: 80px;
  border: 1px solid #ccc;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.logo-box span {
  width: 74px;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}

</style>
