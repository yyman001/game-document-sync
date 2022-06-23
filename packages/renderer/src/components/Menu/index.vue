<template>
  <div class="menu-wrap">
    <div class="menu">
      <div class="menu__item" v-for="item in menuList" :key="item.key">
        <router-link
          :class="['menu__link', selectedKeys === item.key ? 'is-active' : '']"
          :to="item.path"
          @click.stop="onMenuSelected(item)"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup (props, { emit }) {
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

    const onMenuSelected = (selectedItem: any) => {
      selectedKeys.value = selectedItem.key
      emit('onMenuChange', selectedItem)
    }

    return {
      selectedKeys,
      menuList,

      onMenuSelected
    }
  }
})

</script>

<style lang="scss" scoped>
@import "@/sass/_var.scss";

.menu-wrap {
  display: flex;
  height: 100vh;
  background-color: $color-master;
}

.menu {
  width: 100%;

  &__item {
    padding:0 20px;
  }

  &__link {
    display: block;
    padding: 10px 8px;
    line-height: 1.8;
    border-radius: 5px;
    text-align: left;
    font-weight: 700;
    color: $color-font;
    background-color: transparent;

    &.is-active,
    &:hover {
      color: $color-font-selected;
      background-color: $color-side;
    }
  }
}
</style>
