<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="监控明细信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="monitorDetailTable.data"
            :columns="monitorDetailTable.columns"
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
  name: 'MoniterDetailContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        monitorDetailTable: {
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
                label: '明细项配置',
                prop: 'strItemComment'
            },
        ]}
    }
  },
  mounted() {
     this.getSysTableData()
  },
  methods: {
      // 获取系统主机表格数据
    getSysTableData() {
      this.monitorDetailTable.data = []
      this.monitorDetailTable.loading = true
      api
        .getMoniterDetailList()
        .then((res) => {
          if (res.code) {
            this.monitorDetailTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.monitorDetailTable.loading = false
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