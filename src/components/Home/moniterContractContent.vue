<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="联系人监控信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="usermonitoringlistTable.data"
            :columns="usermonitoringlistTable.columns"
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
  name: 'MoniterContractContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        usermonitoringlistTable: {
            loading: false,
            data: [],
            columns: [
            {
                label: '用户标识',
                prop: 'userCode'
            },
            {
                label: '用户名称',
                prop: 'userName'
            },
            {
                label: '是否配置监控项通知',
                prop: 'strSystemComment',
                enums: { 0: '未配置', 1: '已配置' }
                // formatter:function(row, column, cellValue, index){
                //   debugger
                //   if(cellValue=="0"){
                //     return '未配置'
                //   }else if(cellValue=='1'){
                //     return '已配置'
                //   }else{
                //     return ''
                //   }
                // }
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
      this.usermonitoringlistTable.data = []
      this.usermonitoringlistTable.loading = true
      api
        .getUserMonitorList()
        .then((res) => {
          if (res.code) {
            let data = JSON.parse(res.strResult);
            this.usermonitoringlistTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.usermonitoringlistTable.loading = false
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