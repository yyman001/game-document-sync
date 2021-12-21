
<template>
  <a-table rowKey="id" :pagination="false" :columns="columns" :data-source="list" :expandRowByClick="true">
    <div slot="expandedRowRender" slot-scope="record" style="margin: 0">

      <a-descriptions bordered :size="'small'" :column="1">
        <a-descriptions-item label="steamId:">
          {{record.steamId}}
        </a-descriptions-item>
        <a-descriptions-item label="游戏名:">
          {{record.gameName}}
        </a-descriptions-item>
        <a-descriptions-item label="文件名:">
          {{record.fileName}}
        </a-descriptions-item>
        <a-descriptions-item label="文件路径:">
          {{record.filePath}}
        </a-descriptions-item>
        <a-descriptions-item label="游戏目录:">
          {{record.gameDocPath}}
        </a-descriptions-item>
        <a-descriptions-item label="系统类型:">
          {{record.platformTye}}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间:">
          {{record.timeStamp}}
        </a-descriptions-item>
        <a-descriptions-item label="备注:">
          {{record.remask}}
        </a-descriptions-item>
      </a-descriptions>
      
    </div><!-- expandedRowRender -->

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button icon="rollback" />
        <a-popconfirm title="确定要删除吗？" @confirm="onDelBackFile(record.id)">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button icon="delete"/>
        </a-popconfirm>
        <a-button icon="folder-open" />
        <a-button icon="file"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import { toRefs } from '@vue/composition-api'
import useBackup from '../../comApi/useBackup'
import useMessage from '../../comApi/useMessage'

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
    const { message } = useMessage()

    const onDelBackFile = async (id) => {
      const isNull = await delBackup(id)
      const text = isNull === null ? '删除备份文件失败!' : '删除成功!'
      message(isNull !== null, text)
    }

    return {
      delBackup,
      result,
      onDelBackFile
    }
  }
}
</script>

<style>

</style>