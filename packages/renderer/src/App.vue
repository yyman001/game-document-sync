<template>
  <a-layout>
    <a-layout-sider
      class="layout-sider"
      width="250"
      collapsed-width="0">
      <div class="logo" />
      <!-- 菜单导航 -->
      <Menu />

    </a-layout-sider>
    <a-layout>
      <a-layout-header class="">
        <div class="header">
          头部
        </div>
      </a-layout-header>
      <a-layout-content>
        <div class="layout-content">
          <router-view></router-view>
        </div>
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
@import "@/sass/_var.scss";

body, html {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
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
    background: $color-master;
    box-shadow: 14px 14px 40px 0 rgba(158, 158, 158, 0.2);
  }

  .ant-layout-header {
    padding: 15px 15px 5px;
    height: auto;
    background: none;
  }
}

.logo {
  height: 80px;
  // border: 1px solid #ccc;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.logo-box span {
  width: 74px;
}

.layout-content {
  margin: 15px;
  height: 100%;

  // background: $color-master;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  background: $color-master;
  border-radius: 8px;
  box-shadow: 0 0 10px 5px rgb(158 158 158 / 20%);
}
</style>
