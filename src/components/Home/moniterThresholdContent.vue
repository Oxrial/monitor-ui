<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="系统阈值信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="systemthresholdTable.data"
            :columns="systemthresholdTable.columns"
            :is-show-pagination="false"
        >
        </CommTable>
    </div>
</template>
<script>
import api from '@/api/index'
const TheTitle = {
  props: ['title'],
  template: `
    <div class="main-header">
      <h4>{{title}}</h4>
    </div>
  `
}
export default {
  name: 'MoniterThresholdContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        systemthresholdTable: {
            loading: false,
            data: [],
            columns: [
            {
                label: '监控项标识',
                prop: 'strItem'
            },
            {
                label: '监控项名称',
                prop: 'strItemName'
            },
            {
                label: '预置配置状态',
                prop: 'strItemComment'
            },
        ]}
    }
  },
  mounted() {
    this.getSystemThreshold()
  },
  methods: {
          // 获取系统主机表格数据
    getSystemThreshold() {
      this.systemthresholdTable.data = []
      this.systemthresholdTable.loading = true
      api
        .getSystemThreshold()
        .then((res) => {
          if (res.code) {
            this.systemthresholdTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.systemthresholdTable.loading = false
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.sysWrapper {
  .home{
    background-color: inherit;
    margin-top: 0 !important;
    padding: 0;
  }
}
</style>