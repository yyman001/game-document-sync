export default {
  data () {
    return {
      // 系统类型 在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'。
      systemType: require('os').type(),
      homedir: require('os').homedir(),
      systemTypeOptions: {
        'Windows_NT': 'Windows',
        'Darwin': 'Mac',
        'Linux': 'Linux'
      }
    }
  }
}
