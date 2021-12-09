
import { ref } from '@vue/composition-api'
import { db } from '../utils/DexieDB'

export default function () {
  // 过滤条件
  let result = ref([])

  const handleSearch = async (keywords) => {
    if (keywords) {
      const regExp = new RegExp(keywords, 'i')
      result.value = await db.docsTable.filter(game => {
        // TODO: 缺失 nickName 数据
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      }).toArray()
    } else {
      result.value = await db.docsTable.toArray()
    }
  }

  return {
    handleSearch,
    result
  }
}
