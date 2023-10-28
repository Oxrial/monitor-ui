import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'
import { cloneDeep, constant, orderBy } from 'lodash-es'
import { formatterRouter } from '@/utils'

const getDefaultState = () => {
  return {
    token: getToken(),
    strUserName: '',
    strUserCode: (Storage.get('userInfo') && Storage.get('userInfo').strUserCode) || '',
    strUserType: (Storage.get('userInfo') && Storage.get('userInfo').strUserType) || '',
    routes: Storage.get('routes') || [],
    menuRoutes: Storage.get('menuRoutes') || [],
    isSSOLogin: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_STRUSERNAME: (state, strUserName) => {
    state.strUserName = strUserName
  },
  SET_STRUSERCODE: (state, strUserCode) => {
    state.strUserCode = strUserCode
  },
  SET_STRUSERTYPE: (state, strUserType) => {
    state.strUserType = strUserType
  },
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
    Storage.remove('routes')
    Storage.set('routes', state.routes)
  },
  SET_MENUROUTES: (state, menuRoutes) => {
    state.menuRoutes = constantRoutes.concat(menuRoutes)
    Storage.set('menuRoutes', state.menuRoutes)
  },
  SET_SSOLOGIN: (state, isSSOLogin) => {
    state.isSSOLogin = isSSOLogin
  }
}

const actions = {
  ssoLogin({ commit }, code) {
    commit('SET_SSOLOGIN', false)
    return new Promise((resolve, reject) => {
      SSOCallback({ code })
        .then((res) => {
          if (res.strState !== '1') return
          const { strResult } = res
          commit('SET_TOKEN', strResult.moseToken)
          commit('SET_SSOLOGIN', true)
          setToken(strResult.moseToken)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
  // user login
  login({ commit }, userInfo) {
    commit('SET_SSOLOGIN', false)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      GetCurUser()
        .then((response) => {
          if (res.strState !== '1') return
          const { strResult } = response
          Storage.set('userInfo', strResult)
          if (!strResult) return reject('Verification failed, please Login again.')
          const { strUserName, strUserCode, strUserType } = strResult

          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          commit('SET_STRUSERNAME', strUserName)
          commit('SET_STRUSERCODE', strUserCode)
          commit('SET_STRUSERTYPE', strUserType)
          resolve(strResult)

          // const { name, avatar } = data

          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)
          // resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          actions.clearStorage() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getAsyncRoutes({ commit, state }, strUserType) {
    return Promise(async (resolve) => {
      Promise.all([confGetMenuByUserType({ roleId: strUserType, menuType: 1 }), confGetMenuByUserType({ roleId: strUserType, menuType: 2 })]).then((res) => {
        try {
          if (!res[0].strResult) res[0].strResult = []
          if (!res[1].strResult) res[1].strResult = []
          const m1 = cloneDeep(res[0].strResult)
          const m2 = cloneDeep(res[1].strResult)
          m2.forEach((m) => [9, 48].includes(m.id) && (m.children = orderBy(m.children, (mm) => +mm.meta.item)))
          const routers = [...m1, ...m2]
          commit('SET_ROUTERS', routers)
          const monitorRoutes = formatterRouter(m1)
          const configRoutes = formatterRouter(m2)
          if (monitorRoutes[0].path !== '/') {
            monitorRoutes[0].path = '/'
            monitorRoutes[0].children[0].path = monitorRoutes[0].redirect
          }
          Storage.set('monitorRoutes', monitorRoutes)
          Storage.set('configRoutes', configRoutes)
          Storage.set('menuRoutes', monitorRoutes)
          commit('SET_MENUROUTES', monitorRoutes)
          resolve(routers)
        } catch (error) {
          console.log(error)
          actions.logout({ commit })
        }
      })
    })
  },
  clearStorage() {
    const needClearStorage = ['mose_token', 'ranKey', 'routes', 'monitorRoutes', 'configRoutes', 'menuRoutes']
    const isRememberMe = Storage.get('isRememberMe')
    if (!isRememberMe) needClearStorage.push('loginForm')
    needClearStorage.forEach((key) => Storage.remove(key))
  },
  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      actions.clearStorage() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  setMenuRoutes({ commit }, routes) {
    commit('SET_MENUROUTES', routes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
