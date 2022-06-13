<template>
  <div class="card-content">
    <div class="card-box">
      <Card
        :key="item.gameName"
        v-for="item in list"
        :item="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, toRefs, Ref } from 'vue'
import Card from '@/components/Card/index.vue'

import useGames from './useGames'
import { GameItem } from '@/model'

export default defineComponent({
  components: { Card },

  props: {
    searchText: String
  },

  setup (props) {
    const { searchText } = toRefs(props)
    const { gameList } = useGames()

    const list = computed(() => {
      if (!Array.isArray(unref(gameList))) return []

      if (!unref(searchText)) return unref(gameList)

      return unref(gameList as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    return {
      list
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
