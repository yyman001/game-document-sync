<!--
创建扫描配置
 -->
<template>
    <el-dialog title="创建扫描游戏配置" :show-close="false" :visible="value">
        <el-form ref="form" :model="form" label-width="80px">
            <el-input placeholder="eg:空洞骑士" v-model="form.nickName" style="margin-bottom: 20px;">
                <template slot="prepend">游戏名</template>
            </el-input>
            <el-input placeholder="eg:Team Cherry/sHollow Knight" v-model="form.gameDocDir" style="margin-bottom: 20px;">
                <template slot="prepend">存档目录名</template>
            </el-input>
            <el-form-item>
                <el-button type="primary" @click.stop="onSubmit">立即创建</el-button>
                <el-button @click.stop="handleExit">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
  export default {
    name: 'new-scan',
    components: {},
    props: ['value'],
    data () {
      return {
        dialogFormVisible: false,
        form: {
          nickName: '',
          gameDocDir: ''
        }
      }
    },
    watch: {
    },
    computed: {
    },
    created () {
    },
    beforeDestroy () {
    },
    mounted () {
    },
    methods: {
      onSubmit () {
        this.$emit('handelSubmit', this.form)
      },
      handleExit () {
        this.$emit('handleExit', this.form)
      }
    }
  }
</script>

<style scoped type="text/scss" lang="scss">
</style>
