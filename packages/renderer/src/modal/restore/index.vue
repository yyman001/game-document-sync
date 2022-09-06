<template>
  <a-modal title="还原" :visible="isVisible" :footer="null" :maskClosable="false" @cancel="onModalClose">
    <FieldSetGroup v-if="treeData.length" title="文件列表">
      <div class="file-content">
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
        <a-input :disabled="true" addon-before="存档路径:" :value="docPath">
          <template #addonAfter>
            <a-tooltip placement="left" title="打开路径">
              <FolderOpenOutlined @click="openItem(docPath)"/>
            </a-tooltip>
          </template>
        </a-input>
      </a-row>

      <a-row>
        <a-input addon-before="文件路径:" :value="filePath">
          <template #addonAfter>
            <a-tooltip placement="left" title="打开还原文件">
              <FolderOpenOutlined />
            </a-tooltip>
          </template>
        </a-input>
      </a-row>
    </div>

    <div class="steps-action">
      <a-button @click="onModalClose"> 取消 </a-button>
      <a-button type="primary" @click="onSbumit"> 还原 </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import { FolderOpenOutlined } from '@ant-design/icons-vue'
import { openItem } from '@/utils/shell'
import { RestoreModal, modal } from '@/hooks/useModal'
import { injectStrict } from '../../utils'

export default defineComponent({
  name: 'modal-restore',
  components: {
    FieldSetGroup,
    FolderOpenOutlined
  },

  setup (props: any, { emit }) {
    const {
      isVisible,
      onModalClose,

      selectedKeys,
      treeData,

      docPath,

      filePath,
      onSbumit
    } = injectStrict<RestoreModal>(modal)

    return {
      isVisible,
      onModalClose,

      docPath,
      filePath,

      selectedKeys,
      treeData,

      openItem,
      onSbumit
    }
  }
})
</script>

<style></style>
