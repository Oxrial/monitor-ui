<template>
  <!-- <div class="user-wrapper"> -->
    <div id="grade-chart" style="width: 100%;height:80px"></div>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'UserStateContent',
  // data() {
  //   return {}
  // },
  mounted() {
    this.shower()
  },
  methods: {
    shower() {
      const pathSymbols = {
        reindeer:
          `path://M187.9,164.2c-0.3-3.1-0.8-5.8-1.5-7.9c-1.2-3.6-3.2-6.4-6.1-8.5c-2.9-2.1-6.2-3.8-9.9-5.2
	c-3.7-1.4-7.6-2.6-11.5-3.7c-3.9-1.1-7.6-2.3-10.9-3.6c-3.7-1.5-6.6-3.1-8.7-5c-2.1-1.9-3.6-3.8-4.6-5.9c-1-2.1-1.6-4.1-1.7-6.2
	c-0.1-2.1,0-4.1,0.4-6.1c0.5-3.3,1.6-5.7,3.2-7.1s3.7-3.1,6.2-5.1c1.1-0.9,2-2.2,2.9-3.9s1.6-3.4,2.3-5.1c0.7-2,1.3-4.1,2-6.4
	c1.3-0.4,2.6-1.1,3.8-2.2c1.1-0.9,2-2.2,2.9-3.9s1.4-3.9,1.7-6.7c0.3-2.1,0.2-3.9-0.1-5.4s-0.8-2.7-1.3-3.6
	c-0.5-1.1-1.3-1.9-2.2-2.6c0-5.5-0.3-10.8-1-16.2c-0.7-4.7-1.8-9.5-3.4-14.7c-1.6-5.1-4.1-9.8-7.6-14.1c-1.5-1.9-3.5-3.7-6.1-5.6
	c-2.6-1.9-5.6-3.5-8.9-5c-3.3-1.5-6.9-2.6-10.7-3.5S109.6,0,105.8,0c-3.1,0-6.2,0.2-9.5,0.7c-3.3,0.5-6.5,1.4-9.8,2.7
	c-3.3,1.3-6.5,3.2-9.6,5.5s-6,5.4-8.5,9.1c-2.8,3.9-4.9,8.3-6.3,13.2c-1.4,4.9-2.4,9.5-2.9,13.8C58.6,50,58.3,55,58.5,60.1
	c-1.2,1.3-2.1,2.7-2.6,4.2c-0.5,1.3-0.9,2.9-1.1,4.8c-0.2,1.9,0.1,3.9,0.9,6.2c0.7,2.3,1.5,4,2.4,5.2c0.9,1.2,1.8,2.1,2.6,2.8
	c0.9,0.7,1.9,1.1,2.8,1.4c0.7,2.3,1.3,4.4,2,6.4c0.7,1.7,1.4,3.4,2.2,5.1s1.7,3,2.8,3.9c2.3,1.9,4.3,3.7,6.2,5.5
	c1.9,1.8,2.9,4.2,3.2,7.3c0.1,2.1,0.2,4.1,0.2,5.8c0,1.7-0.3,3.4-1,5s-1.7,3.2-3.2,4.8s-3.6,3.3-6.4,5c-3.6,2.3-7.7,4-12.4,5.2
	s-9.1,2.6-13.5,4.1s-8.1,3.6-11.4,6.2c-3.3,2.6-5.2,6.4-5.9,11.3c-1.3,8.6-1.6,15.7-0.9,21.2s1.8,8.7,3.1,9.8c0.8,0.7,2.7,1.3,5.8,2
	s6.8,1.3,11.2,2c4.4,0.7,9.3,1.3,14.7,1.9s10.8,1.1,16.3,1.6c5.5,0.5,10.7,0.8,15.9,1.1c5.1,0.3,9.6,0.4,13.5,0.4s8.4-0.1,13.7-0.4
	c5.3-0.3,10.7-0.6,16.5-1.1c5.7-0.5,11.4-1,17.1-1.7c5.7-0.7,10.8-1.4,15.4-2.3c4.6-0.9,8.4-1.8,11.6-2.7s5-1.9,5.7-2.8
	c0.9-1.5,1.6-3.6,2.1-6.4c0.5-2.8,0.7-5.8,0.7-9C188.4,170.5,188.3,167.3,187.9,164.2z`,
      }
      const labelSetting = {
        show: true,
        position: 'right',
        offset: [0, 0],
        fontSize: 12,
        formatter: function (params) {
          return '{label|' + params.seriesName+'}{number|' + params.value+'}';
        },
        //富文本模板 对应return中内容
			  rich: {
          label: {
            color: '#e3e3e3',
            align:'center'
          },
          number: {
            color: '#07fafe',
            fontSize: 13,
            align:'center'
          }
        }
      }
      const option = {
        // title: {
        //   text: '用户状态'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          containLabel: true,
          left: 10,
          // right:10
        },
        yAxis: {
          data: ['用户级别'],
          inverse: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            margin: 15,
            fontSize: 14,
            fontWeight:'bold',
            color:'#124cad'
          },
          nameTextStyle:{
            width:400
          }
        },
        xAxis: {
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false }
        },
        series: [
          {
            name: '系统负责人',
            type: 'pictorialBar',
            label: labelSetting,
            symbolRepeat: true,
            symbolSize: ['14', '16'],
            data: [
              {
                value: 157,
                symbol: pathSymbols.reindeer
              },
            ],
            itemStyle:{
              color:"#3cdcfa"
            }
          },
          {
            name: '处室领导',
            type: 'pictorialBar',
            label: labelSetting,
            symbolRepeat: true,
            symbolSize: ['14', '16'],
            data: [
              {
                value: 184,
                symbol: pathSymbols.reindeer
              }
            ],
            itemStyle:{
              color:"#b895ff"
            }
          },
          {
            name: '部门领导',
            type: 'pictorialBar',
            barGap: '20',
            label: labelSetting,
            symbolRepeat: true,
            symbolSize: ['14', '16'],
            // barCategoryGap: '2%',
            data: [
              {
                value: 284,
                symbol: pathSymbols.reindeer
              }
            ],
            itemStyle:{
              color:"#0099d7"
            }
          }
        ]
      }
      const xechart = this.$_.echartsGSet.call(this, 'grade-chart');
      xechart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
#grade-chart{
  width: 100%;
}
</style>
