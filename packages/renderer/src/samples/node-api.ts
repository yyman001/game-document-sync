import { lstat } from 'fs/promises'
import { cwd } from 'process'
import { ipcRenderer } from 'electron'
import { getAppDirPath } from '@/utils/index'

// Usage of ipcRenderer.on
ipcRenderer.on('main-process-message', (_event, APP_HOME_DIR) => {
  console.log('[Receive Main-process message]:', APP_HOME_DIR)
  if (window) (window as any).APP_HOME_DIR = getAppDirPath(APP_HOME_DIR)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})
