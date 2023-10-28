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
          <el-button size="mini" @click="showDialog($index)">配置采集项项</el-button>
        </template>
      </el-table-column>
    </CommTable>
    <BaseDialog
      :show="hostdialog.visible"
      v-if="hostdialog.visible"
      width="40%"
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
        :data="hostTable.data[c_index]['collectionItem']"
      >
        <template v-for="(col, index) in itemTable.columns">
          <el-table-column v-if="col.slot" :key="index" :label="col.label" :width="col.width">
            <template slot-scope="{ row, $index }">
              <el-switch v-model="row.ctrl" active-color="#13ce66" inactive-color="#ff4949" @change="(value) => handleChangeCtrl(value, $index, row)">
              </el-switch>
              <!-- <BaseSwitch v-model="col.ctrl" :key="index" active-color="#13ce66" inactive-color="#ff4949" @change="(value)=>handleChangeCtrl(value,$index,row)">
              </BaseSwitch> -->
              <!-- <BaseSwitch v-model="col.ctrl" :key="index" @change="handleChangeCtrl($event,index,col)"/> -->
              <!-- <el-radio-group v-model="row.ctrl" @change="handleChangeCtrl($index,row)">
                <el-radio :label="true">备选项</el-radio>
                <el-radio :label="false">备选项</el-radio>
              </el-radio-group> -->
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
export default {
  name: 'CollectionItemList',
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
        title: '采集项配置'
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
            label: '采集项',
            prop: 'collection_item',
            width: '140'
          },
          {
            label: '明细项',
            prop: 'collection_content'
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
    }
  },
  mounted() {
    const hostList = this.hostList
    let itemdata = [
      {
        collection_item: '交易流水',
        collection_content: '交易码、交易码名称、交易来源系统、交易日期、交易时间、交易耗时、交易状态码',
        collection_type: '数据表扫描、日志扫描'
      },
      {
        collection_item: '文件信息',
        collection_content: '文件名、文件路径、状态（是否存在）',
        collection_type: '可执行文件'
      },
      {
        collection_item: '消息队列信息',
        collection_content: '通知消息名称、通知消息发起系统、通知消息接收系统、时间、标志位',
        collection_type: 'API获取'
      },
      {
        collection_item: '日终状态信息',
        collection_content: '日期、日终步骤名、日终步骤号、开始时间、结束时间、步骤耗时、报错时间、处理时长、超时时长、步骤状态',
        collection_type: '数据表扫描'
      },
      {
        collection_item: '对账状态信息',
        collection_content: '对账日期、对账平台名称、对账平台号、采集时间、不一致交易笔数',
        collection_type: '数据表扫描'
      },
      {
        collection_item: '端口状态信息',
        collection_content: '端口号、端口状态',
        collection_type: '可执行文件'
      },
      {
        collection_item: '应用服务状态信息',
        collection_content: '应用服务名、应用服务存活数',
        collection_type: '可执行文件'
      },
      {
        collection_item: '注册服务队列信息',
        collection_content: '注册服务名、注册服务状态',
        collection_type: 'skywalking采集'
      },
      {
        collection_item: '链路信息',
        collection_content: '节点、节点状态、节点请求情况',
        collection_type: 'skywalking'
      },
      {
        collection_item: 'Redis资源信息',
        collection_content: '节点名、节点状态、cpu使用率、内存使用率、内存使用大小',
        collection_type: 'exporter采集'
      },
      {
        collection_item: 'PostgreSQL资源信息',
        collection_content: '启动时间、版本、共享缓冲区、有较缓存、内占内存、最大连接数、数据库大小、当前连接数、已锁数、死锁数',
        collection_type: 'exporter采集'
      },
      {
        collection_item: 'JVM状态信息',
        collection_content:
          '监控Java应用JVM，包括heap区大小、堆外大小、heap区使用率、old区使用率、堆外内存使用率、新生代使用率、老年代使用率、perm、meta区使用率、YGC次数、YGC耗时、FullGC次数、FullGC耗时、GC总耗时，通过折线图展示，统计分析数据变化趋势',
        collection_type: 'java线程'
      },
      {
        collection_item: 'NGINX状态信息',
        collection_content:
          '监控Nacos服务，包括各组件运行状态、JVM监控指标（Nacos暴露指标，包括JVM内存使用、JVM最大字节，JVM GC字数、JMV GC耗时、JVM线程数）、http请求次数、http请求总耗时、Nacos config配置落盘任务堆积数、Nacos naming推送失败数、Nacos请求响应内部错异常（读写失败，没权限，参数错误）、Nacos naming leader发送心跳异常、Nacos naming ip个数、Nacos naming角色状态、数据库异常、Nacos config水平通知失败、Nacos config server之间健康检查异常，通过折线图、数字标签展示，统计分析数据变化趋势',
        collection_type: 'exporter采集'
      },
      {
        collection_item: 'TOMCAT状态信息',
        collection_content:
          '监控Tomcat服务，包括Tomcat版本、JDK版本、运行状态、JVM监控指标（参见2.5.3.1 JVM监控）、Tomcat请求量/秒、Tomcat一分钟新增会话数、错误数、线程总数、线程池使用率、TCP连接数，通过折线图、数字标签展示',
        collection_type: 'Exporter采集'
      },
      {
        collection_item: '主机状态监控',
        collection_content: '监控服务器CPU负载状态、持续正常运行时间',
        collection_type: 'java线程'
      }
    ];
    (hostList || []).map((item) => {
      item['collectionItem'] = JSON.parse(JSON.stringify(itemdata))
    })
    this.hostTable.data = hostList
  },
  methods: {
    showDialog(index) {
      let c_host = this.hostTable.data[index]
      this.c_index = index
      this.hostdialog.visible = true
      this.hostdialog.title = `主机监控配置（${c_host.strHostIP}）`
    },

    handleChangeCtrl(value, index, row) {
      debugger
      let c_index = this.c_index
      let c_host = this.hostTable.data[c_index]
      let arr = c_host['collectionItem'] || []
      arr[index]['ctrl'] = value
      this.hostTable.data[c_index]['collectionItem'] = arr
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