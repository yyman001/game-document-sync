import { ref } from 'vue'
import { remove } from '@/utils/FileClass'
import { openItem, showItemInFolder } from '@/utils/shell'
import { useLocalFileStoreWhitOut } from '@/store/localFile'

import useRestoreFile from './useRestoreFile'

export default function () {
  const localFileStore = useLocalFileStoreWhitOut()
  const { showRestoreFile } = useRestoreFile()

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
      // 还原备份
      case 'rollback':
        showRestoreFile(file)
        break
      // 删除文件
      case 'delete':
        try {
          await remove(file.path)
          localFileStore.removeFile(file.comparsedName)
        } catch (error) {}

        break
        // 打开所在文件夹
      case 'folder-open':
        showItemInFolder(file.path)
        break
        // 云下载
      case 'cloud-down':
        // downloadCloudFile(file)
        break
        // 云上传
      case 'cloud-up':
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
