import { getDirectoryItem, getDirItems, getFileItems } from '@/utils/tools'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import path from 'path'
import { FileItem } from '@/model'

export const useLocalFileStore = defineStore('localFile', () => {
  // TODO: 获取软件根目录
  const rootDir = ''

  const localFiles = reactive({
    directoryItem: [] as FileItem[],
    fileItems: [] as FileItem[]
  })

  // 文件夹名称列表
  const localDirectoryListName = computed(() => {
    return localFiles.directoryItem.map(f => f.basename)
  })

  // 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  const localFileListName = computed(() => {
    return localFiles.fileItems.map(f => f.comparsedName)
  })

  const getDirectoryChildren = (dirname: string) => {
    return localFiles.fileItems.filter(f => f.dirname === dirname)
  }

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = path.join(rootDir, 'backup')
      const list: FileItem[] = await getDirectoryItem(filePath) as FileItem[]
      localFiles.directoryItem = getDirItems(list)
      // 移除第一个备份目录
      localFiles.directoryItem.shift()
      localFiles.fileItems = getFileItems(list)
        .map((f: FileItem) => {
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

  return {
    loadLocalFileDirectoryItem,
    getDirectoryChildren,

    localFileListName,
    localDirectoryListName
  }
})

export const useLocalFileStoreWhitOut = () => {
  return useLocalFileStore()
}
