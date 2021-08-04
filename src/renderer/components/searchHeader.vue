<template>
  <div class="search-header">
    <slot></slot>
    <!--  排序方式 -->
    <div class="sort-type">
      <p>游戏名</p>
      <div class="sort-select">
        <ul class="sort-ul">
          <li><p>游戏名</p></li>
          <li><p>更新时间</p></li>
          <li><p>已安装</p></li>
          <li><p>未安装</p></li>
        </ul>
      </div>
    </div>
    
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
export default {
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

  .sort-type {
    display: inline-flex;
    align-items: center;
    // flex: 1;
    
    position: relative;
    z-index: 1;

    padding: 0 15px;

    color: #ccc;
    background-color: #4c515a;
  }

  .el-input {
    flex: 1;
    box-shadow: inset 0px 0 10px 1px #000000;
  }

  .sort-select {
    display: none;
    position: absolute;
    top: 100%;

    width: 100%;
    
    background-color: #31353c;
    box-shadow: 0px 5px 10px -4px #000000;
    ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }
    li {
      padding: 5px;
      line-height: 24px;
      &:hover {
        color: #31353c;
        background-color: #ccc;
      }
    }

  }
}


</style>