<template>
  <div :class="dialog ? 'update-form' : 'search-form'">
    <el-form
      ref="searchFormRef"
      :size="size"
      inline
      :model="searchData"
      :rules="rules"
      :validate-on-rule-change="validateOnRuleChange"
      :label-width="labelWidth"
      :label-position="labelPosition"
      @submit.native.prevent
    >
      <!-- <el-col :span="item.colSpan || colSpan" v-for="item in searchForm" :key="item.prop"> -->
      <template v-for="(item, index) in searchForm">
        <slot :name="item.prop + '-prepend'" :label-width="item.labelWidth || labelWidth" />
        <el-form-item
          v-show="item.show !== false"
          :key="item.prop"
          v-loading="item.loading || false"
          :error="item.error || ''"
          :label="item.label"
          :label-width="item.labelWidth || labelWidth"
          :prop="item.prop"
          :class="((!item.notFull && ' full ') || '') + ' ' + ((item.right && 'right') || '') + ' ' + (item.class || '')"
          :style="{ 'margin-right': isHandle && index === searchForm.length - 1 && '1.125rem', ...item.formItemStyle }"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'Input'"
            :ref="item.prop"
            v-model="searchData[item.prop]"
            :clearable="item.clearable !== false"
            :disabled="item.disabled"
            :type="item.typeArrt"
            :rows="item.rows || 2"
            :autosize="item.autosize"
            :show-word-limit="item.showWordLimit"
            :maxlength="item.maxlength"
            :style="item.style"
            :placeholder="item.placeholder || '请输入'"
            @input.native="(e) => item.input && item.input(searchData[item.prop], e)"
            @keyup.enter.native="(e) => (item.disabledKeyup === true || dialog ? item.keyupEnter && item.keyupEnter(e.target.value, e) : search())"
            @blur.native.capture="(e) => item.blur && item.blur(e)"
            @focus.native.capture="(e) => item.focus && item.focus(e)"
            @change="item.change && item.change(searchData[item.prop])"
          >
            <template v-if="item.append" #append> {{ item.append }}</template>
            <template v-if="item.prepend" #append> {{ item.prepend }}</template>
            <template v-if="item.prefix" #append> {{ item.prefix }}</template>
            <template v-if="item.suffix" #append> {{ item.suffix }}</template>
          </el-input>

          <el-input-number
            v-if="item.type === 'Number'"
            :ref="item.prop"
            v-model="searchData[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            :min="item.min || -Infinity"
            :max="item.max || Infinity"
            @change="item.change && item.change(searchData[item.prop])"
            @blur.native.capture="(e) => item.blur && item.blur(e)"
            @focus.native.capture="(e) => item.focus && item.focus(e)"
          />

          <!-- 密码框 -->
          <el-input
            v-if="item.type === 'password'"
            :ref="item.prop"
            v-model="searchData[item.prop]"
            :disabled="item.disabled || false"
            :placeholder="item.placeholder || '请输入密码'"
            :show-password="!!searchData[item.prop]"
            auto-complete="new-password"
            autocomplete="new-password"
            @change="item.change && item.change(searchData[item.prop])"
            @blur.native.capture="() => blurVisible(item.prop)"
          >
            <!-- <template slot="append">
              <span @click="item.onClick">{{ item.name }}</span>
            </template> -->
          </el-input>

          <!-- 下拉框 -->
          <!-- $forceUpdate() 下拉刷新,修复数据改变下拉框不变的bug -->
          <el-select
            v-if="item.type === 'Select'"
            :ref="item.prop"
            v-model.trim="searchData[item.prop]"
            :loading="item.loading"
            :filterable="item.filterable || true"
            :remote="item.remote || false"
            :remote-method="(qs) => item.remoteMethod && item.remoteMethod(qs, item)"
            :default-first-option="item.firstOption || false"
            :clearable="item.clearable !== false"
            :placeholder="item.placeholder || '请选择'"
            :name="item.prop"
            :disabled="item.disabled"
            :multiple="item.multiple"
            :collapse-tags="item.collapseTags"
            :popper-class="item.popperClass"
            :allow-create="item.allowCreate"
            :no-data-text="item.noDataText"
            :reserve-keyword="item.reserveKeyword"
            :filter-method="item.filter ? (v) => item.filter(v, item) : (v) => defaultFilter(v, item, item.prop)"
            @change="
              () => {
                item.filter ? item.filter(searchData[item.prop], item) : defaultFilter(searchData[item.prop], item, item.prop)
                item.change && item.change(searchData[item.prop])
                item.search && search()
              }
            "
            @visible-change="
              (v) => {
                item.filter ? item.filter(searchData[item.prop], item) : defaultFilter(searchData[item.prop], item, item.prop)
                $forceUpdate()
                item.visibleChange && item.visibleChange(v)
              }
            "
            @blur.native.capture="(e) => item.blur && item.blur(e)"
            @focus.native.capture="(e) => item.focus && item.focus(e)"
          >
            <el-option
              v-for="op in item.newOptions || item.options"
              :key="$_.optionValueFormat(op, item.props.value || 'value') + ''"
              :label="$_.optionLabelFormat(op, item.props.label)"
              :value="$_.optionValueFormat(op, item.props.value || 'value')"
              :disabled="op.disabled"
            />
          </el-select>

          <ElVirtualSelect
            v-if="item.type === 'VSelect'"
            v-model="searchData[item.prop]"
            :option-props="item.props"
            :options="item.options"
            :default-first-option="item.defaultFirstOption"
            :multiple="item.multiple"
            :filterable="item.filterable"
            :allow-create="item.allowCreate"
            :collapse-tags="item.collapseTags"
            @change="
              () => {
                item.change && item.change(searchData[item.prop])
                item.search && search()
              }
            "
          />

          <!-- 单选 -->
          <el-radio-group v-if="item.type === 'Radio'" v-model="searchData[item.prop]">
            <el-radio v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
          </el-radio-group>

          <!-- 组合单选按钮 -->
          <el-radio-group v-if="item.type === 'RadioButton'" v-model="searchData[item.prop]" @change="item.change && item.change(searchData[item.prop])">
            <el-radio-button v-for="ra in item.radios" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio-button>
          </el-radio-group>

          <!-- 复选框 -->
          <el-checkbox-group v-if="item.type === 'Checkbox'" v-model="searchData[item.prop]">
            <el-checkbox v-for="ch in item.checkboxs" :key="ch.value" :label="ch.value">{{ ch.label }}</el-checkbox>
          </el-checkbox-group>

          <!-- 日期 -->
          <el-date-picker
            v-if="item.type === 'Date'"
            v-model="searchData[item.prop]"
            value-format="yyyy-MM-dd"
            :placeholder="item.placeholder || '请选择'"
            :picker-options="setDisabled"
            @change="item.change && item.change(searchData[item.prop])"
          />

          <!-- 时间 -->
          <el-time-select
            v-if="item.type === 'Time'"
            v-model="searchData[item.prop]"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: item.key && searchData[item.key]
            }"
            :placeholder="item.placeholder || '请选择'"
          />

          <!-- 时间范围 -->
          <el-time-picker
            v-if="item.type === 'timeRange'"
            v-model="searchData[item.prop]"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            @change="item.change && item.change(searchData[item.prop])"
          />

          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type === 'DateTime'"
            v-model="searchData[item.prop]"
            type="datetime"
            :placeholder="item.placeholder"
            value-format="yyyy-MM-dd hh:mm:ss"
            :disabled="item.disable && item.disable(searchData[item.prop])"
            @change="item.change && item.change(searchData[item.prop])"
          />

          <!-- 起止日期 -->
          <el-date-picker
            v-if="item.type === 'Daterange'"
            v-model="searchData[item.prop]"
            :clearable="item.clearable || false"
            :picker-options="item.pickerOptions || {}"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="item.valFormat || 'yyyy-MM-dd'"
            @change="item.change && item.change(searchData[item.prop])"
          />

          <!-- 起止日期时间 -->
          <el-date-picker
            v-if="item.type === 'DateTimerange'"
            v-model="searchData[item.prop]"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-value="new Date().setMonth(new Date().getMonth() - 1)"
            :default-time="['00:00:00', '00:00:00']"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now()
              }
            }"
            @change="item.change && item.change(searchData[item.prop])"
          />

          <!-- 滑块 -->
          <el-slider v-if="item.type === 'Slider'" v-model="searchData[item.prop]" />

          <!-- 开关 -->
          <el-switch v-if="item.type === 'Switch'" v-model="searchData[item.prop]" :active-value="item.active" :inactive-value="item.inactive" />

          <!-- 三级联动 cascader -->
          <el-cascader
            v-if="item.type === 'cascader'"
            v-model="searchData[item.prop]"
            :options="item.props.options"
            :placeholder="item.props.placeholder || '请选择'"
            :disabled="item.props.disabled || false"
            style="width: 100%"
            :props="item.props.defaultParams"
            @change="item.change && item.change(searchData[item.prop], item)"
          />
          <template v-if="item.type === 'monaco'">
            <MonacoEditor
              ref="monacoRef"
              v-model="searchData[item.prop]"
              theme="vs-dark"
              class="monaco-editor"
              :language="item.language"
              :style="item.style"
              :options="{
                fontSize: 16,
                wrappingIndent: 'deepIndent',
                wordWrap: 'on',
                wordWrapBreakAfterCharacters: ' \t})]?|/&,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ”〉》」』】〕）］｝｣'
              }"
              @change="(v) => monacoChange(v, item)"
            />
          </template>
        </el-form-item>
        <slot :name="item.prop + '-append'" />
      </template>
      <!-- </el-col> -->
      <!-- button 操作按钮 -->
      <el-form-item v-if="isHandle" class="search_input_button" :style="operationButtonStyle">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search"> 查询 </el-button>
        <el-button v-if="isHandleReset" type="primary" icon="el-icon-refresh" size="mini" @click="search('重置')"> 重置 </el-button>
        <template v-for="item in searchHandle">
          <el-button
            v-if="!item.hide"
            :key="item.label"
            :icon="item.icon"
            :type="item.type || 'primary'"
            :disabled="item.disabled || false"
            size="mini"
            @click="item.handle()"
          >
            <span>{{ item.label }}</span>
          </el-button>
        </template>
        <slot name="opration-btn" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ElVirtualSelect from '@/components/ElVirtualSelect/index'
