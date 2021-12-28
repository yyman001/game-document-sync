import { ref, reactive } from '@vue/composition-api'
import useMessage from './useMessage'
const webdav = require('webdav')
const { createClient } = webdav
const fs = require('fs-extra')

export default function () {
  const { messageSuccess, messageError } = useMessage()
  const configPath = ref('./static/webDAV.config.json')
  const url = ref('')
  const usearname = ref('')
  const password = ref('')
  // 游戏云存档根目录
  const rootDirectoryName = ref('')
  const loading = ref(false)
  const testResult = ref(false)
  // 云目录列表信息
  const coludItems = reactive({
    directoryItems: [],
    fileItems: []
  })
  let client = null

  const loadWebDavConfig = (filePath) => {
    loading.value = true
    try {
      const fileJson = fs.readJSONSync(filePath)
      if (fileJson) {
        url.value = fileJson.url
        usearname.value = fileJson.usearname
        password.value = fileJson.password
        rootDirectoryName.value = fileJson.rootDirectoryName
        messageSuccess('加载配置成功!')
      }
    } catch (error) {
      messageError('加载配置失败!')
    }
    loading.value = false
  }

  // eslint-disable-next-line no-unused-vars
  const webDAVClient = () => {
    client = createClient(url.value, {
      username: usearname.value,
      password: password.value
    })
  }

  const getDirectoryContents = async (filename = '/') => {
    const directoryItems = await client.getDirectoryContents(filename, { deep: true })
    return directoryItems
  }

  const getFileContents = async (filename) => {
    const fileBuffer = await client.getFileContents(filename)
    return fileBuffer
  }

  const getDirectoryStructure = async () => {
    if (loading.value) return
    loading.value = true

    // 获取自定义名存档目录下列表
    const rootDirectoryItems = await getDirectoryContents(`/${rootDirectoryName.value}`)

    if (!Array.isArray(rootDirectoryItems)) {
      loading.value = false
      return
    }

    // todo:? 过滤非文件夹
    coludItems.directoryItems = rootDirectoryItems

    const fileItems = await Promise.all(
      rootDirectoryItems.map(({filename}) => {
        return getDirectoryContents(filename)
      })
    )

    if (Array.isArray(fileItems)) {
      coludItems.fileItems = fileItems.reduceRight((a, b) => (a.concat(b)), [])
    }

    loading.value = false
  }

  const hanldeSubmitConfig = () => {
    loading.value = true
    const jsonConfig = {
      url: url.value,
      usearname: usearname.value,
      password: password.value,
      rootDirectoryName: rootDirectoryName.value
    }

    try {
      fs.outputJsonSync(configPath.value, jsonConfig)
      messageSuccess('导出配置成功!')
    } catch (error) {
      console.log('e', error)
      messageError('导出配置失败!')
    }

    loading.value = false
  }

  const handleCheckAccount = async () => {
    if (loading.value) return
    loading.value = true
    try {
      webDAVClient()
      await getDirectoryContents()
      testResult.value = true
    } catch (error) {
      // TODO: 错误打点日志
      console.log('e', error.message)
    } finally {
      loading.value = false
    }
  }

  return {
    usearname,
    password,
    loading,
    testResult,
    configPath,
    rootDirectoryName,
    coludItems,
    createClient,
    handleCheckAccount,
    getDirectoryContents,
    getFileContents,
    getDirectoryStructure,
    hanldeSubmitConfig,
    loadWebDavConfig
  }
}
