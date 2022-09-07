import { ref, unref, watch } from 'vue'
import useDocs from '@/hooks/db/useDocs'
import useSystem from '@/hooks/core/useSystem'
import { modal, RestoreModal } from '@/hooks/useModal'
import { copy, remove } from '@/utils/FileClass'
import { unCompress } from '@/utils/compressClass'
import { getPath, getTempPath, injectStrict } from '@/utils'

export default function () {
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

  const showRestoreFile = async (file:any) => {
    onModalOpen()
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

  return {
    showRestoreFile
  }
}
