<template>
  <a-row type="flex" class="file__row" :class="{'is-cloud-file': isCloudFile }">
    <a-col flex="0 50px"><slot name="checkbox"></slot></a-col>
    <a-col flex="auto" class="action-col">
      <div class="file__icon" :class="fileIcon"></div>
      <div class="file__name" @click="handleClick">{{fileName}}</div>
      <div v-if="fileType === 'file' " class="file__action">
        <a-button-group>
          <a-button icon="rollback" @click="handleAction('rollback')"/>
          <a-popconfirm title="确定要删除吗？" @confirm="handleAction('delete')">
            <a-icon slot="icon" type="question-circle-o" style="color: red" />
            <a-button icon="delete"/>
          </a-popconfirm>
          <a-button icon="folder-open" @click="handleAction('folder-open')"/>
        </a-button-group>
      </div>
    </a-col>
    <a-col flex="0 50px">
      <a-tooltip placement="left">
        <template slot="title">
          <span>{{isCloudFile ? '下载' : '上传'}}</span>
        </template>
        <div class="file__cloud-status" :class="[
          isCloudFile ? 'file__cloud-status--down': 'file__cloud-status--up',
        ]" @click="handleAction(isCloudFile ? 'cloud-down' : 'cloud-up')"></div>
      </a-tooltip>

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
    },
    isCloudFile: Boolean
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
        ...this.item,
        fileType: this.item.type
      })
    },
    handleAction (eventType) {
      console.log('eventType', eventType)
      this.$emit('handleAction', {
        eventType,
        ...this.item
      })
    }
  }
}
</script>

<style lang="scss">

</style>