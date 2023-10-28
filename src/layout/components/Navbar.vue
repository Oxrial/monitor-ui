<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/icons/en/user-logo.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/home/index">
            <el-dropdown-item> Dashboard </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <BaseDialog :show.sync="dialog.show" :title="dialog.title" :confirm="onConfirm">
      <el-input-number v-model="refreshTime" />
      <el-select v-model="refreshUnit" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </BaseDialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialog: {
        title: '自定义更新时间',
        show: false
      },
      refreshTime: 1,
      refreshUnit: '分钟',
      options: [
        {
          label: '秒',
          value: 'second'
        },
        {
          label: '分钟',
          value: 'min'
        },
        {
          label: '小时',
          value: 'hour'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    ...mapState({
      refresh: (state) => state.refresh.refresh
    }),
    refreshTimeView() {
      let unit = '分钟'
      switch (this.refresh.unit) {
        case 'second':
          unit = '秒'
          break
        case 'min':
          unit = '分钟'
          break
        case 'hour':
          unit = '小时'
          break
      }
      return this.refresh.time + unit
    }
  },
  methods: {
    onConfirm() {
      this.$store.dispatch('refresh/setRefreshTime', { refreshTime: this.refreshTime, refreshTimeUnit: this.refreshUnit })
      this.dialog.show = false
    },
    handleCommand(command) {
      if (command !== 'custom') {
        this.$store.dispatch('refresh/setRefreshTime', { refreshTime: command, refreshTimeUnit: 'min' })
      } else {
        this.dialog.show = true
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    toggleRefresh() {
      this.$store.dispatch('refresh/toggleRefresh')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-dropdown {
  top: 46px !important;
}

.navbar {
  height: 57px;
  overflow: hidden;
  position: relative;
  background-image: url(~@/assets/icons/en/22.png);
  
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
