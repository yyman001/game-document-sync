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
      <FieldSetGroup v-if="treeData.length" title="文件列表">
        <div class="file-content">
            勾选内容大小: {{nodeSize}}
            <a-directory-tree
              default-expand-all
              multiple
              :checkable="true"
              :height="280"
              v-model:selectedKeys="selectedKeys"
              :tree-data="treeData"
            />
        </div>
      </FieldSetGroup>
      <ModalBackup
       :saveFiles="selectedKeys"
       :gameDocDir="gameDocDir"
       :gameDocPath="gameDocPath"
       @handleClose="onModelClose"
       />
    </a-modal>

  </div>
</template>

<script>
import Card from '../Card'
import FieldSetGroup from '../FieldSetGroup'
import { watch, toRefs, ref } from '@vue/composition-api'
import useCheckDocs from '../../comApi/useCheckDocs'
import useGames from '../../comApi/useGames'
import useModel from '../../comApi/useModel'
import ModalBackup from '../../components/Modal/ModalBackup.vue'
import { showOpenDialog } from '../../utils/dialog'
import useFile from '../../comApi/useBackupFile'
import useMessage from '../../comApi/useMessage'
import useConfig from '../../comApi/useConfig'
import useDocTree from '../../comApi/useDocTree'
const path = require('path')

export default {
  name: 'games-mod',
  components: {
    Card,
    FieldSetGroup,
    ModalBackup
  },
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
    const { homedir } = useConfig()
    const { nodeSize, expandedKeys, selectedKeys, treeData, createNode } = useDocTree()
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
          const docPatch = path.join(homedir.value, gameDocPath.value)
          createNode(docPatch, gameDocDir)

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
      gameDocDir,

      nodeSize,
      expandedKeys,
      selectedKeys,
      treeData
    }
  }

}
</script>

<style lang="scss">
.file-content {
  max-height: 250px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
