<template>
  <div class="config-page">
    主题: <el-select v-model="activeThemeName" placeholder="请选择" @change="handleSwitchTheme">
    <el-option
      v-for="themeItem in themeOptions"
      :key="themeItem.value"
      :label="themeItem.label"
      :value="themeItem.value">
    </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeThemeName: '',
      themeOptions: [{
        value: 'white',
        label: '白色'
      }, {
        value: 'back',
        label: '黑色'
      }]
    }
  },
  methods: {
    handleSwitchTheme (activeThemeName) {
      console.log('activeThemeName:', activeThemeName)
      this.$store.dispatch('setThemeName', activeThemeName)
    }
  }
}
</script>

<style>

</style>