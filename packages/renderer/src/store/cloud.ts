import { SdkConfig } from '@/model'
import { defineStore } from 'pinia'

export const useCloudStore = defineStore('cloud', {
  state: () => {
    return {
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
      return this.cloudConfigList.find((x: SdkConfig) => x.type === this.cloudType) || {}
    }
  },

  actions: {
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
