const Storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    try {
      const value = localStorage.getItem(key)
      if (value === null || value === undefined || value === '') {
        return null
      }
      return JSON.parse(value)
    } catch (error) {
      console.log(error)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  removeAll() {
    localStorage.clear()
  }
}
export default Storage
