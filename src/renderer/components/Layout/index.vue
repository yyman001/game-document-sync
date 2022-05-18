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
           <a-button v-if="activeComponentName === 'docs-mod' " @click="onModelOpen">添加</a-button>
          <!-- <a-select
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
            </a-select> -->

            <a-input-search :value="searchText" placeholder="input search text" style="width: 200px" @change="onSearch" @pressEnter="onSearch" />
          </a-space>


        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div class="layout-content" >
          <component :is="activeComponentName" :searchText="searchText"/>
          <!-- doc弹窗 -->
          <DocDialog v-model="isVisible" @handelSubmit="onAdd" @handleExit="onModelClose"/>
        </div>
      </a-layout-content>
    </a-layout>

    <div class="cloud-select">
      <a-select
        style="width: 100px;"
        size="small"
        v-model:value="cloudType"
        :options="cloudOptions"
      ></a-select>
    </div>

  </a-layout>
</template>

<script>
import Menu from '../Menu/'
import gamesMod from '../Games'
import docsMod from '../Doc'
import configMod from '../Config'
import backMod from '../Back'
import useSearch from '../../comApi/useSearch'
import DocDialog from '../Dialog/index.vue'
import useModel from '../../comApi/useModel'
import useMessage from '../../comApi/useMessage'
import useDocs from '../../comApi/useDocs'
import useCloud from '../../comApi/useCloud'
import { useCloudConfig } from '../../comApi/useCloudConfig'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Menu,
    gamesMod,
    docsMod,
    configMod,
    backMod,
    DocDialog
  },
  data () {
    return {
      activeComponentName: 'games-mod'
    }
  },
  computed: {
    ...mapGetters(['getCloudType', 'targetCloudAccount']),
    cloudType: {
      set (v) {
        this.setCloudType(v)
      },
      get () {
        return this.getCloudType
      }
    }
  },
  watch: {
    targetCloudAccount (v) {
      this.switchCloudAccount(v)
    }
  },
  setup () {
    const { searchText, onSearch } = useSearch()
    const { isVisible, onModelOpen, onModelClose } = useModel()
    const { message } = useMessage()
    const { onAddDoc } = useDocs()
    const { switchCloudAccount } = useCloud()
    const { cloudOptions } = useCloudConfig()

    const onAdd = async (docItem) => {
      const game = await onAddDoc(docItem)
      const text = game === null ? '添加失败,游戏可能已经存在!' : '添加成功!'
      message(game !== null, text)

      if (game !== null) {
        onModelClose()
      }
    }

    return {
      searchText,
      onSearch,
      isVisible,
      onModelOpen,
      onModelClose,
      onAdd,

      cloudOptions,
      switchCloudAccount
    }
  },
  methods: {
    ...mapActions(['setCloudType']),
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

.cloud-select {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 9;
}
</style>