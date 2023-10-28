<template>
  <div class="home" :style="comtableStyle">
    <!-- 表单部分 -->
    <!-- 按钮部分 -->
    <div v-if="buttonLeft.length" class="button">
      <div class="button-left">
        <div v-for="i in buttonLeft" :key="i.name" class="button-left-sub">
          <el-button v-if="!i.hide" size="mini" :type="i.type" :icon="i.icon ? i.icon : ''" @click="i.onClick">
            {{ i.name }}
          </el-button>
        </div>
      </div>
      <div v-if="buttonRight.length" class="button-right">
        <div v-for="i in buttonRight" :key="i.name" class="button-right-sub">
          <el-button v-if="!i.hide" size="mini" :type="i.type" :icon="i.icon ? i.icon : ''" @click="i.onClick">
            {{ i.name }}
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格部分 -->
    <el-table
      ref="commonTable"
      v-loading="loading"
      :border="border"
      highlight-current-row
      size="mini"
      :height="tableHeight"
      stripe
      empty-text="无数据"
      :row-key="rowKey"
      :row-style="rowStyle"
      :data="frontPage ? tableData.slice((pageObj.currentPage - 1) * pageObj.size, pageObj.currentPage * pageObj.size) : tableData"
      :row-class-name="(obj) => (rowColorProp && rowClassNameInner(obj)) || rowClassName(obj)"
      :cell-class-name="(obj) => (cellColorProp && cellClassNameInner(obj)) || cellClassName(obj)"
      @current-change="handleClick"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column v-if="selection && columns.length" type="selection" :reserve-selection="reserveSelection" :selectable="selectable" width="40" />
      <el-table-column v-if="isShowIndex && columns.length" label="序号" type="index" width="50" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 有分页时，序号显示 -->
          <span v-if="pageObj">{{ (pageObj.currentPage - 1) * pageObj.size + scope.$index + 1 }}</span>
          <!-- 无分页时，序号显示 -->
          <span v-else>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="(col, index) in columns">
        <template v-if="col.show !== false">
          <!-- 操作列/自定义列 -->
          <slot v-if="col.slot" :name="col.slot" />
          <el-table-column
            v-else-if="col.state"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :align="col.align || 'left'"
          >
            <template slot-scope="{ row }">
              <el-switch
                :value="row[col.prop]"
                :active-value="col.av || '1'"
                :inactive-value="col.inav || '0'"
                :disabled="col.disabled"
                @change="(val) => col.change && col.change(val, row)"
              />
            </template>
          </el-table-column>
        </template>
        <!-- 普通列 -->
        <el-table-column
          v-else
          :key="index + else"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :formatter="col.formatter"
          :sortable="col.sortable"
          :fixed="col.fixed"
          align="left"
          :show-overflow-tooltip="col.tooltip"
        >
          <template slot-scope="{ row }">
            <slot
              :name="col.prop.toLowerCase()"
              :col="col"
              :value="$_.getValue(col.prop, row)"
              :row="row"
              :enums="col.enums || {}"
              :colorEnums="col.colorEnums || {}"
              :func="col.func"
            >
              <span :class="col.colorEnums && col.colorEnums[$_.getValue(col.prop, row)]">
                {{ col.enums ? col.enums[$_.getValue(col.prop, row)] : col.func ? col.func($_.getValue(col.prop, row)) : $_.getValue(col.prop, row) }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 是否调用分页 -->
    <div v-if="isShowPagination" class="pagination">
      <slot name="pager" />
      <el-pagination
        v-if="pageObj"
        size="mini"
        background
        :layout="pageObj.layout || 'sizes, pager'"
        :pager-count="5"
        :page-sizes="pageObj.sizes || [20, 50, 100]"
        :page-size="pageObj.size"
        :total="frontPage ? tableData.length : pageObj.total"
        :current-page="pageObj.currentPage"
        @size-change="pageObj.sizeFunc"
        @current-change="
          (curr) => {
            pageObj.func(curr)
            $refs.commonTable.bodyWrapper.scrollTop = 0
          }
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommTable',
  props: {
    // 是否前端分页
    frontPage: {
      type: Boolean,
      default: () => true
    },
    // 是否展示边框
    border: {
      type: Boolean,
      default: () => true
    },
    comtableStyle: {
      type: String,
      default: 'margin-top: 10px'
    },
    buttonRight: {
      type: Array,
      default: () => []
    },
    buttonLeft: {
      type: Array,
      default: () => []
    },
    // 表格高度
    tableHeight: {
      type: [String, Number],
      default: () => 300
    },
    // 是否可勾选
    selection: {
      type: Boolean,
      default: () => false
    },
    // 列表数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表头
    columns: {
      type: Array,
      default: () => []
    },
    // 是否需要序号
    isShowIndex: {
      type: Boolean,
      default: () => false
    },
    // 加载
    loading: {
      type: Boolean,
      default: () => false
    },
    // 分页组件
    pageObj: {
      type: Object,
      default: () => {}
    },
    rowColorProp: {
      type: String,
      default: ''
    },
    rowColorEnums: {
      type: Object,
      default: () => ({ 1: 'mose-normal', 2: 'mose-warning', 3: 'mose-danger' })
    },
    cellColorProp: {
      type: String,
      default: ''
    },
    cellColorEnums: {
      type: Object,
      default: () => ({ 1: 'mose-normal', 2: 'mose-warning', 3: 'mose-danger' })
    },
    rowClassName: { type: Function, default: () => {} },
    cellClassName: { type: Function, default: () => {} },
    isShowPagination: {
      type: Boolean,
      default: () => true
    },
    checkKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkArrObj: {}
    }
  },
  watch: {
    'pageObj.currentPage': {
      handler: function (n, o) {
        this.$nextTick(() => {
          n &&
            this.checkKey &&
            this.CheckArr().length &&
            this.CheckArr().forEach((c) =>
              this.tableData.forEach((t, index) => {
                if (c[this.checkKey] === t[this.checkKey]) {
                  this.toggleRowSelection(index, true)
                }
              })
            )
        })
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    clearSelection() {
      this.Table().clearSelection()
      this.checkArrObj = {}
    },
    Table() {
      return this.$refs.commonTable
    },
    CheckArr() {
      return flatten(Object.values(this.checkArrObj))
    },
    toggleRowSelection(index, flag) {
      this.Table().toggleRowSelection(this.tableData[index], flag)
    },
    // 勾选的数据
    handleSelectionChange(val) {
      this.$emit('handle-selection-change', val)
    },
    handleSelect(val) {
      this.backSelectionTrigger(val)
      this.$emit('handle-select', val)
    },
    handleSelectAll(val) {
      this.backSelectionTrigger(val)
      this.$emit('handle-select-all', val)
    },
    backSelectionTrigger(selection) {
      this.checkArrObj[this.pageObj.currentPage - 1] = cloneDeep(selection)
    },
    // 点击某一行返回行数据
    handleClick(currentRow, oldCurrentRow) {
      this.$emit('handle-click', currentRow, oldCurrentRow)
    },
    rowClassNameInner({ row, rowIndex }) {
      // 添加行序号
      row.index = rowIndex
      // 颜色枚举行记录
      return this.rowColorEnums[row[this.rowColorProp]]
    },
    cellClassNameInner({ row, column, rowIndex }) {
      // 添加行序号
      row.index = rowIndex
      column = this.cellColorProp && this.cellColorEnums[row[this.cellColorProp]]
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
