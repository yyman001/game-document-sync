<template>
  <div class="file-explorer">
    <div class="file-explorer__header">
      <a-row type="flex">
        <a-col flex="0 50px"><slot name="checkbox"/></a-col>
        <a-col flex="auto">文件名</a-col>
        <a-col flex="0 120px">大小</a-col>
        <a-col flex="0 120px">类型</a-col>
        <a-col flex="0 200px">修改时间</a-col>
      </a-row>
    </div>
    <div class="file-explorer__body">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.file-explorer {
  &__header {
    width: 100%;
    height: 100%;
    position: relative;
  }
  &__body {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    background: #fff;
  }
}


.file {
  &__row {
    position: relative;
    line-height: 48px;
    border-bottom: 1px solid #f7f7f7;
    text-align: left;
    &:hover {
      background-color: #efefef;
    }
  }

  &__icon {
    float: left;
    width: 50px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 65%;
    background-image: url(./assets/default.png);
    &--dir {
      background-image: url(./assets/file-dir.png);
    }
    &--zip {
      background-image: url(./assets/zip.png);
    }
  }
  &__name {
    display: inline-block;
    max-width: 100%;
    cursor: pointer;
    &:hover {
      color: #141416;
      text-decoration: underline;
    }
  }
  // 操作
  &__action {
    position: absolute;
  }
}
</style>
