<template>
  <div class="card-content">
    <button @click="joinBatch">joinBatch</button>
    <template v-if="GameItems?.length">
      <div class="card-box">
        <Card
          :key="item.gameName"
          v-for="item in GameItems"
          :item="item"
          :appStatus="appStatus"
          :appName="GAME_DOC_DIR"
          :hasGameDoc="hasGameDoc(item.gameDocDir)"
          @handleClick="handleClick"
          @contextmenu="onContextMenu($event, item)"
        />
      </div>
    </template>
    <template v-else>
      <Empty description="未找到游戏" :image="simpleImage" />
    </template>
    <ModalBackUp @submit="handleStartBackup" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  unref,
  Ref,
  ref,
  provide,
  inject,
  onMounted,
  onBeforeUnmount
} from 'vue'
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
import { message, Empty, Spin } from 'ant-design-vue'
import { useConfigStoreWhitOut } from '@/store/config'

import ContextMenu from '@imengyu/vue3-context-menu'
import { showOpenDialog } from '@/utils/ipc'
import { deepCopy } from '@/utils/deepCopy'
import { collection, doc, onSnapshot, query, writeBatch } from 'firebase/firestore'
import { firebaseDB, GAMES_TABLE } from '@/utils/firebase/config'
import { showConfirm } from '@/utils/showConfirm'
import { getGames, removeGame, updateGameFiled } from '@/utils/firebase/sdk'
import useRunApp from '@/hooks/useRunApp'

export default defineComponent({
  components: { Card, ModalBackUp, Empty, Spin, ContextMenu },

  setup(props) {
    const { searchText } = inject<any>('search')
    const { gameList } = useGames()
    const { isLoading, hasGameDoc, refreshScanGames } = useScanGamesDoc(gameList)
    const { isVisible, onModalOpen, onModalClose } = useModel()
    const { error, success } = message

    const { appStatus, startApp, stopApp, offsetTime } = useRunApp()

    const { HOME_DIR } = useSystem()
    const { selectedKeys, treeData, createNode, nodeSize } = useDocTree()
    const { loading, onStartBackup } = useBackupFile()
    const { showRestoreFile } = useRestoreFile()
    const localFile = useLocalFileStoreWhitOut()
    const useConfigStore = useConfigStoreWhitOut()
    const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

    const tableList = ref<GameItem[]>([])

    const GameItems = computed(() => {
      if (!Array.isArray(unref(tableList))) return []
      if (!unref(searchText)) return unref(tableList)

      return unref(tableList as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText), 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    let unsubscribe: (() => void) | null = null

    // 获取 Firestore 集合的引用
    const messagesCollection = collection(firebaseDB, GAMES_TABLE)
    const q = query(messagesCollection)

    onMounted(() => {
      unsubscribe = onSnapshot(q, snapshot => {
        tableList.value = snapshot.docs.map(doc => doc.data()) as Array<GameItem>
      })
    })

    onBeforeUnmount(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const GAME_DOC_PATH = ref('')
    const GAME_DOC_DIR = ref('')
    const docPath = ref('')
    const backPath = ref('')
    let lastFile = null

    const updateGamePlaytime = (item: GameItem) => {
      console.log('更新游戏时间', item.nickName, item.playtime)
      updateGameFiled(item.gameDocDir, { playtime: Number(item.playtime || 0) + offsetTime.value })
    }

    const handleClick = (response: CardEmitItem) => {
      const [type, data] = response
      console.log('data', data)
      const { gameDocPath, gameDocDir, pathType } = data
      GAME_DOC_PATH.value = gameDocPath
      GAME_DOC_DIR.value = gameDocDir
      const startTime = Date.now()

      switch (type) {
        case 'restore':
          lastFile = localFile.getLastFile(gameDocDir)
          if (!lastFile) return error('未找到可以还原的备份存档文件!')
          showRestoreFile(lastFile)
          break

        case 'backup':
          docPath.value = getPath(
            pathType === 'PUBLIC' ? 'C:\\Users\\Public' : HOME_DIR,
            gameDocPath
          )
          backPath.value = useConfigStore.getBackupPath(gameDocDir)
          createNode(docPath.value, gameDocDir)
          onModalOpen()
          break

        case 'run':
          // todo: 判断为对于游戏启动时不可继续触发
          if (appStatus.value === 'loading') {
            stopApp()
            return
          }
          // 检测是否存在游戏程序路径,并运行
          getGames(gameDocDir)
            .then(gameItem => {
              if (!gameItem?.gameAppPath) {
                error('游戏路径不存在,请设置游戏应用路径!')
                return
              }
              // 记录运行时间
              updateGameFiled(gameDocDir, { lastRunTime: startTime })
              startApp(gameItem.gameAppPath, gameItem, updateGamePlaytime)
              /*  runApp(gameItem.gameAppPath)
                .then(() => {
                  const offsetTime = Date.now() - startTime
                  updateGameFiled(gameDocDir, { playtime: playtime + offsetTime })
                  console.log('App started successfully')
                })
                .catch(error => {
                  console.error('Error starting app:', error)
                }) */
            })
            .catch(e => {
              console.log('运行错误:', gameDocDir, e)
            })
          break

        case 'editor':
          break

        case 'del':
          break

        default:
          break
      }
    }

    const handleStartBackup = async (data: any) => {
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

    const onContextMenu = (e: MouseEvent, item: GameItem) => {
      // prevent the browser's default menu
      console.log('右键:', item)

      e.preventDefault()
      ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: [
          {
            label: '设置游戏启动路径',
            onClick: async () => {
              const gameAppPath = await showOpenDialog({
                title: '选择程序位置',
                openFileType: 'exe'
              })
              console.log('gameAppPath:', gameAppPath)
              if (!gameAppPath) return

              // todo: 校验路径是否为对应的游戏
              const rtx = await updateGameFiled(item.gameDocDir, { gameAppPath })
              if (rtx === null) {
                error('设置失败!')
                return
              }
              success('设置成功!')
              // todo: 运行设置好的游戏? 加个配置控制
            }
          },
          {
            label: '删除',
            onClick: async () => {
              const rtx = await showConfirm('警告!', `确定要删除${item.gameName}? 不可恢复!`)
              if (!rtx) return
              await removeGame(item.gameDocDir)
            }
          }
        ]
      })
    }

    const joinBatch = async () => {
      console.log('joinBatch')

      const batch = writeBatch(firebaseDB)

      gameList.value?.forEach((item, index) => {
        console.log('item:', index, item)
        const nycRef = doc(firebaseDB, GAMES_TABLE, item.gameDocDir)
        const injectData = deepCopy(item)
        batch.set(nycRef, injectData)
      })

      await batch.commit()
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
      isLoading,
      hasGameDoc,
      refreshScanGames,

      isVisible,
      handleClick,
      handleStartBackup,

      simpleImage,
      onContextMenu,

      GameItems,
      joinBatch,
      stopApp,

      GAME_DOC_DIR,
      appStatus
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
