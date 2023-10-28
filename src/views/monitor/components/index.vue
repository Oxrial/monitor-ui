<template>
  <div>
    <BaseForm :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" @search="searchSubmit" @reset="monitorReset" />
    <!-- 监控配置表变更 -->
    <BaseDialog :title="dialogConfig.title" :show="dialogConfig.show" @confirm="$refs.monitorFormRef.search()" @close-dialog-func="beforeClose">
      <BaseForm
        ref="monitorFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="monitorData"
        :search-form="monitorForm"
        @validate-val="(val) => (monitorValidateVal = val)"
        @search="(obj) => monitorValidateVal && updateMonitor(obj)"
      />
    </BaseDialog>
    <!-- 阈值变更 -->
    <BaseDialog :title="valveDialogConfig.title" :show="valveDialogConfig.show" @confirm="$refs.valveFormRef.search()" @close-dialog-func="valveBeforeClose">
      <BaseForm
        ref="valveFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="valveData"
        :search-form="valveForm"
        @validate-val="(val) => (valveValidateVal = val)"
        @search="(obj) => valveValidateVal && updateValve(obj)"
      />
    </BaseDialog>
    <!-- 监控配置展示表 -->
    <CommTable
      table-height="calc(100vh - 235px)"
      :table-data="monitorTable.tableData"
      :columns="monitorTable.columns"
      :page-obj="monitorTable.pageObj"
      @handle-click="(row, oldRow) => !isMainMonitor && currRowChange(row, oldRow)"
    >
      <template #controlarea="{ row }">
        <el-button size="mini" @click="monitorRowUpdateHandle(row)">编辑 </el-button>
        <el-button size="mini" @click="monitorRowDeleteHandle(row)">删除 </el-button>
      </template>
    </CommTable>
    <!-- 监控明细表弹窗 -->
    <BaseDialog
      v-if="!isMainMonitor"
      class="table-dialog"
      title="监控明细"
      width="80%"
      dialog-top="5vh"
      :show="detailDialogConfig.show"
      :is-show-footer="false"
      @close-dialog-func="detailBeforeClose"
    >
      <el-button key="新增监控明细" icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="detailNewHandle()">
        <span>新增监控明细</span>
      </el-button>
      <CommTable v-if="!isMainMonitor" :table-height="700" :table-data="detailTable.tableData" :columns="detailTable.columns" :page-obj="detailTable.pageObj">
        <template #controlarea="{ row }">
          <el-button size="mini" @click="detailRowUpdateHandle(row)">编辑 </el-button>
          <el-button size="mini" @click="detailRowDeleteHandle(row)">删除 </el-button>
        </template>
      </CommTable>
    </BaseDialog>
    <!-- 监控明细表变更 -->
    <BaseDialog
      v-if="!isMainMonitor"
      :title="detailEditDialogConfig.title"
      :show="detailEditDialogConfig.show"
      @confirm="$refs.detailFormRef.search()"
      @close-dialog-func="detailEditBeforeClose"
    >
      <BaseForm
        v-if="!isMainMonitor"
        ref="detailFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="detailData"
        :search-form="detailForm"
        @validate-val="(val) => (detailValidateVal = val)"
        @search="(obj) => detailValidateVal && updateDetail(obj)"
      />
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'Monitor',
  data() {
    return {
      // 默认为主监控配置页
      isMainMonitor: true,
      // #region 1 search
      searchData: {
        systemCode: '',
        hostCode: '',
        itemCode: '',
        subItemCode: '',
        itemState: ''
      },
      searchDataSubmit: null,
      searchForm: [
        {
          ...this.$_.formItem('系统标识', 'Select', 'systemCode', false, ['strSystemName', 'strSystemCode']),
          change: (sys) => this.$_.changeForOptions.call(this, 'searchForm', 'searchData', 'strSystemCode', sys, 'monitorRedishostinfoconsult', 'hostCode', 2)
        },
        { ...this.$_.formItem('主机标识', 'Select', 'hostCode', false, ['strHostName', 'strHostCode']) },
        // {
        //   ...this.$_.formItem('监控项', 'Select', 'itemCode', false, ['strItemName', 'strItem']),
        //   change: (strItem) => this.$_.changeForOptions.call(this, 'searchForm', 'searchData', 'strItem', strItem, 'monitorGetsubitem', 'subItemCode')
        // },
        // { ...this.$_.formItem('监控子项', 'Select', 'subItemCode', false, ['strItemComment', 'strSubitem']) },
        { ...this.$_.formItem('监控项状态', 'Select', 'itemState', false, ['label', 'value'], this.$_.simpleOptions(['无效', '有效'])) }
      ],
      searchHandle: [
        {
          label: '新增',
          icon: 'el-icon-circle-plus-outline',
          handle: () => {
            this.dialogConfig.title = '新增监控项'
            this.monitorForm.forEach((item) => 'flag' in item && (item.disabled = false))
            this.dialogConfig.show = true
          }
        },
        {
          label: '阈值',
          icon: 'el-icon-odometer',
          disabled: true,
          hide: true,
          handle: () => {
            this.valveDialogConfig.title = '修改阈值'
            if (this.monitorCurrRowData) {
              this.$nextTick(async () => {
                await this.enumFormData(this.monitorCurrRowData, 'valveData', '2')
                api.monitorThreadconsult(this.valveData).then((res) => {
                  if (res.strState === '1') {
                    const enums = { 1: 'Normal', 2: 'Early', 3: 'Exception' }
                    const enumsState = { 1: 'Normal', 2: 'Risk', 3: 'Danger' }
                    res.strResult.forEach((item) => {
                      if (item.strLevel) {
                        this.valveData[`str${enums[item.strLevel]}UpperLimit`] = item.fAlertMaxValue
                        this.valveData[`str${enums[item.strLevel]}LowLimit`] = item.fAlertMinValue
                        this.valveData[`str${enumsState[item.strLevel]}State`] = item.strState
                      }
                    })
                  }
                })
                this.valveDialogConfig.show = true
              })
            }
          }
        },
        {
          label: '监控明细',
          icon: 'el-icon-view',
          disabled: true,
          hide: true,
          handle: async () => {
            if (this.monitorCurrRowData) {
              this.detailTable.columns = [...this.detailColumnsTemplate[this.searchData.itemCode], { label: '操作', prop: 'controlarea', width: 255 }]
              this.detailForm = this.detailFormTemplate[this.searchData.itemCode]
              const row = this.monitorCurrRowData
              await this.enumFormData(row, 'detailSearchData')
              await this.enumFormData(row, 'detailData')
              if (this.searchData.itemCode === '9') {
                this.detailSearchData.strAgentCode = row.host_code
                this.detailData.strAgentCode = row.host_code
              }
              this.$nextTick(() => {
                this.loadingDetailTable()
                this.detailDialogConfig.title = row.host_name + '监控明细'
                this.detailDialogConfig.show = true
              })
            }
          }
        }
      ],
      // #endregion search

      // #region 2 item row dialog
      dialogConfig: { title: '', show: false },
      monitorValidateVal: false,
      monitorCurrRowData: null,
      formEnums: {
        system_name: 'strSystemName',
        system_code: 'strSystemCode',
        host_name: 'strHostName',
        host_code: 'strHostCode',
        item: 'strItem',
        item_name: 'strItemName',
        subitem: 'strSubitem',
        item_comment: 'strItemComment',
        item_state: 'strItemState',
        item_method: 'strItemMethod',
        period: 'strPeriod',
        interval: 'strInterval'
      },
      // flag: 可用状态disabled变更标识
      monitorForm: [
        {
          ...this.$_.formItem('系统标识', 'Select', 'strSystemCode', false, ['strSystemName', 'strSystemCode']),
          flag: null,
          rules: [this.$_.setRequired('系统标识', 2)],
          change: (sys) =>
            this.$_.changeForOptions.call(this, 'monitorForm', 'monitorData', 'strSystemCode', sys, 'monitorRedishostinfoconsult', 'strHostCode', 2)
        },
        {
          ...this.$_.formItem('主机标识', 'Select', 'strHostCode', false, ['strHostName', 'strHostCode']),
          flag: null,
          rules: [this.$_.setRequired('主机标识', 2)]
        },
        { ...this.$_.formItem('监控项名称', 'Input', 'strItemName', true) },
        { ...this.$_.formItem('监控项', 'Input', 'strItem', true) },
        { ...this.$_.formItem('监控项说明', 'Input', 'strItemComment', true) },
        { ...this.$_.formItem('监控子项', 'Input', 'strSubitem', true) },
        { ...this.$_.formItem('分析方法', 'Input', 'strItemMethod', true), class: 'inline' },
        { ...this.$_.formItem('调度方案', 'Input', 'strPeriod', false), rules: [this.$_.setRequired('调度方案')] },
        { ...this.$_.formItem('检查频率', 'Input', 'strInterval', false), rules: [this.$_.setRequired('检查频率')] },
        { ...this.$_.stateFormItem('strItemState', '监控项') }
      ],
      monitorData: {
        strSystemCode: '',
        strHostCode: '',
        strItem: '',
        strItemName: '',
        strSubitem: '',
        strItemComment: '',
        strItemMethod: '',
        strPeriod: '',
        strInterval: '',
        strItemState: '1',
        event: '1'
      },
      // #endregion item row dialog

      // #region 3 valve dialog
      // 阈值表单
      valveDialogConfig: { title: '', show: false },
      valveValidateVal: false,
      valveForm: [
        { ...this.$_.formItem('系统标识', 'Input', 'strSystemName', true) },
        { ...this.$_.formItem('主机标识', 'Input', 'strHostName', true) },
        { ...this.$_.formItem('监控项', 'Input', 'strItemName', true) },
        { ...this.$_.formItem('监控子项', 'Input', 'strItemComment', true) },
        {
          ...this.$_.formItem('正常下限', 'Input', 'strNormalLowLimit', false),
          rules: [
            this.$_.setRequired('正常下限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'max', 'strNormalUpperLimit'),
              trigger: 'blur'
            }
          ]
        },
        {
          ...this.$_.formItem('正常上限', 'Input', 'strNormalUpperLimit', false),
          rules: [
            this.$_.setRequired('正常上限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'min', 'strNormalLowLimit'),
              trigger: 'blur'
            }
          ]
        },
        { ...this.$_.stateFormItem('strNormalState', '阈值') },
        {
          ...this.$_.formItem('风险下限', 'Input', 'strEarlyLowLimit', false),
          rules: [
            this.$_.setRequired('风险下限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'max', 'strEarlyUpperLimit'),
              trigger: 'blur'
            }
          ]
        },
        {
          ...this.$_.formItem('风险上限', 'Input', 'strEarlyUpperLimit', false),
          rules: [
            this.$_.setRequired('风险上限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'min', 'strEarlyLowLimit'),
              trigger: 'blur'
            }
          ]
        },
        { ...this.$_.stateFormItem('strRiskState', '阈值') },
        {
          ...this.$_.formItem('危险下限', 'Input', 'strExceptionLowLimit', false),
          rules: [
            this.$_.setRequired('危险下限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'max', 'strExceptionUpperLimit'),
              trigger: 'blur'
            }
          ]
        },
        {
          ...this.$_.formItem('危险上限', 'Input', 'strExceptionUpperLimit', false),
          rules: [
            this.$_.setRequired('危险上限'),
            ...this.vavleRulesNumber(),
            {
              validator: (rule, value, callback) => this.vavleMaxMinRules(rule, value, callback, 'min', 'strExceptionLowLimit'),
              trigger: 'blur'
            }
          ]
        },
        { ...this.$_.stateFormItem('strDangerState', '阈值') }
      ],
      valveData: {
        strSystemName: '',
        strSystemCode: '',
        strHostName: '',
        strHostCode: '',
        strItem: '',
        strSubitem: '',
        strItemName: '',
        strItemComment: '',
        strItemState: '',
        strItemMethod: '',
        strNormalUpperLimit: '',
        strNormalLowLimit: '',
        strNormalState: '',
        strEarlyLowLimit: '',
        strEarlyUpperLimit: '',
        strRiskState: '',
        strExceptionLowLimit: '',
        strExceptionUpperLimit: '',
        strDangerState: '',
        strPeriod: '',
        strInterval: '',
        strState: '',
        event: '2'
      },
      // #endregion valve dialog

      // #region 4 item table
      monitorTable: {
        columns: [
          { label: '系统名称', prop: 'system_name' },
          { label: '节点名称', prop: 'host_name' },
          { label: '监控项名称', prop: 'item_name' },
          { label: '监控项说明', prop: 'item_comment' },
          { label: '监控项状态', prop: 'item_state' },
          { label: '分析方法', prop: 'item_method' },
          { label: '调度方案标识', prop: 'period' },
          { label: '检查频率', prop: 'interval' },
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
            this.$_.pageTurning.call(this, currentPage, 'monitorTable')
            this.$nextTick(() => {
              this.searchHandle[1].disabled = true
              this.searchHandle[2].disabled = true
            })
          },
          sizeFunc: (size) => {
            this.$_.pageSizeChange.call(this, size, 'monitorTable')
            this.$nextTick(() => {
              this.searchHandle[1].disabled = true
              this.searchHandle[2].disabled = true
            })
          }
        }
      },
      // #endregion item table

      // #region 5 detail row dialog
      detailEditDialogConfig: { title: '', show: false },
      detailSearchData: {
        strSystemCode: '',
        strHostCode: '',
        strItem: '',
        strSubitem: ''
      },
      detailValidateVal: false,
      detailTag: ['1-2', '2-1', '2-2', '3-1', '3-2', '7-1', '8-1', '9-1'],
      detailInfo: {
        1: {
          api: 'monitorDetailThreadConsult',
          updateApi: 'confDetailThreadManage'
        },
        2: {
          api: 'monitorCollectFileConsult',
          updateApi: 'getMonitorCollectFileConsult'
        },
        3: {
          api: 'monitorEdbConfConsult',
          updateApi: 'confEdbConfMange'
        },
        7: {
          api: 'monitorPortConfConsult',
          updateApi: 'confPortConfMange'
        },
        8: {
          api: 'monitorProcessConfConsult',
          updateApi: 'confProcessConfMange'
        },
        9: {
          api: 'monitorServiceInfoConfConsult',
          updateApi: 'confServiceInfoConfMange'
        },
        11: {
          api: 'monitorTableInfoConfConsult',
          updateApi: 'confTableInfoConfMange'
        }
      },
      detailFormTemplate: {
        1: [
          // 交易码
          { ...this.$_.formItem('交易码', 'Input', 'strDetailCode', false), rules: [this.$_.setRequired('交易码')] },
          // 等级
          {
            ...this.$_.formItem('等级', 'Select', 'strLevel', false, ['label', 'value'], this.$_.simpleOptions(['正常', '风险', '危险'], 1)),
            clearable: false
          },
          // 超时时间=最小-最大
          {
            ...this.$_.formItem('超时时间', 'Input', 'fAlertMinValue', false),
            append: 'ms',
            rules: [
              this.$_.setRequired('超时时间'),
              {
                validator: (rule, value, callback) => {
                  this.detailData.fAlertMaxValue = value
                  callback()
                },
                trigger: 'blur'
              }
            ]
          },
          // // 最小值
          // { ...this.$_.formItem('最小值', 'Input', 'fAlertMinValue', false), rules: [this.$_.setRequired('最小值')] },
          // // 最大值
          // { ...this.$_.formItem('最大值', 'Input', 'fAlertMaxValue', false), rules: [this.$_.setRequired('最大值')] },
          // 状态
          { ...this.$_.stateFormItem('strState') }
        ],
        2: [
          // 文件或路径
          { ...this.$_.formItem('文件或路径', 'Input', 'strFilePath', false), rules: [this.$_.setRequired('文件或路径')] },
          // 检查点
          {
            ...this.$_.formItem('检查点', 'Select', 'strCheckPoint', false, ['label', 'value'], this.$_.simpleOptions(['检查文件不存在', '检查文件存在'], 1)),
            clearable: false
          },
          // 状态
          { ...this.$_.stateFormItem('strState') }
        ],
        3: [
          // 起止时间
          // EDB标识
          { ...this.$_.formItem('EDB标识', 'Input', 'strEdbId', false), rules: [this.$_.setRequired('EDB标识')] },
          // 方向
          { ...this.$_.formItem('方向', 'Select', 'strDirection', false, ['label', 'value'], this.$_.simpleOptions(['接收', '发送'], 1)) },
          // 状态
          { ...this.$_.stateFormItem('strState') }
        ],
        7: [
          // 端口号
          { ...this.$_.formItem('端口号', 'Input', 'strPortNumber', false), rules: [this.$_.setRequired('端口号')] },
          // 状态
          { ...this.$_.stateFormItem('strPortState') }
        ],
        8: [
          // 进程名称
          { ...this.$_.formItem('进程名称', 'Input', 'strServerChineseName', false), rules: [this.$_.setRequired('进程名称')] },
          // 检查方法
          { ...this.$_.formItem('检查方法', 'Input', 'strServerMonitorString', false), rules: [this.$_.setRequired('检查方法')] },
          // 状态
          { ...this.$_.stateFormItem('strServerState') }
        ],
        9: [
          // 服务名称
          { ...this.$_.formItem('服务名称', 'Input', 'strServiceName', false), rules: [this.$_.setRequired('服务名称')] },
          // 服务端口
          { ...this.$_.formItem('服务端口', 'Input', 'strPort', false), rules: [this.$_.setRequired('服务端口')] },
          // 服务节点
          { ...this.$_.formItem('服务节点', 'Input', 'strHostCode', false), rules: [this.$_.setRequired('服务节点')] },
          // 注册中心端口
          { ...this.$_.formItem('注册中心端口', 'Input', 'strAgentPort', false), rules: [this.$_.setRequired('注册中心端口')] },
          // 分组名称
          { ...this.$_.formItem('分组名称', 'Input', 'strGroupName', false) },
          // 集群名称
          { ...this.$_.formItem('集群名称', 'Input', 'strClusterName', false) },
          // 命名空间
          { ...this.$_.formItem('命名空间', 'Input', 'strNamespaceId', false) },
          // 状态
          { ...this.$_.stateFormItem('strServiceState') }
        ],
        11: [
          // 表名
          { ...this.$_.formItem('表名', 'Input', 'strTableName', false), rules: [this.$_.setRequired('表名')] },
          // 表最大占用
          { ...this.$_.formItem('表最大占用', 'Input', 'strMax', false), rules: [this.$_.setRequired('表最大占用')] },
          // 状态
          { ...this.$_.stateFormItem('strState') }
        ]
      },
      detailForm: [],
      detailData: {
        // 1
        strDetailCode: '',
        strLevel: '1',
        fAlertMinValue: '',
        fAlertMaxValue: '',
        // 2
        strFilePath: '',
        strCheckPoint: '1',
        // 3
        activeTime: '',
        strEdbId: '',
        strDirection: '1',
        // 7
        strPortNumber: '',
        strPortState: '1',
        // 8
        strServerName: '',
        strServerChineseName: '',
        strServerProgram: '',
        strServerMonitorString: '',
        strNumber: '',
        strServerState: '1',
        // 9
        strServiceName: '',
        strPort: '',
        strAgentPort: '8848',
        strAgentCode: '',
        strHostCode: '',
        strGroupName: '',
        strClusterName: '',
        strNamespaceId: '',
        strServiceState: '1',
        // 11
        strTableName: '',
        strMax: '',

        strState: '1',
        event: '1',
        strSystemCode: '',
        strSystemName: '',
        strHostName: '',
        strItem: '',
        strSubitem: ''
      },
      // #endregion detail row dialog

      // #region 6 detail dialog,
      detailDialogConfig: { title: '', show: false },
      detailColumnsTemplate: {
        1: [
          { prop: 'strDetailCode', label: '交易码' },
          { prop: 'strLevel', label: '等级', enums: { 1: '正常', 2: '风险', 3: '危险' } },
          { prop: 'fAlertMinValue', label: '超时时间(ms)' },
          { prop: 'strState', label: '状态', state: true, width: 160 }
          // { prop: 'detailItemMax', label: '最大值' }
        ],
        2: [
          { prop: 'file_path', label: '文件或路径' },
          { prop: 'checkpoint', label: '检查点' },
          { prop: 'strState', label: '状态', state: true, width: 160 }
        ],
        3: [
          { prop: 'begin_time', label: '开始时间' },
          { prop: 'end_time', label: '结束时间' },
          { prop: 'edb_id', label: 'edb标识' },
          { prop: 'direction', label: '方向' },
          { prop: 'strState', label: '状态', state: true, width: 160 }
        ],
        7: [
          { prop: 'port_number', label: '端口号' },
          { prop: 'strPortState', label: '端口状态', state: true, width: 160 }
        ],
        8: [
          { prop: 'server_chinese_name', label: '进程名称' },
          { prop: 'server_monitor_string', label: '检查方法' },
          { prop: 'strServerState', label: '进程状态', state: true, width: 160 }
        ],
        9: [
          { prop: 'strServiceName', label: '服务名称' },
          { prop: 'strPort', label: '服务端口' },
          { prop: 'strHostCode', label: '服务节点' },
          { prop: 'strGroupName', label: '分组名称' },
          { prop: 'strNamespaceId', label: '命名空间' },
          { prop: 'strClusterName', label: '集群名称' },
          { prop: 'strAgentSystemName', label: '注册中心系统' },
          { prop: 'strAgentCodeName', label: '注册中心节点' },
          { prop: 'strServiceState', label: '服务状态', state: true, width: 160 }
        ],
        11: [
          { prop: 'table_name', label: '表名' },
          { prop: 'max', label: '表最大占用' }
        ]
      },
      tableHeight: 'calc(100vh - 50px)',
      detailTable: {
        columns: [],
        tableData: [],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'detailTable'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'detailTable')
        }
      }
      // #endregion detail dialog
    }
  },
  mounted() {
    const monitorItem = this.$route.meta.monitorItem
    // 若地址参数没有监控项，为主监控页面
    this.isMainMonitor = !monitorItem

    // 非主监控配置页
    if (!this.isMainMonitor) {
      this.searchHandle[1].hide = false
      this.searchHandle[2].hide = !this.detailTag.includes(monitorItem.item + '-' + monitorItem.subitem)
      this.getSystem()
      this.getSubitemInfo(monitorItem.item, monitorItem.subitem)

      this.$nextTick(() => {
        this.searchData.itemCode = monitorItem.item
        this.searchData.subItemCode = monitorItem.subitem
        this.searchSubmit()
      })
    }
  },
  methods: {
    // #region  common
    getSystem() {
      api.monitorRedissysinfoconsult().then((res) => {
        if (res.strState === '1') {
          this.$_.formItemOptionsSet.call(this, 'searchForm', 'Select', 'systemCode', JSON.parse(res.strResult))
          this.$_.formItemOptionsSet.call(this, 'monitorForm', 'Select', 'strSystemCode', JSON.parse(res.strResult))
        }
      })
    },
    getSubitemInfo(strItem, strSubitem) {
      api.confGetItemDetailInfo({ strItem, strSubitem }).then((res) => {
        if (res.strState === '1') {
          const subitemdetail = res.strResult[0]
          this.monitorData.strItem = subitemdetail.strItem
          this.monitorData.strItemName = subitemdetail.strItemName
          this.monitorData.strSubitem = subitemdetail.strSubitem
          this.monitorData.strItemComment = subitemdetail.strItemComment
          this.monitorData.strItemMethod = subitemdetail.strItemMethod
        }
      })
    },
    vavleRulesNumber() {
      return [
        { pattern: /^\S+$/, message: '不可有空格', trigger: 'blur' },
        { pattern: /^\d+(\.\d{1,3})?$/, message: '正数且小数点最多三位', trigger: 'blur' }
      ]
    },
    vavleMaxMinRules(rule, value, callback, type, key) {
      if (value > 10000000000) {
        return callback(new Error('阈值不得高于10000000000'))
      } else {
        // 最小/大值存在时
        if (this.valveData[key]) {
          if (
            // 输入类型为最小值，key为下限 <= 上限，上限规则
            (type === 'min' && parseFloat(this.valveData[key]) <= parseFloat(value)) ||
            // 输入类型为最大值，key为上限 >= 下限，下限规则
            (type === 'max' && parseFloat(this.valveData[key]) >= parseFloat(value))
          ) {
            callback()
          } else {
            callback(new Error('阈值下限不得大于上限'))
          }
        } else {
          return callback()
        }
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
      this.$refs.monitorFormRef && this.$refs.monitorFormRef.resetForm()
      this.monitorData.event = '1'
      this.dialogConfig.show = false
    },
    /**
     * 执行后台数据变更
     */
    updateMonitor(obj) {
      api.confItemmanage(obj).then((res) => {
        if (res.strState === '1') {
          this.$message({ type: 'success', message: res.msg })
          this.loadingMonitorTable()
          this.beforeClose()
        }
      })
    },
    // #endregion item row dialog

    // #region 3 valve dialog
    /**
     * @desc: 阈值弹窗关闭事件
     * @param {*}
     * @return {*}
     */
    valveBeforeClose() {
      this.$refs.valveFormRef && this.$refs.valveFormRef.resetForm()
      this.valveData.event = '1'
      this.valveDialogConfig.show = false
    },
    updateValve(obj) {
      console.log(obj)
      api.confThreadmanage(obj).then((res) => {
        if (res.strState === '1') {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.valveBeforeClose()
        }
      })
    },
    // #endregion valve dialog

    // #region 4 item table
    /**
     * 映射表单数据
     */
    enumFormData(row, fkey, event) {
      // 弹窗表单懒加载，待初始值渲染后，再赋值
      this.$nextTick(() => {
        for (const key in row) {
          this.formEnums[key] in this[fkey] && (this[fkey][this.formEnums[key]] = row[key])
        }
        event && (this[fkey].event = event)
      })
    },
    currRowChange(row, oldRow) {
      this.monitorCurrRowData = cloneDeep(row)
      this.searchHandle[1].disabled = false
      this.searchHandle[2].disabled = false
    },
    /**
     * 修改触发器
     */
    monitorRowUpdateHandle(row) {
      this.dialogConfig.title = '编辑监控项'
      this.dialogConfig.show = true
      this.monitorForm.forEach((item) => 'flag' in item && (item.disabled = true))
      this.enumFormData(row, 'monitorData', '2')
    },
    /**
     * 删除触发器
     */
    monitorRowDeleteHandle(row) {
      this.enumFormData(row, 'monitorData', '3')
      const strOpration = '确定' + this.$_.strUpdate(this.monitorData) + '监控项标识为：【' + this.monitorData.strItemComment + '】的监控项吗？'
      this.$confirm(strOpration, '提示', this.$_._confirmObj)
        .then(() => this.updateMonitor(this.monitorData))
        .catch((action) => (action === 'cancel' ? this.$message.info('已取消操作！') : console.log(action)))
    },
    searchSubmit() {
      // 提交表单
      this.$nextTick(() => {
        this.searchDataSubmit = cloneDeep(this.searchData)
        this.loadingMonitorTable()
      })
    },

    monitorReset() {
      this.monitorTable.pageObj.size = 20
    },
    loadingMonitorTable() {
      this.monitorTable.tableData = []
      this.monitorTable.pageObj.currentPage = 1
      api.monitorItemconsult(this.searchDataSubmit).then((res) => {
        res.strState === '1' && (this.monitorTable.tableData = JSON.parse(res.strResult))
      })
    },
    // #endregion item table

    // #region 5 detail row dialog
    /**
     * @desc: 明细弹窗关闭事件
     * @param {*}
     * @return {*}
     */
    detailEditBeforeClose() {
      this.$refs.detailFormRef && this.$refs.detailFormRef.resetForm()
      this.detailData.event = '1'
      this.detailEditDialogConfig.show = false
    },
    updateDetail(obj) {
      api[this.detailInfo[this.searchData.itemCode].updateApi](obj).then((res) => {
        if (res.strState === '1') {
          this.$message({ type: 'success', message: res.strMsg })
          this.loadingDetailTable()
          this.detailEditBeforeClose()
        }
      })
    },
    // #endregion detail row dialog

    // #region 6 detail dialog
    detailBeforeClose() {
      this.detailDialogConfig.show = false
    },
    detailNewHandle() {
      this.detailEditDialogConfig.title = '新增监控明细'
      this.detailEditDialogConfig.show = true
    },
    detailRowUpdateHandle(row) {
      this.detailEditDialogConfig.title = '编辑监控明细'
      this.$nextTick(() => {
        this.$_.rowForData.call(this, row, 'detailData')
        this.detailData.event = '2'
      })
      this.detailEditDialogConfig.show = true
    },
    async detailRowDeleteHandle(row) {
      await this.enumFormData(row, 'detailData', '3')
      const strOpration = '确定' + this.$_.strUpdate(this.detailData) + '监控明细项吗？'
      this.$confirm(strOpration, '提示', this._._confirmObj)
        .then(() => this.updateDetail(this.detailData))
        .catch((action) => (action === 'cancel' ? this.$message.info('已取消操作！') : console.log(action)))
    },
    loadingDetailTable() {
      this.detailTable.data = []
      this.detailTable.pageObj.currentPage = 1
      api[this.detailInfo[this.searchData.itemCode].api](this.detailSearchData).then(
        (res) => res.strState === '1' && (this.detailTable.tableData = res.strResult)
      )
    }
    // #endregion detail dialog
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
