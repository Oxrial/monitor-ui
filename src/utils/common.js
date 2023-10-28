import api from '@/api/index'
import { reject } from 'core-js/fn/promise'
import { cloneDeep, difference, isNil, toString } from 'lodash-es'
import { resolve } from 'path'
/**
 * 时间自更
 * @author: Zhj
 * @param {*}
 * @return {*}
 */
export function timeWalking() {
  this.timer = setInterval(() => {
    this.date = formatTime(new Date())
  }, 1000)
}

/**
 * 时间小于十补零
 * @author: Zhj
 * @param {*} val
 * @return {*}
 */
function fortime(val) {
  if (val < 10) {
    val = '0' + val
  }
  return val
}
/**
 * Date时间格式化
 * @author: Zhj
 * @param {*} date
 * @return {*}
 */
function formatTime(date) {
  /* 从Date对象（标准时间格式）返回对应数据 */
  return (
    date.getFullYear() +
    '-' +
    fortime(date.getMonth() + 1) +
    '-' +
    fortime(date.getDate()) +
    ' ' +
    fortime(date.getHours()) +
    ':' +
    fortime(date.getMinutes()) +
    ':' +
    fortime(date.getSeconds())
  )
}

/**
 * 日期20210601 时间000000
 * 格式化为 yyyy-MM-dd
 * 格式化为 HH:mm:ss
 * 格式化为  yyyy-MM-dd HH:mm:ss
 * @author: Zhj
 * @param {*} date 8位数日期
 * @param {*} time 6位数时间
 * @return {*}
 */
export function formatDate8Time6ToLocal(date, time) {
  if (date && date.length === 8) {
    date = this.subStr(date, [4, 2, 2], '-')
  }
  if (time && time.length === 6) {
    time = this.subStr(time, [2, 2, 2], ':')
  }
  if (date && time) return date + ' ' + time
  else if (date && !time) return date
  else if (time && !date) return time
}
/**
 * 格式化n位时间戳为 yyyy-MM-dd HH:mm:ss
 * @param {*} num
 * @return {*}
 */
export function formatTimeToDate(num) {
  num = num.toString()
  let numx = 0
  if (num.length === 10 || (num.toString().indexOf('.') > -1 && num.length === 14)) {
    numx = parseInt(num) * 1000
  } else if (num.length === 13) {
    numx = parseInt(num)
  }
  return new Date(numx).toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
}
/**
 * 截取格式化字符串
 * @param {*} str
 * @param {*} subArr
 * @param {*} sign
 */
export function subStr(str, subArr, sign) {
  let res = ''
  let o1 = 0
  let o2 = 0
  subArr.forEach((item, index) => {
    res += str.substring((o1 = o2), (o2 = o1 + item))
    index !== subArr.length - 1 && (res += sign)
  })
  return res
}

/**
 * 不四舍五入
 * @param num
 * @param decimal
 * @return {number}
 */
export function toFixedNot(num, decimal) {
  if (typeof num === 'number') {
    num = num.toString()
    const index = num.indexOf('.')
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
    } else {
      num = num.substring(0)
    }
    return Number(parseFloat(num).toFixed(decimal))
  } else {
    throw new Error('toFixedNot(' + num + ',' + decimal + ')非四舍五入仅支持number的数字类型')
  }
}

/**
 * 小数进1
 */
export function aheadNumber(n) {
  n = Number(n)
  return n > parseInt(n) ? parseInt(n) + 1 : n
}
export function valueForEnums(value, enums = {}) {
  return enums[this[value]]
}
/**
 * echarts 初始化或获取
 * @param {*} echartId 图表id
 * @return {*}
 */
