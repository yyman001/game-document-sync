import { computed, ref, unref } from 'vue'
import { createTree, TreeItem } from '@/utils/getTreeItem'
import { formatFileSize } from '@/utils/formatFileSize'

export default function () {
  const selectedKeys = ref<string[]>([])
  const treeData = ref<TreeItem[]>([])
  const allFile = ref<TreeItem[]>([])
  // 勾选文件的大小
  const nodeSize = computed(() => {
    const totalSize = unref(selectedKeys).reduce((total, currentPath) => {
      const currentNode = unref(allFile).find(x => x.path === currentPath)
      return total + (currentNode ? currentNode.size : 0)
    }, 0)

    return formatFileSize(totalSize)
  })

  async function createNode (docPatch: string, gameDocDir: string) {
    clearNode()
    const { tree, filesPath, fileDetailedList } = await createTree(docPatch, gameDocDir)
    selectedKeys.value = filesPath
    allFile.value = fileDetailedList
    updateNode(tree)
  }

  function updateNode (node: TreeItem) {
    treeData.value = [node]
  }

  function clearNode () {
    treeData.value = []
  }

  return {
    nodeSize,
    selectedKeys,
    treeData,

    createNode,
    updateNode
  }
}
