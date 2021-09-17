<template>
  <div class="search-header">
    <slot></slot>
    <!--  排序方式 -->
    <Select title="名称" :width="120" v-bind="$attrs" v-on="$listeners"></Select>
    
    <el-input
      placeholder="搜索..."
      prefix-icon="el-icon-search"
      v-model.trim="searchKeyword"
      @input="handleSearchGames"
    >
    </el-input>
  </div>
</template>

<script>
import Select from './Select'
export default {
  components: {
    Select
  },
  data () {
    return {

      searchKeyword: ''
    }
  },
  methods: {
    handleSearchGames (keywords) {
      this.$emit('handleSearchGames', keywords)
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.search-header {
  box-sizing: border-box;
  display: flex;
  padding: 10px;
  height: 100%;

  .el-input {
    flex: 1;
    box-shadow: inset 0px 0 10px 1px #000000;
  }
}
</style>