<template>
  <div>
    <a-input v-model:value="searchText" :allowClear="true" placeholder="请输入搜索内容" />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
const { searchText } = inject<any>('search')

</script>
