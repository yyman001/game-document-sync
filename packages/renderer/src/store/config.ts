import { getBackupPath, getTempPath } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
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

  const initConfig = () => {
    setDefaultTempPath()
    setDefaultBackPath()
  }

  return {
    initConfig,

    tempPath,
    setTempPath,
    setDefaultTempPath,

    backPath,
    setBackPath,
    setDefaultBackPath
  }
})

export const useConfigStoreWhitOut = () => {
  return useConfigStore()
}
