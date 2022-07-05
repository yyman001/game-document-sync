import { ref } from 'vue'
import { openItem, showItemInFolder } from '@/utils/shell'

export default function () {
  // 当前打开的文件夹
  const activeDirectoryName = ref<string>('')
  const handleSetDirectory = (directoryName = '') => {
    activeDirectoryName.value = directoryName
  }

  //  打开文件或文件夹
  const handleOpenFile = (file: any) => {
    console.log('file', file)
    //
    if (file.fileType === 'directory') {
      handleSetDirectory(file.basename)
    } else {
      // open file
      openItem(file.path)
    }
  }

  // 文件操作集合
  const handleAction = async (file: any) => {
    console.log(file)
    switch (file.eventType) {
      case 'rollback':
        // 还原备份
        break
      case 'delete':
        // 删除文件
        break
      case 'folder-open':
        // 打开所在文件夹
        showItemInFolder(file.path)
        break
      case 'cloud-down':
        // 云下载
        break
      case 'cloud-up':
        // 云上传
        break
      default:
        break
    }
  }

  return {
    activeDirectoryName,
    handleSetDirectory,

    handleOpenFile,
    handleAction
  }
}
