
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
        <template v-for="item in allDirectory">
          <FileItem
          v-show="!activeDirectoryName"
          :key="item.basename"
          :fileName="item.basename"
          :fileType="item.type"
          :fileSize="formatFileSize(folderSize(item.basename))"
          :item="item" 
          :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
          :isCloudFile="!item.path"
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
        :isCloudFile="!item.path"
        v-for="item in fileList"
        @handleClick="onClick"
        @handleAction="handleAction"
        />
      </div>

    </FileExplorer>  

  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { ref, toRefs, computed, onMounted, watch } from '@vue/composition-api'
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
import useDocs from '../../comApi/useDocs'
import useCloud from '../../comApi/useCloud'

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
    const { result, delBackup, addBackupList } = useBackup()
    const { message } = useMessage()
    const { restoreFile } = useBackupFile()
    const { homedir } = useConfig()
    const { formatTimestamp, formatFileSize } = useUtils()
    const { findGameDocs } = useDocs()
    const { directoryItem, fileItem, localDirectoryListName, localFileListName } = useLocalBackupFile()
    const { cloudDirectorys, directoryItems, cloudFilesName, coludItems } = useCloud()

    // 未同步的云文件夹
    const cloudSynchronizationDirectory = computed(() => {
      return directoryItems.value.filter(file => !localDirectoryListName.value.includes(file.basename)).map((f) => {
        // TODO: 使用 path 作为云下载标识?
        return {...f, timeStamp: f.lastmod, path: ''}
      })
    })

    // 云文件注入本地文件参数
    const cloudSynchronizationFile = computed(() => {
      // 过滤已经存在的云文件(已同步)
      return coludItems.fileItems.filter(f => !localFileListName.value.includes(f.basename))
        .map((f) => {
          return {
            ...f,
            timeStamp: f.lastmod,
            path: ''
          }
        })
    })

    // 未同步到云盘的本地文件
    const localSyncFile = computed(() => {
      return directoryItem.value.filter(file => !cloudDirectorys.value.includes(file.basename))
    })

    const allDirectory = computed(() => {
      return [...directoryItem.value, ...cloudSynchronizationDirectory.value]
    })

    console.log('allDirectory', allDirectory)
    console.log('本地目录', localDirectoryListName)
    console.log('云目录', cloudDirectorys)
    console.log('未同步的云目录', cloudSynchronizationDirectory)
    console.log('未同步到本地目录', localSyncFile)
    console.log('本地文件', localFileListName)
    console.log('云文件', cloudFilesName)

    let activeDirectoryName = ref('')

    const getDirectoryChildrenByCloud = (gameDocDir) => {
      // ! 文件必须为 gameDocDir 目录下的文件
      return cloudSynchronizationFile.value.filter(f => f.filename.indexOf(`${gameDocDir}/`) !== -1)
    }

    const getDirectoryChildrenByDB = (gameDocDir) => {
      if (!gameDocDir) return []
      if (!Array.isArray(result.value)) return []

      const cloudFile = getDirectoryChildrenByCloud(gameDocDir)

      return result.value.filter((game) => {
        return gameDocDir === game.gameDocDir
      })
        .concat(cloudFile)
    }

    const fileList = computed(() => {
      return getDirectoryChildrenByDB(activeDirectoryName.value)
    })

    const folderSize = (directoryName) => {
      return getDirectoryChildrenByDB(directoryName).reduceRight(
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

    const onDelBackFile = async (fileItem) => {
      // 删除本地文件
      await remove(fileItem.path)
      const isNull = await delBackup(fileItem.fileName)
      const text = isNull === null ? '删除备份文件失败!' : '删除成功!'
      message(isNull !== null, text)
      // TODO: 同时删除云文件
    }

    const handleRestore = async (item) => {
      const {
        path: filePath,
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
          // 还原备份
          handleRestore(file)
          break
        case 'delete':
          // 删除文件
          onDelBackFile(file)
          break
        case 'folder-open':
          // 打开所在文件夹
          showItemInFolder(file.path)
          break
        case 'cloud-down':
          // 云下载
          break
        case 'cloud-up':
          // 云上传
          break
        default:
          break
      }
    }

    // 根据本地文件信息生成数据库数据
    const initLocalFileData = async () => {
      const dirname = directoryItem.value.map(f => f.basename)
      const docsList = await findGameDocs(dirname)

      const fileItemList = fileItem.value.map(f => {
        const doc = docsList.find(doc => doc.gameDocDir === f.dirname)
        const pathFormat = path.parse(f.path)
        if (!doc) {
          console.error(f.basename, '未找到doc信息!')
        }
        return {
          ...f,
          ...doc,
          fileName: f.basename.replace(pathFormat.ext, ''),
          ext: pathFormat.ext
        }
      })
      await addBackupList(fileItemList)
    }

    watch(directoryItem, initLocalFileData)

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

      handleAction,

      allDirectory
    }
  }
}
</script>

<style>

</style>