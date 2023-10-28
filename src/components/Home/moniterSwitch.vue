<template>
  <div style="overflow-x: hidden; height: 100%">
    <el-steps :active="active" :space="200" finish-status="success" simple>
      <el-step title="选择系统" />
      <el-step title="选择监控项" />
      <el-step title="主机状态选择" />
    </el-steps>
    <el-row :gutter="8" class="mgt20">
      <el-col :span="5">
        <Tree title="系统分类树" :loading="itemTreeLoading" :data="sysMonitorTreeData" @node-click="monitorTreeClick" :treeProps="systreeprops"> </Tree>
      </el-col>
      <el-col :span="5">
        <Tree ref="itemTree" :showCheckbox="true" nodeKey="strItem" :loading="sysTreeLoading" :data="itemTreeData" @node-check="handleCheckChange" :treeProps="itemtreeprops" :defaultCheckedKeys="defaultCheckedKeys">
          <template #header>
            <el-checkbox v-model="itemChecked" @change="(value) => handleAllItemChecked(value)"></el-checkbox>
            监控项
          </template>
        </Tree>
      </el-col>
      <el-col :span="14">
        <BaseForm
          ref="hostForm"
          class="host-form"
          :search-data="filter"
          :search-form="searchForm"
          :operation-button-style="'margin-left: 20px'"
          @search="getHostByItem(1)"
        />
        <CommTable
          table-height="376px"
          comtable-style="margin-top: 0"
          :table-data="itemconfigured.data"
          :columns="itemconfigured.columns"
          :page-obj="itemconfigured.pageObj"
        >
          <el-table-column slot="operation" label="监控开关" width="100" align="center">
            <template slot="header" slot-scope="scope" align="left">
              <span style="margin-right: 2px">监控开关</span>
              <el-checkbox v-model="itemconfigured.checked" :indeterminate="itemconfigured.indeterminate" @change="(value) => handleAllChangeCtrl(value)"></el-checkbox>
            </template>
            <template slot-scope="{ row, $index }">
              <!-- <el-switch v-model="row.ctrl" active-color="#13ce66" inactive-color="#ff4949" @change="(value) => handleChangeCtrl(value, $index, row)">
              </el-switch> -->
              <el-checkbox v-model="row.ctrl" @change="(value) => handleChangeCtrl(value, $index, row)"></el-checkbox>
            </template>
          </el-table-column>
        </CommTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/api/index'
import { isEmpty } from 'lodash-es'
import Tree from './compontents/Tree.vue'

