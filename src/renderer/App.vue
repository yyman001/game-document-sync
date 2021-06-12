<!--
 * @Author: your name
 * @Date: 2020-07-22 20:22:17
 * @LastEditTime: 2021-06-12 19:16:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\App.vue
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'game-document-sync'
  }
</script>

<style>
  /* CSS */
  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  #app {
    display: flex;
    height: 100%;
    overflow-y: hidden;
  }
</style>
