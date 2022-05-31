/*
 * @Description: 根据扫描列表获取扫描文件详细内容测试
 * @Author: your name
 * @Date: 2019-08-15 21:59:42
 * @LastEditTime: 2020-07-30 22:41:42
 * @LastEditors: Please set LastEditors
 */
const os = require('os')
const USER_INFO = require('../src/utils/systemUserInfo')
const path = require('path')
const FileClass = require('./../src/utils/FileClass')
const config = require('../src/config/scan.config.json')
const { scanList } = require('./scan')
const { initScanPath, createGameDocDetailed, getInvalidPath } = require('../src/utils/index')

/* 
TODO: 后面"C:\\Users\\{userName}\\Saved Games\\{gameDocDir}"
改为: {userHomedir}\\Saved Games\\{gameDocDir}"
因为之前的路径写死了C盘, 用户有可能修改了这个路径
*/ 

const userName = USER_INFO.getSystemUserInfo().username
const scanPath = initScanPath(scanList, config, userName)
const validPathList =  getInvalidPath(scanList, scanPath)
const list = createGameDocDetailed(validPathList)
if (!list.length) {
  console.log('未扫描到相关游戏存档!')
  return
}
FileClass.outputJson(path.join(__dirname, 'test_data', 'fileDetailed.json'), list)