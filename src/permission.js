import router, { resetRouter } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Storage from '@/utils/storage'
import {formatterRouter} from '@/utils/index'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const staticRouter = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const whiteList = ['/login'] // no redirect whitelist
function needResetLogin() {
  if (Storage.get('userInfo')) {
    const { strLastModified } = Storage.get('userInfo')
    if (strLastModified == null) {
      Storage.remove('mose_token')
    } else {
      const lastModified = strLastModified.split(' ')[0]
      const today = dayjs(dayjs().format('YYYY-MM-DD'))
      const differDay = today.diff(lastModified, 'day')
      differDay > 60 && Storage.remove('mose_token')
    }
  }
}
router.beforeEach(async (to, from, next) => {
  // start progress bar
  const isSSOLogin = store.getters.isSSOLogin
  !isSSOLogin && needResetLogin()
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRole = store.getters.strUserType
      if (hasRole) {
        if (to.matched.length === 0) {
          const routes = Storage.get('route')
          if (routes.length) {
            resetRouter()
            const accessRoutes = [...formatterRouter(routes), ...staticRouter]
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } else {
            const accessRoutes = await store.dispatch('user/getAsyncRoutes', hasRole).then((res) => formatterRouter(res))
            resetRouter()
            router.addRoutes([...accessRoutes, ...staticRouter])
            next({ ...to, replace: true })
          }
        } else {
          if (!window.name) {
            store.dispatch('openner/setOpenCount')
            window.name = (to.meta.menuType === 1 ? 'monitorRoutes' : 'configRoutes') + store.state.openner.count
          } else {
            if (to.meta.menuType === 1 && !window.name.includes('monitorRoutes')) {
              store.dispatch('openner/setOpenCount')
              window.name = (to.meta.menuType === 1 ? 'monitorRoutes' : 'configRoutes') + store.state.openner.count
            }
          }
          next()
        }
      } else {
        try {
          const { strUserType } = await store.dispatch('user/getUserType')
          const accessRoutes = await store.dispatch('user/getAsyncRoutes', strUserType)
          resetRouter()
          router.addRoutes([...accessRoutes, { path: '*', redirect: '/404', hidden: true }])
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // get user info
      //     await store.dispatch('user/getInfo')

      //     next()
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* has no token*/
    let after = window.location.search
    after = after.substring(1) || window.location.hash.split('?')[1]
    after && after.indexOf('redirect') < 0 && (window.name = '')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
