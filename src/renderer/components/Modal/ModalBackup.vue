<template>
  <div>
    <div class="backup-content">

      <a-row>
        <a-input :disabled="true" addon-before="存档路径:" :value="targetPatch">
          <a-icon slot="addonAfter" type="folder-open" />
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备份路径:" :value="backPatch">
          <a-icon slot="addonAfter" type="setting" />
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备注:" v-model:value="remask">
        </a-input>
      </a-row>

    </div>

    <div class="steps-action">
      <a-button @click="$emit('handleExit')"> 取消 </a-button>
      <a-button :disabled="loading" type="primary" @click="onStartBackup">
        备份
      </a-button>
    </div>

  </div>
</template>

<script>
import { ref, toRefs } from '@vue/composition-api'
import useConfig from '../../comApi/useConfig'
const path = require('path')

export default {
  name: 'modal-backup',
  props: {
    // 进度
    pression: {
      type: Number,
      default: 0
    },
    // 存档路径
    gameDocPath: String,
    // 存档文件夹
    gameDocDir: String
  },
  setup (props, context) {
    const { gameDocPath, gameDocDir } = toRefs(props)
    const { homedir, rootDir } = useConfig()
    const remask = ref('')
    const loading = ref(false)
    const targetPatch = path.join(homedir.value, gameDocPath.value)
    const backPatch = path.join(rootDir.value, 'backup', gameDocDir.value)
    const tempPatch = path.join(rootDir.value, 'temp', gameDocDir.value)

    const onStartBackup = async () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
      context.emit('handleSubmit', {
        remask: remask.value,
        targetPatch,
        backPatch,
        tempPatch
      })
    }

    return {
      targetPatch,
      backPatch,
      onStartBackup,
      remask,
      loading
    }
  }
}
</script>

<style>
.ant-row {
  margin-bottom: 10px;
}
</style>