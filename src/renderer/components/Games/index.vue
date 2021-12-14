<template>
  <div class="card-content">
    <div class="card-box">
      <Card
        :hasDoc="docMap.includes(item.gameDocDir)"
        :key="item.gameName"
        v-for="item in list"
        :item="item"
        @handleClick="handleClick"
      ></Card>
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
  computed: {
    list () {
      if (!Array.isArray(this.gameList)) return

      return this.gameList.filter((game) => {
        const regExp = new RegExp(this.searchText, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    }
  },
  setup (props) {
    // eslint-disable-next-line no-unused-vars
    const { searchText } = toRefs(props)
    const { docMap, loadCheck, isLoadCheck } = useCheckDocs()
    const { gameList, delGame } = useGames()
    const { isVisible, onModelOpen, onModelClose } = useModel()
    const handleClick = ([type, data]) => {
      switch (type) {
        case 'restore':
          break
        case 'backup':
          break
        case 'editor':
          break
        case 'del':
          delGame(data.gameName)
          break
        default:
          break
      }
    }
    // 游戏列表更新,刷新判断是否有存档
    watch(gameList, (newGameList) => {
      loadCheck(newGameList)
    })

    return {
      docMap,
      isLoadCheck,
      loadCheck,
      gameList,
      handleClick,
      isVisible,
      onModelOpen,
      onModelClose
    }
  }
}
</script>

<style></style>
