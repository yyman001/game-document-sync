import { ref, reactive } from '@vue/composition-api'
import WebDav from '../../utils/WebDav'
const fs = require('fs-extra')
const configPath = ref('./static/webDAV.config.json')
let WebDAVClient = null
// 云目录列表信息
const configJson = reactive({
  name: '',
  type: '',
  url: '',
  usearname: '',
  password: '',
  rootDirectoryName: 'games_doc_sync'
})

const loadWebDavConfig = (filePath) => {
  try {
    const fileJson = fs.readJSONSync(filePath || configPath.value)
    if (fileJson) {
      configJson.type = fileJson.type
      configJson.name = fileJson.name
      configJson.url = fileJson.url
      configJson.usearname = fileJson.usearname
      configJson.password = fileJson.password
      configJson.rootDirectoryName = fileJson.rootDirectoryName
      return true
    }
  } catch (error) {
    return false
  }
}

const initWebDAV = () => {
  const isloadingOk = loadWebDavConfig()
  if (!isloadingOk) {
    console.error('加载webdav配置出错~')
    return
  }

  WebDAVClient = new WebDav(configJson)
  return WebDAVClient
}

export {
  configJson,
  configPath,
  loadWebDavConfig,
  initWebDAV,
  WebDAVClient
}
