<template>
  <a-row type="flex" class="file__row" :class="{'is-cloud-file': isCloudFile }">
    <a-col flex="0 50px"><slot name="checkbox"></slot></a-col>
    <!-- 文件名 -->
    <a-col flex="auto" class="action-col">
      <div class="file__icon" :class="fileIcon"></div>
      <div class="file__name" @click="handleClick">{{fileName}}</div>
      <div v-if="fileType === 'file' " class="file__action">
        <a-button-group>
          <a-button icon="rollback" @click="handleAction('rollback')"/>
          <a-popconfirm title="确定要删除吗？" @confirm="handleAction('delete')">
            <a-button icon="delete"/>
          </a-popconfirm>
          <a-button icon="folder-open" @click="handleAction('folder-open')"/>
        </a-button-group>
      </div>
    </a-col>
    <!-- 状态 -->
    <a-col flex="0 80px" :class="{'is-disabled': disabled}">
      <a-tooltip placement="left" :title="cloudText">
        <div class="file__cloud-status" :class="cloudStatus" @click="handleAction(cloudType)"></div>
      </a-tooltip>

    </a-col>
    <!-- 大小 -->
    <a-col flex="0 100px">{{fileSize}}</a-col>
    <!-- 类型 -->
    <a-col flex="0 100px">{{fileTypeName}}</a-col>
    <!--  修改时间: 2021-12-28 17:12  -->
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
    // 是否未云文件
    isCloudFile: Boolean,
    // 是否已经同步(已存在云文件)
    isSyncSuccess: Boolean,
    // 正在同步
    isSyncing: Boolean,
    // 引用同步状态
    disabled: Boolean
  },
  computed: {
    isFolder () {
      return this.fileType === 'directory'
    },
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
    },
    cloudStatus () {
      // TODO: 断网状态, 初始化状态, 错误状态
      if (this.isSyncSuccess) return 'file__cloud-status--success'
      // TODO: 借用同步中状态, 后期同步中状态改为会动的
      if (this.isFolder) return 'file__cloud-status--sync'
      // if (this.isSyncing) return 'file__cloud-status--sync'
      return this.isCloudFile ? 'file__cloud-status--down' : 'file__cloud-status--up'
    },
    cloudText () {
      if (this.isSyncSuccess) return '已同步'
      if (this.isFolder) return '开始同步'
      // if (this.isSyncing) return '正在同步...'
      return this.isCloudFile ? '下载' : '上传'
    },
    cloudType () {
      if (this.isSyncSuccess) return 'cloud-success'
      if (this.isFolder) return 'cloud-sync'
      // if (this.isSyncing) return 'cloud-sync'
      return this.isCloudFile ? 'cloud-down' : 'cloud-up'
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
      if (this.disabled) return

      this.$emit('handleAction', {
        ...this.item,
        eventType
      })
    }
  }
}
</script>

<style lang="scss">
.is-disabled {
  opacity: .5;
  cursor: no-drop;
}
</style>
