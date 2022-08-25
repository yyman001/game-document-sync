import { ref, computed, onMounted, unref } from 'vue'
import { getDirectoryItem } from '@/utils/tools'
import path from 'path'
import { getBackupPath } from '@/utils'

export default function () {
  const rootDir = ''
  const directoryItem = ref([])
  const fileItem = ref([])

  const localDirectoryListName = computed(() => {
    return unref(directoryItem).map(f => f.basename)
  })

  // 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  const localFileListName = computed(() => {
    return unref(fileItem).map(f => f.comparsedName)
  })

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = getBackupPath()
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

  const getDirectoryChildren = (dirname: string) => {
    return unref(fileItem).filter(f => f.dirname === dirname)
  }

  const downloadFile = async (file: any, dirname: string) => {

  }

  onMounted(() => {
    // TODO: 主线程不支持直接调用node模块
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
