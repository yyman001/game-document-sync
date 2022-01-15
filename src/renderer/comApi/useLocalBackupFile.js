import { ref, computed, onMounted } from '@vue/composition-api'
import { getDirectoryItem } from '../../utils/index'
import useCofig from '../comApi/useConfig'
import useMessage from './useMessage'
import { WebDAVClient } from '../components/Config/config'
const path = require('path')

export default function () {
  const { rootDir } = useCofig()
  const { message } = useMessage()
  const directoryItem = ref([])
  const fileItem = ref([])

  const localDirectoryListName = computed(() => {
    return directoryItem.value.map(f => f.basename)
  })

  const localFileListName = computed(() => {
    return fileItem.value.map(f => f.basename)
  })

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = path.join(rootDir.value, 'backup')
      const list = await getDirectoryItem(filePath)
      directoryItem.value = list.filter(f => f.type === 'directory')
      // 移除第一个备份目录
      directoryItem.value.shift()
      fileItem.value = list.filter(f => f.type === 'file')
    } catch (error) {
      console.error(error)
    }
  }

  const getDirectoryChildren = (dirname) => {
    return fileItem.value.filter(f => f.dirname === dirname)
  }

  const downloadFile = async (file, dirname) => {
    // 组成: 配置的存档文件夹/游戏目录/游戏存档文件.后缀
    // eg: "/games_doc_sync/test/game.file.config.json"
    const downloadUrl = file.filename
    // TODO: 备份文件夹名称读配置
    const filePath = path.join(rootDir.value, 'backup', dirname, file.basename)
    const isDownload = await WebDAVClient.downloadFile(downloadUrl, filePath)
    message(isDownload, isDownload ? '下载成功!' : '下载失败!')
    if (isDownload) {
      file.path = filePath
      file.dirname = dirname
      fileItem.value.push(file)
    }
  }

  onMounted(() => {
    loadLocalFileDirectoryItem()
  })

  return {
    fileItem,
    directoryItem,

    loadLocalFileDirectoryItem,
    getDirectoryChildren,

    localFileListName,
    localDirectoryListName,

    downloadFile
  }
}
