<template>
  <div class="card-content">
  <button @click="refreshScanGames">刷新</button>
    <div class="card-box">
      <Card
        :key="item.gameName"
        v-for="item in list"
        :item="item"
        :hasGameDoc="hasGameDoc(item.gameDocDir)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, toRefs, Ref } from 'vue'
import Card from '@/components/Card/index.vue'

import useGames from './useGames'
import useScanGamesDoc from './useScanGamesDoc'

import { GameItem } from '../../model'

export default defineComponent({
  components: { Card },

  props: {
    searchText: String
  },

  setup (props) {
    const { searchText } = toRefs(props)
    const { gameList } = useGames()
    const { hasGameDoc, refreshScanGames } = useScanGamesDoc(gameList)

    const list = computed(() => {
      if (!Array.isArray(unref(gameList))) return []

      if (!unref(searchText)) return unref(gameList)

      return unref(gameList as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    return {
      list,
      hasGameDoc,
      refreshScanGames
    }
  }
})
</script>

<style>
.card-box {
  display: flex;
  flex-wrap: wrap;
}
</style>
