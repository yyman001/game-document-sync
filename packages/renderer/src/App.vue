<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <div class="logo-box">
    
  </div> -->
  
  <!-- <div class="static-public">
    Place static files into the <code>src/renderer/public</code> folder
    <img style="width:90px;" :src="'./images/node.png'" >
  </div> -->
  <a-layout>
    <a-layout-sider>
      <a-button @click="$router.push('/games')">游戏列表</a-button>
      <a-button @click="$router.push('/backup')">备份列表</a-button>
      <a-button @click="$router.push('/docs')">游戏配置列表</a-button>
      <a-button @click="$router.push('/config')">配置</a-button>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>Header</a-layout-header>
      <a-layout-content>
        <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style>
#app {
  display: flex;
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
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
