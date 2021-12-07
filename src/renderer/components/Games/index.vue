<template>
  <div class="card-content">
    <div class="card-box">
      <Card :hasDoc="docMap.includes(item.gameDocDir)" :key="item.gameName" v-for="item in gameList" :item="item"></Card>
    </div>
  </div>
</template>

<script>
import Card from '../Card'
import { watch, toRefs } from '@vue/composition-api'
import useCheckDocs from '../../comApi/useCheckDocs'
import useGames from '../../comApi/useGames'
import useModel from '../../comApi/useModel'

export default {
  name: 'games-mod',
  components: { Card },
  props: {
    searchText: String
  },
  setup (props) {
    const { searchText } = toRefs(props)
    const { docMap, loadCheck, isLoadCheck } = useCheckDocs()
    const { gameList, handleSearchGame } = useGames()
    const { isVisible, onModelOpen, onModelClose } = useModel()
    // init
    handleSearchGame()
    // 搜索游戏
    watch(searchText, (newSearchText) => {
      console.log('newSearchText', newSearchText)
      handleSearchGame(newSearchText)
    })
    // 游戏列表更新,刷新判断是否有存档
    watch(gameList, (newGameList) => {
      loadCheck(newGameList)
    })

    return {
      docMap,
      isLoadCheck,
      loadCheck,
      gameList,
      handleSearchGame,
      isVisible,
      onModelOpen,
      onModelClose
    }
  },
  data () {
    return {}
  }

}
</script>

<style></style>
