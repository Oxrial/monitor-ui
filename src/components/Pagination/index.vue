<template>
  <el-pagination
    background
    :layout="(pageObj && pageObj.layout) || layout"
    :pager-count="(pageObj && pageObj.count) || pagerCount"
    :page-sizes="(pageObj && pageObj.sizes) || pageSizes"
    :page-size="(pageObj && pageObj.size) || pageSize"
    :total="(pageObj && pageObj.total) || total"
    :current-page="(pageObj && pageObj.currentPage) || currentPage"
    @size-change="sizeChange"
    @current-change="currentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pageObj: { type: Object, default: () => null },
    layout: { type: String, default: 'total,prev, pager, next, sizes, jumper' },
    pagerCount: { type: Number, default: () => 5 },
    pageSizes: { type: Array, default: () => [10, 20, 30, 40, 50, 100] },
    pageSize: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 }
  },
  data() {
    return {}
  },
  methods: {
    sizeChange(params) {
      this.$emit('size-change', params)
    },
    currentChange(params) {
      this.$emit('current-change', params)
    }
  }
}
</script>
<style></style>