export function echartsGSet(echartId) {
  const xdom = document.getElementById(echartId)
  return this.$echarts.getInstanceByDom(xdom) ? this.$echarts.getInstanceByDom(xdom) : this.$echarts.init(xdom)
}
export const colors = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#bc8dd0',
  '#65deb8',
  '#ff4c00',
  '#ff7500',
  '#ffa400',
  '#fff143',
  '#20fd44',
  '#3eede7',
  '#44cef6',
  '#4b5cc4',
  '#cca4e3',
  '#ff0097',
  '#ee4161',
  '#ffb3a7',
  '#a3d900',
  '#88ebf3',
  '#f3d3e7',
  '#b476e7',
  '#ea7ccc',
  '#65ea09',
  '#c4f078',
  '#7480be',
  '#f62e84',
  '#f69bba',
  '#b483d2',
  '#9483d2',
  '#6ba5d9',
  '#20fd44',
  '#8de79d'
]
/**
 * echarts series颜色初始化
 * @param num
 * @return {*}
 */
export function setColor(num) {
  return colors.slice(0, num)
}

/**
 * 重绘无数据加载中的echarts图占位
 * @param id echarts图表id
 */
export function resetNoDataEcharts(id) {
  const xechart = echartsGSet.call(id)
  xechart.hideLoading()
  xechart.clear()
  xechart.dispose()
  document.getElementById(id).innerHTML = `<div class="echart-area-item-text">无数据</div>`
}

/**
 * 科学技术法转正常值
 * @param num 原数据
 */
export function normalNumber(num) {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  let n = num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  const end = n.indexOf('.')
  // 若为小数则截取字符串，保留2位
  end > 0 && (n = n.substring(0, end + 4))
  return n
}

/**
 * 格式化数据
 **/
export function formatNum(str) {
  var newStr = ''
  var count = 0
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    newStr = newStr + str.substr(str.indexOf('.'), str.length)
  }
  return newStr
}

/**
 * 动态千字节演算
 * @param kb
 * @returns {string}
 */
export function dynamicKB(kb) {
  if (kb >= 1024) {
    const MB = normalNumber(accDiv(parseFloat(kb), 1024))
    if (MB >= 1024) {
      const GB = normalNumber(accDiv(parseFloat(kb), 1024 ** 2))
      if (GB >= 1024) {
        return normalNumber(accDiv(parseFloat(kb), 1024 ** 3)) + ' TB'
      } else {
        return GB + ' GB'
      }
    } else {
      return MB + ' MB'
    }
  } else {
    return kb + ' KB'
  }
}

/**
 * 动态字节演算
 * @param bytes
 * @returns {string}
 */
export function dynamicBytes(bytes) {
  if (bytes >= 1024) {
    const KB = normalNumber(accDiv(parseFloat(bytes), 1024))
    if (KB >= 1024) {
      const MB = normalNumber(accDiv(parseFloat(bytes), 1024 ** 2))
      if (MB >= 1024) {
        const GB = normalNumber(accDiv(parseFloat(bytes), 1024 ** 3))
        if (GB >= 1024) {
          return normalNumber(accDiv(parseFloat(bytes), 1024 ** 4)) + ' TB'
        } else {
          return GB + ' GB'
        }
      } else {
        return MB + ' MB'
      }
    } else {
      return KB + ' KB'
    }
  } else {
    return normalNumber(parseFloat(bytes)) + ' Bytes'
  }
}
/**
 * 浮点数乘法
 * @param {*} o1 number
 * @param {*} o2 number
 * @return {*}
 */
