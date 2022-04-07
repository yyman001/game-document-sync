import { ref } from '@vue/composition-api'
import { createTree } from '../utils/getTreeItem'

export default function () {
  const expandedKeys = ref([])
  const selectedKeys = ref([])
  const treeData = ref([])

  async function createNode (docPatch, gameDocDir) {
    const node = await createTree(docPatch, gameDocDir)
    updateNode(node)
  }

  function updateNode (node) {
    treeData.value = [node]
  }

  return {
    expandedKeys,
    selectedKeys,
    treeData,

    createNode,
    updateNode
  }
}
