import { ref, unref } from 'vue'
import { message } from 'ant-design-vue'
import useSystem from '../core/useSystem'
import useGames from '@/hooks/db/useGames'
import useBackup from '@/hooks/db/useBackup'
import { backupFile } from '@/utils/file'
import { getTempPath } from '@/utils/index'

export default function () {
  const { HOME_DIR, SYSTEM_TYPE } = useSystem()
  const { success: messageSuccess, error: messageError } = message

  const { searchGame } = useGames()
  const { addBackup } = useBackup()

  const remask = ref('')
  const loading = ref(false)
  // eslint-disable-next-line no-unused-vars
  const progress = ref(0) // 进度条

  const onStartBackup = async ({ docPath, backPath, gameDocPath, gameDocDir, saveFiles }:any) => {
    const tempPath = getTempPath(gameDocDir)

    if (!saveFiles.length) return messageError('请勾选要备份的文件!')

    loading.value = true
    const game = await searchGame(gameDocDir)
    if (!game) return messageError('未查找游戏数据!')

    const [errorText, backupData] = await backupFile({ HOME_DIR, docPath, tempPath, backPath, gameDocDir, saveFiles })
    if (errorText) {
      messageError(errorText as string)
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
    onStartBackup,
    remask,
    loading
  }
}
