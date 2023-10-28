<template>
  <div style="overflow-x: hidden">
    <el-steps :active="active" :space="200" finish-status="success" simple>
      <el-step title="选择监控子项" />
      <el-step title="选择系统主机" />
      <el-step title="查询联系人列表" />
    </el-steps>
    <el-row :gutter="8" class="mgt20">
      <el-col :span="5">
        <Tree title="监控关系树形图" :loading="itemTreeLoading" :data="monitorTreeData" @node-click="monitorTreeClick" />
      </el-col>
      <el-col :span="5">
        <Tree ref="sysTree" title="系统关系树形图" :loading="sysTreeLoading" :data="sysTreeData" @node-click="sysTreeClick" />
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
          table-height="calc(100vh - 370px)"
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
          <el-table-column slot="operation" label="操作" width="90">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showDialog('编辑联系人', scope.row)">编辑 </el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除 </el-button>
            </template>
          </el-table-column>
        </CommTable>
      </el-col>
    </el-row>
    <BaseDialog
      :dialog-top="dialog.title === '批量添加' ? '5vh' : '15vh'"
      :title="dialog.title"
      :show="dialog.show"
      @confirm="confirmDialog"
      @close-dialog-func="beforeCloseDialog"
    >
      <BaseForm
        v-show="dialog.title === '新增联系人' || dialog.title === '编辑联系人'"
        ref="dialogForm"
        :search-data="dialogFilter"
        :search-form="dialogForm"
        :is-handle="false"
      />
      <el-tabs v-if="dialog.title === '批量添加'" type="border-card">
        <el-tab-pane label="风险">
          <CommTable
            selection
            table-height="600"
            comtable-style="margin-top: 0"
            :loading="batchAddConfig.loading"
            :table-data="batchAddConfig.warnData"
            :columns="batchAddConfig.columns"
            :front-page="false"
            @handle-selection-change="
              (v) => {
                selectionChange(v, 'warnLinkMan')
              }
            "
          />
        </el-tab-pane>
        <el-tab-pane label="危险">
          <CommTable
            selection
            table-height="600"
            comtable-style="margin-top: 0"
            :loading="batchAddConfig.loading"
            :table-data="batchAddConfig.dangerData"
            :columns="batchAddConfig.columns"
            :front-page="false"
            @handle-selection-change="
              (v) => {
                selectionChange(v, 'dangerLinkMan')
              }
            "
          />
        </el-tab-pane>
      </el-tabs>
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { isEmpty } from 'lodash-es'
import Tree from './compontents/Tree.vue'

