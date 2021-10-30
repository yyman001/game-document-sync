import { remote } from 'electron'
import { ref, computed, readonly } from '@vue/composition-api'
const os = require('os')

export default function useConfig () {
  const systemType = ref(os.type())
  const homedir = ref(os.homedir())
  const systemTypeOptions = readonly({
    'Windows_NT': 'Windows',
    'Darwin': 'Mac',
    'Linux': 'Linux'
  })

  const _rootDir = computed(() => {
    const path = remote.app.getPath('exe')

    if (/node_modules/.test(path)) {
      return path.split('node_modules')[0]
    }

    return path.replace('game-document-sync.exe', '')
  })

  return {
    systemType,
    homedir,
    systemTypeOptions,
    rootDir: readonly(_rootDir)
  }
}
