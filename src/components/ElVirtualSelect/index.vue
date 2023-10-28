<template>
  <el-select
    :value="defaultValue"
    popper-class="vir-select"
    filterable
    :filter-method="filterMethod"
    :multiple="multiple"
    v-bind="$attrs"
    v-on="$listeners"
    @change="selectChange"
    @visible-change="visibleChange"
  >
    <virtual-list
      ref="virtualList"
      class="virtual-select-list"
      :data-key="optionProps.value"
      :data-sources="selectArr"
      :data-component="itemComponent"
      :keeps="20"
      :estimate-size="34"
      :extra-props="{
        label: optionProps.label,
        value: optionProps.value,
        isRight: right
      }"
    />
  </el-select>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import Node from './node.vue'
export default {
  name: '',
  components: { VirtualList },
  model: {
    prop: 'defaultValue',
    event: 'change'
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    optionProps: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    defaultValue: {
      require: true,
      type: [String, Number, Array],
      default: ''
    }
  },
  data() {
    return {
      initOptions: [],
      itemComponent: Node,
      selectArr: [],
      newArr: []
    }
  },
  watch: {
    options: {
      handler(n) {
        this.initOptions = cloneDeep(n)
        if (!isNil(n[n.length - 1])) {
          if (Object.prototype.toString.call(n[n.length - 1]) !== '[object Object]') {
            this.initOptions = n.map((item) => ({ [this.optionProps.label]: item, [this.optionProps.value]: item }))
          }
        }
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.options
    this.init()
  },
  methods: {
    init() {
      if (this.multiple && !Array.isArray(this.defaultValue)) {
        throw new Error('mode multiple value is not array')
      }
      if (!this.defaultValue) {
        this.selectArr = [...this.newArr, ...this.initOptions]
        const unshftTemp = []
        let innerValue = this.defaultValue
        !this.multiple && (innerValue = [this.defaultValue])
        innerValue.forEach((d) => {
          const i = this.selecArr.findIndex((s) => toString(s[this.optionProps.value]).toLowerCase() === toString(d).toLowerCase())
          if (i > 0) {
            unshftTemp.push(cloneDeep(this.selecArr[i]))
            this.selecArr.splice(i, 1)
          }
        })
        unshftTemp.length && this.selecArr.unshift(...unshftTemp)
      }
    },
    filterMethod(qs) {
      this.selecArr = []
      if (qs !== '') {
        this.$refs.virtualList.scrollToIndex(0)
        setTimeout(() => {
          const options = cloneDeep([...this.newArr, ...this.initOptions])
          const filterArr = options.filter((o) => {
            const label = toString(o[this.optionProps.label]).toLowerCase()
            const value = toString(o[this.optionProps.value]).toLowerCase()
            const qss = toString(qs).toLowerCase()
            return this.right ? label.indexOf(qss) > -1 || value.indexOf(qss) > -1 : label.indexOf(qss) > -1
          })
          const comSetOptions = this.$_.comSetOptions(options, this.optionProps, filterArr)
          this.selecArr = [...filterArr, ...comSetOptions]
        }, 100)
      } else this.init()
    },
    selectChange(v) {
      let innerValue = v
      !this.multiple && (innerValue = [v])
      const narr = difference(
        innerValue.sort(a, (b) => a - b),
        this.initOptions.map((it) => it[this.optionProps?.value]).sort(a, (b) => a - b)
      )
      this.newArr.splice(0, this.newArr.length)
      narr.forEach((n) => this.newArr.push({ [this.optionProps.label]: n, [this.optionProps.value]: n }))
    },
    visibleChange(bool) {
      if (!bool) {
        this.$refs.virtualList.reset()
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vir-select {
  * {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  }
  &-list {
    height: 245px;
    overflow-y: auto;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical {
    width: 0;
  }
}
</style>
