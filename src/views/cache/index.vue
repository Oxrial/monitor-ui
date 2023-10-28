<template>
  <div>
    <CommTable
      :front-page="false"
      :is-show-pagination="false"
      table-height="calc(100vh - 120px)"
      :table-data="cacheTable.tableData"
      :columns="cacheTable.columns"
    >
      <template #controlarea="{ row }">
        <el-button icon="el-icon-refresh" type="success" @click="cacheRowUpdateHandle(row)">更新一级缓存 </el-button>
      </template>
    </CommTable>
    <BaseDialog :title="cacheDialogConfig.title" :show="cacheDialogConfig.show" @confirm="updateCache" @close-dialog-func="cacheBeforeClose">
      <BaseTree ref="hostTree" :tree-config="hostConfig" @check="hostTreeCheck" />
    </BaseDialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { cloneDeep } from 'lodash-es'
import BaseTree from '@/components/BaseTree'
export default {
  name: 'Cache',
  components: { BaseTree },
  data() {
    return {
      ipList: null,
      cacheData: null,
      hostConfig: {
        nodeKey: 'id',
        data: [],
        props: {
          children: 'children',
          label: 'label'
        },
        defaultCheckedKeys: [],
        defaultExpandedKeys: ['checkedAll']
      },
      cacheTable: {
        tableData: [
          {
            num: '1',
            serverName: 'NC相关服务',
            server: 'NC'
          },
          {
            num: '2',
            serverName: 'AC相关服务',
            server: 'AC'
          },
          {
            num: '3',
            serverName: 'PC相关服务',
            server: 'PC'
          },
          {
            num: '4',
            serverName: 'AG相关服务',
            server: 'AG'
          },
          {
            num: '5',
            serverName: 'UI相关服务',
            server: 'UI'
          }
        ],
        columns: [
          { label: '序号', prop: 'num' },
          { label: '服务名称', prop: 'serverName' },
          { label: '操作', prop: 'controlarea' }
        ]
      },
      cacheDialogConfig: {
        title: '更新AG关联系统主机',
        show: false
      }
    }
  },
  mounted() {},
  methods: {
    getSystemHostTree() {
      this.hostConfig.data = []
      api
        .confGetSystemHostTree()
        .then((res) => {
          if (res.strState === '1') {
            this.hostConfig.data = [
              {
                id: 'checkedAll',
                label: '全选',
                children: res.strResult
              }
            ]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    cacheRowUpdateHandle(row) {
      this.cacheData = cloneDeep(row)
      if (row.server === 'AG') {
        this.getSystemHostTree()
        return (this.cacheDialogConfig.show = true)
      }
      this.$confirm('确定更新【' + row.serverName + '】的一级缓存吗？', '提示', {
        type: 'warning'
      })
        .then(() => this.updateCache())
        .catch(() => {
          this.$message.info('已取消操作！')
        })
    },

    updateCache() {
      if (this.cacheData.server === 'AG') {
        this.cacheData.strListIP = JSON.stringify(this.ipList)
      }
      console.log(this.cacheData)
      // api.confReloadCache(this.cacheData).then((res) => {
      //   if (res.strState === '1') {
      //     this.cacheDialogConfig.show = false
      //     this.$message({
      //       type: 'success',
      //       message: res.strMsg
      //     })
      //   }
      // })
    },
    hostTreeCheck() {
      this.ipList = this.$refs.hostTree.$refs.tree.getCheckedKeys().filter((id) => id.includes('.'))
    },
    cacheBeforeClose() {
      this.cacheDialogConfig.show = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
