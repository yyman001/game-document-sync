/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 23:41:39
 * @LastEditTime: 2019-08-19 23:24:48
 * @LastEditors: Please set LastEditors
 */
// https://github.com/jprichardson/node-fs-extra/blob/master/docs/readJson.md

const path = require('path')
const FileClass = require('./../src/utils/FileClass')
FileClass.readJson(path.join('./doc/game.file.config.json'))