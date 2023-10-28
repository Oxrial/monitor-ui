<template>
  <div class="sysWrapper">
    <BaseForm ref="sysDialogForm" :search-data="sysFormData" :search-form="sysForm" :is-handle="false"
     />
  </div>
</template>
<script>
import api from '@/api/index'
export default {
  name: 'SystemList',
  data() {
    return {
      sysForm: [
        {
          label: '系统序号',
          type: 'Input',
          prop: 'systemIndex',
          rules: [{ required: true, message: '请输入系统序号', trigger: 'blur' }]
        },
        {
          label: '系统标识',
          type: 'Input',
          prop: 'systemCode',
          rules: [{ required: true, message: '请输入系统标识', trigger: 'blur' }]
        },
        {
          label: '系统名称',
          type: 'Input',
          prop: 'systemName',
          rules: [{ required: true, message: '请输入系统名称', trigger: 'blur' }]
        },
        {
          label: '系统说明',
          type: 'Input',
          prop: 'systemComment',
          rules: [{ required: true, message: '请输入系统说明', trigger: 'blur' }]
        }
      ],
      sysFormData: {
        systemIndex: '',
        systemCode: '',
        systemName: '',
        systemComment: '',
      },
    }
  },
  mounted() {
  },
  methods: {
    validate(){
      this.$refs.sysDialogForm.search()
      let canNext = null;
      this.$refs.sysDialogForm.$refs.searchFormRef.validate((v) => {
        if (v) {
          canNext = true;
        }else{
          canNext = false;
        }
      })
      return canNext;
    },

    // savedata(obj){
    //   this.sysFormData = {...obj};
    // }
  }
}
</script>
<style lang="scss" scoped>
.sysWrapper {
  .home{
    background-color: inherit;
    margin-top: 0 !important;
    padding: 0;
  }
}
</style>