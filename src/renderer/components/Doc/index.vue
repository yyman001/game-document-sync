<template>
  <a-table rowKey="gameName" :columns="columns" :data-source="result">
    
    <span slot="gameInfo" slot-scope="record">
        <img class="horizontalCover" :src="horizontalCover(record.steamId)" alt="">
        <p>{{record.gameName}}</p>
    </span>

    <span slot="action" slot-scope="record">
      <a-button-group>
        <a-button type="primary" icon="add" />
        <a-button type="danger" icon="delete" />
        <a-button icon="file" :data-name="record.gameName"/>
      </a-button-group>
    </span>

  </a-table>
</template>

<script>
import useDocs from '../../comApi/useDocs'
import { watch, toRefs } from '@vue/composition-api'
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
  setup (props) {
    const { searchText } = toRefs(props)
    const { result, handleSearch } = useDocs()
    handleSearch()
    // 搜索游戏
    watch(searchText, (newSearchText) => {
      handleSearch(newSearchText)
    })

    return {
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