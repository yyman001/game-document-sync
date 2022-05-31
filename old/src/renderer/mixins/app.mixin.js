import {useCloudConfig} from '../comApi/useCloudConfig'
export default {
  setup (props) {
    const { loadConfig } = useCloudConfig()
    // 初始化云配置对象
    loadConfig()
  }
}
