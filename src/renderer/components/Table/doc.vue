<template>
<el-container>
  <el-header height="auto">
    <div class="doc-header">
      <el-button type="primary" icon="el-icon-circle-plus" @click="onShowDocDialog">添加</el-button>
    </div>
  </el-header>
  <el-main>
    <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="gameName"
      label="游戏名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="游戏别名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="gameDocDir"
      label="文件夹">
    </el-table-column>
    <el-table-column
      prop="gameDocPath"
      label="存档路径">
    </el-table-column>
    <el-table-column
      prop="systemType"
      label="系统类型"
      width="180">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="160">
      <template slot-scope="scope">
        <el-button-group>
          <el-button size="mini" @click="handleCreate(scope.$index, scope.row)" icon="el-icon-plus" title="创建游戏存档"></el-button>
          <el-button size="mini" disabled @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit-outline" title="编辑"></el-button>
          <el-popconfirm @confirm="handleDelete(scope.$index, scope.row)" title="删除无法恢复,确定删除吗？">
          <el-button slot="reference" size="mini" type="danger" title="删除" icon="el-icon-delete"></el-button>
          </el-popconfirm>
        </el-button-group>
      </template>
    </el-table-column>
    </el-table>
  </el-main>
  <!-- 弹窗  -->
  <DocDialog
    v-model.sync="dialogFormVisible"
    @handleExit="onHideDocDialog"
    @handelSubmit="handelSubmit"
  />
</el-container>

</template>

<script>
import DocDialog from '../doc-dialog.vue'
export default {
  components: {
    DocDialog
  },
  data () {
    return {
      tableData: [],
      dialogFormVisible: false
    }
  },

  created () {
    this.getTableData()
  },
  methods: {
    onShowDocDialog () {
      this.dialogFormVisible = true
    },
    onHideDocDialog () {
      this.dialogFormVisible = false
    },
    async handelSubmit (fromData, isCreateGame) {
      const message = await this.$docs.add(fromData)
      if (message === null) {
        this.$message.error('创建存档信息失败!')
        return
      }

      await this.getTableData()
      this.onHideDocDialog()
      this.$message.success('创建存档信息成功!')
    },
    async getTableData () {
      this.tableData = await this.$docs.find({sort: {gameDocDir: 1}})
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    async handleCreate (index, {gameName, nickName, gameDocDir, gameDocPath, systemType}) {
      console.log(index, gameName)
      const result = await this.$games.add({
        gameName,
        nickName,
        gameDocDir,
        gameDocPath,
        systemType,
        gamePlatform: [],
        createTime: Date.now(),
        lastBackTime: null
      })
      console.log('result:', result)
      if (result === null) {
        this.$message.error('创建游戏存档失败!')
        return
      }

      this.$message.success('创建游戏存档成功!')
    },
    handleEdit (index, row) {
      console.log(index, row)
      // this.$docs.updateGameName(row.gameName)
    },
    async handleDelete (index, row) {
      console.log(index, row)
      const x = await this.$docs.remove({gameName: row.gameName})
      if (x === null) {
        this.$message.error('删除失败!')
        return
      }

      this.getTableData()
      this.$message.success('删除成功!')
    }
  }
}
</script>

<style lang="scss" scoped>
.doc-header {
  padding: 20px 0;
}
</style>