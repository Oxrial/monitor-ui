<template>
  <div style="overflow-x: hidden">
    <el-steps :active="active" :space="200" finish-status="success" simple>
      <el-step title="选择监控子项" />
      <el-step title="选择系统主机" />
      <el-step title="查询联系人列表" />
    </el-steps>
    <el-row :gutter="8" class="mgt20">
      <el-col :span="5">
        <Tree title="监控关系树形图" :loading="itemTreeLoading" :data="monitorTreeData" @node-click="monitorTreeClick" :treeProps="systreeprops" />
      </el-col>
      <el-col :span="5">
        <Tree
          ref="sysTree"
          :loading="sysTreeLoading"
          :data="sysTreeData"
          :showCheckbox="true" 
          nodeKey="label"
          @node-click="sysTreeClick"
          :treeProps="itemtreeprops"
          :defaultCheckedKeys="defaultCheckedKeys"
        >
          <template #header>
            <el-checkbox v-model="itemChecked" @change="(value) => handleAllSysChecked(value)"></el-checkbox>
            系统
          </template>
        </Tree>
      </el-col>
      <el-col :span="14">
        <BaseForm
          ref="linkManForm"
          class="link-man-form"
          :search-data="filter"
          :search-form="searchForm"
          :search-handle="searchHandle"
          :operation-button-style="'margin-left: 20px'"
          @search="getLinkmen(1)"
        />
        <CommTable
          table-height="376px"
          comtable-style="margin-top: 0"
          :table-data="configured.data"
          :columns="configured.columns"
          :page-obj="configured.pageObj"
          selection
          @handle-selection-change="
            (v) => {
              selectionChange(v, 'linkMan')
            }
          "
        >
          <el-table-column slot="strLevel" label="告警等级">
            <template slot-scope="scope">
              {{ scope.row.strLevel === '1' ? '正常' : scope.row.strLevel === '2' ? '风险' : scope.row.strLevel === '3' ? '危险' : '' }}
            </template>
          </el-table-column>
          <el-table-column slot="strState" label="联系人状态">
            <template slot-scope="scope">
              {{ scope.row.strState === '0' ? '无效' : scope.row.strState === '1' ? '有效' : '' }}
            </template>
          </el-table-column>
          <el-table-column slot="strUserLevel" label="联系人级别">
            <template slot-scope="scope">
              {{
                scope.row.strUserLevel === '1' ? '系统负责人' : scope.row.strUserLevel === '2' ? '处室领导' : scope.row.strUserLevel === '3' ? '部门领导' : ''
              }}
            </template>
          </el-table-column>
          <el-table-column slot="operation" label="监控开关" width="100" align="center">
            <template slot="header" slot-scope="scope" align="left">
              <span style="margin-right: 2px">监控开关</span>
              <el-checkbox v-model="configured.checked" :indeterminate="configured.indeterminate" @change="(value) => handleAllChangeCtrl(value)"></el-checkbox>
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
  name: 'ContractSwitch',
  components: {
    Tree
  },
  data() {
    const searchFormProps = [
      { label: 'label', value: 'value' },
      { label: 'strUserName', value: 'strUserCode' }
    ]
    const searchFormOptions = {
      strState: [
        {
          value: '0',
          label: '无效'
        },
        {
          value: '1',
          label: '有效'
        }
      ],
      strUserLevel: [
        {
          value: '3',
          label: '部门领导'
        },
        {
          value: '2',
          label: '处室领导'
        },
        {
          value: '1',
          label: '系统负责人'
        }
      ]
    }
    return {
      active: 0,
      itemTreeLoading: false,
      sysTreeLoading: false,
      userCodeOptions: [],
      monitorTreeData: [],
      sysTreeData: [],
      linkManCodeList: [],
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
        strUserCode: '',
        strUserMobile: '',
        strState: ''
      },
      searchForm: [
        {
          label: '联系人标识',
          type: 'Select',
          prop: 'strUserCode',
          // 渲染数组
          options: [],
          // 下拉转换
          props: searchFormProps[1]
        },
        {
          label: '联系人号码',
          type: 'Input',
          prop: 'strUserMobile'
        },
        {
          label: '联系人状态',
          type: 'Select',
          prop: 'strState',
          options: searchFormOptions.strState,
          props: searchFormProps[0]
        }
      ],
      // 已配置联系人表格数据
      configured: {
        columns: [
          {
            label: '联系人标识',
            prop: 'strUserCode'
          },
          {
            label: '联系人号码',
            prop: 'strUserMobile'
          },
          {
            label: '联系人部门',
            prop: 'strUserDept'
          },
          {
            slot: 'strUserLevel'
          },
          {
            slot: 'strState'
          },
          {
            slot: 'strLevel'
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
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'configured'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'configured')
        },
        checked:false,
        indeterminate: false
      },
      // 弹窗
      dialog: {
        show: false,
        title: ''
      }
    }
  },
  created() {
    this.getMonitorTreeData()
    this.getuserCode()
  },
  methods: {
    // 获取未配置联系人
    getNotConfigLinkMan(strLevel) {
      const { strItem, strSubItem, strSystemCode, strHostCode } = this.selectTreeData
      const obj = { strItem, strSubItem, strSystemCode, strHostCode, strLevel }
      this.batchAddConfig.loading = true
      this.changeBatchAddConfigData(strLevel)
      api
        .confEnableLinkman(obj)
        .then((res) => {
          const rs = res.strResult
          if (rs) {
            this.changeBatchAddConfigData(strLevel, rs)
          }
        })
        .finally(() => {
          this.batchAddConfig.loading = false
        })
    },
    changeBatchAddConfigData(level, data = []) {
      level === '2' ? (this.batchAddConfig.warnData = data) : (this.batchAddConfig.dangerData = data)
    },

    // 根据联系人标识获取相关信息
    getUserInfo(userCode) {
      this.dialogFilter.strUserMobile = ''
      this.dialogFilter.strUserDept = ''
      this.dialogFilter.strUserLevel = ''
      if (isEmpty(userCode)) return
      const obj = {
        userCode
      }
      api.monitorGetUserByUserCode(obj).then((res) => {
        if (res.strResult) {
          const rs = res.strResult
          this.dialogFilter.strUserMobile = rs.strUserMobile
          this.dialogFilter.strUserDept = rs.strUserDept
          this.dialogFilter.strUserLevel = rs.strUserLevel
        }
      })
    },

    // 判断是否已选择左边两个关系树，符合条件展示弹窗
    beforeShowDialog(title) {
      const { item, subItem, sysName, hostName } = this.tableTitle
      if (!item || !subItem) {
        return this.$message({
          type: 'info',
          message: '请选择监控子项'
        })
      } else if (!sysName || !hostName) {
        return this.$message({
          type: 'info',
          message: '请选择系统主机'
        })
      }
      switch (title) {
        case '批量添加':
          this.showBatchAddDialog()
          break
      }
      this.dialog.show = true
    },


    // 获取联系人列表信息
    getLinkmen(currentPage) {
      const { strItem, strSubItem, strSystemCode, strHostCode } = this.selectTreeData
      if (!strItem && !strSubItem && !strSystemCode && !strHostCode) return
      this.linkmanTableLoading = true
      currentPage && (this.configured.pageObj.currentPage = currentPage)
      const obj = {
        rows: this.configured.pageObj.size,
        page: this.configured.pageObj.currentPage,
        strItem: strItem,
        strSubItem: strSubItem,
        strSysCode: strSystemCode,
        strHostCode: strHostCode,
        strUserCode: this.filter.strUserCode,
        strUserMobile: this.filter.strUserMobile,
        strState: this.filter.strState,
        strUserDept: '',
        strUserLevel: ''
      }
      api
        .monitorLinkmanmanage(obj)
        .then((res) => {
          this.active = 3
          this.configured.pageObj.total = 0
          this.configured.data = []
          if (res.strResult) {
            this.configured.pageObj.total = res.strResult.size
            this.configured.data = res.strResult.data
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

    handleAllSysChecked(value){
      this.itemChecked = value;
      this.active = 1
      this.clearFilter('hostForm')
      this.configured.pageObj.total = 0
      this.configured.pageObj.currentPage = 1
      this.configured.pageObj.size = 20
      this.configured.data = []
      if(value){
        //获取全部item
        this.defaultCheckedKeys = (this.itemTreeData||[]).map(item=>item.strItem)
      }else{
        //空数组，host都不展示
        this.defaultCheckedKeys = [];
        this.$refs.sysTree.$refs.tree.setCheckedKeys([])
      }
      this.selectTreeData.strItem = this.defaultCheckedKeys   //待定==实际使用中为数组
      this.active = 2
      this.getHostByItem(1)
    },
    // 获取系统树形组件数据
    getSysTreeData(strItem, strSubitem) {
      this.sysTreeLoading = true
      const obj = {
        strItem: strItem,
        strSubitem: strSubitem
      }
      api
        .monitorItemHostTree(obj)
        .then((res) => {
          this.sysTreeData = []
          if (res.strResult && res.strResult.length) {
            this.sysTreeData = res.strResult;
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
      this.clearFilter('linkManForm')
      this.configured.pageObj.total = 0
      this.configured.pageObj.currentPage = 1
      this.configured.pageObj.size = 20
      this.configured.data = []
      this.$nextTick(() => {
        this.$refs.sysTree.$refs.tree.setCurrentKey(null)
      })
      if (node.parent.data.code) {
        this.selectTreeData.strItem = node.parent.data.code
        this.selectTreeData.strSubItem = data.code
        this.tableTitle.item = node.parent.data.label
        this.tableTitle.subItem = data.label
        this.getSysTreeData(node.parent.data.code, data.code)
        this.active = 1
      } else {
        this.tableTitle.item = data.label
        this.tableTitle.subItem = ''
        this.tableTitle.sysName = ''
        this.tableTitle.hostName = ''
        this.sysTreeData = []
      }
    },
    // 获取监控树形组件数据
    getMonitorTreeData() {
      this.itemTreeLoading = true
      api
        .monitorItemTree()
        .then((res) => {
          this.monitorTreeData = []
          if (res.strResult && res.strResult.length) {
            this.monitorTreeData = res.strResult
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.itemTreeLoading = false
        })
    },
    // 获取联系人标识
    getuserCode() {
      api.confUserconsult().then((res) => {
        if (res.strResult) {
          this.searchForm[0].options = JSON.parse(res.strResult)
          this.dialogForm[1].options = JSON.parse(res.strResult)
        }
      })
    },
    // 表格勾选发生变化时触发 联系人列表/批量添加列表
    selectionChange(v, key) {
      this[key + 'List'] = v
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
  ::v-deep .el-step__title.is-process {
    font-weight: 700;
    color: #838383;
  }

  ::v-deep .is-wait {
    color: #eeeeee;
  }
}
.link-man-form {
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
