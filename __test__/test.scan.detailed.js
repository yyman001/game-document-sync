/*
 * @Description: 根据扫描列表获取扫描文件详细内容测试
 * @Author: your name
 * @Date: 2019-08-15 21:59:42
 * @LastEditTime: 2020-07-30 22:41:42
 * @LastEditors: Please set LastEditors
 */

const path = require('path')
const FileClass = require('./../src/utils/FileClass')
const config = require('../src/config/scan.config.json')
const { scanList } = require('./scan')
const { initScanPath, createGameDocDetailed, getInvalidPath } = require('../src/utils/index')

const userName = 'lenovo'
const scanPath = initScanPath(scanList, config, userName)
const validPathList =  getInvalidPath(scanList, scanPath)
const list = createGameDocDetailed(validPathList)

FileClass.outputJson(path.join(__dirname, 'test_data', 'fileDetailed.json'), list)