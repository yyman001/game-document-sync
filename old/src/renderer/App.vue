<!--
 * @Author: yyman001
 * @Date: 2020-07-22 20:22:17
 * @LastEditTime: 2021-06-12 19:16:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\App.vue
-->
<template>
  <div id="app" class="themes">
    <Layout></Layout>
  </div>
</template>

<script>
import Layout from './components/Layout'
import appMixin from './mixins/app.mixin'
export default {
  name: 'game-document-sync',
  components: { Layout },
  mixins: [appMixin]
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
