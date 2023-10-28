import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { url } from 'inspector'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
let singleFlag = false
const resetToken = async () => {
  await store.dispatch('user/resetToken')
  singleFlag = false
  location.reload
}

// 过期不提示接口
const whiteExpireList = ['/conf/getMenuByUserType', '/monitor/logout']
// axios.defaults.timeout = 60000;
// axios.defaults.withCredentials = false;
// axios.defaults.crossDomain = false;
const singleMsg = (url) => {
  if (singleFlag) return
  if (whiteExpireList.includes(url)) {
    resetToken()
  } else {
    MessageBox.alert('登录过期 请重登', '提示', {
      callback: () => resetToken()
    })
  }
  singleFlag = true
}
const whiteList = ['/login', '/sso/callback', '/sendCheckCode', '/verifyCheckCode']
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    config.loading && store.dispatch('setLoading', true)
    if (!whiteList.includes(config.url)) {
      if (getToken()) {
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
    }
    // if (store.getters.token) {

    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken();
    // }
    // if(config.data.indexOf('reqJson')>-1){
    //   config.baseURL = "";
    // }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const check = (res) => {
  if (res.strState === '0') {
    Message({ message: res.strMsg || 'No Data', type: 'info', duration: 5 * 1000 })
  } else if (res.strState !== '1') {
    Message({ message: res.strMsg || 'ERROR', type: 'error', duration: 5 * 1000 })
  }
}
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    response.config.loading && store.dispatch('setLoading', false)
    if (res instanceof Blob) {
      if (response.headers['content-type'] === 'application/json') {
        const reader = new FileReader()
        reader.readAsText(res, 'utf-8')
        reader.onload = function () {
          check(JSON.parse(reader.result))
        }
      }
    } else {
      check(res)
    }
    return res
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      singleMsg(error.config.url)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    error.loading && store.dispatch('setLoading', false)
    console.log('err' + error) // for debug

    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export const post = (url, data = {}, loading) => {
  return service({ method: 'post', url, data: qs.stringify(data), loading })
}
export const blobPost = (url, data = {}, obj = {}, loading) => {
  return service({ method: 'post', url, data: qs.stringify(data), ...obj, loading })
}
export const blobGet = (url, params = {}, obj = {}, loading) => {
  return service({ method: 'get', url, params, ...obj, loading })
}
export const jsonBlobPost = (url, data = {}, obj = {}, loading) => {
  return service({ method: 'post', url, data, ...obj, loading })
}

export const jsonPost = (url, data = {}, loading = false) => {
  return service({ method: 'post', url, data, loading })
}
export const getPost = (url, data = {}, loading = false) => {
  return service({ method: 'get', url, data, loading })
}
// formData
export const formDataPost = (url, data = {}, loading = false) => {
  return service({ method: 'post', url, data, loading, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}
export const deletePost = (url, data = {}, loading = false) => {
  return service({ method: 'delete', url, data, loading })
}
export const methods = (method, url, data = {}, loading = false, obj) => {
  return service({ method, url, data, loading, ...obj })
}
export const methodsFile = (method, url, data = {}, loading = false, obj) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => formData.append(key, data[key]))
  return service({ method, url, data: formData, loading, ...obj })
}
export function xxx(data = {}) {
  return methodsFile('post', '/api/xxx', data, true, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function xxx(data = {}) {
  return blobGet(
    '/api/xxx',
    data,
    {
      resonseType: 'blob'
    },
    true
  )
}
export default service
