<template>
  <div class="x-main">
    <button @click.stop="onCreateScan">新建导入游戏</button>
    <button @click.stop="onExportSave">导出扫描文件</button>
    <card :key="item.gameName" v-for="item in scanList" :item="item"></card>

    <new-scan v-model.sync="dialogFormVisible" @handleExit="handleExit" @handelSubmit="handelSubmit"/>
  </div>
</template>

<script>
    /* eslint-disable */
  import card from '../card'
  import newScan from '../new-scan.vue'
  import eventMessage from '../../mixins/eventMessage'
  export default {
    components: {
      card,
      newScan
    },
    mixins: [eventMessage],
    data () {
      return {
        dialogFormVisible: false,
        scanList: []
      }
    },
    mounted () {
    },
    methods: {
      onCreateScan () {
        this.dialogFormVisible = true
      },
      async onExportSave () {
        this.$send(
          {
            eventType: 'save',
            data: {
            fileName: 'scan.json',
            text: this.scanList
        }})
      },
      handleExit (fromData) {
        console.warn(`handleExit:`, fromData)
         this.dialogFormVisible = false
      },
      handelSubmit (fromData) {
        console.warn(`handelSubmit:`, fromData)
        this.scanList.push(fromData)
        console.log(`this.scanList:`, JSON.stringify(this.scanList))
      }
    }
  }
</script>

<style>

</style>