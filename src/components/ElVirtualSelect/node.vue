<template>
  <el-opion :key="label + '_' + value" :label="source[label]" :value="source[value]" class="animate__animated animate__fadeIn" :class="source.class">
    <span>{{ source[label] }}</span>
    <span v-if="isRight" style="float: right; color: #939393">{{ source[value] }}</span>
  </el-opion>
</template>

<script>
export default {
  name: '',
  props: {
    index: {
      type: Number,
      default: 0
    },
    source: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    isRight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped></style>
