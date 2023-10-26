import { computed, inject, reactive, ref, unref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCloudFileStoreWhitOut } from '@/store/cloudFile'
import { useLocalFileStoreWhitOut } from '@/store/localFile'
import { useConfigStoreWhitOut } from '@/store/config'
import useFile from './useFile'
import useDocs from '@/hooks/db/useDocs'
import { getGamesDocList } from '@/utils/firebase/sdk'

export default function () {
  const Docs = useDocs()
  const { searchText } = inject<any>('search')
  const useConfigStore = useConfigStoreWhitOut()
  const localFileStore = useLocalFileStoreWhitOut()
  const cloudFileStore = useCloudFileStoreWhitOut()
  const { localFileListName, localDirectoryListName } = storeToRefs(localFileStore)
  const { activeDirectoryName, handleSetDirectory, handleOpenFile, handleAction } = useFile()

  // 未同步的云文件夹
  const cloudSynchronizationDirectory = computed(() => {
    return unref(cloudFileStore.coludItems.directoryItem)
      .filter(file => !unref(localDirectoryListName).includes(file.basename))
      .map(f => {
        // 使用 path 作为云下载标识
        return { ...f, timeStamp: f.lastmod, path: '' }
      })
  })

  // 云文件注入本地文件参数
  const cloudSynchronizationFile = computed(() => {
    // 过滤已经存在的云文件(已同步): 云文件 过滤 本地文件
    return cloudFileStore.coludItems.fileItems
      .filter(f => !unref(localFileListName).includes(f.comparsedName))
      .map(f => {
        return {
          ...f,
          timeStamp: f.lastmod,
          path: ''
        }
      })
  })

  // 未同步到云盘的本地文件
  const localSyncDirectory = computed(() => {
    return unref(localFileStore.directoryItem).filter(
      file => !cloudFileStore.cloudDirectorys.includes(file.basename)
    )
  })

  // 本地文件夹&云文件夹
  const allDirectory = computed(() => {
    return [...unref(localFileStore.directoryItem), ...unref(cloudSynchronizationDirectory)]
  })

  const getDirectoryChildrenByCloud = (gameDocDir: string) => {
    // ! 文件必须为 gameDocDir 目录下的文件
    return unref(cloudSynchronizationFile).filter(f => f.filename.indexOf(`${gameDocDir}/`) !== -1)
  }

  console.log('allDirectory', unref(allDirectory))
  console.log('本地目录', unref(localFileStore.localDirectoryListName))
  console.log('云目录', unref(cloudFileStore.cloudDirectorys))
  console.log('未同步的云目录', unref(cloudSynchronizationDirectory))
  console.log('未同步到本地目录', unref(localSyncDirectory))
  console.log('本地文件', unref(localFileStore.localFileListName))
  console.log('云文件', unref(cloudFileStore.cloudFilesName))

  // 本地文件列表 + 云文件列表
  const getChildrenByLocalAndCloud = (gameDocDir: string) => {
    if (!gameDocDir) return []

    const localFile = localFileStore.getDirectoryChildren(gameDocDir)
    const cloudFile = getDirectoryChildrenByCloud(gameDocDir)

    return [...localFile, ...cloudFile]
  }

  // 全部文件列表
  const fileList = computed(() => {
    // 未选择文件夹, 返回文件夹列表
    if (!unref(activeDirectoryName)) return unref(allDirectory)

    // 返回文件夹文件列表
    return getChildrenByLocalAndCloud(unref(activeDirectoryName))
  })

  const filterList = computed(() => {
    if (!Array.isArray(unref(fileList))) return []

    if (!unref(searchText)) return unref(fileList)

    return unref(fileList as any).filter((file: any) => {
      const regExp = new RegExp(unref(searchText) as string, 'i')
      return regExp.test(file.basename)
    })
  })

  // TODO
  const folderSize = (directoryName: string) => {
    return getChildrenByLocalAndCloud(directoryName).reduceRight(
      (accumulator: number, currentFile: any) => {
        return accumulator + currentFile.size
      },
      0
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
    const localFileList = unref(localFileListName).filter(
      filename => filename.indexOf(`${gameDocDir}/`) !== -1
    )
    // 获取云文件列表
    const coludFileList = unref(cloudFileStore.cloudFilesName).filter(
      filename => filename.indexOf(`${gameDocDir}/`) !== -1
    )
    // 本地文件列表和云文件列表 一致时,代表已同步
    return localFileList.join() === coludFileList.join()
  }

  // 云同步状态判断
  const getSyncStatus = (item: any) => {
    if (item.type === 'file') return cloudFileStore.getFileSyncStatus(item)

    return getFolderSyncStatus(item)
  }

  const downloadFile = async (file: any, dirname: string) => {
    // 组成: 配置的存档文件夹/游戏目录/游戏存档文件.后缀
    // eg: "/games_doc_sync/test/game.file.config.json"
    const downloadUrl = file.filename
    // TODO: 备份文件夹名称读配置
    const filePath = useConfigStore.getBackupPath(dirname, file.basename)
    // TODO: 下载方法迁移到 cloud 模块
    cloudFileStore.downloadCloudFile(downloadUrl, filePath, () => {
      file.path = filePath
      file.dirname = dirname
      localFileStore.fileItems.push(file)
    })
  }

  /*
    数据结构体:
    {gameDocDir: nickname}
  */
  const nickNameMap = reactive<{ [index: string]: string }>({})

  const getGamesNickName = async (dirsname: string[]) => {
    if (!dirsname.length) return

    const games = await getGamesDocList(dirsname)
    if (games.length) {
      games.forEach(item => {
        nickNameMap[item.gameDocDir] = item.nickName
      })
    }
  }

  const getGameNickName = (dirname: string) => {
    const game = nickNameMap[dirname]
    return game || 'not find game info'
  }

  // TODO: 云文件也要监控
  watch(
    () => unref(localFileStore.localDirectoryListName),
    dirsname => {
      getGamesNickName(dirsname)
      console.log('nickNameMap:', nickNameMap)
    },
    {
      immediate: true
    }
  )

  return {
    activeDirectoryName,
    handleSetDirectory,

    filterList,
    fileList,
    folderSize,

    fileOrDirSize,

    handleOpenFile,
    handleAction,

    getSyncStatus,
    downloadFile,

    getGameNickName
  }
}
