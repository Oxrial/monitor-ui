<template>
  <div>
    <BaseForm :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" @search="searchSubmit" @reset="collectionReset" />
    <!-- 采集配置表变更 -->
    <BaseDialog :title="dialogConfig.title" :show="dialogConfig.show" @confirm="$refs.collectionFormRef.search()" @close-dialog-func="beforeClose">
      <BaseForm
        ref="collectionFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="collectionData"
        :search-form="collectionForm"
        @validate-val="(val) => (collectionValidateVal = val)"
        @search="(obj) => collectionValidateVal && updateCollection(obj)"
      />
    </BaseDialog>
    <!-- 采集配置展示表 -->
    <CommTable
      table-height="calc(100vh - 235px)"
      :table-data="collectionTable.tableData"
      :columns="collectionTable.columns"
      :page-obj="collectionTable.pageObj"
      @handle-click="(row, oldRow) => !isMainCollection && currRowChange(row, oldRow)"
    >
      <template #strCollectSource="{ row }">
        {{ collectionSources[row.strCollectSource - 1] && collectionSources[row.strCollectSource - 1] }}
      </template>
      <template #controlarea="{ row }">
        <el-button size="mini" @click="collectionRowUpdateHandle(row)">编辑 </el-button>
        <el-button size="mini" @click="collectionRowDeleteHandle(row)">删除 </el-button>
      </template>
    </CommTable>
    <!-- 系统参数表弹窗 -->
    <BaseDialog
      v-if="!isMainCollection"
      :show="paramsDialogConfig.show"
      class="table-dialog"
      title="系统参数配置"
      width="80%"
      dialog-top="5vh"
      :is-show-footer="false"
      @close-dialog-func="paramsBeforeClose"
    >
      <el-button key="新增系统参数" icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="paramsNewHandle()">
        <span>新增系统参数</span>
      </el-button>
      <CommTable
        v-if="!isMainCollection"
        :table-height="700"
        :table-data="paramsTable.tableData"
        :columns="paramsTable.columns"
        :page-obj="paramsTable.pageObj"
      >
        <template #controlarea="{ row }">
          <el-button size="mini" @click="paramsRowUpdateHandle(row)">编辑 </el-button>
          <el-button size="mini" @click="paramsRowDeleteHandle(row)">删除 </el-button>
        </template>
      </CommTable>
    </BaseDialog>
    <!-- 系统参数表变更 -->
    <BaseDialog
      v-if="!isMainCollection"
      :title="paramsEditDialogConfig.title"
      :show="paramsEditDialogConfig.show"
      @confirm="$refs.paramsFormRef.search()"
      @close-dialog-func="paramsEditBeforeClose"
    >
      <BaseForm
        v-if="!isMainCollection"
        ref="paramsFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="paramsData"
        :search-form="paramsForm"
        @validate-val="(val) => (paramsValidateVal = val)"
        @search="(obj) => paramsValidateVal && updateParams(obj)"
      />
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { remove, forEach, cloneDeep } from 'lodash-es'
export default {
  name: 'Collection',
  data() {
    return {
      // 默认为主监控配置页
      isMainCollection: true,
      // #region 1 search
      searchData: {
        strSystemCode: '',
        strHostCode: '',
        strCollect: '',
        strSubCollect: '',
        strState: ''
      },
      searchDataSubmit: null,
      searchForm: [
        {
          ...this.$_.formItem('系统标识', 'Select', 'strSystemCode', false, ['strSystemName', 'strSystemCode']),
          change: (sys) =>
            this.$_.changeForOptions.call(this, 'searchForm', 'searchData', 'strSystemCode', sys, 'monitorRedishostinfoconsult', 'strHostCode', 2)
        },
        { ...this.$_.formItem('主机标识', 'Select', 'strHostCode', false, ['strHostName', 'strHostCode']) },
        { ...this.$_.formItem('采集项', 'Input', 'strCollect', true) },
        { ...this.$_.formItem('采集子项', 'Input', 'strSubCollect', true) },
        { ...this.$_.formItem('采集项状态', 'Select', 'strState', false, ['label', 'value'], this.$_.simpleOptions(['无效', '有效'])) }
      ],
      searchHandle: [
        {
          label: '新增',
          icon: 'el-icon-circle-plus-outline',
          handle: () => {
            this.dialogConfig.title = '新增采集项'
            this.collectionForm.forEach((item) => 'flag' in item && (item.disabled = false))
            this.dialogConfig.show = true
          }
        },
        {
          label: '系统参数配置',
          icon: 'el-icon-view',
          disabled: true,
          hide: true,
          handle: () => {
            if (this.collectionCurrRowData) {
              const row = this.collectionCurrRowData
              console.log(row)
              const obj = {
                strSystemCode: row.strSystemCode,
                strHostCode: row.strHostCode,
                strParaState: ''
              }
              this.$nextTick(() => {
                this.loadingParamsTable(obj)
                this.paramsDialogConfig.show = true
              })
            }
          }
        }
      ],
      // #endregion search

      // #region 2 item row dialog
      dialogConfig: { title: '', show: false },
      collectionValidateVal: false,
      collectionCurrRowData: null,
      // flag: 可用状态disabled变更标识
      collectionForm: [
        {
          ...this.$_.formItem('系统标识', 'Select', 'strSystemCode', false, ['strSystemName', 'strSystemCode']),
          flag: null,
          rules: [this.$_.setRequired('系统标识', 2)],
          change: (sys) =>
            this.$_.changeForOptions.call(this, 'collectionForm', 'collectionData', 'strSystemCode', sys, 'monitorRedishostinfoconsult', 'strHostCode', 2)
        },
        {
          ...this.$_.formItem('主机标识', 'Select', 'strHostCode', false, ['strHostName', 'strHostCode']),
          flag: null,
          rules: [this.$_.setRequired('主机标识', 2)]
        },
        { ...this.$_.formItem('采集项', 'Input', 'strCollect', true) },
        { ...this.$_.formItem('采集子项', 'Input', 'strSubCollect', true) },
        {
          ...this.$_.formItem('监控项', 'Select', 'strItem', true, ['strItemName', 'strItem']),
          change: (strItem) => this.$_.changeForOptions.call(this, 'collectionForm', 'collectionData', 'strItem', strItem, 'monitorGetsubitem', 'strSubitem', 2)
        },
        {
          ...this.$_.formItem('监控子项', 'Select', 'strSubitem', true, ['strItemComment', 'strSubitem'])
        },
        {
          ...this.$_.formItem('数据来源', 'Select', 'strCollectSource', false, ['label', 'value']),
          flag: null,
          rules: [this.$_.setRequired('数据来源', 2)]
        },
        { ...this.$_.formItem('调度方案', 'Input', 'strPeriodId', false), rules: [this.$_.setRequired('调度方案')] },
        { ...this.$_.formItem('检查频率', 'Input', 'strInterval', false), rules: [this.$_.setRequired('检查频率')] },
        { ...this.$_.stateFormItem('strState', '采集项') }
      ],
      collectionData: {
        strSystemCode: '',
        strHostCode: '',
        strCollect: '',
        strSubCollect: '',
        strItem: '',
        strSubitem: '',
        strCollectSource: '',
        strPeriodId: '',
        strInterval: '',
        strState: '1',
        event: '1'
      },
      // #endregion item row dialog

      // #region 4 item table
      collectionSources: ['prometheus', 'ES', '暂无', 'RocketMQ', '自定义'],
      collectionTable: {
        columns: [
          { label: '系统名称', prop: 'strSystemCode' },
          { label: '节点名称', prop: 'strHostCode' },
          { label: '采集项标识', prop: 'strCollect' },
          { label: '采集子项标识', prop: 'strSubCollect' },
          { label: '监控项', prop: 'strItem' },
          { label: '监控子项', prop: 'strSubitem' },
          { label: '采集数据来源', prop: 'strCollectSource' },
          { label: '采集项状态', prop: 'strState', width: '90' },
          { label: '分析方法', prop: 'strCollectMethod' },
          { label: '调度方案', prop: 'strPeriodId', width: '95' },
          { label: '调度频率', prop: 'strInterval', width: '80' },
          { label: '操作', prop: 'controlarea', width: 255 }
        ],
        tableData: [],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => {
            this.$_.pageTurning.call(this, currentPage, 'collectionTable')
            this.$nextTick(() => (this.searchHandle[1].disabled = true))
          },
          sizeFunc: (size) => {
            this.$_.pageSizeChange.call(this, size, 'collectionTable')
            this.$nextTick(() => (this.searchHandle[1].disabled = true))
          }
        }
      },
      // #endregion item table

      // #region 5 params row dialog
      paramsEditDialogConfig: { title: '', show: false },
      paramsValidateVal: false,
      paramsForm: [
        { ...this.$_.formItem('参数名称', 'Input', 'strParaName', false), rules: [this.$_.setRequired('参数名称')] },
        { ...this.$_.formItem('参数值', 'Input', 'strParaValue', false), rules: [this.$_.setRequired('参数值')] },
        { ...this.$_.stateFormItem('strParaState') }
      ],
      paramsData: {
        strParaName: '',
        strParaValue: '',
        strParaState: '1',
        event: '1'
      },
      // #endregion params row dialog

      // #region 6 params dialog,
      paramsDialogConfig: { title: '', show: false },
      tableHeight: 'calc(100vh - 50px)',
      paramsTable: {
        columns: [
          { label: '参数名称', prop: 'strParaName' },
          { label: '参数值', prop: 'strParaValue' },
          { label: '状态', prop: 'strParaState' },
          { label: '操作', prop: 'controlarea', width: 255 }
        ],
        tableData: [],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'paramsTable'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'paramsTable')
        }
      }
      // #endregion params dialog
    }
  },
  mounted() {
    const collectionItem = this.$route.meta.monitorItem
    // 监控项下拉数据
    this.$_.apiFormItemOptionsSet.call(this, 'collectionForm', 'Select', 'strItem', 'monitorGetDistinctItemInfo')
    // 模拟路由跳转参
    // 若地址参数没有监控项，为主监控页面
    this.isMainCollection = !collectionItem

    // 非主监控配置页
    if (!this.isMainCollection) {
      remove(this.searchForm, (item) => {
        return item.prop === 'strCollect' || item.prop === 'strSubCollect'
      })
      this.$nextTick(() => {
        this.collectionData.strCollect = this.collectionData.strItem = this.searchData.strCollect = collectionItem.item
        this.collectionData.strSubCollect = this.collectionData.strSubitem = this.searchData.strSubCollect = collectionItem.subitem

        collectionItem.item === '1' && collectionItem.subitem === '1' && (this.searchHandle[1].hide = false)
      })
      this.getSystem()
      this.$_.changeForOptions.call(this, 'collectionForm', 'collectionData', 'strItem', collectionItem.item, 'monitorGetsubitem', 'strSubitem')
      this.$_.formItemOptionsSet.call(this, 'collectionForm', 'Select', 'strCollectSource', this.$_.simpleOptions(this.collectionSources, 1))
      this.searchSubmit()
    }
  },
  methods: {
    // #region  common
    getSystem() {
      api.monitorRedissysinfoconsult().then((res) => {
        if (res.strState === '1') {
          const jres = JSON.parse(res.strResult)
          this.$_.formItemOptionsSet.call(this, 'searchForm', 'Select', 'strSystemCode', jres)
          this.$_.formItemOptionsSet.call(this, 'collectionForm', 'Select', 'strSystemCode', jres)
        }
      })
    },

    isRightLength(rule, value, callback) {
      if (value > 10000000000) {
        return callback(new Error(''))
      } else {
        return callback()
      }
    },
    // #endregion common

    // #region 2 item row dialog
    /**
     * @desc: 弹窗关闭事件
     * @param {*}
     * @return {*}
     */
    beforeClose() {
      this.$refs.collectionFormRef.resetForm()
      this.collectionData.event = '1'
      this.dialogConfig.show = false
    },
    /**
     * 执行后台数据变更
     */
    updateCollection(obj) {
      const strOpration = '确定' + this.$_.strUpdate(obj) + '采集项标识为:【' + obj.strCollect + '】的采集项吗？'
      this.$confirm(strOpration, '提示', { type: 'warning' })
        .then(() => {
          // api.confUserManage().then()
          console.log(obj)
          this.dialogConfig.show = false
          this.loadingCollectionTable()
        })
        .catch(() => this.$message.info('已取消操作！'))
    },
    // #endregion item row dialog

    // #region 4 item table
    currRowChange(row, oldRow) {
      this.collectionCurrRowData = cloneDeep(row)
      this.searchHandle[1].disabled = false
    },
    /**
     * 修改触发器
     */
    collectionRowUpdateHandle(row) {
      this.dialogConfig.title = '编辑采集项'
      this.collectionForm.forEach((item) => 'flag' in item && (item.disabled = true))
      this.$nextTick(() => {
        this.$_.rowForData.call(this, row, 'collectionData')
        console.log(this.collectionData)
        this.collectionData.event = '2'
      })
      this.dialogConfig.show = true
    },
    /**
     * 删除触发器
     */
    collectionRowDeleteHandle(row) {
      this.$nextTick(() => {
        this.$_.rowForData.call(this, row, 'collectionData')
        this.collectionData.event = '3'
      })
      this.updateCollection(this.collectionData)
    },
    collectionReset() {
      this.collectionTable.pageObj.size = 20
    },
    searchSubmit() {
      // 提交表单
      this.$nextTick(() => {
        this.searchDataSubmit = cloneDeep(this.searchData)
        this.loadingCollectionTable()
      })
    },
    loadingCollectionTable() {
      this.collectionTable.tableData = []
      api.monitorCollectRelaConsult(this.searchData).then((res) => {
        this.collectionTable.pageObj.currentPage = 1
        this.collectionTable.tableData = res.strResult
      })
    },
    // #endregion item table

    // #region 5 params row dialog
    /**
     * @desc: 明细弹窗关闭事件
     * @param {*}
     * @return {*}
     */
    paramsEditBeforeClose() {
      this.$refs.paramsFormRef.resetForm()
      this.paramsEditDialogConfig.show = false
    },
    updateParams(obj) {
      console.log('updateParams', obj)
    },
    // #endregion params row dialog

    // #region 6 params dialog
    paramsBeforeClose() {
      this.paramsDialogConfig.show = false
    },
    paramsNewHandle() {
      this.paramsEditDialogConfig.title = '新增系统参数'
      this.paramsEditDialogConfig.show = true
    },
    paramsRowUpdateHandle(row) {
      this.paramsEditDialogConfig.title = '编辑系统参数'
      this.$nextTick(() => {
        forEach(this.paramsData, (value, key) => {
          this.paramsData[key] = row[key]
        })
        this.paramsData.event = '2'
      })
      this.paramsEditDialogConfig.show = true
    },
    paramsRowDeleteHandle(row) {
      this.$nextTick(() => {
        this.$_.rowForData.call(this, row, 'paramsData')
        this.paramsData.event = '3'
      })
      this.updateParams(this.collectionData)
    },
    loadingParamsTable(obj) {
      api.monitorSystemParameterConsult(obj).then((res) => (this.paramsTable.tableData = res.strResult))
    }
    // #endregion params dialog
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