export function accMul(o1, o2) {
  let m = 0
  const s1 = o1.toString()
  const s2 = o2.toString()
  try {
    m += s1.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}
/**
 * 浮点数除法
 * @param {*} o1 number
 * @param {*} o2 number
 * @return {*}
 */
export function accDiv(o1, o2) {
  let t1 = 0
  let t2 = 0
  try {
    t1 = o1.toString().split('.')[1].length
    t2 = o2.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const r1 = Number(o1.toString().replace('.', ''))
  const r2 = Number(o2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * 解析key对应的vuedata对象
 * @param key
 * @param obj
 */
export function getValue(key, obj) {
  const arr = key.split('.')
  return arr.reduce((a, b) => {
    return a[b]
  }, obj)
}
/**
 * 请求formData生成
 * @param sys 系统标识
 * @param host 主机标识
 * @param strItem 监控项
 * @param strSubitem 监控子项
 * @returns {FormData}
 */
export function createFormData(sys, host, strItem, strSubitem) {
  const formData = new FormData()
  formData.append('strSystemCode', sys)
  formData.append('strHostCode', host)
  formData.append('strItem', strItem || '')
  formData.append('strSubitem', strSubitem || '')
  return formData
}

/**
 * 请求json生成
 * @param sys 系统标识
 * @param host 主机标识
 * @param strItem 监控项
 * @param strSubitem 监控子项
 * @returns {{strSystemCode: *, strHostCode: *, strSubitem: (*|string), strItem: (*|string)}}
 */
export function createRequestData(sys, host, strItem, strSubitem) {
  return {
    strSystemCode: sys,
    strHostCode: host,
    strItem: strItem || '',
    strSubitem: strSubitem || ''
  }
}

/**
 * 图表serie子项名称
 * @param iitem serie项配置数据
 * @param resItem serie项结果集
 * @returns {string}
 */
export function getSubSerieName(iitem, resItem) {
  let subserieName = ''
  if (iitem.subserieList) {
    iitem.subserieList.forEach((key) => {
      subserieName ? (subserieName += '/') : ''
      subserieName += getValue(key, resItem)
    })
  }
  return subserieName
}

// 源
// 目标
// 线型
// 连接端点8个方位
// arrowType 箭头类型
// lineColor 线色
export function jsPlumbDrawLine(source, target, arrowType, conn, anchor, lineColor, width) {
  // 1 单向单箭头；2 双向单箭头 ；3 单向双箭头
  arrowType = arrowType || 2
  let overlays = [['Arrow', { width: 7, length: 5, location: 1 }]]
  if (arrowType === 2) {
    overlays = [
      ['Arrow', { width: 7, length: 5, location: 1 }],
      ['Arrow', { width: 7, length: 5, location: 0, direction: -1 }]
    ]
  }
  // anchor数组进行定位是x、y、dx、dy说明，
  // x代表从左到右（0-1），
  // y代表从上到下（0-1）。
  // dx代表从从左到右（-1-0-1）中间为0，
  // dy代表从上到下（-1-0-1）中间为0。
  // 例如： [0, 0.5, -1, 0]代表leftCenter（left）。 [ 0.7,0,-1,0]
  const common = {
    endpoint: 'Rectangle',
    connector: [conn || 'Flowchart'],
    anchor: anchor || 'Continuous',
    // anchor: [
    //   "Top",
    //   "TopRight",
    //   "Right",
    //   "BottomRight",
    //   "Bottom",
    //   "BottomLeft",
    //   "Left",
    //   "TopLeft"
    // ],
    // 线条样式
    paintStyle: {
      stroke: lineColor || this.$c.Green3,
      strokeWidth: width || 0
    },
    // 点
    // endpoints:
    //   [
    //   ["Dot", { radius: 7 }],
    //   ["Dot", { radius: 11 }]
    //   ]
    //   "Blank",
    // 点样式
    endpointStyle: {
      fill: 'transparent'
      // outlineStroke: "darkgray",
      // outlineWidth: 0
    },
    overlays: overlays
  }
  this.$line.connect(
    {
      source: source,
      target: target
    },
    common
  )

  if (arrowType === 3) {
    this.$line.connect(
      {
        source: target,
        target: source
      },
      common
    )
  }
}

// 排序方法 attr 需要排序的字段--- rev true 升序 false降序
export function sortBy(attr, rev) {
  if (rev === undefined) {
    rev = 1
  } else {
    rev = rev ? 1 : -1
  }
  return function re(a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

// #region echarts
const tooltipFormatterEnums = {
  '%': (val) => {
    return (parseFloat(val) - parseInt(val) > 0 ? toFixedNot(parseFloat(val), 2) : val) + ' %'
  },
  dynamicBytes: (val) => {
    return dynamicBytes(val)
  },
  dynamicKB: (val) => {
    return dynamicKB(val)
  }
}

/**
 * tooltipFormatter执行
 * @param unit 单位 / 枚举单位键
 * @param item 原数据
 * @returns {string}
 */
function doTooltipFormatter(unit, item) {
  let res = '<td>' + item.marker + item.seriesName + '</td><td>'
  if (isNaN(parseFloat(item.data[1]))) {
    res += item.data[1]
  } else {
    res += tooltipFormatterEnums[unit] ? tooltipFormatterEnums[unit](item.data[1]) : toFixedNot(parseFloat(item.data[1]), 2) + ' ' + unit
  }
  res += '</td>'
  return res
}

export function tooltipFormatter(param) {
  let tooltipText = '日期：' + param[0].axisValueLabel + '<br/>' + '<table>'
  for (let index = 0; index < param.length; index++) {
    const unit = param[index].borderColor
    tooltipText += '<tr>' + doTooltipFormatter(unit, param[index])
  }
  return tooltipText + '</table>'
}

export const _tooltip = {
  moreSeries: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)',
    borderColor: '#333',
    textStyle: {
      color: '#fff'
    },
    confine: false,
    className: 'echarts-tooltip echarts-tooltip-dark'
  }
}
export const _titleStyle = {
  fontSize: 14,
  fontWeight: 'bold'
}
export const _xaxis = {
  time: [
    {
      type: 'time',
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        formatter: {
          day: '{yyyy}-{M}-{d}',
          hour: '{H}:{mm}',
          minute: '{H}:{m}:{ss}',
          second: '{H}:{m}:{ss}'
        }
      },
      boundaryGap: ['1%', '3%'],
      data: []
    }
  ],
  category: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {}
      },
      axisLabel: {
        position: 'bottom'
      },
      data: []
    }
  ]
}

