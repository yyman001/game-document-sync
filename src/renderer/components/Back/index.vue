
<template>
  <a-table rowKey="gameName" :columns="columns" :data-source="result" :expandRowByClick="true">
    <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
      {{ record }}
    </div>

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button type="primary" icon="rollback" />
        <a-button type="danger" icon="delete" />
        <a-button icon="folder-open" />
        <a-button icon="file" :data-name="record.gameName"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import useBackup from '../../comApi/useBackup'
import { watch, toRefs } from '@vue/composition-api'

export default {
  name: 'back-mod',
  components: { },
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
  setup (props) {
    const { searchText } = toRefs(props)
    const { result, handleSearchBackup } = useBackup()
    handleSearchBackup()
    // 搜索游戏
    watch(searchText, (newSearchText) => {
      handleSearchBackup(newSearchText)
    })

    return {
      result
    }
  }
}
</script>

<style>

</style>