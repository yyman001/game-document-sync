import useDocTree from '@/hooks/file/useDocTree'
import useModal from '@/hooks/useModal'
import { ref, unref, watch } from 'vue'

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

  watch(() => unref(isVisible), (value:boolean) => {
    if (!value) isSubmit.value = false
  })

  return {
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
