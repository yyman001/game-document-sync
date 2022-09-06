import { ref } from 'vue'
import { remove } from '@/utils/FileClass'
import { openItem, showItemInFolder } from '@/utils/shell'
import { useLocalFileStoreWhitOut } from '@/store/localFile'

export default function () {
  const localFileStore = useLocalFileStoreWhitOut()

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
        try {
          await remove(file.path)
          localFileStore.removeFile(file.comparsedName)
        } catch (error) {

        }

        break
      case 'folder-open':
        // 打开所在文件夹
        showItemInFolder(file.path)
        break
      case 'cloud-down':
        // 云下载
        // downloadCloudFile(file)
        break
      case 'cloud-up':
        // 云上传
        // uploadFile(file)
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
