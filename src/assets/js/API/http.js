import Vue from '@/main'
import axios from 'axios'
// import QS from 'qs' // 引入qs模块，用来序列化post类型的数据
// import md5 from '@/assets/js/md5.js' // md5加密
// import { Decrypt, Encrypt } from '@/assets/js/crypto.js' //AES加密
// import JsEncrypt from '@/assets/js/jsencrypt.js' // RSA加密
import COMMONJS from '@/assets/js/common'
import GLB_CONFIG from '../glb-constant'
import { refreshToken } from '@/assets/js/API/api'
// import { showFullScreenLoading, tryHideFullScreenLoading } from '../loading'

axios.defaults.timeout = 10000

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

// if (process.env.NODE_ENV === 'development') {
axios.defaults.baseURL = '/' // 模拟api
// axios.defaults.baseURL = GLB_CONFIG.devUrl.serviceSiteRootUrl // 本地
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = GLB_CONFIG.serviceSiteProductionUrl // 生产
// }

axios.interceptors.request.use(
  config => {
    // showFullScreenLoading()
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    if (config.params) {
      // for (let val in config.params) {
      // config.params[val] = JsEncrypt.encrypt(val)
      // }
    }
    if (config.data) {
      // for (let val in config.data) {
      // config.data[val] = JsEncrypt.encrypt(val)
      // }
    }
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    }
    if ((config.url.indexOf('https://open.ys7.com') === -1) && (config.url.indexOf(GLB_CONFIG.devUrl.serviceErpRootUrl) === -1)) {
      Vue.$route.query.token && localStorage.setItem('token', Vue.$route.query.token)
      const token = localStorage.getItem('token')
      token && (config.headers.token = token)
    }
    // let token = localStorage.getItem('ticket')
    // if (token) {
    //   config.params.token = token
    // }
    return config
  }, error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    // if (response.data.data !== 'pass') {
    //   if (localStorage.getItem('refreshToken')) {
    //     refreshToken({ ticket: localStorage.getItem('token') })
    //       .then(res => {
    //       // if (res.data === 'pass') {
    //       //   return
    //       // }
    //       }).catch(() => {
    //       })
    //   }
    // }
    if (response.status === 200) {
      if (response.data != null) {
        if (response.data.status || (response.data.status === 0)) {
          if ((response.data.status === 1) || (response.data.status.toString().toUpperCase() === 'SUCCESS')) {
            // tryHideFullScreenLoading()
            return Promise.resolve(response)
          } else {
            // if (response.data.status === -1) {
            //   response.data.msg = response.data.infoList[0]
            //   if (response.data.msg === '用户登录超时.') {
            //     setTimeout(function () {
            //       COMMONJS.getLoginOut()
            //     }, 1000)
            //   }
            // }
            let msg = response.data.msg
            // switch (response.data.code) {
            switch (response.data.status) {
              case 2:
                msg = response.data.msg || '频繁操作'
                break
              case 0:
                msg = response.data.msg || '失败'
                break
              case -1:
                msg = response.data.msg || 'token失效，请重新登录'
                window.parent.postMessage({
                  login: true
                }, GLB_CONFIG.devUrl.parentIframeAddress)
                setTimeout(function () {
                  COMMONJS.getLoginOut()
                }, 1000)
                break
              case -2:
                msg = response.data.msg || '没有权限'
                break
              case -3:
                msg = response.data.msg || '出错'
                break
              case -4:
                msg = response.data.msg || '业务验证错误'
                break
              case -5:
                msg = response.data.msg || '密码过期'
                break
            }
            COMMONJS.showToast(msg, 'error')
            if (msg === 'token失效，请重新登录') {
              window.parent.postMessage({
                login: true
              }, GLB_CONFIG.devUrl.parentIframeAddress)
              setTimeout(function () {
                COMMONJS.getLoginOut()
              }, 1000)
            }
            // tryHideFullScreenLoading()
            return Promise.reject(response)
          }
        } else {
          if (response.data.code === '200') {
            // tryHideFullScreenLoading()
            return Promise.resolve(response)
          } else {
            let msg = response.data.msg || '系统错误'
            COMMONJS.showToast(msg, 'error')
            // tryHideFullScreenLoading()
          }
        }
      }
      // tryHideFullScreenLoading()
      return Promise.resolve(response)
    }
  },
  error => {
    if (error.response) {
      if (error.response.status) {
        let msg
        switch (error.response.status) {
          case 401:
            msg = '未登录'
            // toLogin()
            break
          case 403:
            msg = '登陆过期，请重新登录'
            // localStorage.removeItem('token')
            // store.commit('loginSuccess', null)
            // setTimeout(() => {
            //   toLogin()
            // }, 1000)
            break
          case 404:
            msg = '请求资源不存在'
            break
          case 500:
            msg = '服务端错误'
            break
          default:
            msg = error.response.data.msg
        }
        COMMONJS.showToast(msg, 'error')
        // tryHideFullScreenLoading()
        return Promise.reject(error.response)
      }
    } else {
      let msg = error.message || '系统错误'
      COMMONJS.showToast(msg, 'error')
      // tryHideFullScreenLoading()
      // return Promise.reject(error.response)
    }
  }
)

export function httpGet ({ url, params = {} }) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'get',
      // transformRequest: [function (data) {
      //   let ret = ''
      //   for (let it in data) {
      //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //   }
      //   return ret
      // }],
      // url参数
      params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function httpPost ({ url, data, params }) {
  // url += '?token=' + localStorage.getItem('ticket')
  // return new Promise((resolve, reject) => {
  // if (url.indexOf('http') === -1) {
  // url = GLOBAL_CONFIG.serviceSiteRootUrl + url
  // }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method: 'post',
      // transformRequest: [function (data) {
      //   let ret = ''
      //   for (let it in data) {
      //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //   }
      //   return ret
      // }],
      // 发送的数据
      data,
      // url参数
      params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
