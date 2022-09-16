import { SdkConfig } from '@/model'
import { defineStore } from 'pinia'

export const useCloudStore = defineStore('cloud', {
  state: () => {
    return {
      // 云账号配置对象
      cloudForm: {
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
      } as SdkConfig,
      // 云账号配置信息列表
      cloudConfigList: [] as SdkConfig[],
      cloudType: 'jianguoyun',
      cloudTypeList: [
        {
          label: '坚果云',
          value: 'jianguoyun'
        },
        {
          label: '阿里云',
          value: 'ali-oss'
        }
      ]
    }
  },

  getters: {
    targetCloudAccount (): any {
      return this.cloudConfigList.find((x: any) => x.type === this.cloudType) || {}
    }
  },

  actions: {
    updateCloudConfig (data: any) {
      const cloudFormState: SdkConfig = this.cloudForm
      Object.keys(data).forEach((key:string) => {
        cloudFormState[key] = data[key]
      })
    },
    setCloudType (type:string) {
      this.cloudType = type
    },
    setConfigList (cloudList: Array<SdkConfig>) {
      this.cloudConfigList = cloudList
    }
  }
})

export const useCloudStoreWhitOut = () => {
  return useCloudStore()
}