export const _legend = {
  show: true,
  data: [],
  selected: {},
  tooltip: {
    show: true
  },
  textStyle: {}
}

export const _yaxis = {
  parcent: {
    name: '百分比',
    nameTextStyle: {
      align: 'left'
    },
    type: 'value',
    min: 0,
    max: 100,
    interval: 10,
    axisLine: {
      show: true
    },
    axisLabel: {
      show: true
    }
  },
  value: {
    name: '',
    nameTextStyle: {
      align: 'middle',
      padding: [0, 30, 0, 0]
    },
    type: 'value',
    minInterval: 1,
    axisLine: {
      show: true,
      lineStyle: {}
    },
    axisLabel: {
      show: true
    }
  }
}

export const _serie = {
  name: '',
  symbol: 'none',
  symbolSize: 1,
  type: 'line',
  yAxisIndex: 0,
  connectNulls: false,
  data: [],
  itemStyle: {
    borderWidth: 0,
    borderColor: '-'
  },
  lineStyle: {
    width: 1
  }
}

/**
 * echarts折线图初始化
 * @param {*} id echarts dom id
 * @param {*} title:{show:true/false,text:'标题'}
 * @param {*} tooltip 悬浮框
 * @param {*} legend 图例数据
 * @param {*} grid 布局
 * @param {*} dataZoom:{true:true,dataZoomStart:0} 是否禁缩放
 * @param {*} xAxis x对象
 * @param {*} yAxis y对象
 * @param {*} series 图表数据
 * @return {*}
 */
