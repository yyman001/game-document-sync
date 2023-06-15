<template>
  <div class="search-mod">
    <a-row>
      <a-col :span="12">
        <a-input class="search-input" size="large" :bordered="false" v-model:value="searchText" :allowClear="true"
          placeholder="请输入搜索内容">
          <template #prefix>
            <search-outlined />
          </template> </a-input>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="2">
        <FileAddOutlined v-if="isViewRoute('/docs')" :style="{ fontSize: '24px', color: '#08c' }" @click="onModalOpen"/>
      </a-col>
      <a-col :span="2">
        <ReloadOutlined v-if="isViewRoute('/games') " :style="{ fontSize: '24px', color: '#08c' }" @click="refreshScanGames" />
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { SearchOutlined, ReloadOutlined, FileAddOutlined } from '@ant-design/icons-vue'

import useGames from '@/hooks/db/useGames'
import useScanGamesDoc from '@/view/games/useScanGamesDoc'

import { useDocFormStoreWhitOut } from '@/store/doc'
const { searchText } = inject<any>('search')
const docFrom = useDocFormStoreWhitOut()
const { gameList } = useGames()
const { refreshScanGames } = useScanGamesDoc(gameList)

type routePath = '/games' | '/backup' | '/docs' | '/config'
const route = useRoute()
const currentPath = computed(() => route.path)
const isViewRoute = (type: routePath) => currentPath.value === type
const onModalOpen = () => docFrom.onModalOpen()
</script>

<style type="text/scss" lang="scss">
.search-mod {
  width: 100%;
}

.search-input {
  color: var(--text-default) !important;
  background-color: var(--input-background) !important;
}
</style>
