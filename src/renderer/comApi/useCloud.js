// 云操作文件
// eslint-disable-next-line no-unused-vars
import { ref, reactive, onMounted, computed } from '@vue/composition-api'
import { WebDAVClient } from '../components/Config/config'
import useMessage from './useMessage'

export default function () {
  const { message } = useMessage()
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

  const cloudUpSymbol = ref([])

  const getCloudSyncSymbol = (fileName) => {
    return cloudDownSymbol[fileName]
  }

  // 获取文件同步状态(必须云列表存在,并且本地文件存在)
  const getFileSyncStatus = (file) => {
    return cloudFilesName.value.includes(file.comparsedName) && !!file.path
  }

  const pullCloudData = () => {
    WebDAVClient.getDirectoryStructure()
      .then(({directoryItems, fileItems}) => {
        coludItems.directoryItems = directoryItems
        coludItems.fileItems = fileItems.map((f) => {
          return {
            ...f,
            // 转换云文件文件名为 本地格式, 方便对比数据
            // /games_doc_sync/torchlight 2/torchlight 2_t1628915843842.zip => /torchlight 2/torchlight 2_t1628915843842.zip
            comparsedName: f.filename.replace('/games_doc_sync/', '')
          }
        })
        console.log('coludItems:', coludItems)
        console.log('cloudDownSymbol:', cloudDownSymbol)
      })
      .catch((e) => e)
  }

  const uploadFile = async (file) => {
    const { basename, dirname, path } = file
    const isUpLoad = await WebDAVClient.uploadFile(path, dirname, basename)
    message(isUpLoad, isUpLoad ? '上传成功!' : '上传失败!')
    if (isUpLoad) {
      coludItems.fileItems.push(file)
    }
  }

  onMounted(() => {
    pullCloudData()
  })

  return {
    cloudDownSymbol,
    cloudUpSymbol,
    getCloudSyncSymbol,
    getFileSyncStatus,

    coludItems,
    cloudDirectorys,

    cloudFilesName,
    directoryItems,

    uploadFile
  }
}
