<template>
  <el-container>
    <el-main>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="expand"
        >
        <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="游戏名:">
            <span>{{ props.row.gameName }}</span>
          </el-form-item>
          <el-form-item label="文件夹名:">
            <span>{{ props.row.gameDocDir }}</span>
          </el-form-item>
          <el-form-item label="文件名:">
            <span>{{ props.row.fileName }}</span>
          </el-form-item>
          <el-form-item label="文件路径:">
            <span>{{ props.row.filePath }}</span>
          </el-form-item>
          <el-form-item label="文件类型:">
            <span>{{ props.row.fileType }}</span>
          </el-form-item>
          <el-form-item label="备份系统:">
            <span>{{ props.row.platformTye }}</span>
          </el-form-item>
          <el-form-item label="备份日期:">
            <span>{{ formatTimestamp(props.row.timeStamp) }}</span>
          </el-form-item>
          <el-form-item label="备注:">
            <span>{{ props.row.remask }}</span>
          </el-form-item>
        </el-form>
      </template>
      </el-table-column>
      <el-table-column
        prop="gameName"
        label="游戏名"
        width="180">
      </el-table-column>

      <el-table-column
        label="备份日期"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ formatTimestamp(scope.row.timeStamp)}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="remask"
        label="备注"
        width="250">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">还原</el-button>
          <el-popconfirm @confirm="handleDelete(scope.$index, scope.row)" title="删除无法恢复,确定删除吗？">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import formatTime from '../mixins/formatTime'
const {remove} = require('../../utils/FileClass').default

export default {
  mixins: [formatTime],
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    async handleDelete (index, row) {
      console.log(index, row)
      const isDel = await this.$backup.remove({fileName: row.fileName})
      if (isDel === null) {
        this.$message.error('删除失败!')
      }
      const filePath = `${row.filePath}.${row.fileType}`
      await remove(filePath)
      this.getTableList()
      this.$message.success('删除成功!')
    },
    async getTableList () {
      const list = await this.$backup.find({sort: {timeStamp: -1}})
      if (list === null) {
        this.$message.error('获取备份列表失败!')
        return
      }

      this.tableData = list
    }
  }
}
</script>

<style>
.el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-form--inline .el-form-item {
  width: 100%;
}
</style>