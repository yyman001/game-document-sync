import { ipcRenderer } from 'electron'

export interface IpcParameter {
  // 调用模块名
  modName?: string
  // 调用函数名
  functionName: string
  data: any
}

export const showOpenDialog = async () => {
  const { canceled, filePaths } = await ipcRenderer.invoke('ipc', [{ functionName: 'showOpenDialog', data: { properties: ['openDirectory'] } }])
  if (canceled) return ''
  return filePaths.pop()
}
