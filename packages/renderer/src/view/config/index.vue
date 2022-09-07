<template>
  <div class="config-page">
    <a-tabs type="card" @change="callback">
    <a-tab-pane key="1" tab="基本设置">
      <a-checkbox> 随开机启动 </a-checkbox>
    </a-tab-pane>

    <a-tab-pane key="2" tab="备份/还原设置">
      <field-set-group title="临时操作路径">
        <div style="margin-bottom: 16px">
          <a-input :value="tempPath">
            <template #addonBefore>
              <a-tooltip title="设置临时操作目录">
                <SettingOutlined />
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <ReloadOutlined @click="setDefaultTempPath"/>
              </a-tooltip>
            </template>

          </a-input>
        </div>
      </field-set-group>

      <field-set-group title="备份路径">
        <div style="margin-bottom: 16px">
          <a-input :value="backPath">
            <template #addonBefore>
              <a-tooltip title="设置备份目录">
                <SettingOutlined />
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <ReloadOutlined @click="setDefaultBackPath"/>
              </a-tooltip>
            </template>
          </a-input>
        </div>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="3" tab="数据库设置">
      <field-set-group title="数据库恢复">

        <div style="margin-bottom: 16px">
          <a-input default-value=".\">
            <template #addonBefore>
              <a-tooltip title="选择数据库文件">
                <SettingOutlined />
              </a-tooltip>
            </template>
          </a-input>
        </div>

        <a-checkbox @change="handleDeleteDatabse">
          导入前删除旧数据库
        </a-checkbox>
        <!-- TODO: 自定义导入文件 -->
        <a-button :disabled="isLoading" type="primary" @click="improtDatabaseByJson">
          导入数据库
        </a-button>
      </field-set-group>

      <field-set-group title="数据库备份路径">
        <FieldSetGroup title="勾选导出的数据表">
          <a-checkbox-group v-model:value="exportTableName" name="checkboxgroup" :options="exportTableOptions" />
        </FieldSetGroup>

        <!-- <a-divider /> -->

        <div style="margin-bottom: 16px">
          <a-input default-value=".\">
            <template #addonBefore>
              <a-tooltip title="设置备份导出目录">
                <SettingOutlined />
              </a-tooltip>
            </template>

            <template #addonAfter>
              <a-tooltip title="恢复默认">
                <ReloadOutlined />
              </a-tooltip>
            </template>
          </a-input>
        </div>

        <a-button :disabled="isLoading" type="primary" @click="saveDatabaseToJson">
          导出数据库
        </a-button>
      </field-set-group>
    </a-tab-pane>

 <a-tab-pane key="4" tab="云同步设置">
      <field-set-group title="云配置">
        <div>
          <a-input v-model:value="configFilePath">
            <template #addonBefore>
              <a-tooltip title="导入配置">
                <SettingOutlined @click="handleSetConfig"/>
              </a-tooltip>
            </template>
            <template #addonAfter>
              <a-tooltip  title="恢复默认">
                <RedoOutlined />
              </a-tooltip>
            </template>
          </a-input>
          <a-divider/>
          <a-button type="primary" @click="loadConfig">重新载入配置</a-button>
          <a-divider/>

          <field-set-group title="账号设置">
            <div class="colud-type">
              云盘类型:
              <a-select
                style="width: 100px;"
                size="small"
                v-model:value="cloudType"
                :options="cloudOptions"
                @change="onSwitchCloud"
              ></a-select>
            </div>
          <a-divider/>
          <a-form
              v-if="targetCloudAccount"
              :model="cloudFormState"
              name="basic"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
            >
            <template v-if="targetCloudAccount.type === 'ali-oss'">
              <a-form-item
                label="AccessKeyId"
                name="accessKeyId"
                :rules="[{ required: true, message: 'Please input your accessKeyId!' }]"
              >
                <a-input v-model:value="accessKeyId" />
              </a-form-item>

              <a-form-item
                label="AccessKeySecret"
                name="accessKeySecret"
                :rules="[{ required: true, message: 'Please input your accessKeySecret!' }]"
              >
                <a-input v-model:value="accessKeySecret" />
              </a-form-item>

              <a-form-item
                label="Bucket"
                name="bucket"
                :rules="[{ required: true, message: 'Please input your bucket!' }]"
              >
                <a-input v-model:value="bucket" />
              </a-form-item>
            </template>

            <template v-if="targetCloudAccount.type === 'jianguoyun' ">
            <!-- 账号 -->
              <a-form-item>
                <a-input placeholder="账号" v-model:value="usearname">
                  <!-- <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" /> -->
                </a-input>
              </a-form-item>
              <!-- 密码 -->
              <a-form-item>
                <a-input-password type="password" placeholder="密码" v-model:value="password">
                  <!-- <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /> -->
                </a-input-password>
              </a-form-item>
            </template>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <a-button type="primary" @click="handleSave">保存</a-button>
            </a-form-item>
          </a-form>
          </field-set-group>

        </div>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="5" tab="关于"> 这是一个免费开源程序 </a-tab-pane>
  </a-tabs>
  </div>

</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { SettingOutlined, RedoOutlined, InteractionOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import FieldSetGroup from '@/components/FieldSetGroup/index.vue'
import useDB from '@/hooks/db/useDB'
import useCloudConfig from '@/hooks/cloud/useCloudConfig'
import { useConfigStoreWhitOut } from '@/store/config'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'config-mod',
  components: {
    FieldSetGroup,
    SettingOutlined,
    RedoOutlined,
    InteractionOutlined,
    ReloadOutlined
  },
  setup () {
    const {
      progress,
      isLoading,
      isDeleteOldDatabse,
      handleDeleteDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson,

      exportTableOptions,
      exportTableName
    } = useDB()

    const callback = (key) => {
      console.log(key)
    }

    const {
      cloudFormState,
      cloudType,
      configFilePath,
      cloudOptions,
      targetCloudAccount,
      onSwitchCloud,
      loadConfig,
      handleSetConfig,
      handleSave
    } = useCloudConfig()

    const useConfig = useConfigStoreWhitOut()
    const { tempPath, backPath } = storeToRefs(useConfig)

    return {
      progress,
      isLoading,
      isDeleteOldDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson,
      handleDeleteDatabse,
      exportTableOptions,
      exportTableName,

      callback,

      ...toRefs(cloudFormState),
      cloudType,
      configFilePath,
      cloudOptions,
      targetCloudAccount,
      onSwitchCloud,
      loadConfig,
      handleSetConfig,
      handleSave,

      tempPath,
      backPath,
      setDefaultTempPath: useConfig.setDefaultTempPath,
      setDefaultBackPath: useConfig.setDefaultBackPath
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
