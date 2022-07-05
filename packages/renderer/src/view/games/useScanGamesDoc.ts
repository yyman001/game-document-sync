import { Ref, ref, unref, watch } from 'vue'
import useSystem from '@/hooks/core/useSystem'
import path from 'path'
import { GameItem } from '@/model'
const fs = require('fs-extra')

export default function (gameList: Readonly<Ref<any>>) {
  const { HOME_DIR } = useSystem()

  const isLoading = ref(false)
  const setLoading = (status:boolean) => {
    isLoading.value = status
  }

  const mapGames = ref<string[]>([])
  const clearMapGames = () => {
    mapGames.value = []
  }
  const scanGames = async (docList: GameItem[]) => {
    if (unref(isLoading)) return

    setLoading(true)
    clearMapGames()

    for (let i = 0; i < docList.length; i++) {
      // TODO: 目前先判断是否有 存档目录, 后面精确到某个文件的存档再另外确定字段
      const { gameDocDir, gameDocPath } = docList[i]
      const docPath = path.join(HOME_DIR, gameDocPath)
      const exists = await fs.pathExists(docPath)
      exists && mapGames.value.push(gameDocDir)
    }

    setLoading(false)
  }

  const refreshScanGames = () => {
    scanGames(unref(gameList))
  }

  const hasGameDoc = (gameDocDir: string) => {
    return unref(mapGames).includes(gameDocDir)
  }

  watch(() => unref(gameList), (gameList) => {
    scanGames(unref(gameList))
  })

  return {
    isLoading,
    setLoading,
    hasGameDoc,
    refreshScanGames
  }
}
