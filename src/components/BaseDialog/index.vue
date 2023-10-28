<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      :top="title === '详情' ? '5vh' : dialogTop"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      :append-to-body="true"
      :custom-class="customdialog"
    >
      <slot />
      <span v-if="isShowFooter" slot="footer" class="dialog-footer">
        <slot name="footer">
          <el-button @click="beforeClose">取 消</el-button>
          <el-button type="primary" @click="confirm">{{ onConfirmBtnName }}</el-button>
        </slot>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    title: {
      type: String,
      default: 'title'
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    // 按钮名称
    onConfirmBtnName: {
      type: String,
      default: '确 定'
    },
    // 弹窗离顶部距离
    dialogTop: {
      type: String,
      default: '15vh'
    },
    customdialog: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      visible: this.show
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    beforeClose() {
      this.$emit('close-dialog-func')
      this.$emit('update:show', false)
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
