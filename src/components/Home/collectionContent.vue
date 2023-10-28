<template>
    <div class="sysWrapper tableWrapper">
        <!-- <div>11111</div> -->
        <TheTitle title="采集项信息" /> 
        <CommTable
            is-show-index
            :front-page="false"
            :border="false"
            :table-data="collectionTable.data"
            :columns="collectionTable.columns"
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
        collectionTable: {
            loading: false,
            data: [],
            columns: [
            {
                label: '采集项名称',
                prop: 'strItemName'
            },
            {
                label: '采集项说明',
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
      this.collectionTable.data = []
      this.collectionTable.loading = true
      api
        .getCollectionList()
        .then((res) => {
          if (res.code) {
            this.collectionTable.data = JSON.parse(res.strResult)
          }
        })
        .finally(() => {
          this.collectionTable.loading = false
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