export default {
  name: 'LinkMan',
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
      searchHandle: [
        {
          label: '新增',
          icon: 'el-icon-circle-plus-outline',
          handle: () => {
            this.showDialog('新增联系人')
          }
        },
        {
          label: '批量添加',
          icon: 'el-icon-circle-plus',
          type: 'null',
          handle: () => {
            this.showDialog('批量添加')
          }
        },
        {
          label: '批量删除',
          icon: 'el-icon-delete',
          type: 'danger',
          handle: () => {
            this.batchDelete()
          }
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
          func: (currentPage) => {
            this.pageTurning(currentPage, 'configured')
          },
          sizeFunc: (size) => {
            this.pageSizeChange(size, 'configured')
          }
        }
      },
      // 弹窗
      dialog: {
        show: false,
        title: ''
      },
      // 新增/编辑联系人
      dialogFilter: {
        strLevel: '',
        strUserCode: '',
        strUserMobile: '',
        strUserDept: '',
        strUserLevel: '',
        strState: ''
      },
      dialogForm: [
        {
          ...this.$_.formItem('告警等级', 'Select', 'strLevel', false, ['label', 'value'], this.$_.simpleOptions(['正常', '风险', '危险'], 1)),
          rules: [this.$_.setRequired('请选择告警等级')]
        },
        {
          label: '联系人标识',
          type: 'Select',
          prop: 'strUserCode',
          change: (v) => {
            this.getUserInfo(v)
          },
          // 渲染数组
          options: [],
          // 下拉转换
          props: searchFormProps[1],
          rules: [{ required: true, message: '请选择联系人标识', trigger: 'blur' }]
        },
        {
          label: '联系人号码',
          type: 'Input',
          disabled: true,
          prop: 'strUserMobile'
        },
        {
          label: '联系人部门',
          type: 'Input',
          disabled: true,
          prop: 'strUserDept'
        },
        {
          label: '用户级别',
          type: 'Select',
          disabled: true,
          prop: 'strUserLevel',
          // 渲染数组
          options: searchFormOptions.strUserLevel,
          // 下拉转换
          props: searchFormProps[0]
        },
        {
          label: '联系人状态',
          type: 'Select',
          prop: 'strState',
          options: searchFormOptions.strState,
          props: searchFormProps[0],
          rules: [{ required: true, message: '请选择联系人状态', trigger: 'blur' }]
        }
      ],
      // 批量添加
      batchAddConfig: {
        columns: [
          { label: '联系人标识', prop: 'user_code' },
          { label: '联系人号码', prop: 'user_mobile' },
          { label: '联系人部门', prop: 'user_dept' }
        ],
        warnData: [],
        dangerData: [],
        loading: false
      },
      // 批量删除
      batchDeleteList: []
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
    // 批量删除联系人
    batchDelete() {
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
      } else if (!this.linkManList.length) {
        return this.$message({
          type: 'info',
          message: '请选择需要删除的联系人'
        })
      }
      const warn = this.linkManList.filter((v) => v.strLevel === '2')
      const danger = this.linkManList.filter((v) => v.strLevel === '3')
      this.$confirm('确定批量删除联系人吗', '提示', {
        type: 'warning'
      }).then(() => {
        const obj = {
          strItem: this.selectTreeData.strItem,
          strSubitem: this.selectTreeData.strSubItem,
          strSysCode: this.selectTreeData.strSystemCode,
          strHostCode: this.selectTreeData.strHostCode,
          warn,
          danger
        }
        api.confBatdellinkman(obj).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: '批量删除成功'
            })
            this.getLinkmen(1)
          }
        })
      })
    },
    // 删除联系人
    handleDelete(row) {
      this.$confirm('确定删除该联系人吗', '提示', {
        type: 'warning'
      }).then(() => {
        const { strSystemCode, strHostCode, strItem, strSubItem, strUserCode, strLevel } = row
        const obj = {
          strSystemCode,
          strHostCode,
          strItem,
          strSubItem,
          strUserCode,
          strLevel,
          event: '3'
        }
        api
          .confLinkmanmanage(obj)
          .then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除联系人成功'
              })
              this.getLinkmen()
            }
            this.dialog.show = false
          })
          .catch(() => {
            this.dialog.show = false
          })
      })
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
    // 确认弹窗
    confirmDialog() {
      switch (this.dialog.title) {
        case '新增联系人':
        case '编辑联系人':
          this.addOrEditLinkMan()
          break
      }
    },
    // 新增/编辑联系人
    addOrEditLinkMan() {
      this.$refs.dialogForm.search()
      this.$refs.dialogForm.$refs.searchFormRef.validate((v) => {
        if (v) {
          const { strSystemCode, strHostCode, strItem, strSubItem } = this.selectTreeData
          const obj = {
            strSystemCode,
            strHostCode,
            strItem,
            strSubItem
          }
          Object.keys(this.dialogFilter).forEach((key) => {
            obj[key] = this.dialogFilter[key]
          })
          this.dialog.title === '新增联系人' ? (obj.event = '1') : (obj.event = '2')
          api.confLinkmanmanage(obj).then(res => {
            this.$message({
              type: 'success',
              message: res.strMsg
            })
            this.getLinkmen()
          })
        }
      })
    },
    // 点击需要展示弹窗的按钮
    showDialog(title, row) {
      this.dialog.title = title
      // 编辑时存在row
      if (row) {
        Object.keys(this.dialogFilter).forEach((key) => {
          this.dialogFilter[key] = row[key]
        })
      }
      this.beforeShowDialog(title)
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
    showBatchAddDialog() {
      const strLevelList = ['1', '2']
      strLevelList.forEach((strLevel) => {
        this.getNotConfigLinkMan(strLevel)
      })
    },
    // 关闭弹窗
    beforeCloseDialog() {
      switch (this.dialog.title) {
        case '新增联系人':
        case '编辑联系人':
          this.clearFilter('dialogForm')
          break
      }
      this.dialog.show = false
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
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.linkmanTableLoading = false
        })
    },
    // 点击系统树形组件节点
    sysTreeClick(data, node) {
      this.active = 1
      this.clearFilter('linkManForm')
      this.configured.pageObj.total = 0
      this.configured.pageObj.currentPage = 1
      this.configured.pageObj.size = 20
      this.configured.data = []
      if (node.parent.data.code) {
        this.selectTreeData.strSystemCode = node.parent.data.code
        this.selectTreeData.strHostCode = data.code
        this.tableTitle.sysName = node.parent.data.label
        this.tableTitle.hostName = data.label
        this.active = 2
        this.getLinkmen(1)
      } else {
        this.tableTitle.sysName = data.label
        this.tableTitle.hostName = ''
      }
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
            this.sysTreeData = res.strResult
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
</style>
