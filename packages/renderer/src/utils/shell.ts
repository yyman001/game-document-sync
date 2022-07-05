// 文档#https://www.electronjs.org/zh/docs/latest/api/shell
import { shell } from 'electron'
/**
 * 以默认打开方式打开文件.
 *
 * @param {String} fullPath
 */
export function openItem(fullPath: string) {
  try {
    shell.openPath(fullPath)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 打开文件所在文件夹,一般情况下还会选中它.
 *
 * @param {String} fullPath
 */
export function showItemInFolder(fullPath: string) {
  try {
    shell.showItemInFolder(fullPath)
  } catch (error) {
    console.error(error)
  }
}

/**
 *以系统默认设置打开外部协议.(例如,mailto: [email protected]会打开用户默认的邮件客户端)

 * @param {String} url
 */
export function openExternal(url: string) {
  try {
    shell.openExternal(url)
  } catch (error) {
    console.error(error)
  }
}

/**
 *删除指定路径文件,并返回此操作的状态值(boolean类型).

 * @param {String} fullPath
 * @return {Boolean} isDeleSuccess
 */
export function moveItemToTrash(fullPath: string) {
  try {
    return shell.trashItem(fullPath)
  } catch (error) {
    console.error(error)
  }
}
