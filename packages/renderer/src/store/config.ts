import { getAppPath, getDefaultBackupPath, getPath, getTempPath } from '@/utils'
import { defineStore } from 'pinia'
import { ref, unref, watch } from 'vue'
import useCloudConfig from '@/hooks/cloud/useCloudConfig'

export const useConfigStore = defineStore('config', () => {
  const { loadConfig } = useCloudConfig()

  const tempPath = ref('')
  const setTempPath = (path: string) => {
    tempPath.value = path
    localStorage.setItem('_custom_temp_path', path)
  }
  const setDefaultTempPath = () => {
    setTempPath(getTempPath())
  }

  const backPath = ref('')
  const setBackPath = (path: string) => {
    backPath.value = path
    localStorage.setItem('_custom_back_path', path)
  }
  // 改名为恢复默认路径
  const setDefaultBackPath = () => {
    setBackPath(getDefaultBackupPath())
  }
  const getBackupPath = (...param:any) => {
    return getPath(unref(backPath), ...param)
  }

  // 配置文件名
  const configFileName = 'cloud.config.json'
  const configFilePath = ref('')
  const setConfigFilePath = (path:string) => {
    configFilePath.value = path
  }
  const setDefalutConfigPath = () => {
    const path = getAppPath(configFileName)
    setConfigFilePath(path)
  }

  const initConfig = () => {
    const customBackPath = localStorage.getItem('_custom_back_path')
    const customTempPath = localStorage.getItem('_custom_temp_path')
    customTempPath ? setTempPath(customTempPath) : setDefaultTempPath()
    customBackPath ? setBackPath(customBackPath) : setDefaultBackPath()
    setDefalutConfigPath()
  }

  watch(() => unref(configFilePath), (value) => {
    console.log('*****watch:configFilePath******', value)
    loadConfig(unref(configFilePath))
  })

  return {
    initConfig,

    tempPath,
    setTempPath,
    setDefaultTempPath,

    backPath,
    setBackPath,
    getBackupPath,
    setDefaultBackPath,

    configFilePath,
    setConfigFilePath,
    setDefalutConfigPath
  }
})

export const useConfigStoreWhitOut = () => {
  return useConfigStore()
}
