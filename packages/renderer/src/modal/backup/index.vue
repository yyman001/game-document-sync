<template>
  <a-modal title="备份" :visible="isVisible" :footer="null" :maskClosable="false">
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
        <a-input :disabled="true" addon-before="存档路径:" :value="docPath">
          <a-icon slot="addonAfter" type="folder-open" @click="openItem(docPath)" />
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备份路径:" :value="backPath">
        </a-input>
      </a-row>

      <a-row>
        <a-textarea addon-before="备注:" v-model:value="remask"> </a-textarea>
      </a-row>
    </div>

    <div class="steps-action">
      <a-button @click="onModalClose"> 取消 </a-button>
      <a-button :disabled="loading" type="primary" @click="onSbumit"> 备份 </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'

import { openItem } from '@/utils/shell'
import { injectStrict } from '@/utils'
import { Modal, modal } from '@/hooks/useModal'

export default defineComponent({
  name: 'modal-backup',
  components: {
    FieldSetGroup
  },
  // props: ['visible', 'gameDocPath', 'gameDocDir'],

  setup (props: any, { emit }) {
    // const { visible, gameDocPath, gameDocDir } = toRefs(props)
    const {
      isVisible,
      onModalClose,

      loading,
      expandedKeys,
      selectedKeys,
      treeData,

      docPath,
      backPath

    } = injectStrict<Modal>(modal)

    const onSbumit = () => {
      emit('submit', {
        docPath,
        backPath,
        selectedKeys
      })
    }

    return {
      isVisible,
      onModalClose,

      docPath,
      backPath,

      loading,
      expandedKeys,
      selectedKeys,
      treeData,

      openItem,
      onSbumit
    }
  }
})
</script>

<style></style>
