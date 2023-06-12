<template>
  <a-layout>
    <a-layout-sider class="layout-sider" width="200" collapsed-width="0">
      <div class="logo" />
      <!-- 菜单导航 -->
      <Menu />
      <div class="cloud-select">
        <a-select
          style="width: 100px"
          size="small"
          :value="cloudType"
          :options="cloudTypeList"
          @change="setCloudType"
        ></a-select>
        <a-button size="small" @click="reLoadCloudData"><ReloadOutlined /></a-button>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="">
        <div class="header">
          <Search />
          <RestoreModal />
        </div>
      </a-layout-header>
      <a-layout-content>
        <perfect-scrollbar class="scrollbar-wrap" ref="scroll">
          <div class="layout-content">
            <router-view></router-view>
          </div>
        </perfect-scrollbar>
      </a-layout-content>
      <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import Menu from './components/Menu/index.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import RestoreModal from '@/modal/restore/index.vue'
import Search from '@/components/Search/index.vue'

import { useCloudFileStoreWhitOut } from '@/store/cloudFile'
import { useCloudStoreWhitOut } from '@/store/cloud'
import useRestore from './modal/restore/useRestore'
import { storeToRefs } from 'pinia'
import useScroll, { scrollMod } from './hooks/useScroll'
import { onMounted, provide } from 'vue'
import useSearch from './components/Search/useSearch'

const cloudStore = useCloudStoreWhitOut()
const cloudFileStore = useCloudFileStoreWhitOut()
const { cloudType, cloudTypeList } = storeToRefs(cloudStore)

const reLoadCloudData = () => {
  cloudFileStore.switchCloudAccount(cloudStore.targetCloudAccount)
}

const { restoreProvide } = useRestore()
restoreProvide()
// ! 切换 实例
// 如果存在对应配置
const setCloudType = (type: string) => {
  cloudStore.setCloudType(type)
  reLoadCloudData()
}

const { scroll, scrollTop } = useScroll()
provide(scrollMod, {
  scrollTop
})

const { searchProvide } = useSearch()
searchProvide()

onMounted(() => {
  document.body.classList.add('catppuccin-frappe')
})
</script>

<style lang="scss">
@import '@/sass/_var.scss';

body,
html {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Motiva Sans', Sans-serif;
}

#app {
  display: flex;
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;

  /* 重写框架样式 */
  .ant-layout {
    background: var(--gradient-body-background);
  }

  .ant-layout-sider {
    background: var(--navbar-background);
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
  padding: 15px;
  height: 100%;
}

.header {
  display: flex;
  flex-wrap: wrap;
  border-radius: 8px;
}

.cloud-select {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 9;
}

.scrollbar-wrap {
  height: 100%;
}
</style>
