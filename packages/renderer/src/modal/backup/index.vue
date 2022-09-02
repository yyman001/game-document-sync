<template>
  <a-modal title="备份" :visible="visible" :footer="null" :maskClosable="false">
    <FieldSetGroup v-if="treeData.length" title="文件列表">
      <div class="file-content">
        <a-directory-tree
          default-expand-all
          multiple
          :checkable="true"
          :height="280"
          v-model:selectedKeys="selectedKeys"
          :tree-data="treeData"
        />
      </div>
    </FieldSetGroup>
    <div class="backup-content">
      <a-row>
        <a-input :disabled="true" addon-before="存档路径:" :value="formDocPatch">
          <a-icon slot="addonAfter" type="folder-open" @click="openItem(formDocPatch)" />
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备份路径:" :value="backPatch">
        </a-input>
      </a-row>

      <a-row>
        <a-textarea addon-before="备注:" v-model:value="remask"> </a-textarea>
      </a-row>
    </div>

    <div class="steps-action">
      <a-button @click="onModalClose"> 取消 </a-button>
      <a-button :disabled="loading" type="primary" @click="handleStartBackup"> 备份 </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, unref, watch } from 'vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'

import useDocTree from '@/hooks/file/useDocTree'
import useSystem from '@/hooks/core/useSystem'
import useBackupFile from '@/hooks/file/useBackupFile'

import { openItem } from '@/utils/shell'
import { getBackupPath, getPath, injectStrict } from '@/utils'
import { Modal, modal } from '@/hooks/useModal'

export default defineComponent({
  name: 'modal-backup',
  components: {
    FieldSetGroup
  },
  props: ['visible', 'gameDocPath', 'gameDocDir'],

  setup (props: any) {
    const { visible, gameDocPath, gameDocDir } = toRefs(props)
    const { onModalClose } = injectStrict<Modal>(modal)
    const { HOME_DIR } = useSystem()
    const { expandedKeys, selectedKeys, treeData, createNode } = useDocTree()
    const { loading, onStartBackup } = useBackupFile()

    const formDocPatch = ref('')
    const backPatch = getBackupPath(unref(gameDocDir))

    watch(
      () => unref(visible),
      isVisible => {
        if (!isVisible) return
        const docPatch = getPath(HOME_DIR, unref(gameDocPath))
        console.log('docPatch', docPatch)
        formDocPatch.value = docPatch
        createNode(docPatch, unref(gameDocDir))
      }
    )

    const handleStartBackup = () => {
      onStartBackup(unref(gameDocPath), unref(gameDocDir), unref(selectedKeys))
    }

    return {
      expandedKeys,
      selectedKeys,
      treeData,
      createNode,

      openItem,
      loading,
      handleStartBackup,

      onModalClose,
      formDocPatch,
      backPatch
    }
  }
})
</script>

<style></style>
