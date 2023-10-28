<template>
  <div class="mitemWrapper">
    <CommTable
      is-show-index
      :front-page="false"
      :border="false"
      :table-data="hostTable.data"
      :columns="hostTable.columns"
      :is-show-pagination="false"
      tableHeight="100%"
    >
      <el-table-column slot="operation" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" @click="showDialog($index)">配置监控项</el-button>
        </template>
      </el-table-column>
    </CommTable>
    <BaseDialog
      :show="hostdialog.visible"
      v-if="hostdialog.visible"
      width="60%"
      dialogTop="13vh"
      :title="hostdialog.title"
      @close-dialog-func="closeDialog()"
      @confirm="confirm"
      customdialog="mitemdialog"
    >
      <el-table
        ref="commonTable"
        highlight-current-row
        size="mini"
        stripe
        empty-text="无数据"
        :data="hostTable.data[c_index]['moniterItem']"
        :span-method="objectSpanMethod"
      >
        <template v-for="(col, index) in itemTable.columns">
          <el-table-column v-if="col.slot" :key="index" :label="col.label" :width="col.width">
            <template slot-scope="{ row, $index }">
              <div v-if="col.slot=='threshold'">
                <el-tag v-if="row.threshold_item.normal!=''" type="success">正常：{{row.threshold_item.normal}}</el-tag>
                <el-tag v-if="row.threshold_item.risk!=''" type="warning">风险：{{row.threshold_item.risk}}</el-tag>
                <el-tag v-if="row.threshold_item.danger!=''" type="danger">危险：{{row.threshold_item.danger}}</el-tag>
              </div>
              <el-switch v-else v-model="row.ctrl" active-color="#13ce66" inactive-color="#ff4949" @change="(value) => handleChangeCtrl(value, $index, row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :width="col.width" align="left">
            <template slot-scope="{ row }">
              <slot :name="col.prop" :value="row[col.prop]" :row="row" :enums="col.enums || {}" :func="col.func">
                {{ col.enums ? col.enums[row[col.prop]] : row[col.prop] }}
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </BaseDialog>
  </div>
</template>
<script>
import api from '@/api/index'
import axios from 'axios'
export default {
  name: 'MoniterItemList',
  props: {
    hostList: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  data() {
    return {
      // 弹窗
      hostdialog: {
        visible: false,
        title: '监控项配置'
      },
      hostTable: {
        data: [],
        columns: [
          {
            label: '系统标识',
            prop: 'systemCode'
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
            slot: 'operation'
          }
        ]
      },
      itemTable: {
        columns: [
          {
            label: '监控项',
            prop: 'moniter_item',
            width: '140'
          },
          {
            label: '阈值',
            prop: 'threshold_item',
            slot: 'threshold',
          },
          {
            label: '明细项',
            prop: 'detail_item'
          },
          {
            label: '监控开关',
            prop: 'ctrl',
            slot: 'operation',
            width: '140'
          }
        ]
      },
      c_index: 0, //当前host的index
      spanArr: [], // 记录每一行的合并数
      pos: 0, // 记录索引
      switch_model: []
    }
  },
  mounted() {
    const hostList = this.hostList;
    axios.get('statics/json/moniterItem.json').then(res=>{
      if (res.data.code) {
        let itemdata = res.data.strResult;
        (hostList || []).map((item) => {
          item['moniterItem'] = JSON.parse(JSON.stringify(itemdata))
        })
        this.hostTable.data = hostList 
      }
    })
    this.spanArr = []
  },
  methods: {
    showDialog(index) {
      let c_host = this.hostTable.data[index]
      this.c_index = index
      this.spanArr = []
      this.getSpanArr(c_host['moniterItem'])
      this.hostdialog.visible = true
      this.hostdialog.title = `主机监控配置（${c_host.strHostIP}）`
    },

    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].moniter_item === data[i - 1].moniter_item) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex, callback }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // console.log(`rowspan:${_row} colspan:${_col}`)
        // [0,0] 表示这一行不显示， [2,1]表示行的合并数
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },

    handleChangeCtrl(value, index, row) {
      let c_index = this.c_index
      let c_host = this.hostTable.data[c_index]
      let arr = c_host['moniterItem'] || []
      arr[index]['ctrl'] = value
      this.hostTable.data[c_index]['moniterItem'] = arr
      this.itemTable.data[index]['ctrl'] = value
    },

    confirm() {
      // let c_index = this.c_index;
      // let c_host = this.hostTable.data[c_index];
      this.hostdialog.visible = false
    },

    closeDialog() {
      this.hostdialog.visible = false
    }
  }
}
</script>
<style lang="scss">
.mitemWrapper {
  margin-top: 10px;
  height: 100%;
  .home {
    background-color: inherit;
    margin-top: 0 !important;
    padding: 0;
    height: 86%;
  }
}
.mitemdialog {
  height: 650px;
  .el-dialog__header {
    padding: 10;
    height: 60;
  }
  .el-dialog__body {
    padding-top: 5px;
    height: 530px;
    overflow: auto;
  }
}
</style>