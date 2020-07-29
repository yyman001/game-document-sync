/*
 * @Author: your name
 * @Date: 2020-07-28 21:17:49
 * @LastEditTime: 2020-07-29 22:30:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\utils\index.js
 */ 

const fs = require('fs')

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
    scanList.forEach(({ gameDocDir, gameCompany }) => {
        keyMap[gameDocDir] = configList.map((path) => {
            return path.replace(/{userName}/, userName)
                .replace(/{gameName}/, gameDocDir)
                // 为了设置过滤标识,给后面的filter过滤掉这个无用path
                .replace(/{gameCompany}/, gameCompany || '{filter}')
        })
            .filter((path) => !/{filter}/.test(path))
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


module.exports = {
    initScanPath,
    filterInvalidPath
}