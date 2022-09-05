import { ref } from 'vue'
import { createTree, TreeItem } from '@/utils/getTreeItem'

export default function () {
  const selectedKeys = ref<string[]>([])
  const treeData = ref<TreeItem[]>([])

  async function createNode (docPatch:string, gameDocDir:string) {
    const { tree, filesPath } = await createTree(docPatch, gameDocDir)
    selectedKeys.value = filesPath
    updateNode(tree)
  }

  function updateNode (node:TreeItem) {
    treeData.value = [node]
  }

  return {
    selectedKeys,
    treeData,

    createNode,
    updateNode
  }
}
