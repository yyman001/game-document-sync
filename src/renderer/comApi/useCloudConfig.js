
import { ref, unref, computed } from '@vue/composition-api'
import useMessage from './useMessage'
import { showOpenDialog } from '../utils/dialog'
const fs = require('fs-extra')

export function useCloudConfig () {
  const { messageSuccess, messageError } = useMessage()
  // 云配置文件
  const configFilePath = ref('./static/cloud.config.json')
  // 支持的云类型
  const cloudOptions = ref([
    {
      label: '坚果云',
      value: 'jianguoyun'
    },
    {
      label: '阿里云',
      value: 'ali-oss'
    }
  ])
  // 云账号配置信息列表
  const cloudList = ref([])
  const loading = ref(false)
  const cloudType = ref('jianguoyun')
  const targetCloudACcount = computed(() => {
    return unref(cloudList).find((x) => x.type === unref(cloudType))
  })

  const loadConfig = () => {
    try {
      const fileJson = fs.readJSONSync(unref(configFilePath))
      if (Array.isArray(fileJson)) {
        cloudList.value = fileJson
        messageSuccess('加载配置成功!')
        return true
      }
    } catch (error) {
      console.log('error:', error)
      messageError('加载配置失败!')
      return false
    }
  }

  const handleSetConfig = async () => {
    const configPath = showOpenDialog({
      title: '选择配置文件',
      filters: [{name: '配置文件', extensions: ['json']}]
    })

    if (!Array.isArray(configPath)) return
    const isSuccess = loadConfig(configPath[0])
    if (isSuccess) {
      hanldeSaveConfig()
    }
  }

  const hanldeSaveConfig = () => {
    if (unref(loading)) return
    loading.value = true

    try {
      fs.outputJsonSync(unref(configFilePath), unref(cloudList))
      messageSuccess('保存配置成功!')
    } catch (error) {
      messageError('保存配置失败!')
    }

    loading.value = false
  }

  const onSwitchCloud = (type) => {
    cloudType.value = type
  }

  return {
    cloudType,
    configFilePath,
    targetCloudACcount,
    cloudOptions,
    cloudList,

    loadConfig,
    handleSetConfig,
    onSwitchCloud
  }
}
