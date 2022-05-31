// https://wizardforcel.gitbooks.io/electron-doc/content/api/dialog.html
import { remote } from 'electron'

export function showOpenDialog ({title = '', defaultPath = '', filters = [{ name: '压缩存档', extensions: ['zip', 'tar', 'tgz'] }], properties = ['openFile']} = {}) {
  return remote.dialog.showOpenDialog({title, defaultPath, filters, properties})
}
