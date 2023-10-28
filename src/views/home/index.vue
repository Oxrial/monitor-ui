<template>
  <div class="contentWrapper">
    <div class="header-wrapper">
      <HandleContent></HandleContent>
    </div>
    <div class="top-wrapper">
      <div class="syshost">
        <div class="sys">
          <SystemContent></SystemContent>
        </div>
        <div class="host">
          <HostContent></HostContent>
        </div>
      </div>
      <div class="moniter">
        <div class="moniter-item moniter-sys">
          <MoniterSysContent></MoniterSysContent>
        </div>
        <div class="moniter-item moniter-contract">
          <MoniterContractContent></MoniterContractContent>
        </div>
        <div class="moniter-item moniter-contract">
          <MoniterThresholdContent></MoniterThresholdContent>
        </div>
        <div class="moniter-item moniter-contract">
          <MoniterDetailContent></MoniterDetailContent>
        </div>
      </div>
    </div>
    <div class="user">
      <div class="user-content tableWrapper">
        <UserStateContent></UserStateContent>
      </div>
      <div class="roledept">
        <div class="role">
          <RoleContent></RoleContent>
        </div>
        <div class="dept-wrapper">
          <DeptContent></DeptContent>
        </div>
      </div>
    </div>
    <div class="collect">
      <div class="sche-wrapper">
        <SchedulingschemeContent></SchedulingschemeContent>
      </div>
      <div class="collect-content">
        <div class="collect-wrapper">
          <CollectionContent></CollectionContent>
        </div>
        <div class="collect-sys">
          <CollectionContent></CollectionContent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemContent from '@/components/Home/systemContent'
import HostContent from '@/components/Home/hostContent'
import HandleContent from '@/components/Home/handleContent'
import UserStateContent from '@/components/Home/userStateContent'
import UserGradeContent from '@/components/Home/userGradeContent'
import RoleContent from '@/components/Home/roleContent'
import DeptContent from '@/components/Home/deptContent'
import MoniterSysContent from '@/components/Home/moniterSysContent'
import MoniterContractContent from '@/components/Home/moniterContractContent'
import MoniterThresholdContent from '@/components/Home/moniterThresholdContent'
import MoniterDetailContent from '@/components/Home/moniterDetailContent'
import SchedulingschemeContent from '@/components/Home/schedulingschemeContent'
import CollectionContent from '@/components/Home/collectionContent'

export default {
  name: 'Home',
  components: {
    SystemContent,
    HostContent,
    HandleContent,
    UserStateContent,
    // eslint-disable-next-line vue/no-unused-components
    UserGradeContent,
    RoleContent,
    DeptContent,
    MoniterSysContent,
    MoniterContractContent,
    MoniterThresholdContent,
    MoniterDetailContent,
    SchedulingschemeContent,
    CollectionContent
  },
  mounted() {
    // window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
  },
  methods: {
    // // 滚动页面时触发导航变色
    // handleScroll () {
    //     let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    //     // 设置背景颜色的透明度
    //     if (scrollTop) {
    //         this.topNavBg.backgroundColor = `rgba(19, 23, 130,
    //     	${scrollTop / (scrollTop + 60)})` // scrollTop + 多少根据自己的需求设置
    //   	} else if (scrollTop === 0) {
    //     	this.topNavBg.backgroundColor = 'transparent' // 设置回到顶部时，背景颜色为透明
    //   	}
    // },
    // // 滚动之前重置
    // beforeDestroy () {
    // 	window.removeEventListener('scroll', this.handleScroll)
    // },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  color: #e3e3e3;
  background-color: #091639;
}

::v-deep .el-table tr {
  background: inherit;
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: inherit;
}
::v-deep .el-table tr:hover {
  background: inherit;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: inherit;
}
::v-deep .el-table__body tr.current-row > td.el-table__cell {
  background-color: #0d77ed;
}
::v-deep .el-table th.el-table__cell {
  background: inherit;
  color: #fff;
}
::v-deep .el-table--enable-row-transition .el-table__body td.el-table__cell {
  border-bottom: none;
}
::v-deep ::-webkit-scrollbar {
  background-color: #001a3c;
}
::v-deep .el-table::before {
  height: 0;
}
::v-deep h4 {
  color: #11b3e7;
  font-weight: bold;
  font-family: sans-serif;
}
.contentWrapper {
  margin-bottom: 10px;
}
.header-wrapper {
  position: fixed;
  height: 80px;
  top: 57px;
  // left: 54px;
  width: 100%;
  margin-left: -10px;
  background: #091639;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
}
.top-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-content: space-between;
  margin-top: 90px;
  .syshost {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-content: space-between;
  }
  .moniter {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .moniter-item {
      width: 49%;
      &:nth-child(even) {
        margin-right: 10px;
      }
    }
  }
}
.user {
  display: flex;
  align-content: space-between;
  flex-wrap: nowrap;
  .user-content {
    width: 500px;
  }
  .roledept {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .role {
      width: 49%;
      // margin-right: 10px;
    }
    .dept-wrapper {
      width: 49%;
    }
  }
}
.collect {
  display: flex;
  align-content: space-between;
  flex-wrap: nowrap;
  .sche-wrapper {
    width: 500px;
  }
  .collect-content {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .collect-wrapper {
      width: 49%;
    }
    .collect-sys {
      width: 49%;
    }
  }
}
.tableWrapper {
  background-color: initial;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  background-image: url('~@/assets/icons/home/tableBorder.png');
  padding: 20px;
}
</style>