export default {
  name: 'MoniterSwitch',
  components: {
    Tree
  },
  data() {
    return {
      active: 0,
      itemTreeLoading: false,
      sysTreeLoading: false,
      userCodeOptions: [],
      sysMonitorTreeData: [],
      itemTreeData: [],
      linkManCodeList: [],
      systreeprops: {
        children: 'children',
        label: 'systemName'
      },
      itemtreeprops: {
        children: 'children',
        label: 'strItemName'
      },
      // 树形控件选中的数据
      selectTreeData: {
        strItem: '',
        strSubItem: '',
        strSystemCode: '',
        strHostCode: ''
      },
      // 存储勾选数据的数组
      linkManList: [],
      warnLinkManList: [],
      dangerLinkManList: [],
      // 选中的树形节点名称
      tableTitle: {
        item: '',
        subItem: '',
        sysName: '',
        hostName: ''
      },
      // 筛选表单
      filter: {
        strHostCode: '',
        strHostIP: ''
      },
      searchForm: [{ ...this.$_.formItem('节点标识', 'Input', 'strHostCode', false) }, { ...this.$_.formItem('IP地址', 'Input', 'strHostIP', false) }],

      // 主机
      itemconfigured: {
        columns: [
          {
            label: '节点标识',
            prop: 'strHostCode',
            width: '120'
          },
          {
            label: '节点名称',
            prop: 'strHostName'
          },
          {
            label: '节点说明',
            prop: 'strHostComment'
          },
          {
            label: 'IP地址',
            prop: 'strHostIP',
            width: '110'
          },
          {
            label: '节点存放地',
            prop: 'strHostArea'
          },
          {
            slot: 'operation'
          }
        ],
        data: [],
        pageObj: {
          size: 20,
          sizes: [20, 50, 100],
          layout: 'total, sizes, prev, pager, next, jumper',
          total: 0,
          currentPage: 1,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'itemconfigured'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'itemconfigured')
        },
        checked: false,
        indeterminate: false
      },
      itemChecked:false,
      defaultCheckedKeys:[]
    }
  },
  created() {
    this.getSysItemTreeData()
  },
  methods: {
    // 获取主机列表信息
    getHostByItem(currentPage) {
      const { strItem } = this.selectTreeData
      if (!strItem) return
      this.linkmanTableLoading = true
      const obj = {
        rows: this.itemconfigured.pageObj.size,
        page: this.itemconfigured.pageObj.currentPage,
        strItem: strItem,
        strHostCode: this.filter.strHostCode,
        strHostIP: this.filter.strHostIP
      }
      api
        .getHostByMoniterItem(obj)
        .then((res) => {
          this.active = 3
          this.itemconfigured.pageObj.total = 0
          this.itemconfigured.data = []
          if (res.strResult) {
            this.itemconfigured.pageObj.total = res.strResult.size
            this.itemconfigured.data = res.strResult.data
            let ischecked = (res.strResult.data || []).every((item) => item.ctrl == true)
            let isindeterminate = (res.strResult.data || []).some((item) => item.ctrl == true)
            this.itemconfigured.checked = ischecked
            this.itemconfigured.indeterminate = isindeterminate
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.linkmanTableLoading = false
        })
    },

    handleCheckChange(data, node) {
      this.active = 1
      this.clearFilter('hostForm')
      this.itemconfigured.pageObj.total = 0
      this.itemconfigured.pageObj.currentPage = 1
      this.itemconfigured.pageObj.size = 20
      this.itemconfigured.data = []
      this.selectTreeData.strItem = data.strItem   //待定==实际使用中为数组
      //selectTreeData对应的标识设置为已选择
      this.active = 2
      this.getHostByItem(1)
    },

    handleAllItemChecked(value){
      this.itemChecked = value;
      this.active = 1
      this.clearFilter('hostForm')
      this.itemconfigured.pageObj.total = 0
      this.itemconfigured.pageObj.currentPage = 1
      this.itemconfigured.pageObj.size = 20
      this.itemconfigured.data = []
      if(value){
        //获取全部item
        this.defaultCheckedKeys = (this.itemTreeData||[]).map(item=>item.strItem)
      }else{
        //空数组，host都不展示
        this.defaultCheckedKeys = [];
        this.$refs.itemTree.$refs.tree.setCheckedKeys([])
      }
      this.selectTreeData.strItem = this.defaultCheckedKeys   //待定==实际使用中为数组
      this.active = 2
      this.getHostByItem(1)
    },
    // 获取监控项树形组件数据
    getItemTreeData(strSysCode) {
      this.sysTreeLoading = true
      const obj = {
        strSysCode: strSysCode
      }
      api
        .monitorItemTreeHome(obj)
        .then((res) => {
          this.itemTreeData = []
          if (res.strResult && res.strResult.length) {
            this.itemTreeData = res.strResult
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.sysTreeLoading = false
        })
    },

    // 点击监控树形组件节点
    monitorTreeClick(data, node) {
      this.active = 0
      this.clearFilter('hostForm')
      this.itemconfigured.pageObj.total = 0
      this.itemconfigured.pageObj.currentPage = 1
      this.itemconfigured.pageObj.size = 20
      this.itemconfigured.data = []
      this.$nextTick(() => {
        this.$refs.itemTree.$refs.tree.setCurrentKey(null)
      })

      this.selectTreeData.strItem = node.parent.data.code
      this.selectTreeData.strSubItem = data.code
      this.tableTitle.item = node.parent.data.label
      this.tableTitle.subItem = data.label
      this.getItemTreeData(data.strSysCode)
      this.active = 1
    },

    // 获取系统监控项组件数据
    getSysItemTreeData() {
      this.itemTreeLoading = true
      api
        .sysmonitorItemTree()
        .then((res) => {
          this.sysMonitorTreeData = []
          if (res.strResult && res.strResult.length) {
            this.sysMonitorTreeData = res.strResult
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.itemTreeLoading = false
        })
    },

    handleChangeCtrl(value, index, row) {
      let arr = this.itemconfigured.data
      arr[index]['ctrl'] = value
      this.itemconfigured.data = [...arr]
    },

    handleAllChangeCtrl(value) {
      let arr = this.itemconfigured.data
      arr.map((item) => {
        item['ctrl'] = value
      })
      this.itemconfigured.data = [...arr]
      this.itemconfigured.indeterminate = false
    },

    // 清除表单数据
    clearFilter(formName) {
      this.$refs[formName].resetForm()
    }
  }
}
</script>
<style scoped lang="scss">
.el-steps--simple {
  background: rgb(25, 81, 176);

  ::v-deep .is-wait {
    color: #eeeeee;
  }
}
.host-form {
  ::v-deep .el-input__inner {
    width: 200px !important;
  }
}
.search-form[data-v-a6d488b0] {
  padding: 0;
}
.el-dialog .search-form {
  width: 100%;
}
</style>
