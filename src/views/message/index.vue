<template>
  <div>
    <BaseForm :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" @search="searchSubmit" @reset="messageReset" />
    <el-tabs v-model="activeValue" type="border-card" @tab-click="tabClick">
      <el-tab-pane name="notice" label="短信内容">
        <CommTable table-height="calc(100vh - 275px)" :table-data="noticeTable.tableData" :columns="columns" :page-obj="noticeTable.pageObj">
          <template #strLevel="{ value, enums }">
            <el-tag v-if="value" :type="levelTagEnums[value]"> {{ enums[value] }}</el-tag>
          </template>
          <template #controlarea="{ row }"><el-button size="mini" @click="messageRowUpdateHandle(row)">编辑短信内容 </el-button> </template>
        </CommTable>
      </el-tab-pane>
      <el-tab-pane name="alarm" label="告警信息">
        <CommTable table-height="calc(100vh - 275px)" :table-data="alarmTable.tableData" :columns="columns" :page-obj="alarmTable.pageObj">
          <template #strLevel="{ value, enums }">
            <el-tag v-if="value" :type="levelTagEnums[value]"> {{ enums[value] }}</el-tag>
          </template>
          <template #controlarea="{ row }"><el-button size="mini" @click="messageRowUpdateHandle(row)">编辑告警信息 </el-button> </template>
        </CommTable>
      </el-tab-pane>
    </el-tabs>
    <BaseDialog
      :title="messageDialogConfig.title"
      :show="messageDialogConfig.show"
      @confirm="$refs.messageFormRef.search()"
      @close-dialog-func="messageBeforeClose"
    >
      <BaseForm
        ref="messageFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="messageData"
        :search-form="messageForm"
        @search="updateMessage"
      />
      <template>
        <div class="import-info">注意,以下参数将会被替换：</div>
        <div class="import-info">{sys}：系统标识；{host}：节点标识；{IP}：主机IP；{currentValue}：当前值；{min}：阈值下限；{max}：阈值上限。</div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'Message',
  data() {
    return {
      searchData: {
        strItem: '',
        strSubItem: '',
        strLevel: '',
        strData: ''
      },
      searchDataSubmit: null,
      searchForm: [
        {
          ...this.$_.formItem('监控项', 'Select', 'strItem', false, ['strItemName', 'strItem']),
          change: (strItem) => this.$_.changeForOptions.call(this, 'searchForm', 'searchData', 'strItem', strItem, 'monitorGetsubitem', 'strSubItem')
        },
        { ...this.$_.formItem('监控子项', 'Select', 'strSubItem', false, ['strItemComment', 'strSubitem']) },
        { ...this.$_.formItem('告警等级', 'Select', 'strLevel', false, ['label', 'value'], this.$_.simpleOptions(['正常', '风险', '危险'], 1)) },
        { ...this.$_.formItem('模板内容配置状态', 'Select', 'strData', false, ['label', 'value'], this.$_.simpleOptions(['未配置', '已配置'])) }
      ],
      searchHandle: [],
      activeValue: 'notice',

      levelTagEnums: { 1: 'success', 2: 'warning', 13: 'danger' },
      columns: [
        { label: '监控标识', prop: 'strItem' },
        { label: '监控名称', prop: 'strItemName' },
        { label: '监控子项标识', prop: 'strSubItem' },
        { label: '告警规则', prop: 'strItemComment' },
        { label: '告警等级', prop: 'strLevel', enums: { 1: '正常', 2: '风险', 13: '危险' } },
        { label: '操作', prop: 'controlarea', width: 255 }
      ],
      noticeTable: {
        tableData: [],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'monitorTable'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'monitorTable')
        }
      },
      alarmTable: {
        tableData: [],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'monitorTable'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'monitorTable')
        }
      },
      messageDialogConfig: { title: '', show: false },
      messageValidateVal: false,
      messageForm: [
        { ...this.$_.formItem('监控项', 'Input', 'strItem', true) },
        { ...this.$_.formItem('监控项名称', 'Input', 'strItemName', true) },
        { ...this.$_.formItem('监控子项', 'Input', 'strSubItem', true) },
        { ...this.$_.formItem('监控子项名称', 'Input', 'strItemComment', true) },
        { ...this.$_.formItem('告警等级', 'Select', 'strLevel', true, ['label', 'value'], this.$_.simpleOptions(['正常', '风险', '危险'], 1)) }
      ],
      messageData: { strItem: '', strItemName: '', strSubItem: '', strItemComment: '', strLevel: '', strData: '' }
    }
  },
  mounted() {
    // 监控项下拉数据
    this.$_.apiFormItemOptionsSet.call(this, 'searchForm', 'Select', 'strItem', 'monitorGetDistinctItemInfo')
    this.searchSubmit()
  },
  methods: {
    // #region  common
    // #endregion  common
    searchSubmit() {
      this.searchDataSubmit = cloneDeep(this.searchData)
      this.loadingTable()
    },
    messageReset() {
      this.searchDataSubmit = null
      this.noticeTable.tableData = []
      this.alarmTable.tableData = []
      this.searchSubmit()
    },
    tabClick() {
      !this[`${this.activeValue}Table`].tableData.length && this.searchSubmit()
    },
    messageRowUpdateHandle(row) {
      this.$_.rowForData.call(this, row, 'messageData')
      const str = this.activeValue === 'notice' ? '短信内容' : this.activeValue === 'alarm' ? '告警信息' : ''
      this.messageForm.push({ ...this.$_.formItem(str, 'Input', 'strData', false), class: 'inline', typeArrt: 'textarea', colSpan: 24 })
      this.messageDialogConfig.title = '修改' + str
      this.messageDialogConfig.show = true
    },
    messageBeforeClose() {
      this.$refs.messageFormRef.resetForm()
      this.messageForm.pop()
      this.messageDialogConfig.show = false
    },
    updateMessage(obj) {
      console.log(obj)
      this.messageDialogConfig.show = false
    },
    loadingTable() {
      this.searchDataSubmit.strType = this.$_.valueForEnums.call(this, 'activeValue', { notice: '0', alarm: '1' })
      api.confMsgConsult(this.searchDataSubmit).then((res) => {
        this[`${this.activeValue}Table`].tableData = res.strResult
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
