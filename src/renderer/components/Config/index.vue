<template>
  <a-tabs type="card" @change="callback">
    <a-tab-pane key="1" tab="基本设置">

      <a-checkbox @change="onChange">
        随开机启动
      </a-checkbox>

      <field-set-group title="界面">
        <a-checkbox>
          测试内容随开机启动
        </a-checkbox>
        <p>哈哈哈是的</p>
      </field-set-group>
      
    </a-tab-pane>
    <a-tab-pane key="2" tab="备份设置">
      Content of Tab Pane 2
    </a-tab-pane>
    <a-tab-pane key="3" tab="云同步设置">
      Content of Tab Pane 3
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