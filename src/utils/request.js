import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const urlList = ['/server/login', '/server/logout']
const service = axios.create({
  // baseURL: 'http://10.36.28.146:8089',
  // baseURL: 'http://webServe.com:3000',
  baseURL: 'http://121.36.62.243:8084',
  // baseURL: 'http://10.36.28.146:8084',
  timeout: Infinity // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (config.method === 'get') {
    //   //  给data赋值以绕过if判断
    //   config.data = true 
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded '
    // }
  
    // return config
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.headers['content-disposition']) {
      return response
    }
    if (res.code !== 20000) {
      if (
        res.code === 0 ||
        res.code === undefined ||
        res.code === '000000' ||
        res.code === '200' ||
        res.code === 10000 || 
        res.code === '100000' || 
        res.code === -1
      ) {
        return res
      }
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm(
      //     'You have been logged out, you can cancel to stay on this page, or log in again',
      //     'Confirm logout',
      //     {
      //       confirmButtonText: 'Re-Login',
      //       cancelButtonText: 'Cancel',
      //       type: 'warning'
      //     }
      //   ).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response) {
      Message({
        showClose: true,
        message: error.response.data.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
