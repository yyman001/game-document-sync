/*
 * @Author: your name
 * @Date: 2020-07-28 21:17:49
 * @LastEditTime: 2020-07-30 22:41:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\utils\index.js
 */

import { FileItem } from '@/model'

const fs = require('fs')
// https://www.npmjs.com/package/rd
const rd = require('rd')
// eslint-disable-next-line no-unused-vars
const md5 = require('md5')
const path = require('path')

/**
 * 初始化扫描路径
 *
 * @param {Array} [scanList=[]]
 * @param {Array} [configList=[]]
 * @param {string} [userName='']
 * @returns
 */

export function initScanPath (scanList = [], configList = [], userName = '') {
  const keyMap = Object.create(null)
  scanList.forEach(({ gameDocDir }) => {
    keyMap[gameDocDir] = configList.map(scanPath => {
      const tempPath = scanPath
        .replace(/{userName}/, userName)
        .replace(/{gameDocDir}/, gameDocDir.replace('|', '/'))
      return path.join(tempPath)
    })
  })

  return keyMap
}

/**
 * 过滤无效的扫描路径
 *
 * @param {Array} scanList 扫描路径数组
 * @param {Object} scanPath 路径集合对象
 * @returns {Object} 返回有效的路径集合对象
 */
export function filterInvalidPath (scanList = [], scanPath = {}) {
  return scanList.reduce((gather, { gameDocDir }) => {
    const configList = scanPath[gameDocDir] || []

    configList.some(gameDocPath => {
      if (fs.existsSync(gameDocPath)) {
        gather[gameDocDir] = gameDocPath
        return true
      }

      return false
    })

    return gather
  }, Object.create(null))
}

/**
 * 获取有效路径
 *
 * @param {*} [scanList=[]]
 * @param {*} [scanPath={}]
 * @returns 返回有效路径数组
 */
export function getInvalidPath (scanList = [], scanPath = {}) {
  return scanList.reduce((gather, item) => {
    const { gameDocDir } = item
    const configList = scanPath[gameDocDir] || []

    configList.some(gameDocPath => {
      if (fs.existsSync(gameDocPath)) {
        gather[gameDocDir] = gameDocPath
        gather.push({
          ...item,
          gameDocPath
        })
        return true
      }

      return false
    })

    return gather
  }, [])
}

/**
 * 扫描路径下的目录列表(文件夹+文件)
 *
 * @param {String} filePath 扫描输入路径
 * @returns {Promise<Array>}
 */
export function getDirectoryItem (filePath: string) {
  const fileDetailedList = []

  return new Promise(resolve => {
    rd.each(
      filePath,
      function (fileFullPath, stats, next) {
        const splitArray = fileFullPath.split('\\')
        const [basename] = splitArray.slice(-1)
        const [dirname] = splitArray.slice(-2)
        fileDetailedList.push({
          type: stats.isFile() ? 'file' : 'directory',
          path: fileFullPath,
          dirname,
          basename,
          size: stats.size,
          timeStamp: stats.ctimeMs
        })
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
