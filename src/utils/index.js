/*
 * @Author: your name
 * @Date: 2020-07-28 21:17:49
 * @LastEditTime: 2020-07-28 21:57:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\utils\index.js
 */ 



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



 module.exports = {
    initScanPath
 }