export function categoryEchartsInit(id, title, tooltip, legend, grid, dataZoom, xAxis, yAxis, series, item, func) {
  const option = {
    color: setColor((legend && legend.data && legend.data.length) || 1),
    title: {
      show: (title && title.show) || false,
      text: (title && title.text) || '',
      textStyle: (title && title.textStyle) || {}
    },
    tooltip: tooltip,
    legend: legend || {},
    grid: {
      top: (grid && grid.top) || '13%',
      right: (grid && grid.right) || (yAxis.length === 2 && '8%') || '',
      bottom: (grid && grid.bottom) || '10%',
      left: (grid && grid.left) || '6%'
    },
    dataZoom: [
      {
        throttle: 330,
        disabled: (dataZoom && !dataZoom.true) || false,
        type: 'inside',
        start: (dataZoom && dataZoom.dataZoomStart) || 0,
        end: 100,
        minSpan: 10,
        maxSpan: 100
      }
    ],
    xAxis: xAxis || cloneDeep(_xaxis.time),
    yAxis: yAxis,
    series: series
  }
  if (tooltip && tooltip === 'clickType') {
    option.tooltip = _tooltip.simpleType
    option.legend.data = option.legend.data.sort()
    delete option.legend.formatter
    delete option.legend.tooltip
    option.tooltip.formatter = () => {
      return ''
    }
  }
  const xechart = echartsGSet.call(this, id)
  xechart.setOption(option, true)
  this.$forceUpdate()
  this.$nextTick(() => {
    xechart.resize()
    item && item.tooltip && item.tooltip === 'clickType' && xechart.on('click', (params) => func(params))
    tooltip && tooltip === 'clickType' && xechart.on('click', (params) => func(params))
    xechart.hideLoading()
    // 检查图表中图例是否全为false，若是则判定无数据
    let show = false
    Object.keys(legend.selected).forEach((key) => {
      legend.selected[key] && (show = true)
    })
    if (!show) {
      xechart.clear()
      xechart.dispose()
      document.getElementById(id).innerHTML = `<div class="echart-area-item-text">无数据</div>`
    }
  })
}

export function dashboardEchartsInit(id, title, data) {
  const option = {
    title: {
      text: title,
      textStyle: _titleStyle
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        progress: {
          show: true,
          width: 18
        },
        min: 0,
        max: 100,
        splitNumber: 20,
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        pointer: {
          length: '55%',
          width: 5,
          itemStyle: {
            color: 'inherit'
          }
        },
        axisTick: {
          length: 2,
          distance: 1,
          lineStyle: {
            color: 'inherit',
            width: 0
          }
        },
        splitLine: {
          length: 5,
          distance: 4,
          lineStyle: {
            color: 'inherit',
            width: 0
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 16,
          distance: -30,
          formatter: function f(value) {
            if (value === 0) {
              return '优'
            } else if (value === 25) {
              return '中'
            } else if (value === 50) {
              return '良'
            } else if (value === 75) {
              return '差'
            }
          }
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            borderWidth: 8
          }
        },
        detail: {
          show: true,
          fontSize: 14,
          offsetCenter: ['5%', '70%'],
          valueAnimation: true,
          formatter: '{value}%',
          color: 'inherit'
        },
        title: {
          show: true,
          offsetCenter: ['5%', '40%'],
          fontSize: 14
        },
        data: [
          {
            value: data,
            name: '使用率'
          }
        ]
      }
    ]
  }
  const xechart = echartsGSet.call(this, id)
  xechart.setOption(option, true)
}

export function gaugeEchartsInit(id, title, data) {
  const option = {
    title: {
      text: title,
      textStyle: _titleStyle
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '90%',
        startAngle: 140,
        endAngle: -140,
        min: 0,
        max: 100,
        precision: 0,
        splitNumber: 10,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0.5, this.$c.Green0],
              [0.8, this.$c.Yellow5],
              [1, this.$c.Red1]
            ],
            width: 5
          }
        },
        axisTick: {
          show: true,
          splitNumber: 5,
          length: 8,
          lineStyle: {
            color: this.$c.Gray4,
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          formatter: function re(v) {
            switch (v + '') {
              case '30':
                return '低'
              case '60':
                return '中'
              case '90':
                return '高'
              default:
                return ''
            }
          },
          color: this.$c.Gray4
        },
        splitLine: {
          show: true,
          length: 10,
          lineStyle: {
            color: this.$c.Gray4,
            width: 2,
            type: 'solid'
          }
        },
        pointer: {
          length: '80%',
          width: 4,
          itemStyle: {
            color: 'auto'
          }
        },
        detail: {
          show: true,
          borderWidth: 0,
          width: 50,
          height: 20,
          offsetCenter: ['-60%', 10],
          formatter: '{value}%',
          color: 'inherit',
          fontSize: 15
        },
        data: [{ value: data, name: '' }]
      }
    ]
  }
  const xechart = echartsGSet.call(this, id)
  xechart.setOption(option, true)
}

