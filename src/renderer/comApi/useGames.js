import { ref } from '@vue/composition-api'
import { db } from '../utils/DexieDB'

export default function useGames () {
  // 过滤条件
  let gameList = ref([])

  const handleSearchGame = async (keywords) => {
    let result = []

    if (keywords) {
      const regExp = new RegExp(keywords, 'i')
      result = await db.gamesTable.filter(game => {
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      }).toArray()
    } else {
      result = await db.gamesTable.toArray()
    }

    gameList.value = result
  }

  return {
    handleSearchGame,
    gameList
  }
}
