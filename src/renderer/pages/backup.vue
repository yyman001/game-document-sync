<template>
  <el-container>
    <el-main>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="gameName"
        label="游戏名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="docName"
        label="存档名"
        width="180">
      </el-table-column>
      <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">还原</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        gameName: '王小虎',
        docName: 'xxxx.rar'
      }]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style>

</style>