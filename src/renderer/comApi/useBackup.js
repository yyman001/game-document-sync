
import { ref } from '@vue/composition-api'
import { db } from '../utils/DexieDB'

export default function () {
  // 过滤条件
  let result = ref([])

  const handleSearchBackup = async (keywords) => {
    if (keywords) {
      const regExp = new RegExp(keywords, 'i')
      result.value = await db.backupTable.filter(game => {
        // TODO: 缺失 nickName 数据
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      }).toArray()
    } else {
      result.value = await db.backupTable.toArray()
    }
  }

  return {
    handleSearchBackup,
    result
  }
}
