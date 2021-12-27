<template>
  <div>
    <div class="backup-content">

      <a-row>
        <a-input :disabled="true" addon-before="存档路径:" :value="docPatch">
          <a-icon slot="addonAfter" type="folder-open" @click="openItem(docPatch)"/>
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备份路径:" :value="backPatch">
          <a-icon slot="addonAfter" type="setting" />
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备注:" v-model:value="remask">
        </a-input>
      </a-row>

    </div>

    <div class="steps-action">
      <a-button @click="$emit('handleClose')"> 取消 </a-button>
      <a-button :disabled="loading" type="primary" @click="onStartBackup">
        备份
      </a-button>
    </div>

  </div>
</template>

<script>
import { ref, toRefs } from '@vue/composition-api'
import useConfig from '../../comApi/useConfig'
import useBackupFile from '../../comApi/useBackupFile'
import useBackup from '../../comApi/useBackup'
import useGames from '../../comApi/useGames'
import useMessage from '../../comApi/useMessage'
import { openItem } from '../../utils/shell'
const path = require('path')

export default {
  name: 'modal-backup',
  props: {
    // 进度
    pression: {
      type: Number,
      default: 0
    },
    // 存档路径
    gameDocPath: String,
    // 存档文件夹
    gameDocDir: String
  },
  setup (props, context) {
    const { gameDocPath, gameDocDir } = toRefs(props)
    const { homedir, rootDir, systemType } = useConfig()
    const { messageSuccess, messageError } = useMessage()
    const { searchGame } = useGames()
    const { addBackup } = useBackup()
    const { backupFile } = useBackupFile()

    const remask = ref('')
    const loading = ref(false)
    // eslint-disable-next-line no-unused-vars
    const progress = ref(0) // 进度条
    const docPatch = path.join(homedir.value, gameDocPath.value)
    const backPatch = path.join(rootDir.value, 'backup', gameDocDir.value)
    const tempPatch = path.join(rootDir.value, 'temp', gameDocDir.value)

    const onStartBackup = async () => {
      loading.value = true
      const game = await searchGame(gameDocDir.value)
      if (!game) return messageError('查找游戏数据异常!')

      const [errorText, backupData] = await backupFile({docPatch, tempPatch, backPatch, gameDocDir: gameDocDir.value})
      if (errorText) {
        messageError(errorText)
        return
      }

      const backupWriteResult = await addBackup({
        steamId: game.steamId,
        gameName: game.gameName,
        gameDocDir: gameDocPath.value,
        gameDocPath: gameDocPath.value,
        fileName: backupData.fileName,
        filePath: `${backupData.savePath}.${backupData.platform}`,
        platformTye: systemType.value,
        fileType: backupData.platform,
        timeStamp: backupData.timeStamp,
        remask: remask.value
      })

      if (backupWriteResult === null) {
        messageError('添加备份历史记录失败!')
        return
      }

      loading.value = false
      messageSuccess('备份成功!')
      context.emit('handleClose')
    }

    return {
      docPatch,
      backPatch,
      onStartBackup,
      remask,
      loading,
      openItem
    }
  }
}
</script>

<style>
.ant-row {
  margin-bottom: 10px;
}
</style>