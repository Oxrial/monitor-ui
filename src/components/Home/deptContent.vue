<template>
    <div class="sysWrapper tableWrapper">
      <!-- <div>22222</div> -->
        <TheTitle title="部门信息" />
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="deptTable.data"
            :columns="deptTable.columns"
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
  name: 'DeptContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        deptTable: {
          loading: false,
          data: [],
          columns: [{
            label: '部门名称',
            prop: 'strSystemCode'
          },
          {
            label: '部门人数',
            prop: 'strHostName'
          }
        ]
      }
    }
  },
  mounted() {
    this.getSysTableData()
  },
  methods: {
     // 获取系统主机表格数据
    getSysTableData() {
      this.deptTable.data = []
      this.deptTable.loading = true
      api
        .getDetpList()
        .then((res) => {
          if (res.code) {
            this.deptTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.deptTable.loading = false
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