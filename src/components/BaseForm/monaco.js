import jy from 'js-yaml'
import { valueFormat } from '@/utils/yamlCheck'
export default {
  data() {
    return {
      monacoChanged: false,
      monacoLength: 0,
      monacoDifferDialogConfig: { show: false },
      monacoDifferPrevalue: '',
      monacoDifferValue: '',
      vRules: null
    }
  },
  methods: {
    checkYaml(value) {
      try {
        const v = jy.load(value)
        if (v && Object.prototype.toString.call(v) === '[object Object]') {
          this.errMsg = ''
          return true
        } else {
          this.errMsg = '配置文件内容有误或为空'
          return false
        }
      } catch (err) {
        this.errMsg = err.toString()
        return false
      }
    },
    monacoFormat(trigger) {
      // diff /update
      // change
      if (this.monacoChanged) {
        // diff -> update
        this.monacoChangedTrigger(trigger)
      } else {
        // update
        this.errMsg = ''
        trigger && this.search()
      }
    },
    monacoChangedTrigger(trigger) {
      const value = this.$refs.monacoRef[0].getMonaco().getValue()
      if (this.checkYaml(value)) {
        const formatV = jy.dump(jy.load(value), { lineWidth: -1 })
        this.$refs.monacoRef[0].getMonaco().setValue(formatV)
        this.monacoChanged = formatV !== this.monacoDifferPrevalue
        if (this.monacoChanged) {
          const o = jy.load(formatV)
          const flag = valueFormat(this.vRules, o)
          if (!flag) {
            if (trigger) {
              this.monacoDifferDialogConfig.show = true
              this.$nextTick(() => (this.monacoDifferValue = formatV))
            }
          } else {
            this.errMsg = flag
          }
        }
      }
    }
  }
}
