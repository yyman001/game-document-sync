<template>
  <div class="file-explorer">
    <div class="file-explorer__header">
      <a-row type="flex">
        <a-col flex="0 50px"><slot name="checkbox"/></a-col>
        <a-col flex="auto">文件名</a-col>
        <a-col flex="0 80px" style="text-align: center;">状态</a-col>
        <a-col flex="0 100px">大小</a-col>
        <a-col flex="0 100px">类型</a-col>
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
@import "@/sass/_var.scss";

.file-explorer {
  &__header {
    position: relative;
    margin-bottom: 10px;
    padding: 10px 0;

    width: 100%;
    height: 100%;

    background: $color-master;
    box-shadow: 0px 0px 5px 1px rgb(158 158 158 / 20%);
  }
  &__body {
    position: relative;
    display: block;

    width: 100%;
    height: 100%;
    background: $color-master;
  }
}

.file {
  &__row {
    position: relative;
    line-height: 48px;
    border-bottom: 1px solid #f7f7f7;
    text-align: left;
    &:hover {
      background-color: $color-side;
      .file__action {
        display: block;
      }
    }
    .action-col {
      position: relative;
    }
    &.is-cloud-file {
      filter: grayscale(100%);
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

  &__cloud-status {
  height: 100%;

  &--up {
    cursor: pointer;
    background-image: url('./assets/cloud-up.png');
  }
  &--down {
    cursor: pointer;
    background-image: url('./assets/cloud-down.png');
  }
  &--sync {
    background-image: url('./assets/cloud-sync.png');
  }
  &--success {
    background-image: url('./assets/cloud-success.png');
  }
  &--fail {
    background-image: url('./assets/cloud-fail.png');
  }
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 35%;
}
  // 操作
  &__action {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 15px;

    width: auto;
  }
}
</style>
