<!--
 * @Author: your name
 * @Date: 2021-04-06 12:18:58
 * @LastEditTime: 2021-06-12 23:03:32
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
            v-model="searchText"
          >
          </el-input>
        </div>
      </el-header>

      <el-main>
        <div class="x-main">
          <div class="card-content">
            <div class="card-box">
              <card
                :key="item.gameName"
                v-for="item in scanList"
                :item="item"
              ></card>
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
/* eslint-disable */
import card from "../Card"
import newScan from "../new-scan.vue"
import eventMessage from "../../mixins/eventMessage"
export default {
  components: {
    card,
    newScan,
  },
  mixins: [eventMessage],
  data() {
    const item = {
      nickName: "",
      gameDocDir: "OxygenNotIncluded",
      fullPath: "C:\\Users\\Administrator\\Documents\\Klei\\OxygenNotIncluded",
      path: "\\Documents\\Klei\\OxygenNotIncluded",
      gameName: "OxygenNotIncluded",
      systemType: "1",
    };

    return {
      dialogFormVisible: false,
      scanList: Array(19).fill(item),
      searchText: "",
    };
  },
  mounted() {},
  methods: {
    onCreateScan() {
      this.dialogFormVisible = true
    },
    async onExportSave() {
      console.log(JSON.stringify(this.scanList))
    },
    handleExit(fromData) {
      this.dialogFormVisible = false
    },
    handelSubmit(fromData) {
      this.scanList.push(fromData)
    },
  },
};
</script>

<style type="text/scss" lang="scss">
.el-aside {
  background-color: #24282f;
  color: #6d727d;
  text-align: left;
  line-height: 200px;
}

.el-main {
  background-color: #323a4b;
  color: #333;
  text-align: center;
  line-height: 160px;
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