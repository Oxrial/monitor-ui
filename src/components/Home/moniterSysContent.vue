<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="监控项信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="monitorTable.data"
            :columns="monitorTable.columns"
            :is-show-pagination="false"
        >
          <el-table-column slot="sys" label="已配置系统">
            <template slot-scope="{ row,$index }">
              <span v-for="(item,index) in row.sysList" :key="item">
                <span :style="[!row.expend_flag?{}:{display: (index < 10 ? 'inline-block' : 'none') }]">{{item}}{{row.sysList&&row.sysList.length>0&&row.sysList.length-1==index?'':','}}</span>
              </span>
              <el-button v-if="row.sysList&&row.sysList.length>9&&row['expend_flag']" type="text" icon="el-icon-arrow-down" size="mini" @click="toggle($index,false)">更多</el-button>
              <el-button v-if="row.sysList&&row.sysList.length>9&&!row['expend_flag']" type="text" icon="el-icon-arrow-up" size="mini" @click="toggle($index,true)">收起</el-button>
            </template>
          </el-table-column>
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
  name: 'MoniterSysContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        monitorTable: {
            loading: false,
            data: [],
            columns: [
            {
                label: '监控项标识',
                prop: 'strItem',
                width:80
            },
            {
                label: '监控项名称',
                prop: 'strItemName'
            },
            {
                slot:'sys',
                prop: 'sysList'
            },
        ]},
    }
  },
  mounted() {
    this.getMonitorTableData();
  },
  methods: {
    // 获取系统主机表格数据
    getMonitorTableData() {
      this.monitorTable.data = []
      this.monitorTable.loading = true
      api
        .monitorGetAllMonitor()
        .then((res) => {
          if (res.code) {
            let arr = JSON.parse(res.strResult)||[];
            arr.map(item=>{
              item.expend_flag = true;   //默认收起
            })
            this.monitorTable.data = arr;
          }
        })
        .finally(() => {
          this.monitorTable.loading = false
        })
    },

    toggle(index,flag){
      let arr = this.monitorTable.data;
      arr[index]["expend_flag"] = flag;
      this.monitorTable.data = arr;
    }
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