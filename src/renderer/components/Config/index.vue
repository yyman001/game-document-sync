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
      <field-set-group title="云账号信息配置">
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
          <a-button @click="loadConfig">重新载入配置</a-button>
          targetCloudACcount: {{targetCloudACcount}}

          <div >
            <a-select
              style="width: 100px;"
              size="small"
              v-model:value="cloudType"
              :options="cloudOptions"
              @change="onSwitchCloud"
            ></a-select>
          </div>

          <a-divider/>

          <!-- 当类型是 webDAV 时 -->
          <a-form layout="inline" >
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
            <!-- 游戏存档根目录名 -->
            <a-form-item>
              <a-input placeholder="存档目录名" v-model:value="rootDirectoryName">
                <a-icon slot="prefix" type="folder" style="color:rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
            <!-- 提交 -->
            <a-form-item>
              <a-button type="primary" :disabled="!usearname || !password || !rootDirectoryName" @click="hanldeSaveConfig"> 保存 </a-button>
            </a-form-item>

          </a-form>
          
          <a-divider/>

        </div>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="5" tab="关于"> 这是一个免费开源程序 </a-tab-pane>
  </a-tabs>
</template>

<script>
import fieldSetGroup from '../FieldSetGroup'
import { useDB } from '../../comApi/useDB'
import useWebDAV from '../../comApi/useWebDAV'
import { useCloudConfig } from '../../comApi/useCloudConfig'
import { configJson } from './config'
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
      loading,
      configPath,
      testResult,
      handleCheckAccount,
      hanldeSaveConfig,
      loadWebDavConfig,
      handleSetConfig
    } = useWebDAV()

    const { cloudType, configFilePath, cloudOptions, targetCloudACcount, onSwitchCloud, loadConfig } = useCloudConfig()

    return {
      progress,
      isLoading,
      isDeleteOldDatabse,
      saveDatabaseToJson,
      improtDatabaseByJson,
      handleDeleteDatabse,
      loading,
      configPath,
      testResult,
      handleCheckAccount,
      hanldeSaveConfig,
      loadWebDavConfig,
      handleSetConfig,
      ...toRefs(configJson),

      cloudType,
      configFilePath,
      cloudOptions,
      targetCloudACcount,
      loadConfig,
      onSwitchCloud
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