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
    <!-- 进度步骤 -->
    <a-modal
      title="备份"
      :visible="isVisible"
      :footer="null"
      :maskClosable="false"
    >
      <ModalBackup
       :gameDocDir="gameDocDir"
       :gameDocPath="gameDocPath"
       @handleClose="onModelClose"
       />
    </a-modal>

  </div>
</template>

<script>
import Card from '../Card'
import { watch, toRefs, ref } from '@vue/composition-api'
import useCheckDocs from '../../comApi/useCheckDocs'
import useGames from '../../comApi/useGames'
import useModel from '../../comApi/useModel'
import ModalBackup from '../../components/Modal/ModalBackup.vue'
import { showOpenDialog } from '../../utils/dialog'
import useFile from '../../comApi/useBackupFile'
import useMessage from '../../comApi/useMessage'

export default {
  name: 'games-mod',
  components: { Card, ModalBackup },
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
    const { customRestoreFile } = useFile()
    const { message } = useMessage()
    const gameDocPath = ref('')
    const gameDocDir = ref('')

    const handleClick = async ([type, data]) => {
      console.log('data', data)
      switch (type) {
        case 'restore':
          const selectedFilePath = showOpenDialog()
          if (!Array.isArray(selectedFilePath)) return
          customRestoreFile(selectedFilePath[0], data)
            .then((data) => {
              message(data[0], data[1])
            })
            .catch((e) => {
              message(false, e.message)
            })
          break

        case 'backup':
          onModelOpen()
          gameDocPath.value = data.gameDocPath
          gameDocDir.value = data.gameDocDir
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
      onModelClose,
      gameDocPath,
      gameDocDir
    }
  }

}
</script>

<style></style>
