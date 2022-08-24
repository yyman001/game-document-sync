import { ref } from 'vue'
import { createTree } from '@/utils/getTreeItem'

export default function () {
  const expandedKeys = ref<string[]>([])
  const selectedKeys = ref<string[]>([])
  const treeData = ref<any[]>([])

  async function createNode (docPatch:string, gameDocDir:string) {
    const { tree, filesPath } = await createTree(docPatch, gameDocDir)
    selectedKeys.value = filesPath
    updateNode(tree)
  }

  function updateNode (node:any) {
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
