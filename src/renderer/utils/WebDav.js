import { Buffer } from 'buffer'
import { createClient } from 'webdav/web'
const fs = require('fs-extra')
export default class WebDav {
  /**
   * 初始化数据
   *
   * @param {*} url - webdav 服务器地址
   * @param {*} usearname - 用户名
   * @param {*} password - 密码
   * @param {*} rootDirectoryName - 指定根目录
   */
  constructor ({url, usearname, password, rootDirectoryName = ''}) {
    if (!url || !usearname || !password) {
      throw new Error('must input url&usearname&password!')
    }
    this.url = url
    this.usearname = usearname
    this.password = password
    this.rootDirectoryName = rootDirectoryName
    this.client = null
    this.loading = false
    this.getWebDavClient()
  }

  /**
   * 创建 webdav 对象
   *
   * @returns { webdav } client
   */
  getWebDavClient = () => {
    if (this.client) return this.client

    this.client = createClient(this.url, {
      username: this.usearname,
      password: this.password
    })

    return this.client
  }

  destroy () {
    this.client = null
  }

  /**
   * 获取指定目录列表
   *
   * @param {String} [filename] 目录名
   * @returns {Array} directoryItems
   */
   getDirectoryContents = async (filename = '/') => {
     const directoryItems = await this.client.getDirectoryContents(filename, { deep: true })
     return directoryItems
   }

   /**
    * 获取云目录列表
    *
    * @param {String} filename 文件名
    * @returns
    */
   getFileContents = async (filename) => {
     const fileBuffer = await this.client.getFileContents(filename)
     return fileBuffer
   }

   /**
    * 获取坚果云目录和文件
    *
    * @returns {Object<directoryItems, fileItems>} - { directoryItems, fileItems }
    */
   getDirectoryStructure = async () => {
     if (this.loading) return
     this.loading = true

     // 获取自定义名存档目录下列表
     const rootDirectoryItems = await this.getDirectoryContents(`/${this.rootDirectoryName}`)

     if (!Array.isArray(rootDirectoryItems)) {
       this.loading = false
       return
     }

     let fileItems = []
     // TODO: 改成多线程, 坚果云最大并发数为6, 超过就 503
     for (let index = 0; index < rootDirectoryItems.length; index++) {
       const element = rootDirectoryItems[index]
       try {
         const result = await this.getDirectoryContents(element.filename)
         fileItems.push(result)
       } catch (error) {
         console.error(error)
         continue
       }
     }

     fileItems = fileItems.reduceRight((a, b) => (a.concat(b)), [])

     this.loading = false

     return {
       // todo:? 过滤非文件夹
       directoryItems: rootDirectoryItems,
       fileItems
     }
   }

   /**
   * 确保目录存在
   *
   * @param {String} path 创建目录路径
   */
   ensureDir = async (path) => {
     try {
       await this.client.createDirectory(path)
       return true
     } catch (error) {
       return false
     }
   }

  /**
   * 上传文件到坚果云
   *
   * @param {Buffer|String} filePath 本地备份文件路径 | 文件数据
   * @param {String} gameDocDir 游戏文件夹名
   * @param {String} fileName 存档名(带完整文件后缀)
   * @param {Boolean} isOverwrite 是否覆盖文件
   * @param {Function} cb 上传完成回调函数
   * @param {Function} progressFn 上传进度回调函数
   * @returns {Promise<Boolean>} 是否成功
   */
   uploadFile = async (filePath, gameDocDir, fileName, isOverwrite = false, cb, progressFn) => {
     try {
       let fileBuffer
       if (typeof filePath === 'string') {
         fileBuffer = await fs.readFile(filePath)
       } else if (Buffer.isBuffer(filePath)) {
         fileBuffer = filePath
       }

       const onUploadProgress = progress => {
         progressFn(gameDocDir, fileName, progress)
       }
       // 确保根目录存在
       await this.ensureDir(`/${this.rootDirectoryName}`)
       // 确保游戏存档目录
       await this.ensureDir(`/${this.rootDirectoryName}/${gameDocDir}`)
       await this.client.putFileContents(`/${this.rootDirectoryName}/${gameDocDir}/${fileName}`, fileBuffer, {
         overwrite: isOverwrite,
         contentLength: false,
         onUploadProgress: progressFn ? onUploadProgress : null
       })
       // 成功回调
       cb && cb()
       return true
     } catch (error) {
       return false
     }
   }

   /**
    * 下载文件
    *
    * @param {String} coludFilename - 云盘中文件名
    * @param {String} writeFilePath - 写入文件路径
    * @param {Function} cb - 下载完成回调
    * @param {Function} progressFn - 下载进度回调
    * @returns {Promise<Boolean>} - 是否成功
    */
   downloadFile = async (coludFilename, writeFilePath, cb, progressFn) => {
     const onDownloadProgress = progress => {
       progressFn(coludFilename, writeFilePath, progress)
     }

     try {
       const fileBuffer = await this.getFileContents(coludFilename, {
         onDownloadProgress: progressFn ? onDownloadProgress : null
       })
       await fs.outputFile(writeFilePath, Buffer.from(fileBuffer))
       // 成功回调
       cb && cb()
       return true
     } catch (error) {
       console.error(error)
       return false
     }
   }
}
