import { remote } from 'electron'

export default {
  computed: {
    rootDir () {
      const path = remote.app.getPath('exe')

      if (/node_modules/.test(path)) {
        return path.split('node_modules')[0]
      }

      return path
    }
  }
}
