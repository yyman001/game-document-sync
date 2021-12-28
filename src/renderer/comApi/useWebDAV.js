import { ref, reactive } from '@vue/composition-api'
const webdav = require('webdav')
const { createClient } = webdav
// const fs = require('fs-extra')

export default function () {
  const url = ref('https://dav.jianguoyun.com/dav/')
  const usearname = ref('yyman001@qq.com')
  const password = ref('akuz6vqd5iccz67w')
  // 游戏云存档根目录
  const rootDirectoryName = ref('games_doc_sync')
  const loading = ref(false)
  const testResult = ref(false)
  // 云目录列表信息
  const coludItems = reactive({
    directoryItems: [],
    fileItems: []
  })
  let client = null

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
    // TODO: 保存配置
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
    rootDirectoryName,
    coludItems,
    createClient,
    handleCheckAccount,
    getDirectoryContents,
    getFileContents,
    getDirectoryStructure,
    hanldeSubmitConfig
  }
}
