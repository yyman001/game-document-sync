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
            <el-input placeholder="steamId" v-model="form.steamId" size="small" style="margin-bottom: 20px;">
                <template slot="prepend">SteamId</template>
                <el-button slot="append" icon="el-icon-search" :disabled="!form.steamId" @click="handleSearchAppId"></el-button>
            </el-input>
            <el-input placeholder="自动识别" v-model="form.gameName" size="small" style="margin-bottom: 20px;">
                <template slot="prepend">游戏名</template>
            </el-input>
            <el-input placeholder="eg:空洞骑士" v-model="form.nickName" size="small" style="margin-bottom: 20px;">
                <template slot="prepend">游戏名别名</template>
            </el-input>
            <el-input placeholder="eg: C:/Team Cherry/Hollow Knight" v-model="gameDocFullPath" size="small" style="margin-bottom: 20px;">
                <template slot="prepend">存档路径</template>
            </el-input>
            <el-input disabled placeholder="自动识别" v-model="form.gameDocPath" size="small" style="margin-bottom: 20px;">
                <template slot="prepend">存档相对路径</template>
            </el-input>
            <el-input placeholder="自动识别" v-model="systemType" size="small" style="margin-bottom: 20px;" disabled>
                <template slot="prepend">系统类型</template>
            </el-input>
            <el-input placeholder="用户目录" v-model="homedir" size="small" style="margin-bottom: 20px;" disabled>
                <template slot="prepend">用户目录</template>
            </el-input>
            <el-form-item>
                <el-button size="small" @click.stop="handleExit" >取消</el-button>
                <el-button type="primary" size="small" @click.stop="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import homeDirMixin from '../../mixins/homedir'
const path = require('path')

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
      gameDocFullPath: '',
      docType: {
        '%APPDATA%': '\\AppData\\Roaming',
        '%LOCALAPPDATA%': '\\AppData\\Local'
      }
    }
  },
  watch: {
    gameDocFullPath (v) {
      console.log('输入存档路径', v) // C:\Users\Administrator\Documents\Klei\OxygenNotIncluded
      console.log('homedir', this.homedir) // C:\Users\Administrator
      const pathObject = path.parse(v)
      console.log('path', pathObject)
      if (this.systemType !== 'Windows_NT') {
        this.$message.error('目前只支持windows平台!')
        return
      }

      switch (pathObject.dir) {
        case '%APPDATA%':
        case '%LOCALAPPDATA%':
          this.form.gameDocPath = path.join(this.docType[pathObject.dir], pathObject.name)
          this.form.gameDocDir = pathObject.name
          this.form.gameName = pathObject.name.replace(/_/ig, ' ')
          break
        default:
          // 表达式: \w+:\\users\\\w+?\\ 替换 C:\Users\???\
          this.form.gameDocPath = pathObject.dir.replace(/\w+:\\users\\\w+?\\/ig, '\\')
          this.form.gameDocDir = pathObject.name
          this.form.gameName = pathObject.name.replace(/_/ig, ' ')
          break
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
        gameName: '',
        nickName: '',
        gameDocDir: '',
        gameDocPath: ''
      }
    },
    onSubmit () {
      // TODO: 交易填写的数据
      this.$emit('handelSubmit', {...this.form, systemType: this.systemTypeOptions[this.systemType]})
      this.onReset()
    },
    handleExit () {
      this.$emit('handleExit', this.form)
    },
    handleSearchAppId () {
      window.open(`https://www.pcgamingwiki.com/w/index.php?search=${this.form.steamId}&title=Special%3ASearch`)
    }
  }
}
</script>

<style scoped type="text/scss" lang="scss">
</style>
