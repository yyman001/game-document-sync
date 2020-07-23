/*
 * @Description: 拷贝文件测试
 * @Author: your name
 * @Date: 2019-08-15 21:59:42
 * @LastEditTime: 2020-07-23 22:04:40
 * @LastEditors: Please set LastEditors
 */

// eg: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md

const path = require('path')
const FileClass = require('./../src/utils/FileClass')

let test_dir  = path.join(__dirname, `test_data`)
let copy_path = path.join(test_dir, 'orgin')
let save_path = path.join(test_dir, 'test_copy')

async function run() {

  const [error, is_copy_success] = await FileClass.copy(copy_path, save_path)
  if (error) {
    console.log(`错误信息:`, error)
  }
}

run()
