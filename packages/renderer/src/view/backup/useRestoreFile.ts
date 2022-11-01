import { ref, unref, watch } from 'vue'
import useDocs from '@/hooks/db/useDocs'
import { storeToRefs } from 'pinia'
import useSystem from '@/hooks/core/useSystem'
import { modal, RestoreModal } from '@/hooks/useModal'
import { copy, remove } from '@/utils/FileClass'
import { unCompress } from '@/utils/compressClass'
import { getPath, getTempPath, injectStrict } from '@/utils'
import { useConfigStoreWhitOut } from '@/store/config'

export default function () {
  const { getGameDoc } = useDocs()
  const { HOME_DIR } = useSystem()
  const useConfigStore = useConfigStoreWhitOut()
  const { tempPath } = storeToRefs(useConfigStore)

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
    if (!gameDoc) {
      console.log('未找到game doc 对象！')
      return
    }

    const _docPath = getPath(gameDoc.pathType === 'PUBLIC' ? 'C:\\Users\\Public' : HOME_DIR, gameDoc.gameDocPath)
    // 解压临时路径
    const unCompressTempPath = unref(tempPath)
    docTempPath.value = getPath(unCompressTempPath, gameDoc.gameDocDir)

    setFilePath(file.path)
    setDocPath(_docPath)

    try {
      await unCompress(unref(filePath), unCompressTempPath)
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
