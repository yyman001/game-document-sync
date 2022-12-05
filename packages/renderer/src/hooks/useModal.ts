import { TreeItem } from '@/utils/getTreeItem'
import { ref } from 'vue'

export default function useModal () {
  const isVisible = ref(false)

  const onModalOpen = () => {
    isVisible.value = true
  }

  const onModalClose = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    onModalOpen,
    onModalClose
  }
}

export interface Modal {
  isVisible?: boolean
  onModalOpen: Function
  onModalClose: Function
}

export const modal = Symbol('')

export interface BackModal extends Modal {
  loading?: boolean
  selectedKeys: string[]
  treeData: TreeItem[],
  nodeSize: number,
  docPath: string
  backPath: string
}

export interface RestoreModal extends Modal {
  loading?: boolean
  selectedKeys: string[]
  treeData: TreeItem[]
  docPath: string
  filePath: string
  setDocPath: Function
  setFilePath: Function
  onCreateNode: Function
  isSubmit: boolean
  onSbumit: Function
}
