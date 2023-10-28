<template>
  <div class="tree-box">
    <div v-if="title" class="tree-box-title">
      <span>{{title}}</span>
    </div>
    <!-- 不支持用slot方式传title -->
    <!-- 如果页面没有title title传false -->
    <div v-else-if="$slots.header" class="tree-box-title">
      <slot name="header"></slot>
    </div>
    <el-tree
      ref="tree"
      v-loading="loading"
      class="tree-box-content tree-line"
      highlight-current
      :node-key="nodeKey"
      style="height: 500px"
      :show-checkbox="showCheckbox"
      check-on-click-node
      :default-checked-keys="defaultCheckedKeys"
      :empty-text="loading ? ' ' : '无数据'"
      :data="data"
      :props="treeProps"
      @node-click="nodeClick"
      @check-change="nodeCheckChange"
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
      default() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    loading: {
      type: Boolean,
      default: () => {}
    },
    title: {
      type: String,
      default: () => ''
    },
    showCheckbox: {
      type: Boolean,
      default: () => {}
    },
    defaultCheckedKeys:{
      type: Array,
      default: () => ['xxx79']
    },
    nodeKey: {
      type: String,
      default: () => 'label'
    },
    
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
    },

    nodeCheckChange(data, checked, indeterminate) {
      this.$emit('node-check', data, checked, indeterminate)
    },
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
