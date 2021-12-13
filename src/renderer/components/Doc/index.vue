<template>
  <a-table rowKey="gameName" :columns="columns" :data-source="list">
    
    <span slot="gameInfo" slot-scope="record">
        <img class="horizontalCover" :src="horizontalCover(record.steamId)" alt="">
        <p>{{record.gameName}}</p>
    </span>

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button icon="plus" />
        <a-button icon="delete" @click="onDelDoc(record.gameName)"/>
        <a-button icon="file" :data-name="record.gameName"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import useDocs from '../../comApi/useDocs'
import { toRefs } from '@vue/composition-api'
import { horizontalCover } from '../../../utils/steamPrivew'

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

    return {
      result,
      horizontalCover,
      onDelDoc
    }
  }
}
</script>

<style lang="scss">
.horizontalCover {
  max-height: 80px;
}
</style>