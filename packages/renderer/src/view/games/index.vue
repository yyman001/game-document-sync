<template>
  <div class="card-content">
    <button @click="refreshScanGames">刷新</button>
    <div class="card-box">
      <Card
        :key="item.gameName"
        v-for="item in list"
        :item="item"
        :hasGameDoc="hasGameDoc(item.gameDocDir)"
        @handleClick="handleClick"
      />
    </div>
    <ModalBackUp :visible="isVisible" :gameDocPath="gameDocPath" :gameDocDir="gameDocDir"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, toRefs, Ref, ref, provide } from 'vue'
import Card from '@/components/Card/index.vue'
import ModalBackUp from '@/modal/backup/index.vue'

import useGames from '@/hooks/db/useGames'
import useScanGamesDoc from './useScanGamesDoc'
import useModel, { modal } from '@/hooks/useModal'

import { GameItem } from '../../model'
export default defineComponent({
  components: { Card, ModalBackUp },

  props: {
    searchText: String
  },

  setup (props) {
    const { searchText } = toRefs(props)
    const { gameList } = useGames()
    const { hasGameDoc, refreshScanGames } = useScanGamesDoc(gameList)
    const { isVisible, onModalOpen, onModalClose } = useModel()
    const list = computed(() => {
      if (!Array.isArray(unref(gameList))) return []

      if (!unref(searchText)) return unref(gameList)

      return unref(gameList as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    const gameDocPath = ref('')
    const gameDocDir = ref('')

    // 注入参数
    provide(modal, {
      onModalClose
    })

    const handleClick = ([type, data]) => {
      console.log('data', data)
      switch (type) {
        case 'restore':
          break

        case 'backup':
          gameDocPath.value = data.gameDocPath
          gameDocDir.value = data.gameDocDir
          onModalOpen()
          break

        case 'editor':
          break

        case 'del':
          break

        default:
          break
      }
    }

    return {
      list,
      hasGameDoc,
      refreshScanGames,

      isVisible,
      handleClick,
      gameDocPath,
      gameDocDir
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
