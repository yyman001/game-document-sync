
<template>
  <div class="backup">
    <a-page-header
        v-show="activeDirectoryName"
        :title="activeDirectoryName"
        @back="handleSetDirectory()"
      />
    <FileExplorer >

      <div class="file-content">
        <!-- 一级文件夹 -->
        <template v-for="item in directoryItem">
          <FileItem
          v-show="!activeDirectoryName"
          :key="item.basename"
          :fileName="item.basename"
          :fileType="item.type"
          :fileSize="formatFileSize(folderSize(item.basename))"
          :item="item" 
          :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
          @handleClick="onClick"
          @handleAction="handleAction"
          />
        </template>

        <!-- 二级文件列表 -->
        <FileItem :key="item.basename"
        :fileType="item.type"
        :fileName="item.basename"
        :fileSize="formatFileSize(item.size)"
        :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
        :item="item" 
        v-for="item in fileList"
        @handleClick="onClick"
        @handleAction="handleAction"
        />
      </div>

    </FileExplorer>  

  </div>
</template>

<script>
import { ref, toRefs, computed } from '@vue/composition-api'
import useBackup from '../../comApi/useBackup'
import useMessage from '../../comApi/useMessage'
import { Loading } from 'element-ui'
import useBackupFile from '../../comApi/useBackupFile'
import useConfig from '../../comApi/useConfig'
import useLocalBackupFile from '../../comApi/useLocalBackupFile'
import FileExplorer from '../FileExplorer'
import FileItem from '../FileExplorer/FileItem.vue'
import useUtils from '../../comApi/useUtils'
import { openItem, showItemInFolder } from '../../utils/shell'
const { remove } = require('../../../utils/FileClass').default
const path = require('path')

export default {
  name: 'back-mod',
  components: { FileExplorer, FileItem },
  props: {
    searchText: String
  },
  computed: {
    list () {
      if (!Array.isArray(this.result)) return

      return this.result.filter((game) => {
        const regExp = new RegExp(this.searchText, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    }
  },

  setup (props) {
    // eslint-disable-next-line no-unused-vars
    const { searchText } = toRefs(props)
    const { result, delBackup } = useBackup()
    const { message } = useMessage()
    const { restoreFile } = useBackupFile()
    const { homedir } = useConfig()
    const { formatTimestamp, formatFileSize } = useUtils()
    const { directoryItem, getDirectoryChildren } = useLocalBackupFile()

    let activeDirectoryName = ref('')
    const fileList = computed(() => {
      return getDirectoryChildren(activeDirectoryName.value)
    })
    const folderSize = (directoryName) => {
      return getDirectoryChildren(directoryName).reduceRight(
        (accumulator, currentFile) => {
          return accumulator + currentFile.size
        }, 0
      )
    }

    const handleSetDirectory = (directoryName = '') => {
      activeDirectoryName.value = directoryName
    }

    const onClick = (file) => {
      console.log('file', file)
      //
      if (file.fileType === 'directory') {
        handleSetDirectory(file.basename)
      } else {
        // open file
        openItem(file.path)
      }
    }

    const onDelBackFile = async (record) => {
      // 删除本地文件
      await remove(record.filePath)
      const isNull = await delBackup(record.id)
      const text = isNull === null ? '删除备份文件失败!' : '删除成功!'
      message(isNull !== null, text)
      // TODO: 同时删除云文件
    }

    const handleRestore = async (item) => {
      const {
        filePath,
        gameDocDir,
        gameDocPath
      } = item
      let loadingInstance1 = Loading.service({ fullscreen: true })

      // 解压会多一层文件夹, 需要指定到备份存档 上一级(父目录)
      const docPath = path.join(homedir.value, gameDocPath.replace(gameDocDir, ''))
      const [error, text] = await restoreFile(filePath, docPath)
      message(!error, text)

      setTimeout(() => {
        loadingInstance1.close()
      }, 350)
    }

    const handleAction = async (file) => {
      console.log(file)
      switch (file.eventType) {
        case 'rollback':
          // TODO: 还原备份
          break
        case 'delete':
          // TODO: 删除文件
          break
        case 'folder-open':
          // 打开所在文件夹
          showItemInFolder(file.path)
          break
        default:
          break
      }
    }

    return {
      delBackup,
      result,
      onDelBackFile,
      handleRestore,
      directoryItem,
      onClick,
      fileList,
      formatTimestamp,
      activeDirectoryName,
      handleSetDirectory,
      formatFileSize,
      folderSize,

      handleAction
    }
  }
}
</script>

<style>

</style>