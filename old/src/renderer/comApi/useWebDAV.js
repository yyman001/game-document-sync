import { ref, reactive } from '@vue/composition-api'
import useMessage from './useMessage'
import { showOpenDialog } from '../utils/dialog'
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
  // 是否 覆盖已存在的云文件
  const isOverwrite = false
  const loadWebDavConfig = (filePath) => {
    try {
      const fileJson = fs.readJSONSync(filePath)
      if (fileJson) {
        url.value = fileJson.url
        usearname.value = fileJson.usearname
        password.value = fileJson.password
        rootDirectoryName.value = fileJson.rootDirectoryName
        messageSuccess('加载配置成功!')
        return true
      }
    } catch (error) {
      messageError('加载配置失败!')
      return false
    }
  }

  // eslint-disable-next-line no-unused-vars
  const webDAVClient = () => {
    if (client) return client

    client = createClient(url.value, {
      username: usearname.value,
      password: password.value
    })
    return client
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

  /**
   * 校验目录是否存在并生成目录
   *
   * @param {String} path 创建目录路径
   */
  const ensureDir = async (path) => {
    if (await client.exists(path) === false) {
      await client.createDirectory(path)
      console.log('目录不存在,创建', path)
      return true
    }
    console.log('目录已存在')
    return false
  }

  /**
   * 上传文件到坚果云
   *
   * @param {*} filePath 本地备份文件
   * @param {*} gameDocDir 游戏文件夹名
   * @param {*} fileName 存档名(带完整文件后缀)
   * @returns {Promise<Boolean>}
   */
  const uploadFile = async (filePath, gameDocDir, fileName) => {
    try {
      const fileBuffer = await fs.readFile(filePath)
      console.log('fileBuffer', fileBuffer)
      // 确保根目录存在
      await ensureDir(`/${rootDirectoryName.value}`)
      // 确保游戏存档目录
      await ensureDir(`/${rootDirectoryName.value}/${gameDocDir}`)
      await client.putFileContents(`/${rootDirectoryName.value}/${gameDocDir}/${fileName}`, fileBuffer, {
        overwrite: isOverwrite
      })
      return true
    } catch (error) {
      return false
    }
  }

  const hanldeSaveConfig = () => {
    loading.value = true
    const jsonConfig = {
      url: url.value,
      usearname: usearname.value,
      password: password.value,
      rootDirectoryName: rootDirectoryName.value
    }

    try {
      fs.outputJsonSync(configPath.value, jsonConfig)
      messageSuccess('保存配置成功!')
    } catch (error) {
      console.log('e', error)
      messageError('保存配置失败!')
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

  const handleSetConfig = async () => {
    const configPath = showOpenDialog({
      title: '选择配置文件',
      filters: [{name: '配置文件', extensions: ['json']}]
    })

    if (!Array.isArray(configPath)) return
    const isSuccess = loadWebDavConfig(configPath[0])
    if (isSuccess) {
      hanldeSaveConfig()
    }
  }

  return {
    usearname,
    password,
    loading,
    testResult,
    webDAVClient,
    configPath,
    rootDirectoryName,
    coludItems,
    createClient,
    handleCheckAccount,
    getDirectoryContents,
    getFileContents,
    getDirectoryStructure,
    hanldeSaveConfig,
    loadWebDavConfig,
    handleSetConfig,
    uploadFile
  }
}
