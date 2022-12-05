
import { FileItem } from '@/model'
// https://www.npmjs.com/package/rd
const rd = require('rd')
// eslint-disable-next-line no-unused-vars
const md5 = require('md5')

/**
 * 扫描路径下的目录列表(文件夹+文件)
 *
 * @param {String} filePath 扫描输入路径
 * @returns {Promise<Array<FileItem>>}
 */
export function getDirectoryItem (filePath: string): Promise<FileItem[]> {
  const fileDetailedList: FileItem[] = []

  return new Promise(resolve => {
    rd.each(
      filePath,
      function (fileFullPath: string, stats: any, next: Function) {
        const splitArray = fileFullPath.split('\\')
        const [basename] = splitArray.slice(-1)
        const [dirname] = splitArray.slice(-2)
        fileDetailedList.push({
          type: stats.isFile() ? 'file' : 'directory',
          path: fileFullPath,
          dirname,
          basename,
          size: stats.size,
          ctimeStamp: stats.ctimeMs,
          // 修改时间
          timeStamp: stats.mtimeMs
        } as FileItem)

        next()
      },
      function () {
        // 完成
        resolve(fileDetailedList)
      }
    )
  })
}

/**
 * 获取文件夹列表
 *
 * @param list <FileItem>
 * @returns Array<dir>
 */
export function getDirItems (list: FileItem[]) {
  return list.filter(f => f.type === 'directory')
}

/**
 * 获取文件列表
 *
 * @param list <FileItem>
 * @returns Array<file>
 */
export function getFileItems (list: FileItem[]) {
  return list.filter(f => f.type === 'file')
}