function createTpsSeries(legendData, seriesData) {
  const series = []
  if (legendData.length) {
    legendData.forEach((item, index) => {
      const serie = {
        name: item,
        type: 'line',
        stace: '总量',
        symbol: 'none',
        data: seriesData[index].data
      }
      series.push(serie)
    })
  }
  return series
}
export function TPSLineInit(id, isShowTitle, datas, color) {
  const title = {
    show: isShowTitle,
    text: 'TPS变化情况',
    textStyle: _titleStyle
  }
  const xAxisData = []
  for (let i = 0; i < 1440; i++) {
    xAxisData.push(i)
  }
  const xAxis = cloneDeep(_xaxis.category)
  xAxis[0].interval = 119
  xAxis[0].axisLabel.formatter = (value) => {
    return (value / 60).toFixed(0)
  }
  xAxis[0].data = xAxisData
  const tooltip = cloneDeep(_tooltip.moreSeries)
  tooltip.formatter = (val) => {
    if (!val.length) return
    const time = val[0].axisValueLabel
    const timeMiu = time % 60 === 0 ? time / 60 + ':00' : parseInt(time / 60 + '') + ':' + (time - parseInt(time / 60 + '') * 60)
    const tArr = timeMiu.split(':')
    let h = tArr[0]
    let m = tArr[1]
    if (parseInt(h) > 0 && parseInt(h) < 10) {
      h = '0' + h
    }
    if (parseInt(m) > 0 && parseInt(m) < 10) {
      m = '0' + m
    }
    if (val.length === 3) {
      return (
        '时间：' +
        h +
        ':' +
        m +
        '<br/>' +
        val[0].marker +
        val[0].seriesName +
        '：' +
        val[0].value +
        '<br/>' +
        val[1].marker +
        val[1].seriesName +
        '：' +
        val[1].value +
        '<br/>' +
        val[2].marker +
        val[2].seriesName +
        '：' +
        val[2].value
      )
    } else if (val.length === 2) {
      return '时间：' + h + ':' + m + '<br/>' + val[0].seriesName + '：' + val[0].value + '<br/>' + val[1].seriesName + '：' + val[1].value
    } else if (val.length === 1) {
      return '时间：' + h + ':' + m + '<br/>' + val[0].seriesName + '：' + val[0].value
    }
  }
  const yAxis = [cloneDeep(_yaxis.value)]
  const legend = cloneDeep(_legend)
  legend.data = ['当日', '上日', '前日']
  legend.data.forEach((item) => {
    legend.selected[item] = true
  })
  if (color) {
    xAxis[0].axisLabel.color = color
    xAxis[0].axisLine.lineStyle.color = color
    yAxis[0].axisLabel.color = color
    yAxis[0].axisLine.lineStyle.color = color
    legend.textStyle.color = color
  }
  this.$nextTick(() => {
    categoryEchartsInit.call(this, id, title, tooltip, legend, null, null, xAxis, yAxis, createTpsSeries(legend.data, datas))
  })
}
export function scatterEchartsInit(id, data, title) {
  const option = {
    title: {
      text: title ?? '节点存储使用散点分布',
      textStyle: this.$_._titleStyle
    },
    grid: {
      // 左
      x: 50,
      // 上
      y: 65,
      // 右
      x2: 20,
      // 下
      y2: 30
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: {
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      }
    },
    legend: {
      show: false,
      data: ['节点']
    },
    xAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value}G'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '节点',
        type: 'scatter',
        tooltip: {
          trigger: 'item',
          formatter: function re(params) {
            if (params.value.length > 1) {
              return params.data.name + ':<br/>' + params.value[0] + 'G,' + params.value[1] + '%'
            }
          }
        },
        data: data,
        symbolSize: 8,
        itemStyle: {
          borderColor: this.$c.White,
          borderWidth: 1
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        }
      }
    ]
  }
  const xechart = this.$_.echartsGSet.call(this, id)
  xechart.setOption(option, true)
}

