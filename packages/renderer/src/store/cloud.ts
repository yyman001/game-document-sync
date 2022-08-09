import { SdkConfig } from '@/model'
import { defineStore } from 'pinia'

export const useCloudStore = defineStore('cloud', {
  state: () => {
    return {
      // 备份目录
      backupPath: '',
      // 临时目录(文件拷贝,压缩,解压)
      tempPath: '',
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
      cloudList: [] as any[],
      cloudType: 'jianguoyun'
    }
  },

  getters: {
    targetCloudAccount (): any {
      return this.cloudList.find((x: any) => x.type === this.cloudType) || {}
    },
    getCloudList (): Array<any> {
      return this.cloudList
    },
    getCloudType (): string {
      return this.cloudType
    }
  },

  actions: {
    setBackupPath (path:string) {
      this.backupPath = path || '.\\backup'
    },
    setTempPath (path:string) {
      this.tempPath = path
    },
    updateCloudConfig (data: any) {
      const cloudFormState: SdkConfig = this.cloudForm
      Object.keys(data).forEach((key:string) => {
        cloudFormState[key] = data[key]
      })
    },
    setCloudType (type:string) {
      this.cloudType = type
    },
    setCloudList (cloudList: Array<any>) {
      this.cloudList = cloudList
    }
  }
})

export const useCloudStoreWhitOut = () => {
  return useCloudStore()
}
