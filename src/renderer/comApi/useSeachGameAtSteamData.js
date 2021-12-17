import Axios from 'axios'
import { ref, reactive } from '@vue/composition-api'
import useConfig from './useConfig'
const fs = require('fs-extra')
const path = require('path')

export default function () {
  const { rootDir } = useConfig()
  const steamAppData = reactive({ data: [] })
  const searchResult = ref([])
  const loading = ref(false)

  // 用于本地开发测试
  const readLoaclAppData = () => {
    try {
      const appPath = path.join(rootDir.value, '/static/app.json')
      fs.readJSON(appPath)
        .then((data) => {
          steamAppData.data = data.applist.apps
          console.log('#### 加载完毕 ####')
        })
        .catch((e) => e)
    } catch (error) {
      console.error(error)
    }
  }

  const featSteamApp = () => {
    if (loading.value) return
    loading.value = true
    // TODO: 处理跨域 or 使用别的方法提供这个文件更新
    Axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
      .then((data) => {
        steamAppData.data = data.applist.apps
      })
      .catch((e) => e)
      .finally(() => {
        loading.value = false
      })
  }

  const searchAppGames = (keyword) => {
    const regExp = new RegExp(keyword, 'i')
    searchResult.value = steamAppData.data.filter((game) => {
      return regExp.test(game.name) || game.appid === Number(keyword)
    })
  }

  return {
    loading,
    searchResult,
    readLoaclAppData,
    featSteamApp,
    searchAppGames
  }
}
