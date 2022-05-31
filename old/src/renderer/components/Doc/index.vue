<template>
  <a-table rowKey="gameName" :columns="columns" :data-source="list">
    
    <span slot="gameInfo" slot-scope="record">
        <img class="horizontalCover" :src="horizontalCover(record.steamId)" alt="">
        <p>{{record.gameName}}</p>
    </span>

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button icon="plus" @click="onAdd(record)"/>
        <a-popconfirm title="确定要删除吗？" @confirm="onDel(record.gameDocDir)">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button icon="delete"/>
        </a-popconfirm>
        <a-button icon="file" :data-name="record.gameName"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import useDocs from '../../comApi/useDocs'
import { toRefs } from '@vue/composition-api'
import { horizontalCover } from '../../../utils/steamPrivew'
import useMessage from '../../comApi/useMessage'
import useGames from '../../comApi/useGames'

export default {
  name: 'doc-mod',
  components: { },
  props: {
    searchText: String
  },
  data () {
    return {
      columns: [
        {
          title: 'steamId',
          dataIndex: 'steamId',
          key: 'steamId'
        },
        {
          title: '游戏名',
          key: 'gameName',
          scopedSlots: { customRender: 'gameInfo' }
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
    const { result, onDelDoc } = useDocs()
    const { message } = useMessage()
    const { addGame } = useGames()

    const onAdd = async (gameItem) => {
      const game = await addGame(gameItem)
      const text = game === null ? '添加失败,游戏可能已经存在!' : '添加成功!'
      message(game !== null, text)
    }

    const onDel = async (gameName) => {
      const isNull = await onDelDoc(gameName)
      const text = isNull === null ? '删除失败!' : '删除成功!'
      message(isNull !== null, text)
    }

    return {
      onAdd,
      onDel,
      result,
      horizontalCover
    }
  }
}
</script>

<style lang="scss">
.horizontalCover {
  max-height: 80px;
}
</style>