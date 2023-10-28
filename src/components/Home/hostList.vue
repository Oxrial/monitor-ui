<template>
  <div class="hostWrapper">
    <TheTitle title="" @add="showDialog('新增系统主机')" />
    <CommTable
        is-show-index
        :front-page="false"
        :border="false"
        :table-data="hostTable.data"
        :columns="hostTable.columns"
        :is-show-pagination="false"
        tableHeight="100%"
    >
    </CommTable>
    <BaseDialog :show="hostdialog.visible" width="40%" :title="hostdialog.title" @close-dialog-func="closeDialog('host')" @confirm="confirm">
      <BaseForm
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
      <el-button size="small" @click="add">新增</el-button>
    </div>
  `
}
export default {
  name: 'HostContent',
  components: { TheTitle },
  props: {
    sysdata: { 
      type: Object,
      default: () => {} 
    },
  },
  data() {
    return {
      // 弹窗
      hostdialog: {
        visible: false,
        title: '新增系统主机'
      },
      hostTable:{
        data:[],
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
        ]
      },
      // sysdata:{},
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
          type: 'Input',
          prop: 'systemCode',
          disabled:true,
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
      ],
    }
  },
  mounted() {
    // this.sysdata = this.sysdata;
    this.hostFormData.systemCode = this.sysdata.systemCode;
    this.getHostTableData(this.sysdata.systemCode)
  },
  methods: {
    showDialog(title){
      this.hostdialog.visible = true;
      this.hostdialog.title = title;
    },

    closeDialog(){
      this.hostdialog.visible = false;
    },

    confirm(title){
      var testValue = 3 > 2 ? true : false
      this.hostFormData.event = title === '新增系统主机' ? '1' : '2'
      this.$refs.hostDialogForm.search()
      this.$refs.hostDialogForm.$refs.searchFormRef.validate((v) => {
        if (v) {
          api
            .confHostinfomanage(this.hostFormData)
            .then((res) => {
              if (res) {
                this.getHostTableData(this.hostFormData.systemCode);
                this.$message({
                  type: 'success',
                  message: this.hostFormData.event === '1' ? '新增成功' : '编辑成功'
                })
                this.hostdialog.visible = false;
              }
            })
            .catch((err) => console.log(err))
        }
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
            this.hostTable.data = JSON.parse(res.strResult);
            this.$emit("confirm",JSON.parse(res.strResult));
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
.hostWrapper {
  margin-top: 10px;
  height: 100%;
  .home {
    background-color: inherit;
    margin-top: 0 !important;
    padding: 0;
    height: 86%;
  }
}
</style>