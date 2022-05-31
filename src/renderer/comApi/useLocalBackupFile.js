import { ref, computed, onMounted } from '@vue/composition-api'
import { getDirectoryItem } from '../../utils/index'
import useCofig from '../comApi/useConfig'
import useCloud from './useCloud'
const path = require('path')

export default function () {
  const { rootDir } = useCofig()
  const { downloadCloudFile } = useCloud()
  const directoryItem = ref([])
  const fileItem = ref([])

  const localDirectoryListName = computed(() => {
    return directoryItem.value.map(f => f.basename)
  })

  // 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  const localFileListName = computed(() => {
    return fileItem.value.map(f => f.comparsedName)
  })

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = path.join(rootDir.value, 'backup')
      const list = await getDirectoryItem(filePath)
      directoryItem.value = list.filter(f => f.type === 'directory')
      // 移除第一个备份目录
      directoryItem.value.shift()
      fileItem.value = list.filter(f => f.type === 'file').map((f) => {
        return {
          ...f,
          // 用于比较同步文名标识
          comparsedName: `${f.dirname}/${f.basename}`
        }
      })
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
    // TODO: 下载方法迁移到 cloud 模块
    downloadCloudFile(downloadUrl, filePath, () => {
      file.path = filePath
      file.dirname = dirname
      fileItem.value.push(file)
    })
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
