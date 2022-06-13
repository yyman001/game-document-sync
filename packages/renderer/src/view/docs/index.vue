<template>
  <a-table rowKey="gameName" :columns="tableColumns" :data-source="list">

    <template #bodyCell="{ column, record }">
      <a-button-group v-if="column.key === 'action'">
        <a-button icon="plus" @click="onAdd(record)"/>
        <a-popconfirm title="确定要删除吗？" @confirm="onDel(record.gameDocDir)">
          <a-button icon="delete"/>
        </a-popconfirm>
        <a-button icon="file" :data-name="record.gameName"/>
      </a-button-group>
    </template>

  </a-table>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, unref } from 'vue'
import useDocs from './useDocs'
import { horizontalCover } from '@/utils/steamPrivew'

export default defineComponent({
  name: 'doc-mod',
  components: { },
  props: {
    searchText: String
  },

  setup (props) {
    const { searchText } = toRefs(props)
    const { result } = useDocs()

    const tableColumns = [
      {
        title: 'steamId',
        dataIndex: 'steamId',
        key: 'steamId'
      },
      {
        title: '游戏名',
        key: 'gameName',
        customRender ({ record }) {
          return record.gameName
        }
      },
      {
        title: '译名',
        dataIndex: 'nickName',
        key: 'nickName'
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]

    const list = computed(() => {
      if (!Array.isArray(unref(result))) return []

      if (!props.searchText) return unref(result)

      return unref(result).filter((game: any) => {
        const regExp = new RegExp(unref(searchText) as string, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    })

    const onAdd = () => {}
    const onDel = () => {}

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
