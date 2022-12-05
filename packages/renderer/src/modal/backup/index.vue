<template>
  <a-modal title="备份" :visible="isVisible" :footer="null" :maskClosable="false" @cancel="onModalClose">
    <FieldSetGroup v-if="treeData.length" title="文件列表">
      <div class="file-content">
        <a-alert :message="`勾选内容大小: ${nodeSize}`" type="info" show-icon />
        <a-directory-tree
          default-expand-all
          multiple
          :treeLine="true"
          :checkable="true"
          :height="280"
          v-model:checkedKeys="selectedKeys"
          :tree-data="treeData"
        />
      </div>
    </FieldSetGroup>
    <div class="backup-content">
      <a-row>
        <a-input :disabled="true" addon-before="存档路径:" :value="docPath" style="margin-bottom: 16px;">
          <template #addonAfter>
            <a-tooltip placement="left" title="打开路径">
              <FolderOpenOutlined @click="openItem(docPath)"/>
            </a-tooltip>
          </template>
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="备份路径:" :value="backPath" style="margin-bottom: 16px;">
          <template #addonAfter>
            <a-tooltip placement="left" title="修改路径">
              <FolderOpenOutlined />
            </a-tooltip>
          </template>
        </a-input>
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
import { FolderOpenOutlined } from '@ant-design/icons-vue'

import { openItem } from '@/utils/shell'
import { injectStrict } from '@/utils'
import { BackModal, modal } from '@/hooks/useModal'

export default defineComponent({
  name: 'modal-backup',
  components: {
    FieldSetGroup,
    FolderOpenOutlined
  },

  setup (props: any, { emit }) {
    const {
      isVisible,
      onModalClose,

      loading,
      selectedKeys,
      nodeSize,
      treeData,

      docPath,
      backPath
    } = injectStrict<BackModal>(modal)

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
      selectedKeys,
      nodeSize,
      treeData,

      openItem,
      onSbumit
    }
  }
})
</script>

<style></style>
