<template>
  <a-layout id="components-layout-demo-responsive">
    
    <!-- 左侧栏 -->
    <a-layout-sider
      class="layout-sider"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
    
    <div class="logo" />
    
    <div class="layout-menu-wrap">
      <Menu/>
    </div>
    </a-layout-sider>

    <!-- 右侧栏 -->
    <a-layout>
      <a-layout-header>
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
          class="layout-content"
          :style="{ padding: '24px', minHeight: '360px' }"
        >
          <Table/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Menu from '../Menu/'
import Table from '../Table'

export default {
  components: { Menu, Table },
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

<style lang="scss">
@import "../../sass/_var.scss";

#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

.themes {

  .ant-layout {
    background-color: $color-bg;
  }

  .ant-layout-sider,
  .ant-layout-header { 
    background-color: $color-master;
  }

  .layout-menu-wrap {
    padding: 0 15px;
  }

  .ant-menu {
    color: $color-font;
  }

  .ant-menu-inline {
    border-right: none;
    .ant-menu-item {
      border-radius: 10px;
    }
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected,
  .ant-menu-item:hover {
    color: $color-font-selected;
    background-color: $color-side;
    font-weight: bold;
    &::after {
      content: none;
    }
  }

  .layout-content {
    background-color: $color-master;
  }
  
   // 搜索框
   .ant-input:focus,
   .ant-input:hover {
     border-color: $color-font-selected !important;
     box-shadow: 0 0 0 2px $color-side;
   }

}

.layout-sider-wrap {
  border-radius: 5px;
  // box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
}

</style>