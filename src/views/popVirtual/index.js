const popt = /* HTML */ `
  <el-popover v-if="popShowPre && popShow" ref="popRef" placement="bottom" :reference="referenceDom" popper-class="log-popper"> content... </el-popover>
`
const dt = /* HTML */ ` <div @mouseenter="popShowTrigger(xxx, $event)">content...</div> `
export default {
  data() {
    return {
      popContents: [],
      popShow: false,
      popShowPre: false,
      referenceDom: {}
    }
  },
  methods: {
    contextDom() {
      // return document.getElementsByClassName('context-menu')[0]
    },
    popShowTrigger(xxx, e) {
      !this.contextDom() && (this.popShowPre = true)
      if (popShowPre) {
        this.$refs.popRef?.doClose()
        this.popShow = false
        this.referenceDom = e.target
        this.$nextTick(() => {
          this.popShow = true
          this.popContents = []
          this.$nextTick(() => {
            this.popContents = xxx
            this.$refs.popRef.doShow()
          })
        })
      }
    }
  }
}
