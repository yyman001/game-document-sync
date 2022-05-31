/*
 * @Description: 获取window下游戏存档
 * @Author: your name
 * @Date: 2019-08-15 22:21:46
 * @LastEditTime: 2019-08-19 23:27:58
 * @LastEditors: Please set LastEditors
 */
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

let game_doc_path = 'C:\\Users\\lenovo\\Documents\\My Games'
let game_profiles_path = `C:\Users\lenovo\Saved Games`
const FileClass = require('./../src/utils/FileClass')


let file_list = FileClass.readdirSync(game_doc_path)
console.log('file_list:', file_list);