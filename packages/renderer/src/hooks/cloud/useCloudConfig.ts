import { ref, unref, computed, reactive, watch, onMounted } from 'vue'
import { showOpenDialog } from '@/utils/dialog'
import { message } from 'ant-design-vue'
import { useCloudStoreWhitOut } from '@/store/cloud'
const fs = require('fs-extra')

export default function useCloudConfig () {
  const { success: messageSuccess, error: messageError } = message
  const cloudStore = useCloudStoreWhitOut()
  console.log('cloudStore:', cloudStore)

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
  const cloudType = ref('')
  const targetCloudAccount = computed(() => {
    return unref(cloudList).find((x: any) => x.type === unref(cloudType)) || {}
  })

  const cloudFormState = reactive({
    type: '',
    // 坚果云
    url: '',
    usearname: '',
    password: '',
    rootDirectoryName: 'games_doc_sync',
    // 阿里云
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  })

  watch(
    targetCloudAccount,
    () => {
      Object.keys(unref(targetCloudAccount)).forEach(key => {
        cloudFormState[key] = unref(targetCloudAccount)[key]
      })
    },
    {
      deep: true
    }
  )

  const loadConfig = () => {
    try {
      const fileJson: Array<any> = fs.readJSONSync(unref(configFilePath))
      if (Array.isArray(fileJson)) {
        cloudList.value = fileJson
        cloudStore.setCloudList(fileJson)
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
      openFileType: 'config'
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

  const onSwitchCloud = type => {
    cloudType.value = type
    console.log('onSwitchCloud:', type)
  }

  const handleSave = () => {
    console.log('cloudFormState:', JSON.stringify(cloudFormState))
    // TODO: 校验数据
    cloudList.value = unref(cloudList).map(config => {
      if (cloudFormState.type === 'jianguoyun') {
        return {
          ...config,
          password: cloudFormState.password,
          usearname: cloudFormState.usearname
        }
      } else if (cloudFormState.type === 'ali-oss') {
        return {
          ...config,
          accessKeyId: cloudFormState.accessKeyId,
          accessKeySecret: cloudFormState.accessKeySecret,
          bucket: cloudFormState.bucket
        }
      }

      return config
    })
    // 更新到vuex
    cloudStore.setCloudList(unref(cloudList))
    hanldeSaveConfig()
  }

  onMounted(() => {
    try {
      onSwitchCloud(cloudStore.getCloudType)
      cloudList.value = cloudStore.getCloudList
    } catch (error) {
      console.log('?', error)
    }
  })
  return {
    cloudFormState,
    cloudType,
    configFilePath,
    targetCloudAccount,
    cloudOptions,
    cloudList,

    loadConfig,
    handleSetConfig,
    onSwitchCloud,

    handleSave
  }
}
