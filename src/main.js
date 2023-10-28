import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/assets/styles/index.scss' // global css

import * as c from '@/assets/styles/common.scss'
import * as _ from '@/utils/common.js' // global js
import qs from 'qs'

import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.prototype.$_ = _
Vue.prototype.$c = c
Vue.prototype.$qs = qs

import App from './App'
import store from './store'
import router from './router'
import components from '@/components/index'

import '@/assets/icons/layout/' // icon
// import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.config.productionTip = false
import { Plugin } from 'vue-fragment'
Vue.use(Plugin)
// import VCalendar from 'v-calendar-oxr'
// console.log(VCalendar)
// Use v-calendar & v-date-picker components
// Vue.use(VCalendar)
import Contextmenu from 'vue-contextmenujs'
Vue.use(Contextmenu)
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
