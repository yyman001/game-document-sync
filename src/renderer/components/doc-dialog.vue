<!--
 * @Author: your name
 * @Date: 2021-04-06 12:07:55
 * @LastEditTime: 2021-06-13 21:41:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\components\new-scan.vue
-->
<!--
创建扫描配置
 -->
<template>
    <el-dialog :append-to-body="true" title="创建扫描游戏配置" :show-close="false" :visible="value">
        <el-form ref="form" :model="form" label-width="80px">
            <el-input placeholder="steamId" v-model="form.steamId" style="margin-bottom: 20px;">
                <template slot="prepend">SteamId</template>
            </el-input>
            <el-input placeholder="自动识别" v-model="form.gameName" style="margin-bottom: 20px;">
                <template slot="prepend">游戏名</template>
            </el-input>
            <el-input placeholder="eg:空洞骑士" v-model="form.nickName" style="margin-bottom: 20px;">
                <template slot="prepend">游戏名别名</template>
            </el-input>
            <el-input placeholder="eg: C:/Team Cherry/Hollow Knight" v-model="gameDocFullPath" style="margin-bottom: 20px;">
                <template slot="prepend">存档路径</template>
            </el-input>
            <el-input disabled placeholder="自动识别" v-model="form.gameDocPath" style="margin-bottom: 20px;">
                <template slot="prepend">存档相对路径</template>
            </el-input>
            <el-input placeholder="自动识别" v-model="systemType" style="margin-bottom: 20px;" disabled>
                <template slot="prepend">系统类型</template>
            </el-input>
            <el-input placeholder="用户目录" v-model="homedir" style="margin-bottom: 20px;" disabled>
                <template slot="prepend">用户目录</template>
            </el-input>
            <el-form-item>
                <el-button type="primary" @click.stop="onSubmit">立即创建</el-button>
                <el-button @click.stop="handleExit">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import homeDirMixin from '../mixins/homedir'
export default {
  name: 'new-scan',
  mixins: [homeDirMixin],
  components: {},
  props: ['value', 'userInfo'],
  data () {
    return {
      dialogFormVisible: false,
      form: {
        steamId: '',
        nickName: '',
        gameDocDir: '',
        gameDocPath: ''
      },
      gameDocFullPath: ''
    }
  },
  watch: {
    gameDocFullPath (path) {
      console.log('path', path) // C:\Users\Administrator\Documents\Klei\OxygenNotIncluded
      console.log('homedir', this.homedir) // C:\Users\Administrator
      if (this.systemType === 'Windows_NT') {
        const gameDocDir = path.split('\\').slice(-1)[0]
        // 表达式: \w+:\\users\\\w+?\\ 替换 C:\Users\???\
        this.form.gameDocPath = path.replace(/\w+:\\users\\\w+?\\/ig, '\\')
        this.form.gameDocDir = gameDocDir
        this.form.gameName = gameDocDir.replace(/_/ig, ' ')
      }
    }
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
    onReset () {
      this.gameDocFullPath = ''
      this.form = {
        steamId: '',
        nickName: '',
        gameDocDir: '',
        gameDocPath: ''
      }
    },
    onSubmit () {
      this.$emit('handelSubmit', {...this.form, systemType: this.systemTypeOptions[this.systemType]})
      this.onReset()
    },
    handleExit () {
      this.$emit('handleExit', this.form)
    }
  }
}
</script>

<style scoped type="text/scss" lang="scss">
</style>
