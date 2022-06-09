<template>
  <fieldset class="fieldset">
    <legend>{{ title }}</legend>
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  name: 'fieldSetGroup',
  props: {
    title: {
      type: String,
      default: 'Group name'
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/_var.scss";
.fieldset {
  margin-bottom: 10px;
  padding: 15px;
  color: $color-font-selected;
  border: 1px solid #e8e8e8;

  legend {
    margin: 0;
    padding: 2px;
    width: auto;
    font-size: 14px;
  }
}
</style>
