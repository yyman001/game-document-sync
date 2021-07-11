<template>
      <el-container>
      <!-- 右侧栏  -->
      <el-header class="x-header">
        <div class="search-header">
          <el-input
            placeholder="请输入游戏名称"
            prefix-icon="el-icon-search"
            v-model.trim="searchKeyword"
            @change="handleSearchGames"
          >
          </el-input>
        </div>
      </el-header>

      <el-main>
        <div class="x-main">
          <div class="card-content">
            <div class="card-box">
              <div v-if="!scanList.length" class="card-empt">
                暂无游戏记录
              </div>
              <card
                :key="item.gameName"
                v-for="item in scanList"
                :item="item"
                @handleClick="handleClick"
              />
            </div>
          </div>

        </div>
      </el-main>
      
    </el-container>
</template>

<script>
import card from '../components/Card'
import newScan from '../components/doc-dialog.vue'
import eventMessage from '../mixins/eventMessage'
import {insterDocRecord, addGame, getGames, removeGame} from '../../utils/nedb'

export default {
  components: {
    card,
    newScan
  },
  mixins: [eventMessage],
  data () {
    return {
      dialogFormVisible: false,
      scanList: [],
      searchKeyword: ''
    }
  },
  async created () {
    const list = await getGames()
    this.scanList = list
  },
  mounted () {},
  methods: {
    onCreateScan () {
      this.dialogFormVisible = true
    },
    async onExportSave () {
      console.log(JSON.stringify(this.scanList))
    },
    handleExit (fromData) {
      this.dialogFormVisible = false
    },
    async handelSubmit (fromData) {
      // todo: 判断是否再添加游戏,同时更新 游戏扫描列表
      const message = await insterDocRecord(fromData)
      if (message === null) {
        console.log('插入数据失败!')
        return
      }

      this.scanList.push(fromData)

      const game = await addGame({
        ...fromData,
        gamePlatform: [],
        createTime: Date.now(),
        lastBackTime: null
      })
      console.log('插入成功!!', game)
    },
    async handleClick ([type, game]) {
      console.log(type, game)
      if (type === 'editor') {

      } else if (type === 'del') {
        const x = await removeGame(game.gameDocDir)
        if (x === null) {
          this.$message.error('删除失败!')
          return
        }

        this.scanList = await getGames()
        this.$message.success('删除成功!')
      }
    },
    async handleSearchGames (keywords) {
      const games = await getGames(keywords)
      if (!games.length) {
        console.log('未查询到相关信息!')
        return
      }

      this.scanList = games
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.el-main {
  background-color: #1b2838;
  color: #fff;
  text-align: center;
}

.x-header {
  background-color: #2f3b50;
}

.search-header {
  padding: 10px;
  .el-input__inner {
    background-color: #23252a;
  }
}

.card-box {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  justify-content: flex-start;
}
</style>