import { getAppPath, getBackupPath, getTempPath } from '@/utils'
import { defineStore } from 'pinia'
import { ref, unref, watch } from 'vue'
import useCloudConfig from '@/hooks/cloud/useCloudConfig'

export const useConfigStore = defineStore('config', () => {
  const { loadConfig } = useCloudConfig()

  const tempPath = ref('')
  const setTempPath = (path: string) => {
    tempPath.value = path
  }
  const setDefaultTempPath = () => {
    setTempPath(getTempPath())
  }

  const backPath = ref('')
  const setBackPath = (path: string) => {
    backPath.value = path
  }
  const setDefaultBackPath = () => {
    setBackPath(getBackupPath())
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
    setDefaultTempPath()
    setDefaultBackPath()
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
    setDefaultBackPath,

    configFilePath,
    setConfigFilePath,
    setDefalutConfigPath
  }
})

export const useConfigStoreWhitOut = () => {
  return useConfigStore()
}
