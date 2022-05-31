/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 23:40:34
 * @LastEditTime: 2019-08-19 23:32:18
 * @LastEditors: Please set LastEditors
 */
// https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md

const path = require('path')
const FileClass = require('./../src/utils/FileClass')

FileClass.outputJson(path.join('test.outputJson.json'))