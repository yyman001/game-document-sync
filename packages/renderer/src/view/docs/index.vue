<template>
  <a-table rowKey="gameName" :columns="tableColumns" :data-source="list">

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'gameName'">
        <p>
          <img :src="horizontalCover(record.steamId)" :alt="record.gameName">
        </p>
        <p>{{ record.gameName }}</p>
        <p>{{ record.nickName }}</p>
      </template>

      <a-button-group v-if="column.key === 'action'">
        <a-button @click="onAdd(record)">
          <template #icon><plus-outlined /></template>
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
import { computed, defineComponent, Ref, toRefs, unref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'

import useDocs from '@/hooks/db/useDocs'
import useGames from '@/hooks/db/useGames'
import { horizontalCover } from '@/utils/steamPrivew'
import { GameItem } from '@/model'

export default defineComponent({
  name: 'doc-mod',
  components: {
    PlusOutlined,
    CloseOutlined
  },
  props: {
    searchText: String
  },

  setup (props) {
    const { searchText } = toRefs(props)
    const { result, onDelDoc } = useDocs()
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

      if (!props.searchText) return unref(result)

      return unref(result as Readonly<Ref<GameItem[]>>).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    const onAdd = async ({ gameName, nickName, gameDocDir, gameDocPath, systemType, steamId, pathType = '' }:any) => {
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
        pathType
      })

      if (result === null) {
        messageError('创建游戏存档失败!')
        return
      }

      messageSuccess('创建游戏存档成功!')
    }

    const onDel = async (gameDocDir:string) => {
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
      onDel,
      horizontalCover
    }
  }
})
</script>

<style lang="scss">
.horizontalCover {
  max-height: 80px;
}
</style>
