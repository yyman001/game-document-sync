<!--
 * @Author: yyman001
 * @Date: 2021-04-06 12:18:58
 * @LastEditTime: 2021-06-13 22:01:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\components\main\index.vue
-->
<template>
  <el-container>
    <!--  左侧栏  -->
    <el-aside width="200px">
      <ul class="aside-meun">
        <li class="aside-meun__button">
          <a @click.stop="onCreateScan">新建存档游戏</a>
        </li>
        <li class="aside-meun__button">
          <a >游戏列表</a>
        </li>
        <li class="aside-meun__button">
          <a @click.stop="onExportSave">导出扫描文件</a>
        </li>
        <li class="aside-meun__button">
          <a>备份管理</a>
        </li>
      </ul>
    </el-aside>

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
          <!-- 弹窗  -->
          <new-scan
            v-model.sync="dialogFormVisible"
            @handleExit="handleExit"
            @handelSubmit="handelSubmit"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import card from '../Card'
import newScan from '../new-scan.vue'
import eventMessage from '../../mixins/eventMessage'
import {insterDocRecord, addGame, getGames} from '../../../utils/nedb'

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
    console.log('list:', list)
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
    handleClick ([type, game]) {
      console.log(type, game)
    },
    async handleSearchGames (keywords) {
      // if (!keywords) {
      //   console.log('请输入关键字!')
      //   return
      // }
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
.el-aside {
  background-color: #24282f;
  color: #6d727d;
  text-align: left;
  line-height: 200px;
}

.el-main {
  // background-color: #323a4b;
  background-color: #1b2838;
  color: #fff;
  text-align: center;
  // line-height: 160px;
}
.aside-meun {
  margin: 0;
  padding: 20px 0;
  box-sizing: border-box;
  flex: 1;
  height: 100%;

  &__button {
    display: block;
    padding-left: 50px;
    height: 50px;
    line-height: 50px;
    cursor: default;
    &:hover {
      color: #c6ccd7;
      background-color: #323a4b;
    }
  }
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