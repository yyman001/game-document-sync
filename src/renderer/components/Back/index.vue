
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
          :isSyncSuccess="getFolderSyncStatus(item)"
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
        :isSyncSuccess="getFileSyncStatus(item)"
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
    const { getGameDoc, findGameDocs } = useDocs()
    const { directoryItem, fileItem, localDirectoryListName, localFileListName, getDirectoryChildren, downloadFile } = useLocalBackupFile()
    const { cloudDirectorys, directoryItems, cloudFilesName, coludItems, getFileSyncStatus, uploadFile } = useCloud()

    // 未同步的云文件夹
    const cloudSynchronizationDirectory = computed(() => {
      return directoryItems.value.filter(file => !localDirectoryListName.value.includes(file.basename)).map((f) => {
        // TODO: 使用 path 作为云下载标识?
        return {...f, timeStamp: f.lastmod, path: ''}
      })
    })

    // 云文件注入本地文件参数
    const cloudSynchronizationFile = computed(() => {
      // 过滤已经存在的云文件(已同步): 云文件 过滤 本地文件
      return coludItems.fileItems.filter(f => !localFileListName.value.includes(f.comparsedName))
        .map((f) => {
          return {
            ...f,
            timeStamp: f.lastmod,
            path: ''
          }
        })
    })

    // 未同步到云盘的本地文件
    const localSyncDirectory = computed(() => {
      return directoryItem.value.filter(file => !cloudDirectorys.value.includes(file.basename))
    })

    const allDirectory = computed(() => {
      return [...directoryItem.value, ...cloudSynchronizationDirectory.value]
    })

    console.log('allDirectory', allDirectory)
    console.log('本地目录', localDirectoryListName)
    console.log('云目录', cloudDirectorys)
    console.log('未同步的云目录', cloudSynchronizationDirectory)
    console.log('未同步到本地目录', localSyncDirectory)
    console.log('本地文件', localFileListName)
    console.log('云文件', cloudFilesName)

    let activeDirectoryName = ref('')

    const getDirectoryChildrenByCloud = (gameDocDir) => {
      // ! 文件必须为 gameDocDir 目录下的文件
      return cloudSynchronizationFile.value.filter(f => f.filename.indexOf(`${gameDocDir}/`) !== -1)
    }

    // eslint-disable-next-line no-unused-vars
    const getDirectoryChildrenByDB = (gameDocDir) => {
      if (!gameDocDir) return []
      if (!Array.isArray(result.value)) return []

      const cloudFile = getDirectoryChildrenByCloud(gameDocDir)

      return result.value.filter((game) => {
        return gameDocDir === game.gameDocDir
      })
        .concat(cloudFile)
    }

    // 本地文件列表 + 云文件列表
    const getChildrenByLocalAndCloud = (gameDocDir) => {
      if (!gameDocDir) return []

      const localFile = getDirectoryChildren(gameDocDir)
      const cloudFile = getDirectoryChildrenByCloud(gameDocDir)

      return localFile.concat(cloudFile)
    }

    const fileList = computed(() => {
      return getChildrenByLocalAndCloud(activeDirectoryName.value)
      // 读数数据库数据
      // return getDirectoryChildrenByDB(activeDirectoryName.value)
    })

    // 计算文件夹大小
    const folderSize = (directoryName) => {
      // return getDirectoryChildrenByDB(directoryName).reduceRight(
      return getChildrenByLocalAndCloud(directoryName).reduceRight(
        (accumulator, currentFile) => {
          return accumulator + currentFile.size
        }, 0
      )
    }

    // 文件夹同步态判断 => 文件夹只能判断是否同步完成, 无法判断是需要上传还是下载(因为可能会同时存在2种状态)
    // Bug: 有几率不成功更新
    const getFolderSyncStatus = (item) => {
      // 当前文件夹名称
      const gameDocDir = item.basename
      // 获取本地文件列表
      const localFileList = localFileListName.value.filter(filename => filename.indexOf(`${gameDocDir}/`) !== -1)
      // 获取云文件列表
      const coludFileList = cloudFilesName.value.filter(filename => filename.indexOf(`${gameDocDir}/`) !== -1)
      // 本地文件列表和云文件列表 一致时,代表已同步
      return localFileList.join() === coludFileList.join()
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
        dirname
      } = item
      let loadingInstance1 = Loading.service({ fullscreen: true })
      const { gameDocDir, gameDocPath } = await getGameDoc(dirname)
      if (!gameDocDir) return message(false, '未找到游戏信息!')

      // 解压会多一层文件夹, 需要指定到备份存档 上一级(父目录)
      const docPath = path.join(homedir.value, gameDocPath.replace(gameDocDir, ''))
      console.log('docPath', docPath)

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
          downloadFile(file, activeDirectoryName.value)
          break
        case 'cloud-up':
          // 云上传
          uploadFile(file)
          break
        default:
          break
      }
    }

    // 根据本地文件信息生成数据库数据
    // eslint-disable-next-line no-unused-vars
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

    // watch(directoryItem, initLocalFileData)

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

      allDirectory,
      getFileSyncStatus,
      getFolderSyncStatus
    }
  }
}
</script>

<style>

</style>