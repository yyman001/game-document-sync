<template>
  <div class="card__wrap">
    <div class="card" :class="cardStyle">
      <div class="card__head" :class="modeStyle" :style="{ backgroundImage: `url(${verticalCover(item.steamId)})` }">
      </div>
      <div class="card__body">
        <div class="card__info">
          <div class="card__name">{{ item.gameName }}</div>
          <div class="card__buttons">
            <a-button :disabled="!hasDoc" type="danger" size="small" @click.stop="onClick('restore')">还原</a-button>
            <a-button :disabled="!hasDoc" type="primary" size="small" @click.stop="onClick('backup')">备份</a-button>
          </div>
          <div>
            <slot></slot>
          </div>
          <div class="card__label-time">
            <span>备份时间:</span>
            <i>{{ item.lastBackTime === null ? '无' : formatTimestamp(item.lastBackTime) }}</i>
          </div>
        </div>
      </div>

      <a class="card__editor" title="编辑" @click.stop="onClick('editor')"></a>
      <a class="card__del" title="删除" @click.stop="onClick('del')"></a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { horizontalCover, verticalCover } from '@/utils/steamPrivew'

export default defineComponent({
  components: {},
  props: {
    hasDoc: {
      type: Boolean,
      default: false
    },
    item: Object
  },

  setup (props, { emit }) {
    const mode = ref<string>('vertical')

    const modeStyle = computed(() => {
      return `is-${unref(mode)}`
    })

    const cardStyle = computed(() => {
      return [props.hasDoc ? '' : 'is-empty', `card--border-shadow${props.hasDoc ? '' : '__empty'}`]
    })

    const onClick = (type: string) => {
      emit('handleClick', [type, props.item])
    }

    return {
      mode,
      modeStyle,
      cardStyle,

      onClick,

      formatTimestamp,
      horizontalCover,
      verticalCover
    }
  }
})
</script>

<style type="text/scss" lang="scss">
// box-shadow-demo: https://getcssscan.com/css-box-shadow-examples
.card {
  position: relative;
  background-color: #ccc;
  overflow: hidden;

  &--border-shadow {
    box-shadow: #fcfcfc 0px 0px 0px 2px, #141416 0px 0px 0px 4px,
      rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  }

  &--border-shadow__empty {
    box-shadow: #fcfcfc 0px 0px 0px 2px, #d9d9d9 0px 0px 0px 4px,
      rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  }

  &--normal-shadow {
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  }

  // 无存档显示灰色图
  &.is-empty {
    filter: grayscale(100%);
  }

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
    padding: 0.5em 1em;
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

    .card__body {
      top: 0;
      opacity: 0.9;
    }
  }

  &__head {
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100% auto;

    .is-horizontal {
      padding-top: 56%;
    }

    &.is-vertical {
      padding-top: 150%;
    }
  }

  &__body {
    box-sizing: border-box;
    position: absolute;
    top: 100%;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    color: #ffffff;
    transition: top 0.6s, opacity 0.5s;
  }

  &__info {
    position: absolute;
    box-sizing: border-box;
    left: 0;
    bottom: 0;

    padding: 6% 9%;
    width: 100%;
    background: linear-gradient(315deg, #213c55 5%, #016968 95%);
  }

  &__name {
    padding-bottom: 0.3em;
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
