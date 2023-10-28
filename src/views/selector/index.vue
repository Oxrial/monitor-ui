<template>
  <div id="se" @mousedown.stop="handleBox">
    <ul id="ul">
      <li v-for="(item, index) in list" :key="index" :class="item.isS ? 'isS' : ''" class="li" @click.stop="handleClick(index)">
        {{ item.name + (index + 1) }}
      </li>
    </ul>
    <div v-show="isShowSeBox" id="selection"><span>VX:VillinWeChat</span><span>🙏谢谢送个👍</span></div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      list: [
        {
          name: '列表',
          id: 1,
          isS: false
        },
        {
          name: '列表',
          id: 2,
          isS: false
        },
        {
          name: '列表',
          id: 3,
          isS: false
        },
        {
          name: '列表',
          id: 4,
          isS: false
        },
        {
          name: '列表',
          id: 5,
          isS: false
        },
        {
          name: '列表',
          id: 6,
          isS: false
        },
        {
          name: '列表',
          id: 7,
          isS: false
        },
        {
          name: '列表',
          id: 8,
          isS: false
        },
        {
          name: '列表',
          id: 9,
          isS: false
        },
        {
          name: '列表',
          id: 10,
          isS: false
        },
        {
          name: '列表',
          id: 11,
          isS: false
        },
        {
          name: '列表',
          id: 12,
          isS: false
        }
      ],
      isshift: false, // 是否按下 shift
      isctrl: false, // 是否按下 ctrl
      isonkeydown: false, // 是否按下键盘
      selectBox: null, // 框选盒子
      isShowSeBox: false, // 框选是否显示div
      selectList: [], // 每次点击，push进去点击的index
      lipL: 0, // 框选li的父盒子针对于窗口的left
      lipT: 0 // 框选li的父盒子针对于窗口的top
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.selectBox = document.getElementById('selection')
    this.parentBox = document.getElementById('se')
    this.handleScroll()
  },
  destroyed() {
    document.body.removeEventListener('mousemove', this.moveselecttion)
    document.body.removeEventListener('mouseup', this.mouseupSelection)
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('keydown', this.clickKeydown)
    window.removeEventListener('keyup', this.clickKeyup)
  },
  methods: {
    handleBox(even) {
      if (!this.isctrl && !this.isshift && this.selectList.length !== 0) {
        this.selectList = []
        this.loop()
      }
      // 按下时的坐标
      this.downX = even.clientX
      this.downY = even.clientY
      this.selectBox.style.left = this.downX + 'px'
      this.selectBox.style.top = this.downY + 'px'
      document.body.addEventListener('mousemove', this.moveselecttion)
      document.body.addEventListener('mouseup', this.mouseupSelection)
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('keydown', this.clickKeydown)
      window.addEventListener('keyup', this.clickKeyup)
    },
    // 页面滚动  滚动时，实时更新父盒子横纵坐标
    handleScroll() {
      // 获取li父元素的纵坐标（相对于窗口）
      this.lipT = this.parentBox.getBoundingClientRect().top
      // 获取li父元素的横坐标（相对于窗口）
      this.lipL = this.parentBox.getBoundingClientRect().left
    },
    // 键盘按下
    clickKeydown(e) {
      switch (e.keyCode) {
        case 16:
          this.isshift = true
          break
        case 17: // window 键盘
          this.isctrl = true
          break
        case 91: // mac command  按键
          this.isctrl = true
          break
      }
    },
    // 键盘松开
    clickKeyup(e) {
      this.isshift = false
      this.isctrl = false
    },
    handleClick(index) {
      // shift 连选
      if (this.isshift) {
        if (this.selectList.indexOf(index) === -1) {
          this.selectList.push(index)
        }
        if (this.selectList.length > 1) {
          // 按 shift 连选，通过判断第一次点击index和最后一次index，中间全部选中
          const le = this.selectList.length
          var min = Math.min(this.selectList[0], this.selectList[le - 1])
          var max = Math.max(this.selectList[0], this.selectList[le - 1])
          this.selectList = [] // 防止最初始的两次点击，多处的两个index
          for (let i = min; i <= max; i++) {
            this.selectList.push(i)
          }
        }
        this.loop()
      } else if (this.isctrl) {
        // ctrl 多选 可重复单机取消
        if (this.selectList.indexOf(index) === -1) {
          this.selectList.push(index)
        } else {
          // 此处判断是否存在高亮index，如果存在，再次点击后，则删除此index，达到二次点击取消选区效果
          this.selectList.splice(this.selectList.indexOf(index), 1)
        }
        this.loop()
      } else {
        // 单选
        this.selectList = []
        this.selectList.push(index)
        this.loop()
      }
    },

    // 鼠标移动事件
    moveselecttion(even) {
      this.isShowSeBox = true
      this.selectBox.style.left = Math.min(even.clientX, this.downX) + 'px'
      this.selectBox.style.top = Math.min(even.clientY, this.downY) + 'px'
      this.selectBox.style.width = Math.abs(this.downX - even.clientX) + 'px'
      this.selectBox.style.height = Math.abs(this.downY - even.clientY) + 'px'
      this.covered()
    },
    // 鼠标松开事件
    mouseupSelection(even) {
      this.isShowSeBox = false
      this.selectBox.style.width = 0 + 'px'
      this.selectBox.style.height = 0 + 'px'
      document.body.removeEventListener('mousemove', this.moveselecttion)
      document.body.removeEventListener('mouseup', this.mouseupSelection)
    },
    // 是否被覆盖
    covered() {
      const li = document.getElementsByClassName('li')
      if (!this.isctrl && !this.isctrl) {
        this.selectList = []
      }
      const l = parseInt(this.selectBox.style.left)
      const t = parseInt(this.selectBox.style.top)
      const w = parseInt(this.selectBox.style.width)
      const h = parseInt(this.selectBox.style.height)
      for (let i = 0; i < li.length; i++) {
        if (this.selectList.indexOf(i) === -1) {
          //  子元素是相对父元素定位的，所以父元素有定位高度，offsetLeft 和 offsetTop不准
          const sl = li[i].offsetWidth + li[i].offsetLeft + this.lipL
          const st = li[i].offsetHeight + li[i].offsetTop + this.lipT
          if (sl > l && st > t && li[i].offsetLeft + this.lipL < l + w && li[i].offsetTop + this.lipT < t + h) {
            this.selectList.push(i)
          }
          this.loop()
        }
      }
    },
    // 循环遍历,在这里，可以拿到所选的item
    loop() {
      this.list.forEach((e, index) => {
        e.isS = false
        this.selectList.filter((item) => {
          if (item === index) {
            e.isS = true
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#se {
  background-color: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
ul {
  display: flex;
  flex-wrap: wrap;
  width: 500px;
  margin: 50px auto;
  li {
    box-sizing: border-box;
    padding: 5px 10px;
    border: 1px solid #ccc;
    margin: 10px;
    cursor: pointer;
  }
  .isS {
    background: #99f;
  }
}
#selection {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top left, rgba(218, 27, 198, 0.5), rgba(255, 222, 32, 0.2));
  color: rgb(36, 138, 129);
  font-size: 16px;
  width: 0px;
  height: 0px;
  overflow: hidden;
}
</style>