// #endregion echarts

// #region form item
/**
 * @desc: 表单项生成
 * @param {*} label 表单项名称
 * @param {*} type 表单项类型
 * @param {*} prop 表单项属性键
 * @param {*} disabled 表单项是否禁用
 * @param {*} props 表单项映射规则（Select）
 * @param {*} options 表单项下拉框数据（Select）
 * @return {*}
 */
export function formItem(label, type, prop, disabled, props, options) {
  const formItem = {
    label: label,
    type: type,
    prop: prop,
    disabled: disabled
  }
  switch (type) {
    case 'Select':
      if (Array.isArray(props)) {
        formItem.props = { label: props[0], value: props[1] }
      } else {
        throw new Error(label + '下拉框需要传入数组映射键值')
      }
      formItem.options = options || []
      break
    case 'Input':
      formItem.placeholder = '请输入内容'
      break
    default:
  }
  return formItem
}
/**
 * @desc: 表单项下拉框数据填充（简单类型）
 * @param {*} arr
 * @param {*} start
 * @return {*}
 */
export function simpleOptions(arr, start = 0) {
  if (Array.isArray(arr)) {
    const result = []
    arr.forEach((item, index) => {
      result.push({ label: item, value: index + start + '' })
    })
    return result
  } else {
    throw new Error('simpleOptions 仅接收数组')
  }
}
/**
 * @desc: 表单状态项
 * @param {*} prop 表单状态项属性键
 * @param {*} lable 表单状态项名称（'状态'略
 * @return {*}
 */
export function stateFormItem(prop, lable = '') {
  return { ...formItem(lable + '状态', 'Switch', prop, false), class: 'inline', notFull: true, right: true, inactive: '0', active: '1' }
}
/**
 * @desc: 必输（选）规则
 * @param {*} text 表单项名称
 * @param {*} type 类型
 * @return {*}
 */
export function setRequired(text, type = 1) {
  return { required: true, message: '请' + (type === 1 ? '输入' : '选择') + text, trigger: 'blur' }
}
/**
 * @desc: 表单项下拉框数据填充
 * @param {*} fform form表单定义键
 * @param {*} type 表单项类型
 * @param {*} prop 表单项属性键
 * @param {*} optionsRes optins数据
 * @return {*}
 */
export function formItemOptionsSet(fform, type, prop, optionsRes) {
  this[fform].forEach((item) => {
    item.type === type && item.prop === prop && (item.options = optionsRes)
  })
}
/**
 * @desc: 表单项下拉框数据填充-api
 * @param {*} fform form表单定义键
 * @param {*} type 表单项类型
 * @param {*} prop 表单项属性键
 * @param {*} gapi 接口名
 * @param {*} dataType 返回数据类型
 * @param {*} obj 接口参数
 * @return {*}
 */
export function apiFormItemOptionsSet(fform, type, prop, gapi, dataType = 1, obj = {}) {
  console.log(fform, type, prop, gapi, dataType, obj)
  api[gapi](obj).then(
    (res) => res.strState === '1' && formItemOptionsSet.call(this, fform, type, prop, dataType === 1 ? res.strResult : JSON.parse(res.strResult))
  )
}
/**
 * @desc: 关联下拉框联动change事件
 * @param {*} fform form表单定义键
 * @param {*} fdata form表单数据键
 * @param {*} fprop 源表单项关联接口请求体项名
 * @param {*} fvalue 源表单项属性值
 * @param {*} gapi 关联表单项接口名
 * @param {*} gprop 关联表单项属性键
 * @param {*} dataType 数据类型 1 JSON/2 String
 * @return {*}
 */
