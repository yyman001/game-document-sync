<template>
  <a-tabs type="card" @change="callback">
    <a-tab-pane key="1" tab="基本设置">
      <a-checkbox @change="onChange"> 随开机启动 </a-checkbox>
    </a-tab-pane>

    <a-tab-pane key="2" tab="备份/还原设置">
      <field-set-group title="临时操作路径">
        <div style="margin-bottom: 16px">
          <a-input
            default-value="C:\Users\yyman001\AppData\Roaming\Electron"
          >
            <a-tooltip slot="addonBefore" title="设置临时操作目录">
              <a-icon type="folder-open"></a-icon>
            </a-tooltip>

            <a-tooltip slot="addonAfter" title="恢复默认">
              <a-icon type="rollback" />
            </a-tooltip>
          </a-input>
        </div>

      </field-set-group>

      <field-set-group title="备份路径">
        <div style="margin-bottom: 16px">
          <a-input default-value=".\backup">
            <a-tooltip slot="addonBefore" title="设置备份目录">
              <a-icon type="folder-open"></a-icon>
            </a-tooltip>

            <a-tooltip slot="addonAfter" title="恢复默认">
              <a-icon type="rollback" />
            </a-tooltip>
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
        <a-button
          :disabled="isLoading"
          type="primary"
          @click="improtDatabaseByJson"
        >
          导入数据库
        </a-button>
      </field-set-group>

      <field-set-group title="数据库备份路径">
        <div style="margin-bottom: 16px">
          <a-input default-value=".\">
            <a-tooltip slot="addonBefore" title="设置备份导出目录">
              <a-icon type="folder-open"></a-icon>
            </a-tooltip>

            <a-tooltip slot="addonAfter" title="恢复默认">
              <a-icon type="rollback" />
            </a-tooltip>
          </a-input>
        </div>

        <a-button
          :disabled="isLoading"
          type="primary"
          @click="saveDatabaseToJson"
        >
          导出数据库
        </a-button>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="4" tab="云同步设置">
      <field-set-group title="云配置">
        <div>
          <a-input v-model:value="configFilePath">
            <a-tooltip slot="addonBefore" title="导入配置">
              <a-icon type="folder-open" @click="handleSetConfig"></a-icon>
            </a-tooltip>

            <a-tooltip slot="addonAfter" title="恢复默认">
              <a-icon type="rollback" />
            </a-tooltip>
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
                  <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <!-- 密码 -->
              <a-form-item>
                <a-input-password type="password" placeholder="密码" v-model:value="password">
                  <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
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
</template>

<script>
import fieldSetGroup from '../FieldSetGroup'
import { useDB } from '../../comApi/useDB'
import { useCloudConfig } from '../../comApi/useCloudConfig'
import { toRefs } from '@vue/composition-api'

export default {
  name: 'config-mod',
  components: { fieldSetGroup },
  setup () {
    const {
      progress,
      isLoading,
      isDeleteOldDatabse,
      handleDeleteDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson
    } = useDB()

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

    return {
      progress,
      isLoading,
      isDeleteOldDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson,
      handleDeleteDatabse,

      ...toRefs(cloudFormState),

      cloudFormState,
      cloudType,
      configFilePath,
      cloudOptions,
      targetCloudAccount,
      loadConfig,
      onSwitchCloud,
      handleSetConfig,
      handleSave
    }
  },
  data () {
    return {}
  },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.checked}`)
    },
    callback (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>