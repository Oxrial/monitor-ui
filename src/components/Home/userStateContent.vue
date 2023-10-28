<template>
  <!-- <div id="state-chart" style="width: 100%; height: 60px;"></div> -->
  <div class="sysWrapper">
    <TheTitle title="用户信息" />
    <div class="stategrade">
      <div class="state">
        <!-- <div class=""> -->
        <span class="state-label">正常状态用户(人)</span>
        <span class="state-num">2233</span>
        <el-divider direction="vertical"></el-divider>
        <span class="state-label">失效状态用户(人)</span>
        <span class="state-num">44</span>
      </div>
      <div class="grade">
        <div class="lineF">
            <div class="boxF">
                <div class="boxS">
                    <div class="boxT">
                        <div class="overlay">
                            <span class="dept-title">系统负责人</span>
                            <span class="dept-num">4292353463（人）</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="boxF">
                <div class="boxS">
                    <div class="boxT">
                        <div class="overlay">
                            <span class="dept-title">处室领导</span>
                            <span class="dept-num">56（人）</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="boxF">
                <div class="boxS">
                    <div class="boxT">
                        <div class="overlay">
                            <span class="dept-title">部门领导</span>
                            <span class="dept-num">32875（人）</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const TheTitle = {
  props: ['title'],
  template: `
    <div class="main-header">
      <h4>{{title}}</h4>
    </div>
  `
}
export default {
  name: 'UserStateContent',
  components: { TheTitle },
  mounted() {
    this.shower()
  },
  methods: {
    shower() {}
  }
}
</script>
<style lang="scss" scoped>
.sysWrapper {
  height: 100%;
}
.stategrade {
  color: #fff;
  height: 100%;
  .state {
    height: 50%;
    text-align: center;
    padding: 10px;
    height: 120px;
    .state-label {
      font-size: 16px;
      color: #457cb0;
      margin-right: 10px;
      vertical-align: sub;
    }
    .state-num {
      font-size: 34px;
      background-image: -webkit-linear-gradient(bottom, #2b3843, #0084ff, #b3edff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bolder;
    }
    .el-divider--vertical {
      height: 6em;
      margin: 0 20px;
      background: #041b50;
    }
  }
  .grade {
    height: 50%;
    .box
        {
            position: relative;
            width: 630px;
            margin: 100px auto;
        }
        .lineF, .lineS
        {
            position: absolute;
            visibility: hidden;
        }
        .lineS
        {
            top: 182px;
            left: 105px;
        }
        .boxF, .boxS, .boxT, .overlay
        {
            width: 120px;
            height: 150px;
            overflow: hidden;
        }
        .boxF, .boxS
        {
            visibility: hidden;
        }
        .boxF
        {
            transform: rotate(120deg);
            float: left;
            margin: 15px;
            -ms-transform: rotate(120deg);
            -moz-transform: rotate(120deg);
            -webkit-transform: rotate(120deg);
        }
        .boxS
        {
            transform: rotate(-60deg);
            -ms-transform: rotate(-60deg);
            -moz-transform: rotate(-60deg);
            -webkit-transform: rotate(-60deg);
        }
        .boxT
        {
            transform: rotate(-60deg);
            background: #133c9c;
            background-size: 125% auto;
            -ms-transform: rotate(-60deg);
            -moz-transform: rotate(-60deg);
            -webkit-transform: rotate(-60deg);
            visibility: visible;
            background-image: -webkit-linear-gradient(bottom,#043868,#034581,#0789fb);
        }
        .overlay{
          position: relative;
          text-align: center;
          .dept-title{
            position:absolute;
            top: 40%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -50%);
          }
          .dept-num{
            position:absolute;
            top: 60%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -50%);
          }
        }
  }
}
</style>
