import { Ref, ref, unref, watch } from 'vue'
import useSystem from '@/hooks/core/useSystem'
import { GameItem } from '@/model'
import { getPath } from '@/utils/index'
const fs = require('fs-extra')
interface GameInfo {
  id: string;
  hasGameAppPath: boolean;
  hasGameDoc: boolean;
}

export default function (gameList: Readonly<Ref<any>>) {
  const { HOME_DIR } = useSystem()

  const isLoading = ref(false)
  const setLoading = (status:boolean) => {
    isLoading.value = status
  }

  const mapGames = ref<GameInfo[]>([])
  const clearMapGames = () => {
    mapGames.value = []
  }

  const scanGames = async (docList: GameItem[]) => {
    if (unref(isLoading)) return

    setLoading(true)
    clearMapGames()

    for (let i = 0; i < docList.length; i++) {
      // TODO: 目前先判断是否有 存档目录, 后面精确到某个文件的存档再另外确定字段
      const { pathType, gameDocDir, gameDocPath, gameAppPath } = docList[i]

      const docPath = getPath(pathType === 'PUBLIC' ? 'C:\\Users\\Public' : HOME_DIR, gameDocPath)
      // 判断配置游戏是否存在
      const gameInfo: GameInfo = {
        id: gameDocDir,
        hasGameAppPath: false,
        hasGameDoc: false
      }

      // 判断游戏路径是否存在
      if (gameAppPath) {
        const exists = await fs.pathExists(gameAppPath)
        gameInfo.hasGameAppPath = exists
      }

      // 判断存档
      const exists = await fs.pathExists(docPath)
      gameInfo.hasGameDoc = exists
      mapGames.value.push(gameInfo)
    }

    setLoading(false)
  }

  const refreshScanGames = () => {
    scanGames(unref(gameList))
  }

  const hasGameDoc = (gameDocDir: string) => {
    const game = mapGames.value.find((item:any) => item.id === gameDocDir)
    return game?.hasGameDoc || false
  }

  const hasGamePath = (gameDocDir: string) => {
    const game = mapGames.value.find((item:any) => item.id === gameDocDir)
    return game?.hasGameAppPath || false
  }

  watch(() => unref(gameList), (gameList) => {
    scanGames(unref(gameList))
  })

  return {
    isLoading,
    setLoading,
    hasGameDoc,
    hasGamePath,
    refreshScanGames
  }
}
