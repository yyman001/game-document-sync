<template>
  <div class="backup">
    <FileExplorer>
      <div class="file-content">
        <!-- 一级文件夹 -->
        <template :key="item.basename" v-for="item in directoryItem">
          <FileItem
            v-show="!activeDirectoryName"
            :fileName="item.basename"
            :fileType="item.type"
            :fileSize="formatFileSize(folderSize(item.basename))"
            :item="item"
            :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
            :isSyncSuccess="false"
            :isCloudFile="!item.path"
            :disabled="true"
          />
        </template>

        <!-- 二级文件列表 -->
        <FileItem
          :key="item.basename"
          :fileType="item.type"
          :fileName="item.basename"
          :fileSize="formatFileSize(item.size)"
          :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
          :item="item"
          :isSyncSuccess="false"
          :isCloudFile="!item.path"
          :disabled="false"
          v-for="item in fileList"
        />
      </div>
    </FileExplorer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'

import useLocalBackupFile from '@/hooks/file/useLocalBackupFile'

import { formatTimestamp } from '@/utils/formatTimestamp'
import { formatFileSize } from '@/utils/formatFileSize'

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

    // 当前打开的文件夹
    const activeDirectoryName = ref<string>('')
    const handleSetDirectory = (directoryName = '') => {
      activeDirectoryName.value = directoryName
    }

    // 本地文件列表 + 云文件列表
    const getChildrenByLocalAndCloud = (gameDocDir: string) => {
      if (!gameDocDir) return []

      const localFile = getDirectoryChildren(gameDocDir)
      const cloudFile = []

      return localFile.concat(cloudFile)
    }

    const fileList = computed(() => {
      return getChildrenByLocalAndCloud(unref(activeDirectoryName))
    })

    // TODO
    const folderSize = (directoryName: string) => {
      return 0
    }

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
      formatFileSize
    }
  }
})
</script>

<style lang="sass" scoped>
</style>
