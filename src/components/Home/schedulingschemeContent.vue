<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="调度方案信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="schedulingSchemeTable.data"
            :columns="schedulingSchemeTable.columns"
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
  name: 'SchedulingschemeContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        schedulingSchemeTable: {
            loading: false,
            data: [],
            columns: [
            {
                label: '调度方案名称',
                prop: 'strItemName'
            },
            {
                label: '调度方案说明',
                prop: 'strItem'
            },
            {
                label: '状态',
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
      this.schedulingSchemeTable.data = []
      this.schedulingSchemeTable.loading = true
      api
        .getSchedulingSchemeList()
        .then((res) => {
          if (res.code) {
            this.schedulingSchemeTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.schedulingSchemeTable.loading = false
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