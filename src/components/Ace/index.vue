<template>
  <div v-if="type === 'edit'" ref="code" class="editor-main" :style="editorStyle" />
  <div v-else-if="type === 'diff'" class="code editor-main" :style="editorStyle + ' position: reletive;'" />
</template>

<script>
import ace from 'ace-builds'
import AceDiff from 'ace-diff'
import 'ace-diff/dist/ace-diff.min.css'
import 'ace-diff/dist/ace-diff-dark.min.css'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-vibrant_ink' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-yaml' // 默认设置的语言模式
export default {
  name: 'Ace',
  props: {
    editorValue: {
      type: String,
      default: ''
    },
    differValue: {
      type: String,
      default: ''
    },
    differPrevalue: {
      type: String,
      default: ''
    },
    editorStyle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      editor: null,
      differ: null,
      commonOption: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: '16px',
        fontFamily: 'Consolas',
        mode: 'ace/mode/yaml',
        theme: 'ace/theme/vibrant_ink',
        tabSize: 2
      }
    }
  },
  mounted() {},
  methods: {
    editorCreated(editor) {
      editor.getSession().setUndoManager(new ace.UndoManager())
      editor.focus()
      editor.gotoLine(1, 0, true)
    },
    initEditor() {
      this.editor = ace.edit(this.$refs.code, {
        readOnly: false,
        ...this.commonOption
      })
      this.editor.setValue(this.editorValue)
      this.editorCreated(this.editor)
      this.$emit('change')
    },
    editorDestory() {
      this.editor && this.editor.destory()
    },
    initDiffer() {
      this.differ = new AceDiff({
        element: '.code',
        left: {
          content: '',
          editable: false
        },
        right: {
          content: '',
          editable: false
        }
      })
      const differEditors = this.differ.getEditors()
      differEditors.left.setOptions({ wrap: true, ...this.commonOption })
      differEditors.right.setOptions({ wrap: true, ...this.commonOption })
      differEditors.left.setValue(this.differPrevalue)
      differEditors.right.setValue(this.differValue)
      this.editorCreated(differEditors.left)
      this.editorCreated(differEditors.right)
    },
    differDestory() {
      this.differ && this.differ.destory()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
