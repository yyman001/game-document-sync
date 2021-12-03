// eslint-disable-next-line no-unused-vars
import { ref, reactive } from '@vue/composition-api'

export default function useGames () {
  // 过滤条件
  let gameList = ref([])

  const handleSearchGame = async (keywords = '') => {
    // gameList.value = await gamesDB.searchGames(keywords)
    console.log('gameList:', gameList)
  }

  return {
    handleSearchGame,
    gameList
  }
}
