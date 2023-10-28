<template>
  <div class="btnWrapper">
    <el-button class="btn-item" @click="showDialog('sys')">接入系统</el-button>
    <el-button class="btn-item" @click="showDialog('moniter')">监控开关</el-button>
    <el-button class="btn-item" @click="showDialog('contract')">联系人管理</el-button>
    <el-button class="btn-item" @click="showDialog('sysInfo')">系统配置信息</el-button>
    <BaseDialog  :show="dialogsys.visible" :title="dialogsys.title" @close-dialog-func="closeDialog('sys')" @confirm="confirm" customdialog="customdialog" dialogTop="10vh" width="65%">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="选择系统" ></el-step>
        <el-step title="选择主机" ></el-step>
        <el-step title="监控项信息" ></el-step>
        <el-step title="采集项信息" ></el-step>
      </el-steps>
      <SystemList v-show="active==0" ref="sysform"></SystemList>
      <HostList v-if="active==1" :sysdata="sysdata" @confirm="getHostList"></HostList>
      <MoniterItemList v-if="active==2" :hostList="hostList"></MoniterItemList>
      <CollectionItemList v-if="active==3" :hostList="hostList"></CollectionItemList>
      <template #footer>
        <div>
          <el-button @click="closeDialog('sys')">取消</el-button>
          <el-button @click="skipTo('pre')" v-if="active > 0"
            >上一步</el-button
          >
          <el-button @click="skipTo('next')" v-if="active < 3"
            >下一步</el-button
          >
          <el-button v-if="active > 2">提交</el-button>
        </div>
      </template>
    </BaseDialog>
     <BaseDialog  :show="dialogmoniter.visible" :title="dialogmoniter.title" @close-dialog-func="closeDialog('moniter')" @confirm="confirm_moniter" customdialog="customdialog itemhostdialog" dialogTop="10vh" width="65%">
        <MoniterSwitch></MoniterSwitch>
    </BaseDialog>
    <BaseDialog  :show="dialogcontract.visible" :title="dialogcontract.title" @close-dialog-func="closeDialog('contract')" @confirm="confirm_moniter" customdialog="customdialog" dialogTop="10vh" width="65%">
        <ContractSwitch></ContractSwitch>
    </BaseDialog>
    <BaseDialog  :show="dialogsysInfo.visible" :title="dialogsysInfo.title" @close-dialog-func="closeDialog('sysInfo')" @confirm="confirm_moniter" customdialog="customdialog" dialogTop="10vh" width="65%">
        <SysConfigInfo></SysConfigInfo>
    </BaseDialog>
  </div>
  
</template>
<script>
import SystemList from '@/components/Home/systemList'
import HostList from '@/components/Home/hostList'
import MoniterItemList from '@/components/Home/moniterItemList'
import CollectionItemList from '@/components/Home/collectionItemList'
import MoniterSwitch from '@/components/Home/moniterSwitch'
import ContractSwitch from '@/components/Home/contractSwitch'
import SysConfigInfo from '@/components/Home/sysConfigInfo'
export default {
  name: 'HandleContent',
  components: {
    SystemList,
    HostList,
    MoniterItemList,
    CollectionItemList,
    MoniterSwitch,
    ContractSwitch,
    SysConfigInfo
  },
  data() {
    return {
      // 弹窗接入系统
      dialogsys: {
        visible: false,
        title: '接入系统'
      },
      // 弹窗设置监控项开关
      dialogmoniter: {
        visible: false,
        title: '监控开关'
      },
      // 弹窗联系人
      dialogcontract: {
        visible: false,
        title: '联系人管理'
      },
      // 弹窗系统配置信息
      dialogsysInfo: {
        visible: false,
        title: '系统配置信息'
      },
      visible: false,
      active:0,
      sysdata:{},
      hostList:[],
    }
  },
  mounted() {},
  methods: {
    showDialog(flag){
      switch (flag) {
        case 'sys':
          this.dialogsys.visible = true
          break;
        case 'moniter':
          this.dialogmoniter.visible = true
          break;
        case 'contract':
          this.dialogcontract.visible = true
          break;
        case 'sysInfo':
          this.dialogsysInfo.visible = true
          break;
        default:
          break
      }
    },

    closeDialog(flag){
      switch (flag) {
        case 'sys':
          this.dialogsys.visible = false;
          this.active = 0;
          break;
        case 'moniter':
          this.dialogmoniter.visible = false
          break;
        case 'contract':
          this.dialogcontract.visible = false
          break;
        case 'sysInfo':
          this.dialogsysInfo.visible = false
          break;
        default:
          break
      }
    },

    skipTo(type) {
      if (type == "pre") {
        if (this.active == 0) return;
        this.active--;
      } else if (type == "next") {
        if(this.active==0){
          // const canNext = this.$refs.sysform.validate();
          // if(canNext){
          //   this.sysdata = this.$refs.sysform.sysFormData
            this.active++;
          // }
        }else if(this.active==1){
          const canNext = this.hostList.length>0;
          if(canNext){
            this.active++;
          }
        }else{
          this.active++;
        }
      }
    },

    confirm(flag){
      switch (flag) {
        case 'sys':
          this.sysdialog.visible = false;
          this.active = 0;
          break;
        case '编辑系统主机':
          this.$refs.hostDialogForm.resetForm()
          break
      }
    },

    confirm_moniter(){

    },

    getHostList(list){
      this.hostList = list;
    }
  }
}
</script>
<style lang="scss">
.btnWrapper {
  .btn-item {
    height: 42px;
    margin: 0 20px;
    background: transparent;
    color: #76d9ff;
    border: 1px solid #004cff;
  }
}
.customdialog{
  height: 720px;
  .el-dialog__header {
    padding: 10 10px 0;
    // height: 40px;
  }
  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #adadad;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
  .el-dialog__body{
    padding-top: 5px;
    height: 600px;
    overflow: hidden;
  }
  .el-step__title.is-wait {
    color: #919191;
}
}
.itemhostdialog{
  .el-dialog__body{
    padding: 0 20px;
  }
}
</style>