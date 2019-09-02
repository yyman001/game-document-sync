/**
 * Created by lenovo on 2019/9/2.
 */
const path = require('path')
const {compress_dir, un_compress} = require('./../src/utils/compressClass')
let dir_name = `SniperGhostWarrior2`
let save_path = path.join(__dirname, 'local_doc', dir_name)
let version = 1
compress_dir(save_path, `${dir_name}.version${version}`)