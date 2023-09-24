<template>
  <div>
    <button @click="joinBatch">joinBatch</button>
    <a-table rowKey="gameName" :columns="tableColumns" :data-source="GameDocItems">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'gameName'">
          <p>
            <img
              class="horizontalCover"
              :src="horizontalCover(record.steamId)"
              :alt="record.gameName"
            />
          </p>
          <p>steamId: {{ record.steamId }}</p>
          <p>{{ record.gameName }}</p>
          <p>{{ record.nickName }}</p>
        </template>

        <a-button-group v-if="column.key === 'action'">
          <a-button @click="onAdd(record)">
            <template #icon><plus-outlined /></template>
          </a-button>
          <a-button @click="onUpdate(record)">
            <template #icon><form-outlined /></template>
          </a-button>
          <a-popconfirm title="确定要删除吗？" @confirm="removeGamesDoc(record.gameDocDir)">
            <a-button>
              <template #icon><close-outlined /></template>
            </a-button>
          </a-popconfirm>
        </a-button-group>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { PlusOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue'

import useDocs from '@/hooks/db/useDocs'
import { horizontalCover } from '@/utils/steamPrivew'
// import { GameItem } from '@/model'
import { useDocFormStoreWhitOut } from '@/store/doc'

import { ref, onMounted, onBeforeUnmount, defineComponent, inject, computed, unref, Ref } from 'vue'
import { firebaseDB, GAME_DOCS_TABLE } from '@/utils/firebase/config'
import { removeGamesDoc } from '@/utils/firebase/sdk'
import { collection, query, onSnapshot, writeBatch, doc, deleteDoc } from 'firebase/firestore'
import { deepCopy } from '@/utils/deepCopy'
import { GameDocItem } from '@/model'

export default defineComponent({
  name: 'demo-firebase',
  components: {
    PlusOutlined,
    CloseOutlined,
    FormOutlined
  },
  setup() {
    const { searchText } = inject<any>('search')
    const docFrom = useDocFormStoreWhitOut()
    const { result } = useDocs()

    const tableColumns = [
      {
        title: '游戏名',
        key: 'gameName'
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]
    const onAdd = () => {}
    const onUpdate = async (record: any) => {
      const {
        gameName,
        nickName,
        gameDocDir,
        gameDocPath,
        systemType,
        steamId,
        pathType = ''
      } = record

      if (!gameDocDir) {
        return
      }
      // 更新标记状态
      docFrom.setUpdateStatus(true)

      docFrom.onSetDocForm(record)
      docFrom.onModalOpen()
    }

    const onDel = async (gameDocDir: string) => {
      try {
        await deleteDoc(doc(db, 'games-doc', gameDocDir))
        message.success('删除成功!')
      } catch (error) {
        message.error('删除失败!')
      }
    }

    const tableList = ref<GameDocItem[]>([])
    let unsubscribe: (() => void) | null = null

    // 获取 Firestore 集合的引用
    const messagesCollection = collection(firebaseDB, GAME_DOCS_TABLE)
    const q = query(messagesCollection)

    onMounted(() => {
      unsubscribe = onSnapshot(q, snapshot => {
        tableList.value = snapshot.docs.map(doc => doc.data()) as Array<GameDocItem>
      })
    })

    onBeforeUnmount(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const GameDocItems = computed(() => {
      if (!Array.isArray(unref(tableList))) return []
      if (!unref(searchText)) return unref(tableList)

      return unref(tableList as Readonly<Ref<GameDocItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText), 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    // todo: 批量导入旧版本数据到新数据库
    const joinBatch = async () => {
      const batch = writeBatch(firebaseDB)

      result.value?.forEach((item, index) => {
        // if (index > 3) return
        console.log('item:', index, item)
        const nycRef = doc(firebaseDB, GAME_DOCS_TABLE, item.gameDocDir)
        const injectData = deepCopy(item)
        batch.set(nycRef, injectData)
      })

      await batch.commit()
    }

    return {
      tableList,
      tableColumns,
      onAdd,
      onUpdate,
      onDel,

      horizontalCover,
      joinBatch,
      GameDocItems,

      removeGamesDoc
    }
  }
})
</script>
<style lang="scss">
.horizontalCover {
  max-height: 140px;
}
</style>