import MonacoEditor from 'vue-monaco'
import monacoJs from './monaco'
export default {
  components: { ElVirtualSelect, MonacoEditor },
  mixins: [monacoJs],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    // 表单布局
    colSpan: {
      type: Number,
      default: 6
    },
    // 操作按钮样式
    operationButtonStyle: {
      type: String,
      default: 'margin-left: 32px'
    },
    // 是否展示操作按钮
    isHandle: {
      type: Boolean,
      default: true
    },
    // label-width
    labelWidth: {
      type: String,
      default: '100px'
    },
    // 表单大小
    size: {
      type: String,
      default: 'mini'
    },
    searchForm: {
      type: Array,
      default: () => []
    },
    searchHandle: {
      type: Array,
      default: () => []
    },
    searchData: {
      type: Object,
      default: () => {}
    },
    // 是否展示重置按钮
    isHandleReset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      setDisabled: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    // 解析表单的正则验证
    rules() {
      const rules = this.searchForm.reduce((map, i) => {
        if (i.rules) {
          map[i.prop] = i.rules
        }
        return map
      }, {})
      return rules
    }
  },
  methods: {
    defaultFilter(v, item, refK) {
      const options = cloneDeep(item.options)
      item.newOptions = []
      const props = item.props
      const filterArr = (v && this.$_.filterArr(options, props, v)) || []
      const comSetOptions = this.$_.comSetOptions(options, props, filterArr)
      item.newOptions = [...filterArr, ...comSetOptions]
      this.$forceUpdate()
      refK &&
        this.$refs[refK] &&
        (this.$refs[refK][0] ? (this.$refs[refK][0].$refs.scrollbar.wrap.scrollTop = 0) : (this.$refs[refK].$refs.scrollbar.wrap.scrollTop = 0))
    },
    blurVisible(refK) {
      refK && this.$refs[refK] && (this.$refs[refK][0] ? (this.$refs[refK][0].passwordVisivle = false) : (this.$refs[refK].passwordVisivle = false))
    },
    resetForm() {
      this.$refs.searchFormRef.resetFields()
    },
    search(type) {
      if (type === '重置') {
        this.$refs.searchFormRef.resetFields()
        this.$emit('reset')
        return this.$emit('search')
      }
      const obj = {}
      Object.keys(this.$refs.searchFormRef.model).forEach((key) => {
        const item = this.$refs.searchFormRef.model[key]
        item ? (obj[key] = item) : (obj[key] = null)
      })
      if (Object.getOwnPropertyNames(this.rules).length) {
        this.$refs['searchFormRef'].validate((valid) => {
          this.$emit('validate-val', valid)
          if (valid) {
            return this.$emit('search', obj)
          } else {
            return false
          }
        })
      } else {
        this.$emit('search', obj)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
