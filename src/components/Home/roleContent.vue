<template>
  <div class="sysWrapper tableWrapper">
    <TheTitle title="角色信息" />
    <CommTable is-show-index :front-page="false" :border="false" :table-data="sysTable.data" :columns="sysTable.columns" :is-show-pagination="false">
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
  name: 'SystemContent',
  components: { TheTitle },
  data() {
    return {
      // 系统表格
      sysTable: {
        loading: false,
        data: [],
        columns: [
          {
            label: '角色名称',
            prop: 'strSystemCode'
          },
          {
            label: '角色说明',
            prop: 'strSystemName'
          },
        ]
      }
    }
  },
  mounted() {
    this.getSysTableData()
  },
  methods: {
    // 获取应用系统表格数据
    getSysTableData() {
      this.sysTable.data = []
      this.sysTable.loading = true
      api
        .monitorSysinfoconsult()
        .then((res) => {
          if (res.strResult) {
            const rs = JSON.parse(res.strResult)
            this.sysTable.data = rs
          }
        })
        .finally(() => {
          this.sysTable.loading = false
        })
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