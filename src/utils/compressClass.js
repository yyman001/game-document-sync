/*
* https://github.com/node-modules/compressing
* */
const compressing = require('compressing')

/**
 * 压缩文件
 *
 * @param entry_path
 * @param out_path
 * @param type
 * @returns {Promise.<*>}
 */
async function compress_dir (entry_path, out_path = 'untitled', type = 'tar') {
  // eg:
  // await compressing.tar.compressDir('nodejs-compressing-demo',
  //   'nodejs-compressing-demo.tar');
  // await compressing.gzip.compressFile('nodejs-compressing-demo.tar',
  //   'nodejs-compressing-demo.tgz');
  if (typeof entry_path !== 'string') {
    console.warn(`must input 'entry_path' & type is string!`)
    return false
  }

  try {
    if (type === 'tar') {
      await compressing.tar.compressDir(entry_path,
        `${out_path}.tar`)
      await compressing.gzip.compressFile(`${out_path}.tar`,
        `${out_path}.tgz`)
    } else if (type === 'zip') {
      return await compressing.zip.compressDir(entry_path, `${out_path}.zip`)
    }

    console.log('compress: success', out_path + type)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * 解压文件
 *
 * @param entry_path
 * @param un_compress_file_path
 * @returns {Promise.<boolean>}
 */
async function un_compress (entry_path, un_compress_file_path) {
  // 解压缩
  try {
    if (entry_path.indexOf('.tar') > -1) {
      await compressing.tar.uncompress(entry_path, un_compress_file_path)
    } else if (entry_path.indexOf('.tgz') > -1) {
      await compressing.gzip.uncompress(`${entry_path}.tgz`, `${un_compress_file_path}.tar`)
      await compressing.tar.uncompress(`${un_compress_file_path}.tar`, `${un_compress_file_path}`)
    } else if (entry_path.indexOf('.zip') > -1) {
      await compressing.zip.uncompress(entry_path, un_compress_file_path)
    }

    console.log('un_compress: success')
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

module.exports = {
  compress_dir,
  un_compress
}
