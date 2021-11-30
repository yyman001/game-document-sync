<template>
  <a-tabs type="card" @change="callback">
    <a-tab-pane key="1" tab="基本设置">

      <a-checkbox @change="onChange">
        随开机启动
      </a-checkbox>
      
    </a-tab-pane>

    <a-tab-pane key="2" tab="备份/还原设置">

      <field-set-group title="临时操作路径">
        <div style="margin-bottom: 16px">
          <a-input addon-before="目录:" default-value="C:\Users\yyman001\AppData\Roaming\Electron">
            <a-icon slot="addonAfter" type="setting" />
          </a-input>
        </div>

        <a-button type="primary">
            恢复默认
        </a-button>
      </field-set-group>

      <field-set-group title="备份路径">
        <div style="margin-bottom: 16px">
          <a-input addon-before="目录:" default-value=".\backup">
            <a-icon slot="addonAfter" type="setting" />
          </a-input>
        </div>

        <a-button type="primary">
            恢复默认
        </a-button>
      </field-set-group>
    </a-tab-pane>

    <a-tab-pane key="3" tab="云同步设置">

      <field-set-group title="oss账号配置">

        <div style="margin-bottom: 16px">
          <a-input default-value="C:\Users\yyman001\AppData\Roaming\Electron\ali-oss.config.js">
            <a-select slot="addonBefore" default-value="阿里云" style="width: 90px">
              <a-select-option value="ali-oss">
                阿里云
              </a-select-option>
              <a-select-option value="七牛oss">
                七牛
              </a-select-option>
            </a-select>
            <a-icon slot="addonAfter" type="setting" />
          </a-input>
        </div>

      </field-set-group>

    </a-tab-pane>

    <a-tab-pane key="4" tab="关于">
      这是一个免费开源程序
    </a-tab-pane>

  </a-tabs>

</template>

<script>
import fieldSetGroup from '../FieldSetGroup'

export default {
  name: 'config-mod',
  components: { fieldSetGroup },
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
</style>