<template>
  <div class="config-page">
    <a-tabs type="card" @change="callback">
    <a-tab-pane key="1" tab="基本设置">
      <a-checkbox> 随开机启动 </a-checkbox>
    </a-tab-pane>

    <a-tab-pane key="2" tab="备份/还原设置">
      <field-set-group title="临时操作路径">
        <div style="margin-bottom: 16px">
          <a-input default-value="C:\Users\yyman001\AppData\Roaming\Electron">
            <template #addonBefore>
              <a-tooltip title="设置临时操作目录">
                <a-icon type="folder-open"></a-icon>
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <a-icon type="rollback" />
              </a-tooltip>
            </template>

          </a-input>
        </div>
      </field-set-group>

      <field-set-group title="备份路径">
        <div style="margin-bottom: 16px">
          <a-input default-value=".\backup">
            <template #addonBefore>
              <a-tooltip title="设置备份目录">
                <a-icon type="folder-open"></a-icon>
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <a-icon type="rollback" />
              </a-tooltip>
            </template>
          </a-input>
        </div>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="3" tab="数据库设置">
      <field-set-group title="数据库恢复">
        <a-checkbox @change="handleDeleteDatabse">
          导入前删除旧数据库
        </a-checkbox>
        <!-- TODO: 自定义导入文件 -->
        <a-button :disabled="isLoading" type="primary" @click="improtDatabaseByJson">
          导入数据库
        </a-button>
      </field-set-group>

      <field-set-group title="数据库备份路径">
        <div style="margin-bottom: 16px">
          <a-input default-value=".\">
            <template #addonBefore>
              <a-tooltip title="设置备份导出目录">
                <a-icon type="folder-open"></a-icon>
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <a-icon type="rollback" />
              </a-tooltip>
            </template>
          </a-input>
        </div>

        <a-button :disabled="isLoading" type="primary" @click="saveDatabaseToJson">
          导出数据库
        </a-button>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="5" tab="关于"> 这是一个免费开源程序 </a-tab-pane>
  </a-tabs>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import useDB from '@/hooks/db/useDB'

export default defineComponent({
  name: 'config-mod',
  components: { FieldSetGroup },
  setup () {
    const {
      progress,
      isLoading,
      isDeleteOldDatabse,
      handleDeleteDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson
    } = useDB()

    const callback = (key) => {
      console.log(key)
    }

    return {
      progress,
      isLoading,
      isDeleteOldDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson,
      handleDeleteDatabse,

      callback
    }
  }
})

</script>

<style lang="scss" scoped>
@import "@/sass/_var.scss";
.ant-form-item {
  margin-bottom: 12px;
}
.config-page {
  background: $color-master;
}
</style>
