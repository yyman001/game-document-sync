import { ref, unref } from 'vue'
import { message } from 'ant-design-vue'
import path from 'path'
import useSystem from '../core/useSystem'

export default function (gameDocPath:string, gameDocDir:string, saveFiles:string[]) {
  const rootDir = ''
  const { HOME_DIR, SYSTEM_TYPE } = useSystem()
  const { success: messageSuccess, error: messageError } = message

  const { searchGame } = useGames()
  const { addBackup } = useBackup()
  const { backupFile } = useBackupFile()

  const remask = ref('')
  const loading = ref(false)
  // eslint-disable-next-line no-unused-vars
  const progress = ref(0) // 进度条
  const docPatch = path.join(HOME_DIR, gameDocPath)
  const backPatch = path.join(rootDir, 'backup', gameDocDir)
  const tempPatch = path.join(rootDir, 'temp', gameDocDir)

  const onStartBackup = async () => {
    if (!unref(saveFiles).length) return messageError('请勾选要备份的文件!')

    loading.value = true
    const game = await searchGame(gameDocDir)
    if (!game) return messageError('查找游戏数据异常!')

    const [errorText, backupData] = await backupFile({ docPatch, tempPatch, backPatch, gameDocDir: gameDocDir.value, saveFiles: unref(saveFiles) })
    if (errorText) {
      messageError(errorText)
      return
    }

    // TODO: 只保留 备注, 其他在读取本地列表和云列表的时候重新更新
    const backupWriteResult = await addBackup({
      steamId: game.steamId,
      gameName: game.gameName,
      gameDocDir,
      gameDocPath,
      fileName: backupData.fileName,
      filePath: `${backupData.savePath}.${backupData.platform}`,
      platformTye: SYSTEM_TYPE,
      fileType: backupData.platform,
      timeStamp: backupData.timeStamp,
      remask: unref(remask)
    })

    if (backupWriteResult === null) {
      messageError('添加备份历史记录失败!')
      return
    }

    loading.value = false
    messageSuccess('备份成功!')
  }

  return {
    docPatch,
    backPatch,
    onStartBackup,
    remask,
    loading
  }
}
