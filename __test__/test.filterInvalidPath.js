/*
 * @Description: 根据扫描列表, 返回有效扫描地址
 * @Author: your name
 * @Date: 2019-08-15 21:59:42
 * @LastEditTime: 2020-07-29 22:37:51
 * @LastEditors: Please set LastEditors
 */

const config = require('../src/config/scan.config.json')
const { scanList } = require('./scan')
const { initScanPath, filterInvalidPath } = require('../src/utils/index')

const userName = 'lenovo'
const scanPath = initScanPath(scanList, config, userName)
const valid =  filterInvalidPath(scanList, scanPath)
console.log('valid', valid);
