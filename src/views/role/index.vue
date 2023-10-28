<template>
  <div style="background: #fff">
    <el-tabs v-model="editTabsValue" type="card" :before-leave="beforeLeaveTab" @tab-remove="delRole" @tab-click="getRoleName">
      <el-tab-pane
        v-for="userRole in tableData"
        :key="userRole.strRoleId"
        :closable="userRole.strRoleId !== '00000001' && userRole.strRoleId !== '00000002'"
        :label="userRole.strRoleName"
        :name="userRole.strRoleId"
      >
        <el-row style="margin: 0 20px">
          <!-- 用户列表 -->
          <el-col :span="12">
            <div class="sub-title" style="display: flex; justify-content: space-between; align-items: center">
              <span>用户列表：</span><el-button size="mini" icon="el-icon-circle-plus" @click="addUser"> 添加用户 </el-button>
            </div>
            <CommTable
              ref="user"
              class="mgt10"
              :comtable-style="'padding:0;'"
              :loading="userTableLoading"
              :table-height="tableHeight"
              :table-data="userList"
              :columns="columns"
              :page-obj="pageObj.user"
            >
              <el-table-column slot="strUserLevel" label="用户级别">
                <template slot-scope="scope">
                  {{ scope.row.strUserLevel === '1' ? '系统负责人' : scope.row.strUserLevel === '2' ? '处室领导' : '部门领导' }}
                </template>
              </el-table-column>
            </CommTable>
          </el-col>

          <!-- 竖线 -->
          <el-col :span="1">
            <div style="width: 1px; background: #80808070; margin: 0 auto" :style="{ height: tableHeight + 100 + 'px' }" />
          </el-col>

          <!-- 权限菜单 -->
          <el-col :span="11">
            <div style="text-align: right; margin-bottom: 10px">
              <el-button v-show="isDisabledEditBtn" size="mini" icon="el-icon-edit" @click="cancelEdit">取消</el-button>
              <el-tooltip effect="dark" content="默认角色禁止编辑" plcaement="top-start">
                <span v-show="editTabsValue === '00000001' || editTabsValue === '00000002'" style="width: 80px">
                  <el-button size="mini" icon="el-icon-edit" :disabled="true"> 编辑 </el-button>
                </span>
              </el-tooltip>
              <el-button
                v-show="!isDisabledEditBtn && editTabsValue !== '00000001' && editTabsValue !== '00000002'"
                size="mini"
                icon="el-icon-edit"
                :disabled="isDisabledEditBtn"
                @click="editRole"
                >编辑
              </el-button>
              <el-button size="mini" icon="el-icon-check" :disabled="!isDisabledEditBtn" @click="saveRole">保存</el-button>
            </div>
            <el-row>
              <el-col :span="3">
                <div class="sub-title">角色名称：</div>
              </el-col>
              <el-col :span="21">
                <el-input v-model="roleName" :disabled="!isDisabledEditBtn" clearable style="color: #9099aa" />
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="3">
                <div class="sub-title">权限菜单：</div>
              </el-col>
              <el-col :span="21">
                <el-tree
                  ref="elTree"
                  class="tree-line"
                  show-checkbox
                  node-key="path"
                  default-expand-all
                  :data="itemData"
                  :props="defaultProps"
                  :empty-text="treeLoading ? ' ' : '无数据'"
                  :style="{ height: tableHeight - 20 + 'px' }"
                  @check="handleCheckChange"
                >
                  <span slot-scope="{ data }" class="custom-tree-node">
                    <span>{{ data.meta.title }}</span>
                  </span>
                </el-tree>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane key="add" name="add">
        <span slot="label" style="padding: 8px; font-weight: bold"> + </span>
      </el-tab-pane>
    </el-tabs>
    <BaseDialog title="添加用户" :show="addUserDialog" @confirm="confirmAddUser" @close-dialog-func="beforeCloseDialog('addUserDialog')">
      <CommTable
        ref="addUser"
        :loading="addUserTableLoading"
        :table-data="addUserList"
        :columns="columns"
        :selection="true"
        :table-height="620"
        :page-obj="pageObj.addUser"
        @handle-selection-change="tableSelectionChange"
      >
        <el-table-column slot="strUserLevel" label="用户级别">
          <template slot-scope="scope">
            {{ scope.row.strUserLevel === '1' ? '系统负责人' : scope.row.strUserLevel === '2' ? '处室领导' : '部门领导' }}
          </template>
        </el-table-column>
      </CommTable>
    </BaseDialog>
    <BaseDialog title="新增角色" :show="addRoleDialog" @close-dialog-func="beforeCloseDialog('addRoleDialog')">
      <el-form ref="addRoleForm" :model="addRoleForm" :rules="addRoleFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" size="small" placeholder="角色名称" clearable />
        </el-form-item>
        <el-form-item label="权限菜单">
          <!-- <el-tree
            ref="addRoleTree"
            style="height: 400px; overflow: auto"
            show-checkbox
            highlight-current
            node-key="path"
            :data="itemData"
            :props="addDefaultProps"
            @check="addRoleHandleCheckChange"
          /> -->
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { asyncRouter } from '@/router/index'
import { deleteChildren } from '@/utils/tree'
export default {
  name: 'Role',
  data() {
    return {
      tableHeight: 800,
      roleMenuMap: new Map(),
      addUserTableLoading: true,
      userTableLoading: true,
      treeLoading: true,
      isChangeTree: false,
      isDisabledEditBtn: false,
      addRoleDialog: false,
      addUserDialog: false,
      roleName: '',
      editTabsValue: '',
      beforeSaveRoleName: '',
      checkedList: [],
      // 存放选中的id
      itemCheckedList: [],
      itemData: [],
      tableData: [],
      selectionUserList: [],
      addUserList: [],
      userList: [],
      columns: [
        { prop: 'strUserCode', label: '用户标识' },
        { prop: 'strUserName', label: '用户名称' },
        { prop: 'strUserMobile', label: '手机号码' },
        { prop: 'strUserDept', label: '用户部门' },
        { slot: 'strUserLevel' }
      ],
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      addRoleForm: {
        roleName: '',
        menu: []
      },
      defaultProps: {
        children: 'children',
        value: 'path',
        disabled: this.disabledFn
      },
      addDefaultProps: {
        children: 'submenuList',
        label: 'name'
      },
      pageObj: {
        user: {
          layout: 'total,sizes,prev,pager,next,jumper',
          currentPage: 1,
          sizes: [20, 50, 100],
          size: 20,
          func: (currentPage) => {
            this.pageTurning(currentPage, 'user')
          },
          sizeFunc: (size) => {
            this.pageSizeChange(size, 'user')
          }
        },
        addUser: {
          layout: 'total,sizes,prev,pager,next,jumper',
          currentPage: 1,
          size: 20,
          sizes: [20, 50, 100],
          func: (currentPage) => {
            this.pageTurning(currentPage, 'addUser')
          },
          sizeFunc: (size) => {
            this.pageSizeChange(size, 'addUser')
          }
        }
      }
    }
  },
  mounted() {
    this.itemData = deleteChildren(asyncRouter)
    this.getRoleList()
  },
  methods: {
    /**
     * 获取当前tab树实例
     * @param activeName 当前tab标签的name值  当切换tab标签前，有修改操作，则有activeName参数
     * @return {*} 当前树形控件实例
     */

    getTreeRef(activeName = this.editTabsValue) {
      const index = this.tableData.findIndex((item) => item.strRoleId === activeName)
      if (index === -1) return null
      return this.$refs.elTree[index]
    },

    /**
     * 树形控件勾选触发
     */
    handleCheckChange() {
      const curTree = this.getTreeRef()
      this.checkedList = curTree.getCheckedKeys().concat([], curTree.getHalfCheckedKeys())
      console.log(this.checkedList)
    },

    /**
     * 树形控件是否全部禁止勾选
     */

    disabledFn() {
      return !this.isDisabledEditBtn
    },

    /**
     * 保存
     */

    saveRole() {
      this.roleMenuMap.delete(this.editTabsValue)
      this.isDisabledEditBtn = false
      this.isChangeTree = false
      this.update()
    },

    /**
     * 编辑
     */

    editRole() {
      this.beforeSaveRoleName = this.roleName
      this.isDisabledEditBtn = true
    },

    /**
     * 取消编辑
     */

    cancelEdit() {
      const strRoleId = this.editTabsValue
      const curTree = this.getTreeRef(strRoleId)
      if (!curTree) return
      // curTree.setCheckedKeys(this.roleMenuMap.get(strRoleId))
      // this.itemCheckedList = this.roleMenuMap.get(strRoleId)
      this.isDisabledEditBtn = false
      this.isChangeTree = false
      this.roleName = this.beforeSaveRoleName
    },

    /**
     * 关闭弹窗
     */
    beforeCloseDialog(key) {
      this[key] = false
      this.$refs.addRoleForm?.clearValidate()
    },

    /**
     * 表格勾选发生改变时触发
     * @param row 已勾选的行数据数组
     */

    tableSelectionChange(row) {
      this.selectionUserList = row
    },

    /**
     * 确认添加用户
     */

    confirmAddUser() {
      const userCodes = this.selectionUserList.map((item) => item.strUserCode)
      const obj = {
        roleId: this.editTabsValue,
        userCodes: JSON.stringify(userCodes)
      }
      api.confUpdateUserTypeToRoleId(obj).then((res) => {
        this.getUserList(this.editTabsValue)
        this.addUserDialog = false
        this.$message({
          type: 'success',
          message: res.strMsg
        })
      })
    },

    /**
     * 获取非当前角色下的用户
     */

    getAddUserList() {
      this.addUserTableLoading = true
      this.addUserList = []
      this.pageObj.addUser.currentPage = 1
      const obj = {
        roleId: this.editTabsValue
      }
      api
        .confQueryUsersNoEqualToUserType(obj)
        .then((res) => {
          if (res.strResult && res.strResult.length) {
            this.addUserList = res.strResult
          }
        })
        .finally(() => {
          this.addUserTableLoading = false
        })
    },

    /**
     * 点击添加用户按钮
     */

    addUser() {
      this.getAddUserList()
      this.addUserDialog = true
    },

    /**
     * 获取当前角色名称
     * @param {*} e 当前树形控件实例
     */

    getRoleName(e) {
      if (e.name === 'add') return
      this.roleName = e.label
    },

    /**
     * 删除
     */

    delRole(name) {
      this.$confirm('此操作将永久删除该角色，是否继续!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          const formData = new FormData()
          formData.append('roleId', name)
          api.confDelRoleByRoleId(formData).then((res) => {
            if (res.strState === '1') {
              this.roleMenuMap.delete(name)
              this.tableData = this.tableData.filter((item) => item.strRoleId !== name)
              if (this.editTabsValue === name) {
                this.editTabsValue = this.tableData[0].strRoleId
                this.$nextTick(() => {
                  this.tabClick(this.editTabsValue)
                })
              }
              this.$message({
                type: 'success',
                message: '删除角色成功'
              })
            }
          })
        })
        .catch((e) => {})
    },

    /**
     * tab被选中时触发
     */

    tabClick(activeName = this.editTabsValue) {
      this.getUserList(activeName)
      this.isDisabledEditBtn = false
      this.isChangeTree = false
      // const curTree = this.getTreeRef(activeName)
      // if (!curTree) return
      // curTree.setCheckedKeys([])
      // this.getRoleMenuList(activeName)
    },

    /**
     * 切换标签之前的钩子，返回false,则阻止切换
     * @param activeName 当前标签的name
     */

    beforeLeaveTab(activeName) {
      if (activeName === 'add') {
        // 显示新增角色弹窗
        this.addRoleDialog = true
        return false
      }
      if (this.isChangeTree) {
        return this.$confirm('离开将不保存本页修改!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        })
          .then(() => {
            this.tabClick(activeName)
          })
          .catch(() => {})
      } else {
        this.tabClick(activeName)
      }
    },

    /**
     * 获取用户列表
     */

    getUserList(roleId) {
      this.userTableLoading = true
      this.userList = []
      this.pageObj.user.currentPage = 1
      const obj = {
        roleId
      }
      api
        .confQueryUsersByRoleId(obj)
        .then((res) => {
          if (res.strResult && res.strResult.length) {
            this.userList = res.strResult
          }
        })
        .finally(() => {
          this.userTableLoading = false
        })
    },

    /**
     * 获取角色列表
     */

    getRoleList() {
      this.tableData = []
      api.monitorRoleconsult().then((res) => {
        if (res.strResult && res.strResult.length) {
          this.tableData = res.strResult
          this.editTabsValue = this.tableData[0].strRoleId
          this.roleName = this.tableData[0].strRoleName
          this.getUserList(this.editTabsValue)
          // this.getRoleMenuList(this.editTabsValue)
        }
      })
    }
  }
}
</script>
<style scoped>
.tree-line {
  overflow: auto;
  padding: 20px 0 0 20%;
  border: 1px solid gray;
  border-radius: 4px;
  letter-spacing: 3px;
}
.el-tree {
    position: relative;
    cursor: default;
    background: #ededed;
    color: #606266;
}
.el-tree-node__content {
  padding-left: 0 !important;
}
.tree-line .el-tree-node {
  position: relative;
  padding-left: 17px;
}
.tree-line .el-tree-node__children {
  padding-left: 16px;
}
.tree-line .el-tree-node::before {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -26px;
  border-width: 1px;
  border-left: 1px dashed #52627c;
}
.tree-line .el-tree-node:last-child::before {
  height: 38px;
}
.tree-line .el-tree-node::after {
  content: '';
  width: 24px;
  height: 20px;
  position: absolute;
  left: -3px;
  top: 12px;
  border-width: 1px;
  border-top: 1px dashed #0a68ff;
}
.tree-line > .el-tree-node::after {
  border-top: none;
}
.tree-line > .el-tree-node::before {
  border-left: none;
}
.tree-line > .el-tree-node__expand-icon {
  font-size: 16px;
}
.tree-line > .el-tree-node__expand-icon .is-leaf {
  color: transparent;
}
</style>
