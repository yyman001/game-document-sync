<template>
  <div class="menu-wrap">
    <div class="menu">
      <div class="menu__item" v-for="item in menuList" :key="item.key">

        <router-link
          :class="['menu__link', selectedKeys === item.key ? 'is-active' : '']"
          :to="item.path"
          @click.stop="onMenuSelected(item)"
        >
         <AppstoreOutlined v-if="item.icon === 'home' " class="menu__item-icon"/>
         <FolderOutlined v-if="item.icon === 'save' " class="menu__item-icon"/>
         <AppstoreAddOutlined  v-if="item.icon === 'appstore' " class="menu__item-icon"/>
         <SettingOutlined  v-if="item.icon === 'setting' " class="menu__item-icon"/>
         <span> {{ item.name }} </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue'
import { FolderOutlined, AppstoreOutlined, AppstoreAddOutlined, SettingOutlined } from '@ant-design/icons-vue'

const selectedKeys = ref('games')
const menuList = ref([
  {
    key: 'games',
    icon: 'home',
    name: '游戏存档管理',
    path: '/games'
  },
  {
    key: 'backup',
    icon: 'save',
    name: '存档备份管理',
    path: '/backup'
  },
  {
    key: 'docs',
    icon: 'appstore',
    name: '配置存档管理',
    path: '/docs'
  },
  {
    key: 'config',
    icon: 'setting',
    name: '配置信息',
    path: '/config'
  }
])

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  /*  !注意:
  onMenuChange: (selectedItem: any) => void , 方式 emits 会报错,但实际可运行,跟插件检测有关,非正真错误
  */
  (event: 'onMenuChange', selectedItem: any): void
}>()

const onMenuSelected = (selectedItem: any) => {
  selectedKeys.value = selectedItem.key
  emits('onMenuChange', selectedItem)
}
</script>

<style lang="scss" scoped>
@import "@/sass/catppuccin.scss";

.menu-wrap {
  display: flex;
  height: 100vh;
}

.menu {
  width: 100%;

  &__item {
    margin-bottom: 8px;
    padding:0 20px;
    &-icon {
      margin-right: 12px;
      font-size: var(--icon-size);
    }
  }

  &__link {
    display: flex;
    align-content: center;

    padding: 8px;
    line-height: 1.8;
    border-radius: 5px;
    text-align: left;
    font-weight: 700;
    color: var(--text-default);
    background-color: transparent;

    &.is-active,
    &:hover {
      color: var(--text-title);
      background-color: var(--input-background);
    }
  }

}
</style>
