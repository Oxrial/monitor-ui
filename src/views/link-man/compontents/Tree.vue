<template>
  <div class="tree-box">
    <div class="tree-box-title">{{ title }}</div>
    <el-tree
      ref="tree"
      v-loading="loading"
      class="tree-box-content tree-line"
      highlight-current
      node-key="label"
      style="height: calc(100vh - 220px)"
      :empty-text="loading ? ' ' : '无数据'"
      :data="data"
      :prop="treeProps"
      @node-click="nodeClick"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {}
    },
    treeProps: {
      type: Object,
      default: {
        children: 'children',
        label: 'label'
      }
    },
    loading: {
      type: Boolean,
      default: () => {}
    },
    title: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      // treeProps: {
      //   children: 'children',
      //   label: 'label'
      // }
    }
  },
  methods: {
    nodeClick(data, node) {
      this.$emit('node-click', data, node)
    }
  }
}
</script>
<style scoped>
.tree-box {
  background: rgb(25, 81, 176);
  border: 1px solid gray;
  border-radius: 4px;
}
.el-tree {
  position: relative;
  cursor: default;
  background: #091235;
  color: #a5abb7;
}
.tree-box-content {
  overflow: auto;
  height: 693px;
}
.tree-box-title {
  font-size: 16px;
  text-align: left;
  padding: 5px;
  color: #eeeff1;
  border-bottom: 1px solid #8080806b;
  border-radius: 4px;
}
.el-tree-node__content {
  padding-left: 0 !important;
}
.tree-line .el-tree-node {
  position: relative;
  /*padding-left: 16px;*/
}
.tree-line .el-tree-node__children {
  padding-left: 16px;
}
.tree-line .el-tree-node::before {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -26px;
  border-width: 1px;
  border-left: 1px dashed #52627c;
}
.tree-line .el-tree-node:last-child::before {
  height: 38px;
}
.tree-line .el-tree-node::after {
  content: '';
  width: 24px;
  height: 20px;
  position: absolute;
  left: -3px;
  top: 12px;
  border-top: 1px dashed #52627c;
}
.tree-line > .el-tree-node::after {
  border-top: none;
}
.tree-line > .el-tree-node::before {
  border-left: none;
}
.tree-line > .el-tree-node__expand-icon {
  font-size: 16px;
}
.tree-line > .el-tree-node__expand-icon .is-leaf {
  color: transparent;
}
</style>
