// import Vue from 'vue'
import Vue from '@/main'
import router from '@/router'
import GLB_CONFIG from '@/assets/js/glb-constant.js'
import Main from '@/components/main/main.vue'
import { getTreeUser } from '@/assets/js/API/api'

const COMMONJS = {
  getWorkflowSsoLoginUrl (ssourl, isLogout = false) {
    let paramData = {
      logintype: 'sso',
      username: localStorage.getItem('loginName'),
      password: '123456',
      ssourl: ssourl,
      preaddr: window.location.protocol + '//' + window.location.host
    }
    return Comjs.fw.core.util.UrlUtils.addParams(!isLogout ? GLB_CONFIG.devUrl.workflowUrl + '/login' : GLB_CONFIG.workflowUrl + '/logout?isSsoLoginOut=1', paramData)
  },
  workflowLogOut () {
    //  let opener = window.open('https://www.cnblogs.com/coolsundy/p/4825292.html');
    //  opener.close();
  },
  routesList: [],
  getLoginOut () {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('id')
    localStorage.removeItem('typeCode')
    localStorage.removeItem('entName')
    localStorage.removeItem('loginName')
    localStorage.removeItem('type')
    localStorage.removeItem('userId')
    router.push({
      path: '/'
    })
  },
  isLeapYear (year) {
    let cond1 = year % 4 === 0 // 条件1：年份必须要能被4整除
    let cond2 = year % 100 !== 0 // 条件2：年份不能是整百数
    let cond3 = year % 400 === 0 // 条件3：年份是400的倍数
    // 当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
    // 如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
    // 所以得出判断闰年的表达式：
    let cond = (cond1 && cond2) || cond3
    if (cond) {
      return true
    } else {
      return false
    }
  },
  showToast (content, type = 'success', showClose = false) {
    Vue.$message({
      showClose: showClose,
      message: content,
      type: type
    })
  },
  getActiveIndex (routerName) {
    if (routerName === '/home') {
      return '/home'
    } else if (routerName === '/enterpriseList' || routerName === '/enterpriseEntry') {
      return '/enterpriseList'
    } else if (routerName === '/enterpriseVerifyList') {
      return '/enterpriseVerifyList'
    } else if (routerName === '/fastClassificationList') {
      return '/fastClassificationList'
    } else if (routerName === '/userManageHome') {
      return '/userManageHome'
    } else if (routerName === '/baseInfo') {
      return '/baseInfo'
    } else if (routerName === '/wasteReport') {
      return '/wasteReport'
    } else if (routerName === '/stockReport') {
      return '/stockReport'
    } else if (routerName === '/outgoingReport') {
      return '/outgoingReport'
    } else if (routerName === '/moveReport') {
      return '/moveReport'
    } else if (routerName === '/transferReport') {
      return '/transferReport'
    } else if (routerName === '/businessBaseInfo') {
      return '/businessBaseInfo'
    } else if (routerName === '/wasteInfo') {
      return '/wasteInfo'
    } else if (routerName === '/storagePoint') {
      return '/storagePoint'
    } else if (routerName === '/analysisParam') {
      return '/analysisParam'
    } else if (routerName === '/landfillsBasicInfo') {
      return '/landfillsBasicInfo'
    } else if (routerName === '/landfillOperatingAccount') {
      return '/landfillOperatingAccount'
    } else if (routerName === '/businessProjectManagement') {
      return '/businessProjectManagement'
    } else if (routerName === '/licenseInfo' || routerName === '/licenseInfoAdd') {
      return '/licenseInfo'
    } else if (routerName === '/customerInfoManagement' || routerName === '/customerInfoAdd') {
      return '/customerInfoManagement'
    } else if (routerName === '/myCustomer') {
      return '/myCustomer'
    } else if (routerName === '/menuManagement') {
      return '/menuManagement'
    } else if (routerName === '/userManageHome') {
      return '/userManageHome'
    } else if (routerName === '/organizationalManagement') {
      return '/organizationalManagement'
    } else if (routerName === '/roleManageListNew') {
      return '/roleManageListNew'
    } else if (routerName === '/sysChangePasswordConfigManage') {
      return '/sysChangePasswordConfigManage'
    } else if (routerName === '/dicMangeListNew') {
      return '/dicMangeListNew'
    } else if (routerName === '/disposalPlan' || routerName === '/addDisposalPlan') {
      return '/disposalPlan'
    } else if (routerName === '/pendingMaterialSolutions' || routerName === '/addPendingMaterialSolutions') {
      return '/pendingMaterialSolutions'
    } else {
      return routerName
    }
  },
  getUserName () {
    return localStorage.getItem('userName')
  },
  getEntName () {
    return localStorage.getItem('entName')
  },
  getHomePage () {
    // getListMenu()
    //   .then(res => {
    //     router.push({
    //       path: res.data.data[0].children.length > 0 ? res.data.data[0].children[0].menuUrl : res.data.data[0].menuUrl
    //     })
    //   })
    //   .catch(() => {
    //   })
    // let listMenu = {
    //   'code': 1,
    //   'data': [
    //     {
    //       'children': [
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:27.0',
    //           'enName': 'wasteReport',
    //           'enabled': null,
    //           'id': '7b423297647c4a72afbe3c7305358416',
    //           'label': '产废台账',
    //           'menuCode': 'wasteReport',
    //           'menuEnglishName': 'wasteReport',
    //           'menuName': '产废台账',
    //           'menuOrder': '2',
    //           'menuUrl': '/wasteReport',
    //           'pageId': '09611eb9d1804600a76e672a5e9b7a06',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': '41b3ac0c71ed49c787e39f628bc79973',
    //           'sortNum': '2',
    //           'updateTime': '2019-02-23 14:01:14.0'
    //         },
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:52.0',
    //           'enName': 'stockReport',
    //           'enabled': null,
    //           'id': 'd87da01f2dd24dbab04b0b6e6d62fce9',
    //           'label': '库存台账',
    //           'menuCode': 'stockReport',
    //           'menuEnglishName': 'stockReport',
    //           'menuName': '库存台账',
    //           'menuOrder': '1',
    //           'menuUrl': '/stockReport',
    //           'pageId': 'b0f09abb33104c39b4c970ccfbcf03d3',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': 'ba29baf7219247d6810cb8f2df48c412',
    //           'sortNum': '1',
    //           'updateTime': '2019-02-23 14:02:03.0'
    //         },
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:52.0',
    //           'enName': 'outgoingReport',
    //           'enabled': null,
    //           'id': 'd87da01f2dd24dbab04b0b6e6d62fce9',
    //           'label': '出入库台账',
    //           'menuCode': 'outgoingReport',
    //           'menuEnglishName': 'outgoingReport',
    //           'menuName': '出入库台账',
    //           'menuOrder': '1',
    //           'menuUrl': '/outgoingReport',
    //           'pageId': 'b0f09abb33104c39b4c970ccfbcf03d3',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': 'ba29baf7219247d6810cb8f2df48c412',
    //           'sortNum': '1',
    //           'updateTime': '2019-02-23 14:02:03.0'
    //         },
    //         // {
    //         //   'children': [],
    //         //   'createTime': '2019-02-23 14:00:52.0',
    //         //   'enName': 'moveReport',
    //         //   'enabled': null,
    //         //   'id': 'd87da01f2dd24dbab04b0b6e6d62fce9',
    //         //   'label': '移库台账',
    //         //   'menuCode': 'moveReport',
    //         //   'menuEnglishName': 'moveReport',
    //         //   'menuName': '移库台账',
    //         //   'menuOrder': '1',
    //         //   'menuUrl': '/moveReport',
    //         //   'pageId': 'b0f09abb33104c39b4c970ccfbcf03d3',
    //         //   'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //         //   'relationId': 'ba29baf7219247d6810cb8f2df48c412',
    //         //   'sortNum': '1',
    //         //   'updateTime': '2019-02-23 14:02:03.0'
    //         // },
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:52.0',
    //           'enName': 'transferReport',
    //           'enabled': null,
    //           'id': 'd87da01f2dd24dbab04b0b6e6d62fce9',
    //           'label': '转移台账',
    //           'menuCode': 'transferReport',
    //           'menuEnglishName': 'transferReport',
    //           'menuName': '转移台账',
    //           'menuOrder': '1',
    //           'menuUrl': '/transferReport',
    //           'pageId': 'b0f09abb33104c39b4c970ccfbcf03d3',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': 'ba29baf7219247d6810cb8f2df48c412',
    //           'sortNum': '1',
    //           'updateTime': '2019-02-23 14:02:03.0'
    //         },
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:52.0',
    //           'enName': 'parkOverview',
    //           'enabled': null,
    //           'id': 'd87da01f2dd24dbab04b0b6e6d62fce9',
    //           'label': '园区一览',
    //           'menuCode': 'parkOverview',
    //           'menuEnglishName': 'parkOverview',
    //           'menuName': '园区一览',
    //           'menuOrder': '1',
    //           'menuUrl': '/parkOverview',
    //           'pageId': 'b0f09abb33104c39b4c970ccfbcf03d3',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': 'ba29baf7219247d6810cb8f2df48c412',
    //           'sortNum': '1',
    //           'updateTime': '2019-02-23 14:02:03.0'
    //         }
    //       ],
    //       'createTime': '2019-02-23 13:58:23.0',
    //       'enName': 'reportManagement',
    //       'enabled': null,
    //       'id': '5f0df705ab7b49aab60de63c04d93ca0',
    //       'label': '台账管理',
    //       'menuCode': 'reportManagement',
    //       'menuEnglishName': 'reportManagement',
    //       'menuName': '台账管理',
    //       'menuOrder': '9',
    //       'menuUrl': null,
    //       'pageId': null,
    //       'parentId': null,
    //       'relationId': '82ab2ccb3aa04cc5ad1f833d7ed138e4',
    //       'sortNum': '9',
    //       'updateTime': '2019-02-28 17:42:44.0'
    //     },
    //     {
    //       'children': [],
    //       'createTime': '2019-02-23 13:58:23.0',
    //       'enName': 'parkOverview',
    //       'enabled': null,
    //       'id': '5f0df705ab7b49aab60de63c04d93ca0',
    //       'label': '园区一览',
    //       'menuCode': 'parkOverview',
    //       'menuEnglishName': 'parkOverview',
    //       'menuName': '园区一览',
    //       'menuOrder': '9',
    //       'menuUrl': null,
    //       'pageId': null,
    //       'parentId': null,
    //       'relationId': '82ab2ccb3aa04cc5ad1f833d7ed138e4',
    //       'sortNum': '9',
    //       'updateTime': '2019-02-28 17:42:44.0'
    //     },
    //     {
    //       'children': [
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:27.0',
    //           'enName': 'businessBaseInfo',
    //           'enabled': null,
    //           'id': '7b423297647c4a72afbe3c7305358416',
    //           'label': '企业基本信息',
    //           'menuCode': 'businessBaseInfo',
    //           'menuEnglishName': 'businessBaseInfo',
    //           'menuName': '企业基本信息',
    //           'menuOrder': '2',
    //           'menuUrl': '/businessBaseInfo',
    //           'pageId': '09611eb9d1804600a76e672a5e9b7a06',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': '41b3ac0c71ed49c787e39f628bc79973',
    //           'sortNum': '2',
    //           'updateTime': '2019-02-23 14:01:14.0'
    //         }
    //       ],
    //       'createTime': '2019-02-23 13:58:23.0',
    //       'enName': 'businessInfo',
    //       'enabled': null,
    //       'id': '5f0df705ab7b49aab60de63c04d93ca0',
    //       'label': '企业信息',
    //       'menuCode': 'businessInfo',
    //       'menuEnglishName': 'businessInfo',
    //       'menuName': '企业信息',
    //       'menuOrder': '9',
    //       'menuUrl': null,
    //       'pageId': null,
    //       'parentId': null,
    //       'relationId': '82ab2ccb3aa04cc5ad1f833d7ed138e4',
    //       'sortNum': '9',
    //       'updateTime': '2019-02-28 17:42:44.0'
    //     },
    //     {
    //       'children': [
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:27.0',
    //           'enName': 'wasteInfo',
    //           'enabled': null,
    //           'id': '7b423297647c4a72afbe3c7305358416',
    //           'label': '危废信息',
    //           'menuCode': 'wasteInfo',
    //           'menuEnglishName': 'wasteInfo',
    //           'menuName': '危废信息',
    //           'menuOrder': '2',
    //           'menuUrl': '/wasteInfo',
    //           'pageId': '09611eb9d1804600a76e672a5e9b7a06',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': '41b3ac0c71ed49c787e39f628bc79973',
    //           'sortNum': '2',
    //           'updateTime': '2019-02-23 14:01:14.0'
    //         },
    //         {
    //           'children': [],
    //           'createTime': '2019-02-23 14:00:27.0',
    //           'enName': 'storagePoint',
    //           'enabled': null,
    //           'id': '7b423297647c4a72afbe3c7305358416',
    //           'label': '贮存点',
    //           'menuCode': 'storagePoint',
    //           'menuEnglishName': 'storagePoint',
    //           'menuName': '贮存点',
    //           'menuOrder': '2',
    //           'menuUrl': '/storagePoint',
    //           'pageId': '09611eb9d1804600a76e672a5e9b7a06',
    //           'parentId': '5f0df705ab7b49aab60de63c04d93ca0',
    //           'relationId': '41b3ac0c71ed49c787e39f628bc79973',
    //           'sortNum': '2',
    //           'updateTime': '2019-02-23 14:01:14.0'
    //         }
    //       ],
    //       'createTime': '2019-02-23 13:58:23.0',
    //       'enName': 'baseDataManagement',
    //       'enabled': null,
    //       'id': '5f0df705ab7b49aab60de63c04d93ca0',
    //       'label': '基础数据管理',
    //       'menuCode': 'baseDataManagement',
    //       'menuEnglishName': 'baseDataManagement',
    //       'menuName': '基础数据管理',
    //       'menuOrder': '9',
    //       'menuUrl': null,
    //       'pageId': null,
    //       'parentId': null,
    //       'relationId': '82ab2ccb3aa04cc5ad1f833d7ed138e4',
    //       'sortNum': '9',
    //       'updateTime': '2019-02-28 17:42:44.0'
    //     }
    //   ],
    //   'infoList': [],
    //   'msg': null,
    //   'status': 'Success',
    //   'success': false
    // }
    // let typeCode = localStorage.getItem('typeCode')
    // let url
    //
    // if (process.env.NODE_ENV === 'development') {
    //   if (typeCode === '000010') {
    //     url = window.location.protocol + '//' + window.location.host + '/jsonData/wasteEnterprise.json'
    //   } else {
    //     url = window.location.protocol + '//' + window.location.host + '/jsonData/disposalEnterprise.json'
    //   }
    // } else if (process.env.NODE_ENV === 'production') {
    //   if (typeCode === '000010') {
    //     url = window.location.protocol + '//' + window.location.host + process.env.BASE_URL + 'jsonData/wasteEnterprise.json'
    //   } else {
    //     url = window.location.protocol + '//' + window.location.host + process.env.BASE_URL + 'jsonData/disposalEnterprise.json'
    //   }
    // }
    // axios.get(url).then((res) => {
    //   router.push({
    //     // path: res.data.data[0].children.length > 0 ? res.data.data[0].children[0].menuUrl : res.data.data[0].menuUrl
    //     path: 'home'
    //   })
    //   // Vue.$router.push({
    //   //   path: 'home'
    //   // })
    //   // console.log(Vue.$store)
    //   // Vue.$store.commit('set_active_index', this.$route.path)
    // })
    let sourceType = localStorage.getItem('sourceType')
    // let refreshHome = localStorage.getItem('refreshHome')
    let postData = {
      sourceType: sourceType
    }
    // getTreeUser(postData)
    getTreeUser()
      .then(res => {
        let menuList = res.data
        router.push({
          path: '/workbench'
        })
        // if ((sourceType === 'back')) {
        // //   Vue.$store.commit('delete_tabs', Vue.$route.path)
        //   router.push({
        //     path: COMMONJS.getFirstPage(menuList)
        //   })
        // //   localStorage.setItem('refreshHome', 'false')
        // } else if ((sourceType === 'web')) {
        // //   if (Vue.$route.path === '/' || Vue.$route.path === '/home') {
        // //     return
        // //   }
        // //   Vue.$store.commit('delete_tabs', Vue.$route.path)
        //   router.push({
        //     path: '/home'
        //   })
        // //   localStorage.setItem('refreshHome', 'false')
        // }
      }).catch(() => {
      })
  },
  getFirstPage (menuList) {
    let _this = this
    for (var i = 0; i < menuList.length; i++) {
      if (menuList[i].children && menuList[i].children.length) {
        return _this.getFirstPage(menuList[i].children)
      } else {
        if (menuList[i].url) {
          return menuList[i].url
        }
      }
    }
  },
  getInitMenuRoutes (data, routeList) {
    let _this = this
    let dynamicRouter = {}
    for (var i = 0; i < data.length; i++) {
      if (data[i].children && data[i].children.length) {
        _this.getInitMenuRoutes(data[i].children, routeList)
      } else {
        if (data[i].url) {
          if ((data[i].url.indexOf('/web/') === 0) || (data[i].url.indexOf('/http') === 0)) {
            dynamicRouter = {
              meta: {
                requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
                keepAlive: true
              },
              component: () => import('@/views/commonErp/commonErpPage.vue')// (resolve) => require(['@/views/testErp/compatibilityRecordList.vue'], resolve)
            }
            dynamicRouter.path = data[i].url
            dynamicRouter.name = data[i].name
            routeList.push(dynamicRouter)
          }
        }
      }
    }
    return routeList
  },
  initMenu (menu) {
    this.routesList = JSON.parse(JSON.stringify(menu))
    if (menu.length === 0) {
      return
    }
    let routeList = this.getInitMenuRoutes(menu, [])
    const menus = this.formatRoutes(routeList)
    const unfound = {
      path: '*',
      redirect: '/404'
    }
    menus.push(unfound)
    router.addRoutes(menus)
    // store.commit('ADD_ROUTERS', menus)
  },
  formatRoutes (menu) {
    return [{
      path: '/commonErp',
      name: 'commonErp',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: menu
    }]
  },
  tabRemove (targetName) {
    // 首页不删
    if (targetName === '/' || targetName === '/home') {
      return
    }
    Vue.$store.commit('delete_tabs', targetName)
  }
}
export default COMMONJS
