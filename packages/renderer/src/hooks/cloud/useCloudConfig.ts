import { ref, unref, reactive } from 'vue'
import { showOpenDialog } from '@/utils/dialog'
import { message } from 'ant-design-vue'
import { useCloudStoreWhitOut } from '@/store/cloud'
import { useConfigStoreWhitOut } from '@/store/config'
import { storeToRefs } from 'pinia'
import { SdkConfig } from '@/model'
const fs = require('fs-extra')

export default function useCloudConfig () {
  const { success: messageSuccess, error: messageError } = message
  const cloudStore = useCloudStoreWhitOut()
  const useConfigStore = useConfigStoreWhitOut()

  const { configFilePath } = storeToRefs(useConfigStore)
  const { cloudTypeList, cloudConfigList } = storeToRefs(cloudStore)

  // 云账号配置信息列表
  const loading = ref(false)
  const cloudType = ref('jianguoyun')

  const cloudFormState = reactive<SdkConfig>({
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

  const initFormState = (fileJson:SdkConfig[]) => {
    fileJson.forEach((element:SdkConfig) => {
      const { type, usearname, password, accessKeyId, accessKeySecret, bucket } = element
      if (type === 'jianguoyun') {
        cloudFormState.usearname = usearname
        cloudFormState.password = password
      } else if (type === 'ali-oss') {
        cloudFormState.accessKeyId = accessKeyId
        cloudFormState.accessKeySecret = accessKeySecret
        cloudFormState.bucket = bucket
      }
    })
  }

  const refreshFormState = () => initFormState(unref(cloudConfigList))

  const loadConfig = (path:string) => {
    try {
      // todo: 判断配置文件是否存在
      const fileJson: Array<any> = fs.readJSONSync(path)
      if (Array.isArray(fileJson)) {
        initFormState(fileJson)
        cloudStore.setConfigList(fileJson)
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
      hanldeSaveConfig(unref(cloudConfigList))
    }
  }

  const hanldeSaveConfig = (cloudList:SdkConfig[]) => {
    if (unref(loading)) return
    loading.value = true
    try {
      fs.outputJsonSync(unref(configFilePath), cloudList)
      messageSuccess('保存配置成功!')
    } catch (error) {
      messageError('保存配置失败!')
    }

    loading.value = false
  }

  const onSwitchCloud = (type:string) => {
    cloudType.value = type
  }

  const handleSave = () => {
    // TODO: 校验数据
    const cloudList = unref(cloudConfigList).map(config => {
      if (config.type === 'jianguoyun') {
        return {
          ...config,
          password: cloudFormState.password,
          usearname: cloudFormState.usearname
        }
      } else if (config.type === 'ali-oss') {
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
    cloudStore.setConfigList(cloudList)
    hanldeSaveConfig(cloudList)
  }

  return {
    cloudFormState,
    refreshFormState,
    cloudType,
    cloudTypeList,

    handleSetConfig,
    onSwitchCloud,

    handleSave,

    loadConfig
  }
}
