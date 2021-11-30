<template>
  <a-layout id="components-layout-demo-responsive">
    
    <!-- 左侧栏 -->
    <a-layout-sider
      class="layout-sider"
      collapsed-width="0"
    >
    
    <div class="logo" />
    
    <div class="layout-menu-wrap">
      <Menu @onMenuChange="onSwitch"/>
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
        <div class="layout-content" >
          <component :is="activeComponentName"/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Menu from '../Menu/'
import gamesMod from '../Games'
import docsMod from '../Doc'
import configMod from '../Config'
import backMod from '../Back'

export default {
  components: {
    Menu,
    gamesMod,
    docsMod,
    configMod,
    backMod },
  data () {
    return {
      activeComponentName: 'games-mod'
    }
  },
  methods: {
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
    },
    onSearch () {},
    onSwitch (actvieName) {
      this.activeComponentName = actvieName
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/_var.scss";
@import "../../sass/_tools.scss";

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
    box-shadow: #f4f4f4 0px 0px 0px 2px;
  }

  .layout-menu-wrap {
    padding: 0 15px;
  }

  .ant-menu {
    color: $color-font;
    background-color: transparent;
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
    @include font-weight($color: $color-font-selected);
    &::after {
      content: none;
    }
  }

  .layout-content {
    padding: 24px 12px;
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
}

</style>