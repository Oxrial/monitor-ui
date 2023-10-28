<template>
  <div>
    <ace-editor ref="rules" :editor-value="coder.editorValue" editor-style="height:100px;" @change="rulesChange" />
    <ace-editor ref="differ" type="diff" :differ-prevalue="coder.differPrevalue" :differ-value="coder.differValue" editor-style="height:100px;" />
  </div>
</template>

<script setup>
import AceEditor from '@/components/Ace'
import { nextTick, onMounted, reactive, ref } from '@vue/composition-api'
const rules = ref(null)
const differ = ref(null)
const coder = reactive({
  editorValue: '',
  differPrevalue: '',
  differValue: '',
  rulesDialogConfig: {
    title: '',
    show: false
  },
  isChanged: false,
  errMsg: '',
  isEdit: false,
  differDialogConfig: { show: false },
  differObj: null
})
const rulesChange = () =>
  rules.value.editor.getSession().on('change', (e) => {
    coder.isChanged = coder.differPrevalue !== coder.value.getValue()
  })
onMounted(() => {
  // Object.prototype.toString.call(value)
  coder.editorValue =
    'hosts: \n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: "install {{ package_name }}"\n    package:\n      name: "{{ package_name }}"\n      state: "{{ state | default(\'present\') }}"'
  coder.differPrevalue =
    'hosts: \n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: "install {{ package_name }}"\n    package:\n      name: "{{ package_name }}"\n      state: "{{ state | default(\'present\') }}"'
  coder.differValue =
    'hosts: s \n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: "install {{ package_name }}"\n    package:\n      name: "{{ package_name }}"\n      state: "{{ state | default(\'present\') }}"'
  nextTick(() => {
    rules.value.initEditor()
    differ.value.initDiffer()
  })
})
</script>
<style lang="scss" scoped></style>
