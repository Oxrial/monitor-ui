<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col :span="12">
        <TheTitle title="应用系统" @add="showDialog('新增应用系统')" />
        <CommTable
          is-show-index
          :front-page="false"
          :loading="sysTable.loading"
          :table-height="tableHeight"
          :table-data="sysTable.data"
          :columns="sysTable.columns"
          :is-show-pagination="false"
          @handle-click="systemRowClick"
        >
          <el-table-column slot="strSystemState" label="状态">
            <template slot-scope="{ row }">
              {{ row.strSystemState === '0' ? '关闭' : '开启' }}
            </template>
          </el-table-column>
          <el-table-column slot="operation" label="操作">
            <template slot-scope="{ row }">
              <el-button size="mini" @click="showDialog('编辑应用系统', row)">编辑</el-button>
              <el-button size="mini" @click="delSystem(row.strSystemCode)">删除</el-button>
            </template>
          </el-table-column>
        </CommTable>
      </el-col>
      <el-col :span="12">
        <TheTitle title="系统主机" @add="showDialog('新增系统主机')" />
        <CommTable
          :front-page="false"
          :loading="hostTable.loading"
          :table-height="tableHeight"
          :table-data="hostTable.data"
          :columns="hostTable.columns"
          :is-show-pagination="false"
        >
          <el-table-column slot="strHostType" label="节点类型">
            <template slot-scope="{ row }">
              {{ row.strHostType === '1' ? '应用节点' : row.strHostType === '2' ? '数据库节点' : '缓存节点' }}
            </template>
          </el-table-column>
          <el-table-column slot="strHostState" label="状态" width="50">
            <template slot-scope="{ row }">
              {{ row.strHostState === '0' ? '关闭' : '开启' }}
            </template>
          </el-table-column>
          <el-table-column slot="operation" label="操作" width="145">
            <template slot-scope="{ row }">
              <el-button size="mini" @click="showDialog('编辑系统主机', row)">编辑</el-button>
              <el-button size="mini" @click="delHost(row)">删除</el-button>
            </template>
          </el-table-column>
        </CommTable>
      </el-col>
    </el-row>
    <BaseDialog :show.sync="dialog.visible" :title="dialog.title" @close-dialog-func="closeDialog" @confirm="confirm">
      <BaseForm
        v-show="dialog.title === '新增应用系统' || dialog.title === '编辑应用系统'"
        ref="sysDialogForm"
        :search-data="sysFormData"
        :search-form="sysForm"
        :is-handle="false"
      />
      <BaseForm
        v-show="dialog.title === '新增系统主机' || dialog.title === '编辑系统主机'"
        ref="hostDialogForm"
        :search-data="hostFormData"
        :search-form="hostForm"
        :is-handle="false"
      />
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'

