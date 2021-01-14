<template>
  <div class="x-main">
    <button @click.stop="onCreateScan">新建存档游戏</button>
    <button @click.stop="onExportSave">导出扫描文件</button>
     <div class="card-box">
         <card :key="item.gameName" v-for="item in scanList" :item="item"></card>
     </div>
    <new-scan v-model.sync="dialogFormVisible" @handleExit="handleExit" @handelSubmit="handelSubmit"/>
  </div>
</template>

<script>
    /* eslint-disable */
  import card from '../Card'
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
        scanList: [
          {
            // [游戏名]
            "gameName": '空洞骑士',
            // 游戏存档目录名
            "gameDocDir": 'Hollow Knight',
            // [游戏开发公司/团队]
            "gameCompany": 'Team Cherry',
            // [游戏存档路径] 自动计算?后面跟进大数据尝试识别
            "gameDocPath": '/Team Cherry/Hollow Knight',
            // 游戏存档路径
            "fullPath": '',
            // 游戏主程序路径
            "mainProgram": '',
            // 游戏目录
            "gameDir": '',
            // 启动方式
            "startMode": '',
            // 游戏平台
            "gamePlatform": [
              {
                id: '',
                name: 'steam',
                link: 'steam://rungameid/game-id'
              },
              {
                id: '',
                name: 'epic',
                link: ''
              }
            ],
            // 游戏版本
            "version": "",
            // 最后备份时间
            "lastBackTime": '',
            // 备份路径(多路径,因为支持多路径的)
            "backPath": []
          }
        ]
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

<style type="text/scss" lang="scss">
    .x-main {
        padding: 1em;
        background-color: #f7f7f7;
    }

    .card-box {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: flex-start;
    }
</style>