<template>
      <el-container>
      <!-- 右侧栏  -->
      <el-header>
        <searchHeader></searchHeader>
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
      <!-- 备份窗口  -->
      <el-dialog :append-to-body="true" :title="`存档备份:${targetName}`" :show-close="false" :visible="dialogVisible">
        <el-input disabled v-model="targetPatch" style="margin-bottom: 20px;">
          <template slot="prepend">存档路径</template>
          <el-button slot="append" icon="el-icon-folder-opened" @click.stop="handleOpenDir('doc', targetPatch)"></el-button>
        </el-input>
        <el-input placeholder="" v-model="backPatch" style="margin-bottom: 20px;">
          <template slot="prepend">备份路径</template>
          <el-button slot="append" icon="el-icon-folder-opened" @click.stop="handleOpenDir('back', backPatch)"></el-button>
        </el-input>
        <el-input type="text" v-model="remask" maxlength="20" show-word-limit >
          <template slot="prepend">备注</template>
        </el-input>

        <div class="el-buttons-gorund">
          <el-button type="primary" @click.stop="handleBackup" :loading="isLoading">立即备份</el-button>
          <el-button :disabled="isLoading" @click.stop="handleExit">取消</el-button>
        </div>

      </el-dialog>
    </el-container>
</template>

<script>
import searchHeader from '../components/searchHeader.vue'
import card from '../components/Card'
import newScan from '../components/doc-dialog.vue'
import eventMessage from '../mixins/eventMessage'
import dirMixin from '../mixins/rootDir'
import homeDirMixin from '../mixins/homedir'
const path = require('path')
const {copy, ensureDir, remove} = require('../../utils/FileClass').default
const {compressDir} = require('../../utils/compressClass').default

export default {
  components: {
    card,
    newScan,
    searchHeader
  },
  mixins: [eventMessage, dirMixin, homeDirMixin],
  data () {
    return {
      dialogVisible: false,
      isVisable: false,
      targetName: '',
      targetPatch: '',
      targetDir: '',
      backPatch: '',
      tempPatch: '',
      gameDocPath: '',
      scanList: [],
      searchKeyword: '',
      isLoading: false,
      remask: ''
    }
  },
  created () {
    this.getGamesList()
  },
  methods: {
    onShowDialog () {
      this.dialogVisible = true
    },
    handleExit () {
      this.dialogVisible = false
    },
    async getGamesList (keywords = '') {
      this.scanList = await this.$games.searchGames(keywords)
    },
    async handleClick ([type, game]) {
      console.log(type, game)
      const {gameName, gameDocDir, gameDocPath} = game
      if (type === 'editor') {

      } else if (type === 'del') {
        const x = await this.$games.remove({gameDocDir})
        if (x === null) {
          this.$message.error('删除失败!')
          return
        }

        this.scanList = await this.$games.searchGames()
        this.$message.success('删除成功!')
      } else if (type === 'backup') {
        this.onShowDialog()
        this.targetDir = gameDocDir
        this.targetName = gameName
        this.gameDocPath = gameDocPath
        this.targetPatch = path.join(this.homedir, gameDocPath)
        this.backPatch = path.join('./', 'backup', gameDocDir)
        this.tempPatch = path.join('./', 'temp', gameDocDir)
      }
    },
    async handleSearchGames (keywords) {
      this.getGamesList(keywords)
    },
    async handleBackup () {
      this.isLoading = true
      const platform = this.systemType === 'Windows_NT' ? 'zip' : 'tar'

      // 复制存档到 当前软件运行目录下的 <temp>目录
      const [error, isCopySuccess] = await copy(this.targetPatch, this.tempPatch)
      console.log('isCopySuccess:', isCopySuccess)
      if (error) {
        console.log(`错误信息:`, error)
        this.isLoading = false
        this.$message.error(`${this.targetPatch},路径目录或文件不存在, 备份失败`)
        return
      }
      // 检查存档目录是否存在
      await ensureDir(this.backPatch)
      const timeStamp = Date.now()
      const fileName = `${this.targetName}_t${timeStamp}`
      // 保存文件路径
      const savePath = path.join(this.backPatch, fileName)
      // 压缩存档
      const [compressError] = await compressDir(this.tempPatch, savePath, platform)
      if (compressError) {
        this.$message.error('备份失败!')
        this.isLoading = false
        return
      }

      await remove(this.tempPatch)
      // TODO: 备份信息录入 数据库(games-back.db)
      const isAddHistory = await this.$backup.add({
        gameName: this.targetName,
        gameDocDir: this.targetDir,
        gameDocPath: this.gameDocPath,
        fileName: fileName,
        filePath: `${savePath}.${platform}`,
        platformTye: this.systemType,
        fileType: platform,
        timeStamp: timeStamp,
        remask: this.remask
      })

      if (isAddHistory === null) {
        this.$message.error('数据库录入备份信息失败!')
        this.isLoading = false
        return
      }

      // 更新游戏列表中显示的 时间字段
      await this.$games.update({gameDocDir: this.targetDir}, {$set: {lastBackTime: timeStamp}})
      // 刷新游戏列表(单个或整个列表)
      await this.getGamesList()
      this.$message.success('备份成功!')
      this.isLoading = false
      this.dialogVisible = false
      this.remask = ''
    },
    handleOpenDir (type, dirPath) {
      const fullPath = type === 'back' ? path.join(this.rootDir, dirPath) : dirPath
      this.$electron.shell.showItemInFolder(fullPath)
    }
  }
}
</script>

<style type="text/scss" lang="scss">
 @import './../sass/_tools.scss';
.el-main {
  text-align: center;
}

.card-box {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  justify-content: flex-start;
}

.el-buttons-gorund {
  margin-top: 20px;
}
</style>