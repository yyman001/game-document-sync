/*
 * @Description: 文件操作类
 * @Author: your name
 * @Date: 2019-08-16 00:57:03
 * @LastEditTime: 2019-08-19 23:58:33
 * @LastEditors: Please set LastEditors
 */
const fs = require('fs-extra')
const path = require('path')

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
    await fs.outputJson(file_path, {name: 'JP'})

    const data = await fs.readJson(file_path)

    console.log(data.name) // => JP
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

module.exports = {
  copy,
  move,
  readdirSync,
  outputFile,
  readJson,
  outputJson
}