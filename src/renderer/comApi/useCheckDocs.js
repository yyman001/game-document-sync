import { ref } from '@vue/composition-api'
import useConfig from './useConfig'
const path = require('path')
const fs = require('fs-extra')
/**
 *  扫描获取是否有相关存档内容
 * @param {*} docList 游戏存档列表
 * @returns {isLoadCheck, docMap, loadCheck}
 */
export default function useCheckDocs () {
  const { homedir } = useConfig()
  let isLoadCheck = ref(false)
  let docMap = ref([])

  async function loadCheck (docList) {
    isLoadCheck.value = true
    docMap.value = []
    for (let i = 0; i < docList.length; i++) {
      // TODO: 目前先判断是否有 存档目录, 后面精确到某个文件的存档再另外确定字段
      const {gameDocDir, gameDocPath} = docList[i]
      const docPath = path.join(homedir.value, gameDocPath)
      const exists = await fs.pathExists(docPath)
      if (exists) {
        docMap.value.push(gameDocDir)
      }
    }
    isLoadCheck.value = false
  }

  return {
    isLoadCheck,
    docMap,
    loadCheck
  }
}
