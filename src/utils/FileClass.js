/* eslint-disable */
/*
 * @Description: 文件操作类
 * @Author: your name
 * @Date: 2019-08-16 00:57:03
 * @LastEditTime: 2020-07-30 22:24:47
 * @LastEditors: Please set LastEditors
 */
const fs = require('fs-extra')

/**
 *
 *
 * @param {*} src
 * @param {*} dest
 * @param {boolean} [is_overwrite=true]
 */
async function move (src, dest, is_overwrite = true) {
  try {
    await fs.move(srcpath, dstpath, {overwrite: is_overwrite})
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *
 * @param {*} [file_path=__dirname]
 * @param {string} [file_content='file_conetent']
 */
async function outputFile (file_path = __dirname, file_content = 'file_conetent') {
  try {
    await fs.outputFile(file_path, file_content)

    const data = await fs.readFile(file_path, 'utf8')

    console.log(data) // => file_conetent!
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *
 * @param {*} file_path
 */
async function readJson (file_path) {
  try {
    const packageObj = await fs.readJson(file_path)

    console.log('readJson:', packageObj) // => 0.1.3
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *
 * @param {*} file_path
 * @param {*} file_buffer
 */
async function outputJson (file_path, file_buffer) {
  try {
    await fs.outputJson(file_path, file_buffer)

    const data = await fs.readJson(file_path)

    console.log(`文件: ${file_path} 写入成功!`) // => JP
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *
 * @param {*} dir_path
 * @returns
 */
 function readdirSync (dir_path) {
  try {
    return fs.readdirSync(dir_path)
  } catch (error) {
    console.error(error)
  }
}


/**
 *
 *
 * @param {*} copy_path
 * @param {*} save_path
 * @param {*} filter_funtion
 * @returns
 */
async function copy (copy_path, save_path, filter_funtion) {
  try {
    console.log('copy_path:', copy_path)
    console.log('save_path:', save_path)
    await fs.copy(copy_path, save_path, {filter: filter_funtion})
    console.log(`copy ${copy_path} is success!`)
    return [null, true]
  } catch (err) {
    // todo 错误信息写入到日志文件
    console.error(err)
    return [err, false]
  }
}

/* 
  确保写入文件夹
* @param {string} directory - 文件夹路径
*/
async function ensureDir (directory) {
  try {
    await fs.ensureDir(directory)
  } catch (err) {
    console.error(err)
  }
}

export default {
  move,
  readJson,
  outputJson,
  outputFile,
  readdirSync,
  copy,
  ensureDir
}