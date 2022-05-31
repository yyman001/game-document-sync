/*
 * @Description: 拷贝&过滤文件测试
 * @Author: your name
 * @Date: 2019-08-15 21:59:42
 * @LastEditTime: 2020-07-23 22:06:05
 * @LastEditors: Please set LastEditors
 */

// eg: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md

const path = require('path')
const FileClass = require('./../src/utils/FileClass')

let test_dir  = path.join(__dirname, `test_data`)
let copy_path = path.join(test_dir, 'orgin')
let save_path = path.join(test_dir, 'test_copy_filter')

let filter_file = ['test.dat']

// filter file by filter list
const filterFunc = (input, out) => {
  let object_path = path.parse(input)
  return !filter_file.includes(object_path.base)
}

async function run() {
  const [error, is_copy_success] = await FileClass.copy(copy_path, save_path, filterFunc)
  if (error) {
    console.log(`错误信息:`, error)
  }
}

run()
