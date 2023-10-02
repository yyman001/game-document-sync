import { defineStore } from 'pinia'
import { computed, ref, unref, watch } from 'vue'
import path from 'path'
import useModal from '@/hooks/useModal'
import { getPathType } from '@/utils/getPathType'

export const useDocForm = defineStore('doc-form', () => {
  const { isVisible, onModalOpen, onModalClose } = useModal()

  const steamId = ref('')
  const gameName = ref('')
  const nickName = ref('')
  const gameDocDir = ref('')
  const gameDocPath = ref('')
  const gameDocFullPath = ref('')
  const pathType = ref('')

  const isUpdate = ref(false)
  const setUpdateStatus = (status: boolean = false) => {
    isUpdate.value = status
  }

  /*
  DOC_TYPE 详细内容表
  | APPDATA            | "C:\\Users\\yyman001_cp\\AppData\\Roaming" |
  | DOCUMENTS          | "\\Documents"                              |
  | DOCUMENTS_MY_GAMES | "\\Documents\\My Games"                    |
  | HOME               | "C:\\Users\\yyman001_cp"                   |
  | LOCALAPPDATA       | "C:\\Users\\yyman001_cp\\AppData\\Local"   |
  | PUBLIC             | "C:\\Users\\Public"                        |
  | USERNAME           | "yyman001_cp"                              |
  | USERPROFILE        | "C:\\Users\\yyman001_cp"                   |
  */
  const DOC_TYPE = {
    APPDATA: '\\AppData\\Roaming',
    LOCALAPPDATA: '\\AppData\\Local',
    DOCUMENTS: '\\Documents',
    DOCUMENTS_MY_GAMES: '\\Documents\\My Games',
    USERPROFILE: ''
  }

  const onSetDocForm = (gameItem: any) => {
    steamId.value = gameItem.steamId
    gameName.value = gameItem.gameName
    nickName.value = gameItem.nickName
    gameDocDir.value = gameItem.gameDocDir
    gameDocPath.value = gameItem.gameDocPath
    // todo: 如果 pathType 为空,则通过 gameDocPath 计算出来
    pathType.value = getPathType(gameItem.gameDocPath)
  }

  const onInitDocForm = () => {
    steamId.value = ''
    gameName.value = ''
    nickName.value = ''
    gameDocDir.value = ''
    gameDocPath.value = ''
    gameDocFullPath.value = ''
    pathType.value = ''
  }

  const onCloseDocModal = () => {
    onInitDocForm()
    onModalClose()
  }

  watch(
    () => unref(gameDocFullPath),
    value => {
      if (!value) return

      let pathObject = null
      // 移除前后空格
      let tempPath = value.replace(/^\s+|\s+$/g, '')
      const regex = /%([^%]+)%/
      /* 区分类型
      1. 全路径类型 =>
      2. %变量混合路径类型 =>
     */
      const isFullPath = /\w+:/.test(tempPath)
      console.log('tempPath:', tempPath)
      if (isFullPath) {
        pathObject = path.parse(tempPath)
        // 表达式: \w+:\\users\\\w+?\\ 替换 C:\Users\???\
        gameDocPath.value = pathObject.dir.replace(/\w+:\\users\\\w+?\\/gi, '\\')
        // TODO: 把全路径识别出对应的 DOC_TYPE
      } else if (regex.test(tempPath)) {
        // 提取%中的内容判断类型
        const currentType = tempPath.match(regex)?.slice(-1).pop()
        tempPath = tempPath.replace(/%([^%]+)%/g, '')
        if (currentType) {
          pathType.value = currentType
          tempPath = path.join(DOC_TYPE[currentType as keyof typeof DOC_TYPE], tempPath)
        }

        pathObject = path.parse(tempPath)
        gameDocPath.value = tempPath
        console.log('pathObject:', pathObject)
      } else {
        console.error('分析异常,路径为:', tempPath)
        return
      }

      gameDocDir.value = pathObject.name
      gameName.value = pathObject.name.replace(/_/gi, ' ')
    }
  )

  return {
    isUpdate,
    setUpdateStatus,
    isVisible,
    onModalOpen,
    onModalClose,
    onCloseDocModal,

    pathType,
    steamId,
    gameName,
    nickName,
    gameDocDir,
    gameDocPath,
    gameDocFullPath,

    onInitDocForm,
    onSetDocForm
  }
})

export const useDocFormStoreWhitOut = () => {
  return useDocForm()
}
