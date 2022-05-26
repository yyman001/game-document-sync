import { ref, unref, computed } from '@vue/composition-api'
import { createTree } from '../utils/getTreeItem'
import useUtils from '../comApi/useUtils'

export default function () {
  const { formatFileSize } = useUtils()

  const expandedKeys = ref([])
  const selectedKeys = ref([])
  const treeData = ref([])
  const allFile = ref([])
  // 勾选文件的大小
  const nodeSize = computed(() => {
    const totalSize = unref(selectedKeys).reduce((total, currentPath) => {
      console.log('total, curret', total, currentPath)

      const currentNode = unref(allFile).find(x => x.path === currentPath)
      return total + currentNode.size
    }, 0)

    return formatFileSize(totalSize)
  })

  async function createNode (docPatch, gameDocDir) {
    const { tree, filesPath, fileDetailedList } = await createTree(docPatch, gameDocDir)
    selectedKeys.value = filesPath
    allFile.value = fileDetailedList
    updateNode(tree)
  }

  function updateNode (node) {
    treeData.value = [node]
  }

  return {
    nodeSize,
    expandedKeys,
    selectedKeys,
    treeData,

    createNode,
    updateNode
  }
}
