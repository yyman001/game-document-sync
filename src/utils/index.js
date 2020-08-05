/*
 * @Author: your name
 * @Date: 2020-07-28 21:17:49
 * @LastEditTime: 2020-07-30 22:41:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\utils\index.js
 */ 

const fs = require('fs')
const rd = require('rd')
const md5 = require('md5')
const path = require("path")

/**
 * 初始化扫描路径
 *
 * @param {Array} [scanList=[]]
 * @param {Array} [configList=[]]
 * @param {string} [userName='']
 * @returns
 */

function initScanPath(scanList = [], configList = [], userName = '') {
    let keyMap = Object.create(null)
    scanList.forEach(({ gameDocDir }) => {
        keyMap[gameDocDir] = configList.map((scanPath) => {
            const temp_path = scanPath.replace(/{userName}/, userName).replace(/{gameDocDir}/, gameDocDir.replace('|', '/'))
            return path.join(temp_path) 
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
function filterInvalidPath(scanList = [], scanPath = {}) {
    return scanList.reduce((gather, { gameDocDir }) => {

        let configList = scanPath[gameDocDir] || []

        configList.some((gameDocPath) => {

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
function getInvalidPath (scanList = [], scanPath = {}) {
    return scanList.reduce((gather, item) => {
        let { gameDocDir } = item
        let configList = scanPath[gameDocDir] || []

        configList.some((gameDocPath) => {

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
 * 返回扫描文件清单结果
 *
 * @param {*} validPathList 需要扫描的清单文件的数组
 * @returns
 */
function createGameDocDetailed (validPathList) {

    return validPathList.map((item) => {
      let {gameDocPath} = item
      let fileDetailedList = []
      
      rd.eachSync(gameDocPath, function (fileFillPath, stats) {
        // 每找到一个文件都会调用一次此函数
        // 参数s是通过 fs.stat() 获取到的文件属性值
        let isFile = stats.isFile()
        let md5Key = ''
        if (isFile){
          md5Key = md5(fs.readFileSync(fileFillPath))
        }
        
        fileDetailedList.push({
          isFile,
          path: fileFillPath,
          md5: md5Key,
          size: stats.size
        })
      })
  
      return {
        ...item,
        fileDetailedList
      }
    })
  }

module.exports = {
    initScanPath,
    filterInvalidPath,
    getInvalidPath,
    createGameDocDetailed
}