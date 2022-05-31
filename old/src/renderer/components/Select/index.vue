<template>
  <div class="sort-type" :style="{width: `${width}px`}">
    <div>{{action || title}}</div>
    <div class="sort-select">
      <ul class="sort-ul">
        <li
         :key="item.name"
         :class="{action: item.name === action}"
         v-for="item in list" @click.stop=onClick(item)>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    action: String,
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    width: {
      type: Number | String,
      default: 200
    }
  },
  methods: {
    onClick (item) {
      this.$emit('change', item)
    }
  }
}
</script>

<style type="text/scss" lang="scss">
  .sort-type {
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    
    position: relative;
    z-index: 1;

    padding: 0 15px;

    color: #ccc;
    background-color: #4c515a;

    &:hover {
      .sort-select {
        display: block;
      }
    }

  }

  .sort-select {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;

    width: 100%;
    
    background-color: #31353c;
    box-shadow: 0px 5px 10px -4px #000000;

    ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    li {
      padding: 5px 15px;
      line-height: 24px;
      &:hover,
      &.action {
        cursor: pointer;
        color: #31353c;
        background-color: #ccc;
      }
    }

  }
</style>