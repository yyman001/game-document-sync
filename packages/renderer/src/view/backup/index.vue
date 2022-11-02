<template>
  <div class="backup">
    <template v-if="fileList.length">
      <a-page-header
      v-show="activeDirectoryName"
      :title="activeDirectoryName"
      @back="handleSetDirectory()"
    />
    <FileExplorer>
      <div class="file-content">
        <!-- 文件夹/文件 -->
          <FileItem
            v-for="item in fileList"
            :key="item.basename"
            :fileName="item.basename"
            :fileType="item.type"
            :fileSize="formatFileSize(fileOrDirSize(item))"
            :item="item"
            :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
            :isSyncSuccess="getSyncStatus(item)"
            :isCloudFile="!item.path"
            :disabled="false"
            @handleOpenFile="handleOpenFile"
            @handleAction="handleAction"
          />

      </div>
    </FileExplorer>
    </template>
    <template v-else>
      <Empty description="未找到相关备份文件" :image="simpleImage" />
    </template>

  </div>
</template>

<script lang="ts" setup>
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { formatFileSize } from '@/utils/formatFileSize'
import { Empty } from 'ant-design-vue'
import useCore from './useCore'

const {
  activeDirectoryName,
  handleSetDirectory,

  fileList,
  fileOrDirSize,

  handleOpenFile,
  handleAction,

  getSyncStatus
} = useCore()

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<style lang="sass" scoped></style>
