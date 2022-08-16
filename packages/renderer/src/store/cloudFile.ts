// 云操作文件
import { ref, unref, reactive, computed } from 'vue'
import WebDav from '@/utils/WebDav'
// import { AliOssSDK } from '../utils/ali-oss'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useCloudStoreWhitOut } from '@/store/cloud'
import { FileItem, SdkConfig, WebDavDirectory, WebDavFile } from '@/model'
// 云对象
export let cloudObject = {}

export const useCloudFileStore = defineStore('cloudFile', () => {
  const cloudStore = useCloudStoreWhitOut()

  const { loading: messageLoading, success: messageSuccess, error: messageError } = message
  const isColudLoading = ref(false)
  const coludItems = reactive({
    directoryItem: [] as WebDavDirectory[],
    fileItems: [] as WebDavFile[]
  })

  // 云文件夹名列表
  const cloudDirectorys = computed(() => {
    return coludItems.directoryItem.map(x => x.basename)
  })

  // 云文件名列表
  const cloudFilesName = computed(() => {
    return coludItems.fileItems.map(f => f.comparsedName)
  })

  // 云文件标致
  const cloudDownSymbol = computed(() => {
    return [...cloudFilesName.value, ...cloudDirectorys.value]
  })

  const switchCloudAccount = (targetCloudAccount: SdkConfig) => {
    console.log('targetCloudAccount', targetCloudAccount)

    switch (targetCloudAccount.type) {
      case 'jianguoyun':
        cloudObject = new WebDav(targetCloudAccount)
        break
      case 'ali-oss':
        // cloudObject = new AliOssSDK(targetCloudAccount)
        break
      default:
        throw new Error('未定义云类型!')
    }
    console.log('cloudObject:', cloudObject)

    pullCloudData()
  }

  const cloudUpSymbol = ref([])

  const getCloudSyncSymbol = (fileName: string) => {
    return unref(cloudDownSymbol).includes(fileName)
  }

  // 获取文件同步状态(必须云列表存在,并且本地文件存在)
  const getFileSyncStatus = (file: any) => {
    return unref(cloudFilesName).includes(file.comparsedName) && !!file.path
  }

  const pullCloudData = () => {
    if (cloudObject === null || isColudLoading.value) return
    isColudLoading.value = true
    messageLoading({ key: 'cloud-loading', content: '正在获取云文件...', duration: 0 })

    cloudObject.getDirectoryStructure()
      .then(({ directoryItems, fileItems }) => {
        coludItems.directoryItem = directoryItems
        coludItems.fileItems = fileItems.map((f: WebDavFile) => {
          return {
            ...f,
            // 转换云文件文件名为 本地格式, 方便对比数据
            // /games_doc_sync/torchlight 2/torchlight 2_t1628915843842.zip => /torchlight 2/torchlight 2_t1628915843842.zip
            // TODO: 重新定制规范, 目前阿里云的url 是以 / 开头, 后台再统一这个规范,暂时使用 .replace(/^\//, ''), 移除开头的 斜杆
            comparsedName: f.filename.replace('/games_doc_sync/', '').replace(/^\//, '')
          }
        })
        console.log('coludItems:', coludItems)
        console.log('cloudDownSymbol:', cloudDownSymbol)
        messageSuccess({ key: 'cloud-loading', content: '云列表读取成功!', duration: 2 })
      })
      .catch((e: Error) => {
        console.error(e)
        messageError({ key: 'cloud-loading', content: '云列表读取失败!', duration: 2 })
      })
      .finally(() => {
        isColudLoading.value = false
      })
  }

  const reLoadCloudData = () => {
    switchCloudAccount(cloudStore.targetCloudAccount)
  }

  const uploadFile = async (file: FileItem) => {
    const { basename, dirname, path } = file
    const isUpLoad = await cloudObject.uploadFile(path, dirname, basename)
    isUpLoad ? messageSuccess('上传成功!') : messageError('上传失败!')
    if (isUpLoad) {
      coludItems.fileItems.push(file)
    }
  }

  const downloadCloudFile = async (downloadUrl:string, filePath: string, cb: Function) => {
    const isDownload = await cloudObject.downloadFile(downloadUrl, filePath, cb)
    isDownload ? messageSuccess('下载成功!') : messageError('下载失败!')
  }

  return {
    switchCloudAccount,

    isColudLoading,
    cloudDownSymbol,
    cloudUpSymbol,
    getCloudSyncSymbol,
    getFileSyncStatus,

    coludItems,
    cloudDirectorys,

    cloudFilesName,

    uploadFile,
    downloadCloudFile,

    pullCloudData,
    reLoadCloudData
  }
})

export const useCloudFileStoreWhitOut = () => {
  return useCloudFileStore()
}
