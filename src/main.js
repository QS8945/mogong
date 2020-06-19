import Vue from 'vue'
import ElementUI from 'element-ui'
import echarts from 'echarts'
// 打印
import Print from 'vue-print-nb'
// 注册

import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import './element-variables.scss'
import './assets/css/common.css'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './assets/js/i18n/index'
// import Http from './assets/js/API/API'
import COMMONJS from './assets/js/common.js'
import GLB_CONSTANT from './assets/js/glb-constant.js'
import { getTreeUser } from '@/assets/js/API/api'
import { numberInput } from '@/assets/js/directives/numberInput'
require('./mock.js')

Vue.config.productionTip = false

Vue.use(Print)
Vue.use(ElementUI)
Vue.use(echarts)
Vue.directive('number-input', numberInput)

// Vue.prototype.$API = Http
Vue.prototype.$echarts = echarts
window.router = router
// window.router = router
router.beforeEach((to, from, next) => {
  // to即将进入的目标路由对象，from当前导航正要离开的路由， next : 下一步执行的函数钩子
  if (to.path === '/login') {
    // if (localStorage.getItem('token')) {
    //   COMMONJS.getHomePage()
    // } else {
    next()
    // }
  } else { // 进入的不是登录路由 // 如果即将进入登录路由，则直接放行
    // if (sessionStorage.getItem('menuList')) {
    //   router.addRoutes(JSON.parse(sessionStorage.getItem('menuList')))
    // } else {
    if (COMMONJS.routesList && (COMMONJS.routesList.length === 0)) {
      let postData = {
        sourceType: localStorage.getItem('sourceType')
      }
      getTreeUser(postData)
        .then(res => {
          COMMONJS.initMenu(res.data)
        })
    }
    // }
    if (GLB_CONSTANT.LOGIN_VALIDATE) {
      if (to.meta.requireAuth && !localStorage.getItem('token')) {
        COMMONJS.showToast('请重新登录', 'error')
        COMMONJS.getLoginOut()
        // next({ path: '/login' })
      } else { // 下一跳路由需要登录验证，并且还未登录，则路由定向到 登录路由
        next()
      }
    } else {
      next()
    }
  }
  // 如果不需要登录验证，或者已经登录成功，则直接放行
})

let vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
export default vue
