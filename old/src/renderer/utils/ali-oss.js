const OSS = require('ali-oss')

export class AliOssSDK {
  constructor ({accessKeyId, accessKeySecret, bucket, rootDirectoryName = ''}) {
    if (!accessKeyId || !accessKeySecret || !bucket) {
      throw new Error('ali oss must input accessKeyId&accessKeySecret&bucket!')
    }

    this.accessKeyId = accessKeyId
    this.accessKeySecret = accessKeySecret
    this.bucket = bucket
    this.rootDirectoryName = rootDirectoryName

    this.client = null
    this.loading = false
    this.createClient()
  }

  createClient = () => {
    if (this.client === null) {
      this.client = new OSS({
        accessKeyId: this.accessKeyId,
        accessKeySecret: this.accessKeySecret,
        bucket: this.bucket
      })
    }

    return this.client
  }

  destroy () {
    this.client = null
  }

  /**
   * 转换需要的格式
   *
   * @param {Array<T>} list - 文件列表
   * @returns
   */
  tarnslateData (list) {
    return list.map(({name, url, lastModified, size, etag}) => {
      const isDirectory = name.endsWith('/')
      // 移除最后面的/
      const filename = name.replace(/\/$/ig, '')
      // 根据 / 分割 获取到最后的文件名
      const file = name.split('/').slice(-1).pop()

      return {
        filename: `/${filename}`,
        // 文件夹: 直接文件夹名称不带后缀
        // 文件: 文件名带后缀(除非文件没有后缀)
        basename: isDirectory ? filename : file,
        lastmod: lastModified,
        size,
        type: isDirectory ? 'directory' : 'file',
        etag: null
      }
    })
  }

  /**
    * 获取阿里云目录和文件
    *
    * @returns {Object<directoryItems, fileItems>} - { directoryItems, fileItems }
    */
  getDirectoryStructure = async () => {
    if (this.loading) return
    this.loading = true
    let fileList = []
    try {
      let result = await this.client.list()
      console.log(result)
      fileList = this.tarnslateData(result.objects)
    } catch (error) {
      console.error('getDirectoryStructure:', error)
    }
    this.loading = false
    return {
      directoryItems: fileList.filter(x => x.type === 'directory'),
      fileItems: fileList.filter(x => x.type === 'file')
    }
  }

  /**
   * 上传文件
   *
   * @param {Buffer|String} filePath 本地备份文件路径 | 文件数据
   * @param {String} gameDocDir 游戏文件夹名
   * @param {String} fileName 存档名(带完整文件后缀)
   * @param {Boolean} isOverwrite 是否覆盖文件
   * @param {Function} cb 上传进度回调函数
   * @returns {Promise<Boolean>} 是否成功
   */
  uploadFile = async (filePath, gameDocDir, fileName, isOverwrite = false, cb) => {
    const rootDir = this.rootDirectoryName ? `/${this.rootDirectoryName}` : ''
    const uploadFileName = `${rootDir}/${gameDocDir}/${fileName}`
    try {
      const { res } = await this.client.put(uploadFileName, filePath)
      if (res.status === 200) return true
    } catch (error) {
      throw new Error(error)
    }

    return false
  }

  /**
    * 下载文件
    *
    * @param {String} coludFilename - 云盘中文件名
    * @param {String} writeFilePath - 写入文件路径
    * @param {Function} cb - 下载进度回调
    * @returns {Promise<Boolean>} - 是否成功
    */
  downloadFile = async (coludFilename, writeFilePath, cb) => {
    debugger
    try {
      const { res } = await this.client.get(coludFilename, writeFilePath)
      if (res.status === 200) {
        // 成功回调
        cb && cb()
        return true
      }
    } catch (error) {
      throw new Error(error)
    }

    return false
  }
}
