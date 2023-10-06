<template>
  <div class="card__wrap">
    <div class="card" :class="cardStyle">
      <div
        class="card__head"
        :class="modeStyle"
        :style="{ backgroundImage: `url(${verticalCover(item.steamId)})` }"
      ></div>
      <div class="card__body">
        <div class="card__action backdrop-filter" :class="isActiveClass">
          <a class="card__run" :class="appRunStyle" title="运行" @click.stop="onClick('run')">
            <CloseOutlined
              v-if="isTargetGameDoc && appStatus !== 'unstart'"
              style="font-size: 32px; color: #fff"
            />
            <CaretRightOutlined v-else style="font-size: 32px; color: #fff" />
          </a>
          <div class="card__game-info">
            <div class="info__title">游戏时间</div>
            <div class="info__text">过去两周: {{ generateTimeSummary(0) }}</div>
            <div class="info__text">总数: {{ generateTimeSummary(item.playtime || 0) }}</div>
          </div>
        </div>
        <!-- <div class="card__info">
          <div class="card__label-time">
            <span>备份时间:</span>
            <i>{{ item.lastBackTime === null ? '无' : formatTimestamp(item.lastBackTime) }}</i>
          </div>
        </div> -->
      </div>

      <a class="card__editor" title="编辑" @click.stop="onClick('editor')"></a>
      <a class="card__del" title="删除" @click.stop="onClick('del')"></a>

      <div class="card__buttons">
        <a-button type="danger" size="small" @click.stop="onClick('restore')">还原</a-button>
        <a-button
          :disabled="!hasGameDoc"
          type="primary"
          size="small"
          @click.stop="onClick('backup')"
          >备份</a-button
        >
      </div>
    </div>
    <div class="card-name ellipsis">{{ item.nickName }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs, unref } from 'vue'
import { generateTimeSummary } from '@/utils/formatTimestamp'
import { horizontalCover, verticalCover } from '@/utils/steamPrivew'
import { GameItem } from '@/model'
import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons-vue'

export type CardEmitItem = [string, GameItem]

export default defineComponent({
  components: { CaretRightOutlined, CloseOutlined },
  props: {
    hasGameDoc: {
      type: Boolean,
      default: false
    },
    appStatus: {
      type: String,
      default: ''
    },
    appName: {
      type: String,
      default: ''
    },
    item: {
      required: true,
      type: Object as PropType<GameItem>
    }
  },

  setup(props, { emit }) {
    const { hasGameDoc, item, appStatus, appName } = toRefs(props)
    const mode = ref<string>('vertical')

    const modeStyle = computed(() => {
      return `is-${unref(mode)}`
    })

    const cardStyle = computed(() => {
      return [
        unref(hasGameDoc) ? '' : 'is-empty',
        `card--normal-shadow${unref(hasGameDoc) ? '' : '__empty'}`
      ]
    })

    const isTargetGameDoc = computed(() => {
      return unref(appName) === unref(item).gameDocDir
    })

    const isLoading = computed(() => {
      return unref(appStatus) === 'loading'
    })

    const appRunStyle = computed(() => {
      // TODO: 判断是否存在游戏路径配置,才可以运行游戏
      return [
        unref(isLoading) && unref(isTargetGameDoc) ? 'card__run--started' : 'card__run--unstart'
      ]
    })

    const isActiveClass = computed(() => {
      return [unref(isLoading) && unref(isTargetGameDoc) ? 'is-active' : '']
    })

    const onClick = (type: string) => {
      emit('handleClick', [type, unref(item)])
    }

    return {
      mode,
      modeStyle,
      cardStyle,
      appRunStyle,
      isActiveClass,
      isTargetGameDoc,

      onClick,

      horizontalCover,
      verticalCover,
      generateTimeSummary
    }
  }
})
</script>

<style type="text/scss" lang="scss">
// box-shadow-demo: https://getcssscan.com/css-box-shadow-examples
.card {
  position: relative;
  background-color: #ccc;
  // overflow: hidden;

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

  &__action {
    display: flex;
    padding: 0.5em;

    opacity: 0;
    visibility: hidden;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }

  &__run {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 6%;
    padding: 8%;
    border-radius: 4px;
    background: #fff;

    transition: all 0.4s ease-in-out;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;

      box-shadow: -1px -1px 5px -1px rgb(0 0 0 / 46%), 2px 2px 5px 0px rgb(0 0 0 / 46%);
    }

    // 未启动
    &--unstart,
    // 启动中
    &--starting {
      box-shadow: inset 0 0 30px 20px #32bc40;
    }
    // 已启动
    &--started {
      // background: #1e81ad;
      box-shadow: inset 0 0 30px 20px #1e81ad;
    }
  }

  &__wrap {
    box-sizing: border-box;
    width: 25%;
    padding: 1em;
    overflow: hidden;
  }

  &:hover {
    .card__action {
      opacity: 1;
      visibility: visible;
    }

    .card__editor {
      opacity: 1;
      left: 0;
    }

    .card__del {
      opacity: 1;
      right: 0;
    }

    .card__buttons {
      top: 100%;
      opacity: 1;
      visibility: visible;
    }
  }

  &__head {
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;

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
    left: 0;
    bottom: 0;

    width: 100%;
    color: #ffffff;
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
    display: flex;
    justify-content: space-between;

    position: absolute;
    left: 0;
    top: 80%;

    width: 100%;

    opacity: 0;
    visibility: hidden;

    // transition: all 0.3s ease-in;

    button {
      display: block;
      width: 50%;
      padding: 0.2em 0;
      height: auto;
    }
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

.card__game-info {
  font-size: 12px;
}
.info__title {
  color: rgb(255 255 255 / 90%);
}
.info__text {
  color: rgb(255 255 255 / 60%);
}

.card-name {
  margin-top: 8px;
  font-size: 13px;
  color: #d9d9d9;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.backdrop-filter {
  backdrop-filter: blur(10px);
  box-shadow: inset 0 0 75px -30px #e6f7ff;
}
</style>
