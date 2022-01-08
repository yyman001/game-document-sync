<template>
  <a-row type="flex" class="file__row">
    <a-col flex="0 50px"><slot name="checkbox"/></a-col>
    <a-col flex="auto">
      <div class="file__icon" :class="fileIcon"></div>
      <div class="file__name" @click="handleClick">{{fileName}}</div>
      <div class="file__action"></div>
    </a-col>
    <a-col flex="0 120px">{{fileSize}}</a-col>
    <a-col flex="0 120px">{{fileTypeName}}</a-col>
    <!--  2021-12-28 17:12  -->
    <a-col flex="0 200px">{{time}}</a-col>
  </a-row>
</template>

<script>
export default {
  name: 'file-item',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    fileType: String,
    fileName: String,
    fileSize: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileIcon () {
      switch (this.fileType) {
        case 'file':
          return 'file__icon--zip'
        case 'directory':
          return 'file__icon--dir'
        default:
          return ''
      }
    },
    fileTypeName () {
      switch (this.fileType) {
        case 'file':
          return '压缩包'
        case 'directory':
          return '文件夹'
        default:
          return '未知类型'
      }
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick', {
        basename: this.item.basename,
        dirname: this.item.dirname,
        fileType: this.item.type
      })
    }
  }
}
</script>

<style>
</style>