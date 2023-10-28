<template>
  <div>
    <el-tree
      ref="tree"
      v-loading="(treeConfig && treeConfig.loading) || loading"
      show-checkbox
      :node-key="(treeConfig && treeConfig.nodeKey) || nodeKey"
      :empty-text="(treeConfig && treeConfig.emptyText) || emptyText"
      :data="(treeConfig && treeConfig.data) || data"
      :props="(treeConfig && treeConfig.props) || props"
      :default-checked-keys="(treeConfig && treeConfig.defaultCheckedKeys) || defaultCheckedKeys"
      :default-expanded-keys="(treeConfig && treeConfig.defaultExpandedKeys) || defaultExpandedKeys"
      @check="$emit('check')"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseTree',
  props: {
    treeConfig: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
    nodeKey: { type: String, default: 'id' },
    emptyText: { type: String, default: '无数据' },
    data: { type: Array, default: () => [] },
    props: { type: Object, default: () => {} },
    defaultCheckedKeys: { type: Array, default: () => [] },
    defaultExpandedKeys: { type: Array, default: () => [] }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped></style>
