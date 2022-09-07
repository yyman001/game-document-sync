import { ref, unref, watch, provide } from 'vue'
import useDocTree from '@/hooks/file/useDocTree'
import useModal, { modal } from '@/hooks/useModal'

export default function () {
  const { isVisible, onModalOpen, onModalClose } = useModal()
  const { selectedKeys, treeData, createNode } = useDocTree()

  const docPath = ref('')
  const filePath = ref('')
  const isSubmit = ref(false)

  const setDocPath = (path = '') => {
    docPath.value = path
  }

  const setFilePath = (path = '' as string) => {
    filePath.value = path
  }

  const onSbumit = () => {
    isSubmit.value = true
  }

  const onCreateNode = (docPatch: string, gameDocDir: string) => {
    createNode(docPatch, gameDocDir)
  }

  // 暴露属性&方法
  const restoreProvide = () => {
    provide(modal, {
      isVisible,
      onModalOpen,
      onModalClose,

      selectedKeys,
      treeData,
      onCreateNode,

      docPath,
      setDocPath,

      filePath,
      setFilePath,

      isSubmit,
      onSbumit
    })
  }

  watch(() => unref(isVisible), (value:boolean) => {
    if (!value) isSubmit.value = false
  })

  return {
    restoreProvide,

    isVisible,
    onModalOpen,
    onModalClose,

    selectedKeys,
    treeData,
    onCreateNode,

    docPath,
    setDocPath,

    filePath,
    setFilePath,

    isSubmit,
    onSbumit
  }
}
