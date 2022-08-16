import { computed, unref } from 'vue'
import useLocalBackupFile from '@/hooks/file/useLocalBackupFile'

import useFile from './useFile'
// import { storeToRefs } from 'pinia'
import { useCloudFileStoreWhitOut } from '@/store/cloudFile'

export default function () {
  const {
    directoryItem,
    fileItem,
    localDirectoryListName,
    localFileListName,
    getDirectoryChildren
  } = useLocalBackupFile()

  const { activeDirectoryName, handleSetDirectory, handleOpenFile, handleAction } = useFile()
  const cloudFileStore = useCloudFileStoreWhitOut()
  console.log('cloudFileStore:', cloudFileStore)
  // 未同步的云文件夹
  const cloudSynchronizationDirectory = computed(() => {
    return unref(cloudFileStore.coludItems.coludDirectoryItems)
      .filter(file => !localDirectoryListName.value.includes(file.basename))
      .map((f) => {
        // 使用 path 作为云下载标识
        return { ...f, timeStamp: f.lastmod, path: '' }
      })
  })

  // 云文件注入本地文件参数
  const cloudSynchronizationFile = computed(() => {
    // 过滤已经存在的云文件(已同步): 云文件 过滤 本地文件
    return cloudFileStore.coludItems.fileItems
      .filter(f => !localFileListName.value.includes(f.comparsedName))
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
    return directoryItem.value.filter(file => !cloudFileStore.cloudDirectorys.includes(file.basename))
  })

  const allDirectory = computed(() => {
    return [...directoryItem.value, ...cloudSynchronizationDirectory.value]
  })

  const getDirectoryChildrenByCloud = (gameDocDir: string) => {
    // ! 文件必须为 gameDocDir 目录下的文件
    return unref(cloudSynchronizationFile).filter(f => f.filename.indexOf(`${gameDocDir}/`) !== -1)
  }

  console.log('allDirectory', unref(allDirectory))
  console.log('本地目录', unref(localDirectoryListName))
  console.log('云目录', unref(cloudFileStore.cloudDirectorys))
  console.log('未同步的云目录', unref(cloudSynchronizationDirectory))
  console.log('未同步到本地目录', unref(localSyncDirectory))
  console.log('本地文件', unref(localFileListName))
  console.log('云文件', unref(cloudFileStore.cloudFilesName))

  // 本地文件列表 + 云文件列表
  const getChildrenByLocalAndCloud = (gameDocDir: string) => {
    if (!gameDocDir) return []

    const localFile = getDirectoryChildren(gameDocDir)
    const cloudFile = getDirectoryChildrenByCloud(gameDocDir)

    return localFile.concat(cloudFile)
  }

  // 全部文件列表
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

  // 内容大小
  const fileOrDirSize = (file: any) => {
    if (file.type === 'directory') {
      return folderSize(file.basename)
    }

    return file.size
  }

  // 文件夹同步态判断 => 文件夹只能判断是否同步完成, 无法判断是需要上传还是下载(因为可能会同时存在2种状态)
  // Bug: 有几率不成功更新
  const getFolderSyncStatus = (item: any) => {
    // 当前文件夹名称
    const gameDocDir = item.basename
    // 获取本地文件列表
    const localFileList = unref(localFileListName).filter(filename => filename.indexOf(`${gameDocDir}/`) !== -1)
    // 获取云文件列表
    const coludFileList = unref(cloudFileStore.cloudFilesName).filter(filename => filename.indexOf(`${gameDocDir}/`) !== -1)
    // 本地文件列表和云文件列表 一致时,代表已同步
    return localFileList.join() === coludFileList.join()
  }

  // 云同步状态判断
  const getSyncStatus = (item: any) => {
    if (item.type === 'file') return cloudFileStore.getFileSyncStatus(item)

    return getFolderSyncStatus(item)
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

    fileOrDirSize,

    handleOpenFile,
    handleAction,

    getSyncStatus
  }
}
