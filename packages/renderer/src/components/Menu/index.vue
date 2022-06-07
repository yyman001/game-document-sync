<template>
  <div class="menu-wrap">
    <div class="menu">
      <div class="menu__item" v-for="item in menuList" :key="item.key">
        <router-link
          :class="['menu__link', selectedKeys === item.key ? 'action' : '']"
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
  setup(props, { emit }) {
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
.menu-wrap {
  display: flex;
  height: 100vh;
  background-color: #fff;
}

.menu {
  width: 100%;

  &__item {
    padding: 10px 8px;
  }

  &__link {
    display: block;
    color: #ccc;
    line-height: 1.8;

    &:hover,
    &.action {
      color: #000;
    }
  }
}
</style>
