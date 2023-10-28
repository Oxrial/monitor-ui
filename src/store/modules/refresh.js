/*
 * @Descripttion: 控制全局自动刷新
 * @Author: Lrl
 * @Date: 2021-11-30 08:58:18
 * @LastEditors: Lrl
 * @LastEditTime: 2021-11-30 14:29:07
 */
import Cookies from 'js-cookie'

export default {
  namespaced: true,
  state: () => ({
    refresh: {
      open: Cookies.get('openRefresh') !== 'false',
      time: Cookies.get('refreshTime') ?? 1,
      unit: Cookies.get('refreshTimeUnit') ?? 'min'
    }
  }),
  mutations: {
    toggle_refresh(state) {
      state.refresh.open = !!state.refresh.open
      Cookies.set('openRefresh', state.refresh.open)
    },
    set_refreshTime(state, { refreshTime, refreshTimeUnit }) {
      switch (refreshTimeUnit) {
        case 'second':
          state.refresh.time = refreshTime * 1000
          break
        case 'min':
          state.refresh.time = refreshTime * 60 * 1000
          break
        case 'hour':
          state.refresh.time = refreshTime * 60 * 60 * 1000
      }
      state.refresh.time = refreshTime
      state.refresh.unit = refreshTimeUnit
      console.log(state.refresh.time, state.refresh.unit)
      Cookies.set('refreshTime', state.refresh.time)
      Cookies.set('refreshTimeUnit', state.refresh.unit)
    }
  },
  actions: {
    toggleRefresh({ commit }) {
      commit('toggle_refresh')
    },
    setRefreshTime({ commit }, refresh) {
      commit('set_refreshTime', refresh)
    }
  }
}
