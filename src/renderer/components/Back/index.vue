
<template>
  <a-table rowKey="gameName" :columns="columns" :data-source="list" :expandRowByClick="true">
    <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
      {{ record }}
    </div>

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button icon="rollback" />
        <a-button icon="delete" @click="delBackup(record.gameName)"/>
        <a-button icon="folder-open" />
        <a-button icon="file"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import useBackup from '../../comApi/useBackup'
import { toRefs } from '@vue/composition-api'

export default {
  name: 'back-mod',
  props: {
    searchText: String
  },
  data () {
    return {
      columns: [
        {
          title: '游戏名',
          dataIndex: 'gameName',
          key: 'gameName'
        },
        {
          title: '备份时间',
          dataIndex: 'timeStamp',
          key: 'timeStamp'
        },
        {
          title: '备注',
          dataIndex: 'remask',
          key: 'remask'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    list () {
      if (!Array.isArray(this.result)) return

      return this.result.filter((game) => {
        const regExp = new RegExp(this.searchText, 'i')
        return regExp.test(game.gameName) || regExp.test(game.nickName)
      })
    }
  },
  setup (props) {
    // eslint-disable-next-line no-unused-vars
    const { searchText } = toRefs(props)
    const { result, delBackup } = useBackup()

    return {
      delBackup,
      result
    }
  }
}
</script>

<style>

</style>