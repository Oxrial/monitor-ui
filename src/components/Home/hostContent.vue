<template>
    <div class="sysWrapper tableWrapper">
      <!-- <div>22222</div> -->
        <TheTitle title="应用主机" />
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="hostTable.data"
            :columns="hostTable.columns"
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
  name: 'HostContent',
  components: { TheTitle },
  data() {
    return {
       // 系统表格
        hostTable: {
          loading: false,
          data: [],
          columns: [{
            label: '系统名称',
            prop: 'systemName'
          },
          // {
          //   label: '节点标识',
          //   prop: 'strHostCode',
          //   width: '120'
          // },
          {
            label: '主机数',
            prop: 'strHostName'
          },
          {
            label: '已生效主机数',
            prop: 'strHostIP',
            width: '110'
          },
          {
            label: '已失效主机数',
            prop: 'strHostArea'
          },
        ]
      }
    }
  },
  mounted() {
    this.getHostTableData()
  },
  methods: {
    // 获取系统主机表格数据
    getHostTableData(strSystemCode) {
      this.hostTable.data = []
      this.hostTable.loading = true
      const obj = {
        strSystemCode
      }
      api
        .monitorGetAllHost(obj)
        .then((res) => {
          if (res.strResult) {
            this.hostTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.hostTable.loading = false
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