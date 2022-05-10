// 云操作文件
// eslint-disable-next-line no-unused-vars
import { ref, unref, reactive, onMounted, computed } from '@vue/composition-api'
import { WebDAVClient } from '../components/Config/config'
import { AliOssSDK } from '../utils/ali-oss'
import useMessage from './useMessage'
// 云对象
export let cloudObject = null

export default function () {
  const { message, messageLoading, messageSuccess, messageError } = useMessage()
  // 默认云类型为: 坚果云 jianguoyun, 备用为: 阿里云, ali-oss
  const cloudType = ref('')
  const isColudLoading = ref(false)
  const coludItems = reactive({
    directoryItems: [],
    fileItems: []
  })

  const directoryItems = computed(() => {
    return coludItems.directoryItems.filter(f => f.type === 'directory')
  })

  const cloudDirectorys = computed(() => {
    return directoryItems.value.map(x => x.basename)
  })

  const cloudFilesName = computed(() => {
    return coludItems.fileItems.map(f => f.comparsedName)
  })

  const cloudDownSymbol = computed(() => {
    return [...cloudFilesName, ...cloudDirectorys]
  })

  const onSwitchCloud = (type) => {
    cloudType.value = type
    switch (type) {
      case 'jianguoyun':
        cloudObject = WebDAVClient
        break
      case 'ali-oss':
        // TODO: 密钥从json配置读取
        cloudObject = new AliOssSDK({})
        break
      default:
        throw new Error('未定义云类型!')
    }

    pullCloudData()
  }

  const cloudUpSymbol = ref([])

  const getCloudSyncSymbol = (fileName) => {
    return cloudDownSymbol[fileName]
  }

  // 获取文件同步状态(必须云列表存在,并且本地文件存在)
  const getFileSyncStatus = (file) => {
    return cloudFilesName.value.includes(file.comparsedName) && !!file.path
  }

  const pullCloudData = () => {
    if (cloudObject === null || isColudLoading.value) return
    isColudLoading.value = true
    messageLoading({key: 'cloud-loading', content: '正在获取云文件...', duration: 0})

    cloudObject.getDirectoryStructure()
      .then(({directoryItems, fileItems}) => {
        coludItems.directoryItems = directoryItems
        coludItems.fileItems = fileItems.map((f) => {
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
        messageSuccess({key: 'cloud-loading', content: '云列表读取成功!', duration: 2})
      })
      .catch((e) => {
        console.error(e)
        messageError({key: 'cloud-loading', content: '云列表读取失败!', duration: 2})
      })
      .finally(() => {
        isColudLoading.value = false
      })
  }

  const uploadFile = async (file) => {
    const { basename, dirname, path } = file
    const isUpLoad = await cloudObject.uploadFile(path, dirname, basename)
    message(isUpLoad, isUpLoad ? '上传成功!' : '上传失败!')
    if (isUpLoad) {
      coludItems.fileItems.push(file)
    }
  }

  const downloadCloudFile = async (downloadUrl, filePath, cb) => {
    const isDownload = await cloudObject.downloadFile(downloadUrl, filePath, cb)
    message(isDownload, isDownload ? '下载成功!' : '下载失败!')
  }

  onMounted(() => {
    onSwitchCloud('ali-oss')
    pullCloudData()
  })

  return {
    cloudType,
    onSwitchCloud,

    isColudLoading,
    cloudDownSymbol,
    cloudUpSymbol,
    getCloudSyncSymbol,
    getFileSyncStatus,

    coludItems,
    cloudDirectorys,

    cloudFilesName,
    directoryItems,

    uploadFile,
    downloadCloudFile
  }
}
