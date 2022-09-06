import { ref, unref, watch } from 'vue'
import { copy, remove } from '@/utils/FileClass'
import { openItem, showItemInFolder } from '@/utils/shell'
import { useLocalFileStoreWhitOut } from '@/store/localFile'
import { getPath, getTempPath, injectStrict } from '@/utils'
import useDocs from '@/hooks/db/useDocs'
import useSystem from '@/hooks/core/useSystem'
import { unCompress } from '@/utils/compressClass'
import { modal, RestoreModal } from '@/hooks/useModal'

export default function () {
  const localFileStore = useLocalFileStoreWhitOut()
  const { getGameDoc } = useDocs()
  const { HOME_DIR } = useSystem()

  const {
    onModalOpen,
    onModalClose,

    selectedKeys,
    onCreateNode,

    docPath,
    setDocPath,

    filePath,
    setFilePath,

    isSubmit
  } = injectStrict<RestoreModal>(modal)

  const docTempPath = ref('')
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

  const showRestoreFile = async (file:any) => {
    const gameDoc = await getGameDoc(file.dirname)
    const _docPath = getPath(gameDoc.pathType === 'PUBLIC' ? 'C:\\Users\\Public' : HOME_DIR, gameDoc.gameDocPath)
    const tempPath = getTempPath()
    docTempPath.value = getTempPath(gameDoc.gameDocDir)

    setFilePath(file.path)
    setDocPath(_docPath)

    console.log('gameDoc:', gameDoc)

    try {
      await unCompress(unref(filePath), tempPath)
      onCreateNode(unref(docTempPath), gameDoc.gameDocDir)
      console.log('selectedKeys', selectedKeys)
    } catch (e) {
      console.error(e)
    }
  }

  const copyFileAtDoc = async () => {
    try {
      await copy(unref(docTempPath), unref(docPath))
      await remove(unref(docTempPath))
      console.log('恢复成功!')
      onModalClose()
    } catch (e) {
      console.error(e)
    }
  }

  watch(() => unref(isSubmit), (value:boolean) => {
    if (value) {
      console.log('点击提交了')
      copyFileAtDoc()
    }
  })

  // 文件操作集合
  const handleAction = async (file: any) => {
    console.log(file)
    switch (file.eventType) {
      case 'rollback':
        // #还原备份
        // 1. 找到 doc 对象
        showRestoreFile(file)
        onModalOpen()
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
