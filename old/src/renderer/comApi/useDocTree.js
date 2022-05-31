import { ref } from '@vue/composition-api'
import { createTree } from '../utils/getTreeItem'

export default function () {
  const expandedKeys = ref([])
  const selectedKeys = ref([])
  const treeData = ref([])

  async function createNode (docPatch, gameDocDir) {
    const { tree, filesPath } = await createTree(docPatch, gameDocDir)
    selectedKeys.value = filesPath
    updateNode(tree)
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
