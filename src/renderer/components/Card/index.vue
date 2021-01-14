<!--
 vue file
 -->
<template>
    <div class="card__wrap">
        <div class="card">
            <div class="card__head"></div>
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
      }
    },
    watch: {},
    computed: {},
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
        &__wrap {
            width: 25%;
            padding: 0 .5em 1em;
            overflow: hidden;
        }

        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 6px 7px 0 rgba(131, 125, 125, 0.13);

        &:hover {
            .card__name {
                color: #ffffff;
                background-color: #419BF9;
            }
        }

        &__head {
            padding-top: 56%;
            background-color: #ccc;
        }
        &__body {
            height: 2.5em;
            line-height: 2.5em;
        }
        &__name {
            padding: 0 1em;
            color: #24273F;
            font-size: 18px;
        }
    }
</style>
