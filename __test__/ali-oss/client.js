
const OSS = require('ali-oss')
const client = new OSS({
  accessKeyId: '',
  accessKeySecret: '',
  bucket: 'games-document-sync'
})

module.exports = client
