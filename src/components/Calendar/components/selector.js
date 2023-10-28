import { debounce } from 'lodash-es'

class Selector {
  shiftDown = false
  ctrlDown = false
  keyDown = false
  selectBox = null
  isShowSelectBox = false
  selectDays = []
  monthBox = null
  page = null
  monthL = 0
  monthT = 0
  downX = 0
  downY = 0
}
export default {
  data() {
    return {
      selector: null
    }
  },
  created() {
    this.selector = new Selector()
  },
  mounted() {
    this.selector.selectBox = document.getElementById('selection')
    this.selector.monthBox = document.getElementById('month')
    this.selector.page = this.page
    this.handleScroll()
  },
  methods: {
    handleScroll() {
      this.selector.monthT = this.selector.monthBox.getBoundingClientRect().top
      this.selector.monthL = this.selector.monthBox.getBoundingClientRect().left
    },
    handleBox(e) {
      e.stopPropagation()
      if (e.button === 0) {
        if (!this.selector.ctrlDown && !this.selector.shiftDown && this.selector.selectDays.length !== 0) {
          this.selector.selectDays = []
          this.loop()
        }
        this.selector.downX = e.clientX
        this.selector.downY = e.clientY
        this.selector.selectBox.style.left = this.selector.downX + 'px'
        this.selector.selectBox.style.top = this.selector.downY + 'px'
        this.selector.monthBox.addEventListener('mousemove', this.moveselecttion)
        this.selector.monthBox.addEventListener('mouseleave', this.mouseupSelection)
        this.selector.monthBox.addEventListener('mouseup', this.mouseupSelection)
        window.addEventListener('scroll', debounce(this.handleScroll))
        window.addEventListener('keydown', this.clickKeydown)
        window.addEventListener('keyup', this.clickKeyup)
      }
    },
    clickKeydown(e) {
      switch (e.keyCode) {
        case 16:
          this.selector.shiftDown = true
          break
        case 17:
          this.selector.ctrlDown = true
          break
        case 91:
          this.selector.ctrlDown = true
          break
      }
    },
    clickKeyup(e) {
      this.selector.shiftDown = false
      this.selector.ctrlDown = false
    },
    moveselecttion(even) {
      this.selector.isShowSelectBox = true
      const { downX, downY } = this.selector
      this.selector.selectBox.style.left = Math.min(even.clientX, downX) + 'px'
      this.selector.selectBox.style.top = Math.min(even.clientY, downY) + 'px'
      this.selector.selectBox.style.width = Math.abs(downX - even.clientX) + 'px'
      this.selector.selectBox.style.height = Math.abs(downY - even.clientY) + 'px'
      this.covered()
    },
    mouseupSelection(even) {
      this.selector.isShowSelectBox = false
      this.selector.selectBox.style.width = 0 + 'px'
      this.selector.selectBox.style.height = 0 + 'px'
      this.selector.monthBox.removeEventListener('mouseleave', this.mouseupSelection)
      this.selector.monthBox.removeEventListener('mousemove', this.moveselecttion)
      this.selector.monthBox.removeEventListener('mouseup', this.mouseupSelection)
    },
    covered() {
      const days = document.getElementsByClassName('vc-day')
      if (!this.selector.ctrlDown && !this.selector.shiftDown) {
        this.selector.selectDays = []
      }
      const { left, top, width, height } = this.selector.selectBox.style
      const { monthL, monthT } = this.selector
      const l = parseInt(left)
      const t = parseInt(top)
      const w = parseInt(width)
      const h = parseInt(height)
      for (let i = 0; i < days.length; i++) {
        if (this.page.days[i].inMonth) {
          if (!this.selector.selectDays.includes(this.page.days[i])) {
            const sl = days[i].offsetWidth + days[i].offsetLeft + monthL
            const st = days[i].offsetHeight + days[i].offsetTop + monthT
            if (sl > l && st > t && days[i].offsetLeft + monthL < l + w && days[i].offsetTop + monthT < t + h) {
              this.selector.selectDays.push(this.page.days[i])
            }
            this.loop()
          }
        }
      }
    },
    loop() {
      this.page.days.forEach((_, index) => {
        this.$set(this.page.days[index], 'isSelected', false)
        this.selector.selectDays.filter((sday) => {
          if (sday.id === this.page.days[index].id) {
            this.$set(this.page.days[index], 'isSelected', true)
          }
        })
      })
    },
    dayclick(day) {
      if (!this.selector.selectDays.find((d) => d.id === day.id)) {
        this.selector.selectDays.push(day)
      }
      this.loop()
      this.$emit('dayclick', day)
    },
    contextMenu(e) {
      e.preventDefault()
      this.$emit('month-context-menu', this.selector, e)
      return false
    }
  }
}
