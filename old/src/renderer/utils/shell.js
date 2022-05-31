// 文档#https://wizardforcel.gitbooks.io/electron-doc/content/api/shell.html
import { shell } from 'electron'
/**
 * 以默认打开方式打开文件.
 *
 * @param {String} fullPath
 */
export function openItem (fullPath) {
  shell.openItem(fullPath)
}

/**
 * 打开文件所在文件夹,一般情况下还会选中它.
 *
 * @param {String} fullPath
 */
export function showItemInFolder (fullPath) {
  shell.showItemInFolder(fullPath)
}

/**
 *以系统默认设置打开外部协议.(例如,mailto: [email protected]会打开用户默认的邮件客户端)

 * @param {String} url
 */
export function openExternal (url) {
  shell.openExternal(url)
}

/**
 *删除指定路径文件,并返回此操作的状态值(boolean类型).

 * @param {String} fullPath
 * @return {Boolean} isDeleSuccess
 */
export function moveItemToTrash (fullPath) {
  return shell.moveItemToTrash(fullPath)
}
