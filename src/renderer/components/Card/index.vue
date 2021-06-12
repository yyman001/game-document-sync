<!--
 * @Author: your name
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
            <div class="card__head" :class="modeStyle"></div>
            <div class="card__body">
                <p class="card__name">{{item.gameName}}</p>
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
    created () {
    },
    beforeDestroy () {
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style type="text/scss" lang="scss">
    .card {
        position: relative;
        border-radius: 4px;
        background-color: #ccc;
        box-shadow: 0 6px 7px 0 rgba(131, 125, 125, 0.13);
        overflow: hidden;

        &__wrap {
            box-sizing: border-box;
            width: 25%;
            padding: 0 .5em 1em;
            overflow: hidden;
        }

        &:hover {
            .card__name {
                color: #ffffff;
            }
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
            display: flex;
            align-items: center;

            position: absolute;
            left: 0;
            bottom: 0;

            width: 100%;
            height: 20%;
            // height: 2.5em;
            // line-height: 2.5em;
            // todo: 磨砂效果
            &::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: #1e6c92;
            }
        }
        &__name {
            position: relative;
            z-index: 1;

            margin: 0;
            padding: 0 1em;
            line-height: initial;
            color: #24273F;
            font-size: 15px;
        }
    }
</style>
