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
        <AddDoc />
      </a-col>
      <a-col :span="2">
        <ReloadOutlined :style="{ fontSize: '24px', color: '#08c' }" @click="refreshScanGames" />
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import useGames from '@/hooks/db/useGames'
import useScanGamesDoc from '@/view/games/useScanGamesDoc'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { inject } from 'vue'
import AddDoc from '@/view/header/addDoc.vue'

const { searchText } = inject<any>('search')

const { gameList } = useGames()
const { refreshScanGames } = useScanGamesDoc(gameList)
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
