<template>
  <div class="backup">
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
            :disabled="true"
            @handleOpenFile="handleOpenFile"
            @handleAction="handleAction"
          />

      </div>
    </FileExplorer>
  </div>
</template>

<script lang="ts" setup>
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { formatFileSize } from '@/utils/formatFileSize'

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

</script>

<style lang="sass" scoped></style>
