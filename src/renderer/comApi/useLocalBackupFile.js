import { ref, onMounted } from '@vue/composition-api'
import { getDirectoryItem } from '../../utils/index'
import useCofig from '../comApi/useConfig'
const path = require('path')

export default function () {
  const { rootDir } = useCofig()
  let directoryItem = ref([])
  let fileItem = ref([])

  const loadLocalFileDirectoryItem = async () => {
    try {
      // TODO: 获取配置的 备份文件夹
      const filePath = path.join(rootDir.value, 'backup')
      const list = await getDirectoryItem(filePath)
      directoryItem.value = list.filter(f => f.type === 'directory')
      fileItem.value = list.filter(f => f.type === 'file')
    } catch (error) {
      console.error(error)
    }
  }

  const getDirectoryChildren = (dirname) => {
    return fileItem.value.filter(f => f.dirname === dirname)
  }

  onMounted(() => {
    loadLocalFileDirectoryItem()
  })

  return {
    directoryItem,
    fileItem,
    loadLocalFileDirectoryItem,
    getDirectoryChildren
  }
}