export function changeForOptions(fform, fdata, fprop, fvalue, gapi, gprop, dataType = 1) {
  console.log(fform, fprop, gapi)
  this[fdata][gprop] = ''
  formItemOptionsSet.call(this, fform, 'Select', gprop, [])
  fvalue &&
    api[gapi]({ [fprop]: fvalue }).then(
      (res) => res.strState === '1' && formItemOptionsSet.call(this, fform, 'Select', gprop, dataType === 1 ? res.strResult : JSON.parse(res.strResult))
    )
}
/**
 * @desc: 遍历行数据至表单数据
 * @param {*} row 行数据
 * @param {*} fdata 表单数据
 * @return {*}
 */
export function rowForData(row, fdata) {
  for (const key in row) {
    key in this[fdata] && (this[fdata][key] = row[key])
  }
}
// #endregion form item

// #region update
export function strUpdate(obj) {
  switch (obj.event) {
    case '1':
      return '新增'
    case '2':
      return '修改'
    case '3':
      return '删除'
    default:
  }
}
export const _confirmObj = { type: 'warning', confirmButtonText: '确定', cancelButtionText: '取消' }
// #endregion update
// #region pager
/**
 * 修改分页信息
 * @author: Zhj
 * @param {*} currentPage
 * @param {*} key
 * @param {*} strRef
 * @return {*}
 */
export function pageTurning(currentPage, key) {
  this.$_.getValue(key, this).pageObj.currentPage = currentPage
  this.$_.getValue(key, this).pageObj.curPageNotFirst = currentPage !== 1
}
/**
 * 分页展示记录数数切换
 * @author: Zhj
 * @param {*} size
 * @param {*} key
 * @param {*} strRef
 * @return {*}
 */
export function pageSizeChange(size, key) {
  this.$_.getValue(key, this).pageObj.size = size
}
export function optionValueFormat(op, vprop) {
  return isNil(op[vprop]) ? op : op[vprop]
}
export function optionLabelFormat(op, vprop) {
  let label = ''
  if (Array.isArray(plabel)) {
    label = plabel.reduce(a, (b) => op[a] + ' - ' + op[b])
  } else {
    label = op[plabel]
  }
  return label
}
// #endregion pager
export function filterArr(options, props, v) {
  return options.filter((op) => {
    const label = toString(optionLabelFormat(op, props?.label) || op)
    const value = toString(op[props?.value] || op)
    return label.toLowerCase().indexOf(toString(v).toLowerCase()) > -1 || value.toLowerCase().indexOf(toString(v).toLowerCase()) > -1
  })
}
export function comSetOptions(options, props, filterArr) {
  const comSetOptions = difference(options, filterArr)
  if (comSetOptions.length > 0) {
    if (Object.prototype.toString.call(comSetOptions[0]) !== '[object Object]') {
      comSetOptions[0] = { [props?.value || 'value']: comSetOptions[0] }
    }
    comSetOptions[0].class = 'split-line'
  }
  return comSetOptions
}
export function prometheusDataAnalyze(ritem, iapi) {
  return new Promise((resolve, reject) =>
    api[ritem.iitem.api || iapi](ritem.req)
      .then((res) => resolve(prometheusDataResolve(ritem.iitem, res)))
      .catch((err) => reject(err))
  )
}
export function prometheusDataResolve(iitem, res) {
  const resolveRes = []
  if (res.strState === '1' && res.strResult.length) {
    for (const resItem of res.strResult) {
      resolveRes.push({
        subserie: getSubSerieName(iitem, resItem),
        data: resItem.values,
        metric: resItem.metric
      })
    }
  }
}