const TheTitle = {
  props: ['title'],
  methods: {
    add() {
      this.$emit('add')
    }
  },
  template: `
    <div class="main-header">
      <h3>{{title}}配置列表</h3>
      <el-button size="small" @click="add">新增</el-button>
    </div>
  `
}
export default {
  name: 'System',
  components: { TheTitle },
  data() {
    const stateRadios = [
      {
        value: '1',
        label: '启动'
      },
      {
        value: '0',
        label: '关闭'
      }
    ]
    return {
      // 弹窗
      dialog: {
        visible: false,
        title: ''
      },
      // 系统/主机表格共用
      tableHeight: 'calc(100vh - 200px)',
      // 系统表格
      sysTable: {
        loading: false,
        data: [],
        columns: [
          {
            label: '系统标识',
            prop: 'strSystemCode'
          },
          {
            label: '系统名称',
            prop: 'strSystemName'
          },
          {
            label: '系统说明',
            prop: 'strSystemComment'
          },
          {
            slot: 'strSystemState'
          },
          {
            slot: 'operation'
          }
        ]
      },
      // 系统表单 event:1 新增/ 2 编辑 / 3 删除
      sysFormData: {
        systemIndex: '',
        systemCode: '',
        systemName: '',
        systemComment: '',
        state: '1'
      },
      // 后台接收字段与返回字段不一样，枚举矫正
      emunSysForm: {
        systemIndex: 'iSystemIndex',
        systemCode: 'strSystemCode',
        systemName: 'strSystemName',
        systemComment: 'systemComment',
        state: 'strSystemState'
      },
      sysForm: [
        {
          label: '系统序号',
          type: 'Input',
          prop: 'systemIndex',
          rules: [{ required: true, message: '请输入系统序号', trigger: 'blur' }]
        },
        {
          label: '系统标识',
          type: 'Input',
          prop: 'systemCode',
          rules: [{ required: true, message: '请输入系统标识', trigger: 'blur' }]
        },
        {
          label: '系统名称',
          type: 'Input',
          prop: 'systemName',
          rules: [{ required: true, message: '请输入系统名称', trigger: 'blur' }]
        },
        {
          label: '系统说明',
          type: 'Input',
          prop: 'systemComment',
          rules: [{ required: true, message: '请输入系统说明', trigger: 'blur' }]
        },
        {
          label: '是否有效',
          type: 'Radio',
          prop: 'state',
          radios: stateRadios
        }
      ],
      // 主机表格
      hostTable: {
        loading: false,
        data: [],
        columns: [
          {
            label: '系统标识',
            prop: 'strSystemCode'
          },
          {
            label: '节点标识',
            prop: 'strHostCode',
            width: '120'
          },
          {
            slot: 'strHostType'
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
            slot: 'strHostState'
          },
          {
            slot: 'operation'
          }
        ]
      },
      // 主机表单 event:1 新增/ 2 编辑 / 3 删除
      hostFormData: {
        strHostType: '',
        systemCode: '',
        hostCode: '',
        hostName: '',
        hostComment: '',
        hostIp: '',
        hostArea: '',
        state: '1'
      },
      hostForm: [
        {
          label: '系统标识',
          type: 'Select',
          prop: 'systemCode',
          props: { label: 'strSystemCode', value: 'strSystemCode' },
          options: [],
          rules: [{ required: true, message: '请选择系统标识', trigger: 'blur' }]
        },
        {
          label: '节点标识',
          type: 'Input',
          prop: 'hostCode',
          rules: [{ required: true, message: '请输入节点标识', trigger: 'blur' }]
        },
        {
          label: '节点类型',
          type: 'Select',
          prop: 'strHostType',
          props: { label: 'label', value: 'strHostType' },
          options: [
            {
              strHostType: '1',
              label: '应用节点'
            },
            {
              strHostType: '2',
              label: '数据库节点'
            },
            {
              strHostType: '3',
              label: '缓存节点'
            }
          ],
          rules: [{ required: true, message: '请选择节点类型', trigger: 'blur' }]
        },
        {
          label: '节点名称',
          type: 'Input',
          prop: 'hostName',
          rules: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
        },
        {
          label: '节点说明',
          type: 'Input',
          prop: 'hostComment',
          rules: [{ required: true, message: '请输入节点说明', trigger: 'blur' }]
        },
        {
          label: 'IP地址',
          type: 'Input',
          prop: 'hostIp',
          rules: [{ required: true, message: '请输入IP地址', trigger: 'blur' }]
        },
        {
          label: '节点存放地',
          type: 'Input',
          prop: 'hostArea',
          rules: [{ required: true, message: '请输入节点存放地', trigger: 'blur' }]
        },
        {
          label: '状态',
          type: 'Radio',
          prop: 'state',
          radios: stateRadios
        }
      ],
      emunHostForm: {
        strHostType: 'strHostType',
        systemCode: 'strSystemCode',
        hostCode: 'strHostCode',
        hostName: 'strHostName',
        hostComment: 'strHostComment',
        hostIp: 'strHostIp',
        hostArea: 'strHostArea',
        state: 'strHostSate'
      }
    }
  },
  created() {
    this.getSysTableData()
    this.getHostTableData()
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
            this.hostForm[0].options = rs
          }
        })
        .finally(() => {
          this.sysTable.loading = false
        })
    },
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
    // 展示弹窗
    showDialog(title, row) {
      this.dialog.title = title
      this.dialog.visible = true
      if (row) {
        if (title === '编辑应用系统') {
          this.$nextTick(() => {
            Object.keys(this.sysFormData).forEach((key) => {
              this.sysFormData[key] = row[this.emunSysForm[key]]
            })
          })
        } else {
          this.$nextTick(() => {
            Object.keys(this.hostFormData).forEach((key) => {
              this.hostFormData[key] = row[this.emunHostForm[key]]
            })
          })
        }
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.dialog.visible = false
      switch (this.dialog.title) {
        case '新增应用系统':
        case '编辑应用系统':
          this.$refs.sysDialogForm.resetForm()
          break
        case '新增系统主机':
        case '编辑系统主机':
          this.$refs.hostDialogForm.resetForm()
          break
      }
    },
    // 点击弹窗确认按钮
    confirm() {
      switch (this.dialog.title) {
        case '新增应用系统':
        case '编辑应用系统':
          this.systemAdd(this.dialog.title)
          break
        case '新增系统主机':
        case '编辑系统主机':
          this.hostAdd(this.dialog.title)
          break
      }
    },
    // 新增/编辑系统
    systemAdd(title) {
      this.sysFormData.event = title === '新增应用系统' ? '1' : '2'
      this.$refs.sysDialogForm.search()
      this.$refs.sysDialogForm.$refs.searchFormRef.validate((v) => {
        if (v) {
          api
            .confSysinfomanage(this.sysFormData)
            .then((res) => {
              if (res) {
                this.getSysTableData()
                this.$message({
                  type: 'success',
                  message: this.sysFormData.event === '1' ? '新增成功' : '编辑成功'
                })
                this.closeDialog()
              }
            })
            .catch((err) => console.log(err))
        }
      })
    },
    // 删除系统
    delSystem(systemCode) {
      this.$confirm('确定删除吗', '提示', {
        type: 'warning'
      })
        .then(() => {
          const obj = {
            systemCode,
            event: '3'
          }
          api.confSysinfomanage(obj).then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getSysTableData()
            }
          })
        })
        .catch(() => {})
    },
    // 点击系统表格行，查询系统下的主机
    systemRowClick(row) {
      this.getHostTableData(row.strSystemCode)
    },
    // 新增/编辑主机
    hostAdd(title) {
      this.hostFormData.event = title === '新增系统主机' ? '1' : '2'
      this.$refs.hostDialogForm.search()
      this.$refs.hostDialogForm.$refs.searchFormRef.validate((v) => {
        if (v) {
          api
            .confHostinfomanage(this.hostFormData)
            .then((res) => {
              if (res) {
                this.getHostTableData()
                this.$message({
                  type: 'success',
                  message: this.hostFormData.event === '1' ? '新增成功' : '编辑成功'
                })
                this.closeDialog()
              }
            })
            .catch((err) => console.log(err))
        }
      })
    },
    // 删除主机
    delHost(row) {
      this.$confirm('确定删除吗', '提示', {
        type: 'warning'
      })
        .then(() => {
          const obj = {
            systemCode: row.strSystemCode,
            hostCode: row.strHostCode,
            event: '3'
          }
          api.confSysinfomanage(obj).then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getHostTableData()
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped lang="scss">
.main {
  background: #03083c;

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 0 10px;
    color: rgb(185, 192, 192);
  }
}
</style>
