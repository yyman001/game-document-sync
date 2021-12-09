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

  const onAddDoc = async (object) => {
    try {
      return await db.docsTable.add(object)
    } catch (error) {
      console.log('onAddDoc', error)
    }

    return null
  }

  const onUpdateDoc = async (object) => {
    try {
      // await db.docsTable.update(object)
    } catch (error) {
      console.log('onUpdateDoc', error)
    }

    return null
  }

  const onDelDoc = async (gameName) => {
    try {
      // del success return undefined
      return await db.docsTable.delete(gameName)
    } catch (error) {
      console.log('onDelDoc', error)
    }

    return null
  }

  return {
    onAddDoc,
    onDelDoc,
    onUpdateDoc,
    handleSearch,
    result
  }
}
