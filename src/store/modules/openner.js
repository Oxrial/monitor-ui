import Storage from '@/utils/storage'
export default {
  namespaced: true,
  state: () => ({ count: Storage.get('open_count') || 0 }),
  mutations: {
    set_openner(state) {
      state.count++
      Storage.set('open_count', state.count)
    }
  },
  actions: {
    setOpenCount({ commit }) {
      commit('set_openner')
    }
  }
}
