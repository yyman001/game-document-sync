import { ipcRenderer } from 'electron'

export interface IpcParameter {
  // 调用模块名
  modName?: string
  // 调用函数名
  functionName: string
  data: any
}

export interface dialogParameter {
  // 窗口标题
  title?: string
  // 打开文件类型, 空则打开"文件夹"
  openFileType?: string
}

// api: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
export const showOpenDialog = async ({
  title = '',
  openFileType = ''
} = {} as dialogParameter) => {
  let filters
  let properties
  if (openFileType === 'rar') {
    filters = [{ name: '压缩存档', extensions: ['zip', 'tar', 'tgz'] }]
    properties = ['openFile']
  } else if (openFileType === 'config') {
    filters = [{ name: '配置文件', extensions: ['json'] }]
    properties = ['openFile']
  } else if (openFileType === 'exe') {
    filters = [{ name: '应用程序', extensions: ['exe'] }]
    properties = ['openFile']
  } else {
    properties = ['openDirectory']
  }

  const { canceled, filePaths } = await ipcRenderer.invoke('ipc', [{ functionName: 'showOpenDialog', data: { title, properties, filters } }])
  if (canceled) return ''
  return filePaths.pop()
}
