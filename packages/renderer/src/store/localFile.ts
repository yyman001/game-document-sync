import { getDirectoryItem, getDirItems, getFileItems } from '@/utils/tools'
import { defineStore } from 'pinia'
import { computed, ref, unref } from 'vue'
import { FileItem } from '@/model'
import { getBackupPath } from '@/utils'

export const useLocalFileStore = defineStore('localFile', () => {
  const directoryItem = ref<FileItem[]>([])
  const fileItems = ref<FileItem[]>([])

  // 文件夹名称列表
  const localDirectoryListName = computed(() => {
    return unref(directoryItem).map(f => f.basename)
  })

  // 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  const localFileListName = computed(() => {
    return unref(fileItems).map(f => f.comparsedName)
  })

  // 获取文件夹的备份列表
  const getDirectoryChildren = (dirname: string) => {
    return unref(fileItems).filter(f => f.dirname === dirname).sort((a, b) => b.timeStamp - a.timeStamp)
  }

  // 还原文件需要获取最后更新的一个文件
  const getLastFile = (dirname: string) => {
    const list = getDirectoryChildren(dirname)
    if (list.length) {
      return list[0]
    }

    return null
  }

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = getBackupPath()
      const list: FileItem[] = await getDirectoryItem(filePath) as FileItem[]
      directoryItem.value = getDirItems(list)
      // 移除第一个备份目录
      directoryItem.value.shift()
      fileItems.value = getFileItems(list)
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

  const removeFile = (comparsedName:string) => {
    fileItems.value = unref(fileItems).filter((f:any) => f.comparsedName !== comparsedName)
  }

  return {
    fileItems,
    directoryItem,

    localFileListName,
    localDirectoryListName,

    loadLocalFileDirectoryItem,
    getDirectoryChildren,

    removeFile,
    getLastFile
  }
})

export const useLocalFileStoreWhitOut = () => {
  return useLocalFileStore()
}
