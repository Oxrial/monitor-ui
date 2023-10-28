<template>
  <div>
    <BaseForm :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" @search="searchSubmit" @reset="userReset" />
    <BaseDialog :title="dialogConfig.title" :show="dialogConfig.show" @confirm="$refs.userFormRef.search()" @close-dialog-func="userBeforeClose">
      <BaseForm
        ref="userFormRef"
        dialog
        :is-handle="false"
        size="middle"
        label-width="120px"
        :search-data="userData"
        :search-form="userForm"
        @validate-val="(val) => (userValidateVal = val)"
        @search="(obj) => userValidateVal && updateUser(obj)"
      />
    </BaseDialog>
    <CommTable table-height="calc(100vh - 285px)" :table-data="userTable.tableData" :columns="userTable.columns" :page-obj="userTable.pageObj">
      <template #controlarea="{ row }">
        <el-button size="mini" @click="userRowUpdateHandle(row)">编辑 </el-button>
        <el-button size="mini" @click="userRowDeleteHandle(row)">删除 </el-button>
        <el-button size="mini" @click="userRowMsgTreeHandle(row)">通知项 </el-button>
      </template>
    </CommTable>
    <BaseDialog :title="msgDidalogConfig.title" :show="msgDidalogConfig.show" @confirm="updateMsgTree" @close-dialog-func="msgBeforeClose">
      <BaseTree ref="msgTree" :tree-config="msgTree" @check="msgTreeCheck" />
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { cloneDeep } from 'lodash-es'
import BaseTree from '@/components/BaseTree/index'
export default {
  name: 'UserManager',
  components: { BaseTree },
  data() {
    return {
      // 表单info
      searchData: {
        strUserType: '',
        strUserMobile: '',
        strUserDept: '',
        strUserLevel: '',
        state: ''
      },
      searchDataSubmit: null,
      searchForm: [
        { ...this.$_.formItem('用户类别', 'Select', 'strUserType', false, ['strRoleName', 'strRoleId']) },
        { ...this.$_.formItem('手机号码', 'Input', 'strUserMobile', false), clearable: true },
        { ...this.$_.formItem('用户部门', 'Input', 'strUserDept', false), clearable: true },
        {
          ...this.$_.formItem(
            '用户级别',
            'Select',
            'strUserLevel',
            false,
            ['label', 'value'],
            this.$_.simpleOptions(['系统负责人', '处室领导', '部门领导'], 1)
          ),
          clearable: true
        },
        {
          ...this.$_.formItem('用户状态', 'Select', 'state', false, ['label', 'value'], this.$_.simpleOptions(['无效', '正常'])),
          clearable: true
        }
      ],
      searchHandle: [
        {
          label: '新增',
          icon: 'el-icon-circle-plus-outline',
          handle: () => {
            this.dialogConfig.title = '新增用户'
            this.userForm.forEach((item) => 'disabled' in item && (item.disabled = false))
            this.dialogConfig.show = true
          }
        }
      ],
      dialogConfig: {
        title: '',
        show: false
      },
      userValidateVal: false,
      formEnums: {
        strUserCheckType: 'userCheckType',
        strUserCode: 'userCode',
        strUserComment: 'userComment',
        strUserDept: 'userDept',
        strUserEmail: 'userEmail',
        strUserLevel: 'userLevel',
        strUserMobile: 'userMobile',
        strUserName: 'userName',
        strUserPSWD: 'userPSWD',
        strUserState: 'userState',
        strUserTel: 'userTel',
        strUserType: 'userType',
        strUserTypeName: 'userTypeName'
      },
      userData: {
        userCode: '',
        userName: '',
        userType: '',
        userComment: '',
        userEmail: '',
        userMobile: '',
        userTel: '',
        userPSWD: '',
        userState: '1',
        loginState: '1',
        userDept: '',
        userLevel: '',
        usefulDate: '',
        event: '1'
      },
      userForm: [
        {
          ...this.$_.formItem('用户类别', 'Select', 'userType', false, ['strRoleName', 'strRoleId']),
          rules: [this.$_.setRequired('用户类别', 2)]
        },

        {
          ...this.$_.formItem('有效期限', 'Daterange', 'usefulDate', false),
          clearable: true,
          valFormat: 'yyyyMMdd',
          rules: [this.$_.setRequired('有效期限', 2)]
        },
        { ...this.$_.formItem('用户名称', 'Input', 'userName', false), rules: [this.$_.setRequired('用户名称')] },
        { ...this.$_.formItem('用户密码', 'password', 'userPSWD', false), flag: null, rules: [this.$_.setRequired('用户密码')] },
        { ...this.$_.formItem('用户标识', 'Input', 'userCode', false), flag: null, rules: [this.$_.setRequired('用户标识')] },
        {
          ...this.$_.formItem('邮箱地址', 'Input', 'userEmail', false),
          rules: [this.$_.setRequired('邮箱地址'), { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
        },
        {
          ...this.$_.formItem('手机号码', 'Input', 'userMobile', false),
          rules: [
            this.$_.setRequired('手机号码'),
            { pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: '请输入合法手机号', trigger: 'blur' }
          ]
        },
        {
          ...this.$_.formItem('电话号码', 'Input', 'userTel', false),
          rules: [{ pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入合法手机号/电话号码', trigger: 'blur' }]
        },
        { ...this.$_.formItem('用户部门', 'Input', 'userDept', false), rules: [this.$_.setRequired('用户部门')] },
        {
          ...this.$_.formItem('用户级别', 'Select', 'userLevel', false, ['label', 'value'], this.$_.simpleOptions(['系统负责人', '处室领导', '部门领导'], 1)),
          rules: [this.$_.setRequired('用户级别')]
        },
        {
          ...this.$_.formItem('用户说明', 'Input', 'userComment', false),
          class: 'inline',
          typeArrt: 'textarea',
          colSpan: 24,
          rules: [this.$_.setRequired('用户名称')]
        },
        {
          ...this.$_.stateFormItem('userState', '用户')
        }
      ],
      userTable: {
        tableData: [],
        columns: [
          // 表头数据
          { label: '用户标识', prop: 'strUserCode' },
          { label: '用户名', prop: 'strUserName' },
          { label: '用户类别', prop: 'strUserTypeName' },
          // {label: "用户说明", prop: "strUserComment"},
          { label: '邮箱地址', prop: 'strUserEmail', minWidth: '120' },
          { label: '手机号码', prop: 'strUserMobile' },
          { label: '电话号码', prop: 'strUserTel' },
          {
            label: '用户注册日期',
            prop: 'strRegistDate',
            width: '140'
          },
          {
            label: '用户开始使用日期',
            prop: 'strBeginDate',
            width: '140'
          },
          {
            label: '用户终止使用日期',
            prop: 'strEndDate',
            width: '140'
          },
          { label: '用户部门', prop: 'strUserDept' },
          { label: '用户级别', prop: 'strUserLevel', enums: { 1: '系统负责人', 2: '处室领导', 3: '部门领导' } },
          { label: '用户状态', prop: 'strUserState', width: '70', enums: { 1: '正常', 2: '无效' } },
          { label: '操作', prop: 'controlarea', width: 255 }
        ],
        pageObj: {
          curPageNotFirst: false,
          total: 0,
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => this.$_.pageTurning.call(this, currentPage, 'userTable'),
          sizeFunc: (size) => this.$_.pageSizeChange.call(this, size, 'userTable')
        }
      },
      msgDidalogConfig: {
        title: '',
        show: false
      },
      msgTree: {
        loading: false,
        checking: false,
        nodeKey: 'id',
        dataSubmit: null,
        data: [],
        props: {
          children: 'children',
          label: 'label'
        },
        defaultCheckedKeys: [],
        defaultExpandedKeys: ['checkedAll']
      }
    }
  },
  mounted() {
    this.getUserType()
    this.loadingUserTable()
  },
  methods: {
    /**
     * @desc: 获取用户类别列表
     * @param {*}
     * @return {*}
     */
    getUserType() {
      api.monitorRoleconsult().then((res) => {
        if (res.strState === '1') {
          this.$_.formItemOptionsSet.call(this, 'searchForm', 'Select', 'strUserType', res.strResult)
          this.$_.formItemOptionsSet.call(this, 'userForm', 'Select', 'userType', res.strResult)
        }
      })
    },
    /**
     * @desc: 弹窗关闭事件
     * @param {*}
     * @return {*}
     */
    userBeforeClose() {
      this.$refs.userFormRef.resetForm()
      this.$nextTick(() => {
        this.userData.event = '1'
        this.dialogConfig.show = false
      })
    },
    /**
     * 执行后台数据变更
     */
    updateUser(obj) {
      let strOpration = ''
      if (obj.event === '1') {
        strOpration = '新增'
      } else if (obj.event === '2') {
        strOpration = '修改'
        obj.userPSWD = null
      } else if (obj.event === '3') {
        strOpration = '删除'
        obj.userPSWD = null
      }

      this.$confirm('确定' + strOpration + '用户标识为:【' + obj.userCode + '】的用户吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          // api.confUserManage().then()
          console.log(obj)
          this.$refs.userFormRef.resetForm()
          this.dialogConfig.show = false
          this.loadingTable()
        })
        .catch(() => {
          this.$message.info('已取消操作！')
        })
    },
    /**
     * 映射表单数据
     */
    enumFormData(row, fkey, event) {
      // 弹窗表单懒加载，待初始值渲染后，再赋值
      this.$nextTick(() => {
        for (const key in row) {
          this.formEnums[key] in this[fkey] && (this[fkey][this.formEnums[key]] = row[key])
        }
        this[fkey].usefulDate = [row.strBeginDate, row.strEndDate]
        this[fkey].event = event
      })
    },
    /**
     * 修改触发器
     */
    userRowUpdateHandle(row) {
      this.dialogConfig.title = '编辑用户'
      this.userForm.forEach((item) => 'flag' in item && (item.disabled = true))
      console.log(row)
      this.enumFormData(row, 'userData', '2')
      this.dialogConfig.show = true
    },

    /**
     * 删除触发器
     */
    userRowDeleteHandle(row) {
      this.enumFormData(row, 'userData', '3')
      this.updateUser(this.userData)
    },

    searchSubmit() {
      // 提交表单
      this.$nextTick(() => {
        this.searchDataSubmit = cloneDeep(this.searchData)
        this.loadingUserTable()
      })
    },
    userReset() {},
    msgBeforeClose() {
      if (this.msgTree.checking) {
        this.$confirm('当前配置未保存，如关闭弹窗配置修改将不保存，是否继续！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => (this.msgDidalogConfig.show = false))
          .catch(() => {})
      } else {
        this.msgDidalogConfig.show = false
      }
    },
    /**
     * 配置用户接收通知项
     */
    userRowMsgTreeHandle(row) {
      this.loadingMsgTree(row)
      this.msgDidalogConfig.show = true
    },
    msgTreeCheck() {
      this.msgTree.checking = true
      this.msgTree.defaultCheckedKeys = this.$refs.msgTree.$refs.tree.getCheckedKeys().filter((id) => id.includes('-'))
    },
    loadingMsgTree(row) {
      this.msgTree.data = []
      this.msgTree.checking = false
      this.msgTree.defaultCheckedKeys = []
      this.msgTree.dataSubmit = cloneDeep(row)
      api.confGetLinkmanConfTree({ strUserCode: row.strUserCode }).then((res) => {
        this.msgTree.data = [
          {
            id: 'checkedAll',
            label: '全选',
            children: res.strResult.children
          }
        ]
        this.msgTree.defaultCheckedKeys = res.strResult.checked
      })
    },
    updateMsgTree() {
      console.log({ strUserCode: this.msgTree.dataSubmit.strUserCode, idStrArr: JSON.stringify(this.msgTree.defaultCheckedKeys) })
      // api.confUpdateLinkmanConfTree({ strUserCode: this.msgTree.dataSubmit.strUserCode, idStrArr: JSON.stringify(this.msgTree.defaultCheckedKeys) }).then((res) => {
      //   if (res.strState === '1') {
      //     this.$message({
      //       message: res.strMsg,
      //       type: 'success'
      //     })
      //   }
      // })
    },
    loadingUserTable() {
      this.userTable.tableData = []
      console.log(this.searchDataSubmit)
      api.confUserconsult(this.searchDataSubmit).then((res) => {
        this.userTable.tableData = JSON.parse(res.strResult)
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
