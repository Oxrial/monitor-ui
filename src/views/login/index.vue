<template>
  <div id="login">
    <el-row>
      <el-col :span="12" :offset="12">
        <form id="loginform" @keyup.enter.native="login()">
          <div id="login-title">统一监控平台</div>
          <span id="login-subtitle">MONITOR OPERATIONS PLATFORM</span>
          <div id="login-inputarea">
            <div>
              <el-input
                v-model="form.username"
                class="login-input"
                autocomplete="off"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                @change="(v) => (loginSubmit.username = v)"
              />
            </div>
            <div>
              <el-input
                v-model="form.password"
                class="login-input"
                autocomplete="off"
                prefix-icon="el-icon-pwd"
                type="password"
                placeholder="请输入密码"
                @change="(v) => (loginSubmit.password = encryptedByPrivateKey(v))"
              />
            </div>
            <div id="login-b">
              <el-input value="登 录" type="button" @click.native="login()" />
            </div>
          </div>
        </form>
      </el-col>
      <div class="login-info">
        <span>@2018-2021 © SUNLINE CORETECH CO.,LTD VER 0.0.1</span>
      </div>
    </el-row>
  </div>
</template>

<script>
import Storage from '@/utils/storage'
import Tree from '../link-man/compontents/Tree.vue'
import api from '@/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      isRememberMe: false,
      loginSubmit: {
        username: null,
        password: null
      }
    }
  },
  mounted() {},
  methods: {
    getStorageLoginForm() {
      this.isRememberMe = Storage.get('isRememberMe')
      if (!this.isRememberMe) return
      const loginForm = Storage.get('loginForm')
      if (!loginForm) return
      this.form.username = loginForm.username
      this.form.password = '-REMEMBER-'
      this.loginSubmit = loginForm
    },
    login() {
      // this.$router.push('/home/index')
      this.loginBtn = true
      this.$refs.form.validate(async (v) => {
        if (v) {
          try {
            this.loginBtn = false
            if (!this.loginSubmit.username || !this.loginSubmit.password) {
              this.form.username = ''
              this.form.password = ''
              this.loginSubmit = {
                username: null,
                password: null
              }
              this.$refs.form.validate()
              return
            }
            this.$store.dispatch('user/login', this.loginSubmit).then(() => {
              this.$store.dispatch('user/getInfo').then((res) => this.getUserInfo(res))
              if (this.isRememberMe) {
                Storage.set('loginForm', this.loginSubmit)
              } else {
                Storage.remove('loginForm')
              }
            })
            this.loginBtn = false
          } catch (error) {
            this.loginBtn = false
            console.log(error)
          }
        }
      })
    },
    getUserInfo(res) {
      const { strUserCode, strUserName, strLastModified } = res
      // 修改表单
      this.searchData.username = strUserName
      this.searchData.userCode = strUserCode
      if (strLastModified == null) {
        this.show = true
      } else {
        const lastModified = strLastModified.split(' ')[0]
        const today = this.$dayjs(this.$dayjs().format('YYYY-MM-DD'))
        const differDay = today.diff(lastModified, 'day')
        if (differDay > 60) {
          this.show = true
        } else this.triggerOpenCount()
      }
    },
    triggerOpenCount(){
          if (!window.name) {
            window.name = 'monitorRouters' + this.$store.state.openner.count
          }
          this.$router.replace({ path: this.$router.query?.redirect || '/' })
          Storage.set('open_count', this.$store.state.openner.count)
    },
    // 密码修改
    onConfirm() {
      this.$refs.searchData.search()
      this.$nextTick(() => {
        if (!this.validateVal) return
        const data = {
          ...this.searchData,
          oldpwd: encryptedByPrivateKey(this.searchData.oldpwd),
          newpwd: encryptedByPrivateKey(this.searchData.newpwd),
          confirmpwd: encryptedByPrivateKey(this.searchData.confirmpwd)
        }
        api.updatePWD(data).then(async () => {
          if (res.strState !== '1') return
          this.show = false
          this.$store.dispatch('user/clearStorage')
          this.$message({ type: 'SUCCESS', message: 'UPDATE PWD SUCCESS' })
        })
      })
    },
    rememberMeChange(){
      Storage.set('isRememberMe', this.isRememberMe)
    },
    showSSODialog(){
      location.href= 'url?xx&redirect_uri=url'
    },
    ssoLogin(code){
      this.$store.dispatch('user/ssoLogin',code).then(() => this.triggerOpenCount())
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
