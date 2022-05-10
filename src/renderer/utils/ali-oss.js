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

  uploadFile = async () => { }
  downloadFile = async (coludFilename, writeFilePath, cb) => {
    debugger
    try {
      const { res } = await this.client.get(coludFilename, writeFilePath)
      if (res.status === 200) return true
    } catch (error) {

    }

    return false
  }
}
