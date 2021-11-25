<template>
  <a-layout id="components-layout-demo-responsive">
    <!-- 左侧栏 -->
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
    <div class="logo" />
    <Menu/>
    </a-layout-sider>

    <!-- 右侧栏 -->
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" >
        <div class="div">
          <a-space :size="8">
          <a-select
              show-search
              placeholder="Select a person"
              option-filter-prop="children"
              style="width: 200px"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
            >
              <a-select-option value="jack">
                Jack
              </a-select-option>
              <a-select-option value="lucy">
                Lucy
              </a-select-option>
              <a-select-option value="tom">
                Tom
              </a-select-option>
            </a-select>

            <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
          </a-space>


        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          content
        </div>
      </a-layout-content>
      <a-layout-footer style="textalign: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import Menu from '../Menu/'
export default {
  components: { Menu },
  methods: {
    onCollapse (collapsed, type) {
      console.log(collapsed, type)
    },
    onBreakpoint (broken) {
      console.log(broken)
    },

    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>