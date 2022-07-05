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
            :isSyncSuccess="false"
            :isCloudFile="!item.path"
            :disabled="true"
            @handleOpenFile="handleOpenFile"
            @handleAction="handleAction"
          />

      </div>
    </FileExplorer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue'
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'

import useLocalBackupFile from '@/hooks/file/useLocalBackupFile'

import { formatTimestamp } from '@/utils/formatTimestamp'
import { formatFileSize } from '@/utils/formatFileSize'

import useFile from './useFile'

export default defineComponent({
  components: { FileExplorer, FileItem },
  props: {
    searchText: String
  },
  setup (props) {
    const {
      directoryItem,
      fileItem,
      localDirectoryListName,
      localFileListName,
      getDirectoryChildren
    } = useLocalBackupFile()

    const { activeDirectoryName, handleSetDirectory, handleOpenFile, handleAction } = useFile()

    // 本地文件列表 + 云文件列表
    const getChildrenByLocalAndCloud = (gameDocDir: string) => {
      if (!gameDocDir) return []

      const localFile = getDirectoryChildren(gameDocDir)
      const cloudFile = []

      return localFile.concat(cloudFile)
    }

    const fileList = computed(() => {
      // 未选择文件夹, 返回文件夹列表
      if (!unref(activeDirectoryName)) return unref(directoryItem)

      // 返回文件夹文件列表
      return getChildrenByLocalAndCloud(unref(activeDirectoryName))
    })

    // TODO
    const folderSize = (directoryName: string) => {
      return getChildrenByLocalAndCloud(directoryName).reduceRight(
        (accumulator: number, currentFile: any) => {
          return accumulator + currentFile.size
        }, 0
      )
    }

    const fileOrDirSize = (file: any) => {
      if (file.type === 'directory') {
        return folderSize(file.basename)
      }

      return file.size
    }

    console.log('fileList:', fileList)

    return {
      activeDirectoryName,
      handleSetDirectory,

      directoryItem,
      fileItem,
      localDirectoryListName,
      localFileListName,
      getDirectoryChildren,

      fileList,
      folderSize,

      formatTimestamp,
      formatFileSize,
      fileOrDirSize,

      handleOpenFile,
      handleAction
    }
  }
})
</script>

<style lang="sass" scoped></style>
