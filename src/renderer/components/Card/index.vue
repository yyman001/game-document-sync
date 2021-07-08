<!--
 * @Author: yyman001
 * @Date: 2021-01-16 18:56:52
 * @LastEditTime: 2021-06-12 20:46:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \game-document-sync\src\renderer\components\Card\index.vue
-->
<!--
 vue file
 -->
<template>
  <div class="card__wrap">
    <div class="card">
      <a class="card__editor" title="编辑" @click.stop="onClick('editor')"
        ><i class="el-icon-setting"></i
      ></a>
      <a class="card__del" title="删除" @click.stop="onClick('del')"
        ><i class="el-icon-close"></i
      ></a>

      <div class="card__head" :class="modeStyle"></div>
      <div class="card__body">
        <div class="card__name">{{ item.gameName }}</div>

        <div class="card__buttons">
          <el-button type="danger" size="small" @click.stop="onClick('restore')"
            >还原</el-button
          >
          <el-button type="primary" size="small" @click.stop="onClick('backup')"
            >备份</el-button
          >
        </div>
        <div class="card__label-time">
          <span>备份时间:</span>
          <i>2021-07-08 16:29:32</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  components: {},
  props: {
    item: Object
  },
  data () {
    return {
      mode: 'vertical'
    }
  },
  watch: {},
  computed: {
    modeStyle () {
      return `is-${this.mode}`
    }
  },
  created () {},
  beforeDestroy () {},
  mounted () {},
  methods: {
    onClick (type) {
      this.$emit('handleClick', [type, this.item])
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.card {
  position: relative;
  background-color: #ccc;
  overflow: hidden;

  &__editor {
    position: absolute;
    top: 0;
    left: -100%;
    padding: 0.25em;
    font-size: 1.2em;
    cursor: pointer;
    color: #909399;
    opacity: 0.5;
    transition: all 0.4s ease-in-out;
    &:hover {
      color: #24282f;
    }
  }

  &__del {
    position: absolute;
    top: 0;
    right: -100%;
    padding: 0.25em;
    font-size: 1.2em;
    cursor: pointer;
    color: #909399;
    opacity: 0.5;
    transition: all 0.4s ease-in-out;
    &:hover {
      color: #24282f;
    }
  }

  &__wrap {
    box-sizing: border-box;
    width: 25%;
    padding: 0 0.5em 1em;
    overflow: hidden;
  }

  &:hover {
    .card__editor {
      opacity: 1;
      left: 0;
    }
    .card__del {
      opacity: 1;
      right: 0;
    }
    // .card__body {
    //     bottom: 0;
    //     opacity: 1;
    // }
  }

  &__head {
    .is-horizontal {
      padding-top: 56%;
    }
    &.is-vertical {
      padding-top: 125%;
    }
  }

  &__body {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    // bottom: -100%;
    padding: 6% 9%;
    width: 100%;
    // opacity: .5;
    color: #ffffff;
    background: linear-gradient(315deg, #213c55 5%, #016968 95%);
    // transition: bottom .6s ,opacity .5s;
  }
  &__name {
    margin-bottom: 0.3em;
    font-weight: bold;
    font-size: 1.2em;
    text-align: justify;
    word-break: break-all;
  }
  &__buttons {
    padding: 0.8em 0;
  }
  &__label-time {
    color: #959595;
    font-size: 12px;
    i {
      font-style: normal;
      color: #fff;
      white-space: nowrap;
    }
  }
}
</style>
