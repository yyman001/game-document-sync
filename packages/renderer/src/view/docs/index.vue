<template>
  <a-table rowKey="gameName" :columns="tableColumns" :data-source="list">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'gameName'">
        <p>
          <img
            class="horizontalCover"
            :src="horizontalCover(record.steamId)"
            :alt="record.gameName"
          />
        </p>
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
        <a-popconfirm title="确定要删除吗？" @confirm="onDel(record.gameDocDir)">
          <a-button>
            <template #icon><close-outlined /></template>
          </a-button>
        </a-popconfirm>
      </a-button-group>
    </template>
  </a-table>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, toRefs, unref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue'

import useDocs from '@/hooks/db/useDocs'
import useGames from '@/hooks/db/useGames'
import { horizontalCover } from '@/utils/steamPrivew'
import { GameItem } from '@/model'
import { useDocFormStoreWhitOut } from '@/store/doc'

export default defineComponent({
  name: 'doc-mod',
  components: {
    PlusOutlined,
    CloseOutlined,
    FormOutlined
  },

  setup(props) {
    const docFrom = useDocFormStoreWhitOut()

    const { searchText } = inject<any>('search')
    const { result, getGameDoc, onDelDoc } = useDocs()
    const { addGame } = useGames()
    const { success: messageSuccess, error: messageError } = message
    const tableColumns = [
      {
        title: 'steamId',
        dataIndex: 'steamId',
        key: 'steamId'
      },
      {
        title: '游戏名',
        key: 'gameName'
      },
      /* {
        title: '译名',
        dataIndex: 'nickName',
        key: 'nickName'
      }, */
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]

    const list = computed(() => {
      if (!Array.isArray(unref(result))) return []

      if (!unref(searchText)) return unref(result)

      return unref(result as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    // todo: bug => 添加成功后, 游戏列表只有添加后的数据,强制刷新后正常
    const onAdd = async ({
      gameName,
      nickName,
      gameDocDir,
      gameDocPath,
      systemType,
      steamId,
      pathType = ''
    }: any) => {
      const result = await addGame({
        steamId,
        gameName,
        nickName,
        gameDocDir,
        gameDocPath,
        systemType,
        gamePlatform: [],
        createTime: Date.now(),
        lastBackTime: null,
        pathType,
        gameAppPath: ''
      })

      if (result === null) {
        messageError('创建游戏存档失败!')
        return
      }

      messageSuccess('创建游戏存档成功!')
    }

    const onUpdate = async ({
      gameName,
      nickName,
      gameDocDir,
      gameDocPath,
      systemType,
      steamId,
      pathType = ''
    }: any) => {
      if (!gameDocDir) {
        return
      }
      // 更新标记状态
      docFrom.setUpdateStatus(true)

      const result = await getGameDoc(gameDocDir)

      console.log('result:', result)
      docFrom.onSetDocForm(result)
      if (result === null) {
        messageError('未找到游戏配置信息!')
      }
      docFrom.onSetDocForm(result)
      docFrom.onModalOpen()
    }

    const onDel = async (gameDocDir: string) => {
      const x = await onDelDoc(gameDocDir)
      if (x === null) {
        messageError('删除失败!')
        return
      }

      messageSuccess('删除成功!')
    }

    return {
      tableColumns,
      list,

      onAdd,
      onUpdate,
      onDel,
      horizontalCover
    }
  }
})
</script>

<style lang="scss">
.horizontalCover {
  max-height: 140px;
}
</style>
