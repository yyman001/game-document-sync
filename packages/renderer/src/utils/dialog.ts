// https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
// import { dialog } from 'electron'
const { dialog } = require('electron')

export function showOpenDialog ({
  title = '',
  defaultPath = '',
  openFileType = '',
  properties = ['openFile']
} = {}) {
  let filters
  if (openFileType === 'rar') {
    filters = [{ name: '压缩存档', extensions: ['zip', 'tar', 'tgz'] }]
  } else if (openFileType === 'config') {
    filters = [{ name: '配置文件', extensions: ['json'] }]
  }

  return dialog.showOpenDialog({ title, defaultPath, filters, ...properties })
}
