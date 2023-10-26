import { ref, unref } from 'vue'
import { message } from 'ant-design-vue'
import useSystem from '@/hooks/core/useSystem'
import useBackup from '@/hooks/db/useBackup'
import { backupFile, BackupFileData } from '@/utils/file'
import { useConfigStoreWhitOut } from '@/store/config'
import { getGamesDocInfo } from '@/utils/firebase/sdk'

export default function () {
  const { HOME_DIR, SYSTEM_TYPE } = useSystem()
  const { success: messageSuccess, error: messageError } = message
  const useConfigStore = useConfigStoreWhitOut()

  const { addBackup } = useBackup()

  const remask = ref('')
  const loading = ref(false)
  // eslint-disable-next-line no-unused-vars
  const progress = ref(0) // 进度条

  const onStartBackup = async ({ docPath, backPath, gameDocPath, gameDocDir, saveFiles }:any) => {
    const tempPath = useConfigStore.getTempPath(gameDocDir)

    if (!saveFiles.length) return messageError('请勾选要备份的文件!')

    loading.value = true
    const gameData = await getGamesDocInfo(gameDocDir)
    if (!gameData) return messageError('未查找游戏数据!')

    const [errorText, backupData] = await backupFile({ HOME_DIR, docPath, tempPath, backPath, gameDocDir, saveFiles }) as BackupFileData
    if (errorText || !backupData) {
      messageError(errorText as string)
      return
    }

    // TODO: 只保留 备注, 其他在读取本地列表和云列表的时候重新更新
    // TODO: 重新设计文件详细信息到备份列表到谷歌数据库
    const backupWriteResult = await addBackup({
      steamId: gameData.steamId,
      gameName: gameData.gameName,
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
