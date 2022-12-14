<template>
  <div class="card-content">
    <button @click="refreshScanGames">刷新</button>
    <template v-if="list?.length">
      <div class="card-box">
        <Card
          :key="item.gameName"
          v-for="item in list"
          :item="item"
          :hasGameDoc="hasGameDoc(item.gameDocDir)"
          @handleClick="handleClick"
        />
      </div>
    </template>
    <template v-else>
      <Empty description="未找到游戏" :image="simpleImage" />
    </template>

    <ModalBackUp @submit="handleStartBackup"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, unref, toRefs, Ref, ref, provide, inject } from 'vue'
import Card, { CardEmitItem } from '@/components/Card/index.vue'
import ModalBackUp from '@/modal/backup/index.vue'

import useGames from '@/hooks/db/useGames'
import useScanGamesDoc from './useScanGamesDoc'
import useModel, { modal } from '@/hooks/useModal'

import { GameItem } from '../../model'
import useSystem from '@/hooks/core/useSystem'
import useDocTree from '@/hooks/file/useDocTree'
import useBackupFile from '@/hooks/file/useBackupFile'
import { getPath } from '@/utils'

import useRestoreFile from '@/view/backup/useRestoreFile'
import { useLocalFileStoreWhitOut } from '@/store/localFile'
import { message, Empty } from 'ant-design-vue'
import { useConfigStoreWhitOut } from '@/store/config'

export default defineComponent({
  components: { Card, ModalBackUp, Empty },

  setup (props) {
    const { searchText } = inject<any>('search')
    const { gameList } = useGames()
    const { hasGameDoc, refreshScanGames } = useScanGamesDoc(gameList)
    const { isVisible, onModalOpen, onModalClose } = useModel()
    const { error } = message

    const { HOME_DIR } = useSystem()
    const { selectedKeys, treeData, createNode, nodeSize } = useDocTree()
    const { loading, onStartBackup } = useBackupFile()
    const { showRestoreFile } = useRestoreFile()
    const localFile = useLocalFileStoreWhitOut()
    const useConfigStore = useConfigStoreWhitOut()
    const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

    const list = computed(() => {
      if (!Array.isArray(unref(gameList))) return []

      if (!unref(searchText)) return unref(gameList)

      return unref(gameList as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    const GAME_DOC_PATH = ref('')
    const GAME_DOC_DIR = ref('')
    const docPath = ref('')
    const backPath = ref('')
    let lastFile = null
    const handleClick = (response: CardEmitItem) => {
      const [type, data] = response
      console.log('data', data)
      const { gameDocPath, gameDocDir, pathType } = data
      GAME_DOC_PATH.value = gameDocPath
      GAME_DOC_DIR.value = gameDocDir

      switch (type) {
        case 'restore':
          lastFile = localFile.getLastFile(gameDocDir)
          if (!lastFile) return error('未找到可以还原的备份存档文件!')
          showRestoreFile(lastFile)
          break

        case 'backup':
          docPath.value = getPath(pathType === 'PUBLIC' ? 'C:\\Users\\Public' : HOME_DIR, gameDocPath)
          backPath.value = useConfigStore.getBackupPath(gameDocDir)
          createNode(docPath.value, gameDocDir)
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

    const handleStartBackup = async (data:any) => {
      try {
        await onStartBackup({
          docPath: unref(docPath),
          backPath: unref(backPath),
          gameDocPath: unref(GAME_DOC_PATH),
          gameDocDir: unref(GAME_DOC_DIR),
          saveFiles: unref(selectedKeys)
        })
        onModalClose()
      } catch (e) {
        console.error(e)
      }
    }

    // 注入参数
    provide(modal, {
      isVisible,
      onModalClose,

      loading,
      selectedKeys,

      nodeSize,
      treeData,

      docPath,
      backPath
    })

    return {
      list,
      hasGameDoc,
      refreshScanGames,

      isVisible,
      handleClick,
      handleStartBackup,

      simpleImage
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
