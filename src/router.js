import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main/main.vue'
import FullScreenPage from '@/components/fullScreenPage.vue'
import Login from '@/components/login/login.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // 登录
    {
      path: '/',
      redirect: '/login',
      component: Main,
      meta: {
        keepAlive: false
      },
      children: [
        { path: '/login', name: 'login', component: Login }
      ]
    },
    // 忘记密码
    {
      path: '/forgetPwd',
      component: Main,
      meta: {
        keepAlive: false
      },
      children: [
        { path: '/forgetPwd', name: '忘记密码', component: () => import('./views/forgetPwd/forgetPwd.vue') }
      ]
    },
    {
      path: '/baseInfo',
      component: Main,
      meta: {
        keepAlive: false
      },
      children: [
        { path: '/baseInfo', name: '基础信息', component: () => import('./views/userManage/baseInfo.vue') }
      ]
    },
    // 修改密码
    {
      path: '/changePassword',
      component: Main,
      meta: {
        keepAlive: false
      },
      children: [
        {
          path: '/changePassword',
          name: '修改密码',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/formDialog/changePassword.vue')
        }
      ]
    },
    // 找不到页面
    {
      path: '/404',
      name: '404',
      component: () => import(/* webpackChunkName: "about" */ './views/errorPages/404.vue')
    },
    // home
    {
      path: '/home',
      name: '主页',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/home',
          name: '工作台',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/home/home.vue')
        },
        {
          path: '/dealTask',
          name: '任务处理',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/home/components/dealTask.vue')
        }
      ]
    },
    // 台账管理
    {
      path: '/reportManagement',
      name: '台账管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/wasteReport',
          name: '产废台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/reportManagement/wasteReport.vue')
        },
        {
          path: '/stockReport',
          name: '库存台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/reportManagement/stockReport.vue')
        },
        {
          path: '/transferReport',
          name: '转移台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/reportManagement/transferReport.vue')
        },
        {
          path: '/outgoingReport',
          name: '出入库台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/reportManagement/outgoingReport.vue')
        },
        {
          path: '/moveReport',
          name: 'moveReport',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/reportManagement/moveReport.vue')
        }
      ]
    },
    // 大屏展示
    {
      path: '/parkOverview',
      name: 'parkOverview',
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      component: () => import('./views/mapScreen/parkOverview.vue')
    },
    // 南平大屏展示
    {
      path: '/wasteSupervise',
      name: 'wasteSupervise',
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      component: () => import('./views/mapScreen/wasteSupervise.vue')
    },
    // 南平直播展示
    {
      path: '/videoTest',
      name: 'videoTest',
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      component: () => import('./views/mapScreen/videoTest.vue')
    },
    // 生产管理
    {
      path: '/productionPlan',
      name: '生产管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [{
        path: '/productionPlan',
        name: '生产计划',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () => import('./views/compatibility/productionPlan.vue')
      },
      {
        path: '/compatibilityTemplate',
        name: '配伍模板管理',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () => import('./views/compatibility/compatibilityTemplate.vue')
      },
      {
        path: '/compatibilityPlan',
        name: '配伍',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () =>
          import('./views/compatibility/compatibilityPlan.vue')
      },
      {
        path: '/addCompatibility',
        name: '创建配伍单',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () =>
          import('./views/compatibility/addCompatibility.vue')
      },
      {
        path: '/storagePick',
        name: '领料出库',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () =>
          import('./views/compatibility/storagePick.vue')
      },
      {
        path: '/signCompatibility',
        name: '配伍审核',
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () => import('./views/compatibility/auditCompatibility.vue')
      }
      ]
    },
    // 合同管理
    {
      path: '/saorderhead',
      name: '合同管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/saorderhead',
          name: '经营合同',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/saorderhead.vue')
        },
        {
          path: '/transportContract',
          name: 'transportContract',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/transportContract.vue')
        },
        {
          path: '/secondaryContract',
          name: 'secondaryContract',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/secondaryContract.vue')
        },
        {
          path: '/intentContract',
          name: 'intentContract',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/intentContract.vue')
        }
      ]
    },
    // 物化
    {
      path: '/materialization',
      name: '物化',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/pendingMaterialSolutions',
          name: '领料处置方案',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/pendingMaterialSolutions.vue')
        },
        {
          path: '/addMaterialSolutions',
          name: '创建领料单',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/components/addMaterialSolutions.vue')
        },
        {
          path: '/disposalPlan',
          name: '处置方案',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/disposalPlan.vue')
        },
        {
          path: '/addDisposalPlan',
          name: '创建处置方案',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/components/addDisposalPlan.vue')
        },
        {
          path: '/outWarehouse',
          name: '仓库出库',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/outWarehouse.vue')
        },
        {
          path: '/addPendingMaterialSolutions',
          name: '领料单',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/components/addPendingMaterialSolutions.vue')
        },
        {
          path: '/materializationReport',
          name: '物化台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/materializationReport.vue')
        }
      ]
    },
    // 工作流
    {
      path: '/workflow',
      name: '工作流',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/demo',
          name: 'demo',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/leaveInfo.vue')
        },
        {
          path: '/todo',
          name: '待办任务',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/todo.vue')
        },
        {
          path: '/historic',
          name: '已办任务',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/historic.vue')
        },
        {
          path: '/hasSent',
          name: '已发任务',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/hasSent.vue')
        },
        {
          path: '/process',
          name: '流程管理',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/process.vue')
        },
        {
          path: '/sysWorkflow',
          name: 'sysWorkflow',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/workflow/sysWorkflow.vue')
        }
      ]
    },
    // 客户信息管理
    {
      path: '/customerManagement',
      name: '客户信息',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/customerInfoManagement',
          name: '客户信息管理',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/customerManagement/customerInfoManagement.vue')
        },
        {
          path: '/customerInfoAdd',
          name: '客户信息新增',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/customerManagement/customerInfoAdd.vue')
        },
        {
          path: '/enterpriseInfoAdd',
          name: '企业信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/salesFunnel/enterpriseInfoAdd.vue')
        },
        {
          path: '/businessActivityAdd',
          name: '商务活动',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/salesFunnel/businessActivityAdd.vue')
        },
        {
          path: '/cusContractList',
          name: 'cusContractList',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/salesFunnel/cusContractList.vue')
        },
        {
          path: '/salesFunnel',
          name: '我的客户',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/salesFunnel/salesFunnelList.vue')
        }
      ]
    },
    // 基础数据管理
    {
      path: '/baseDataManagement',
      name: '基础数据管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/businessBaseInfo',
          name: '企业信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/businessBaseInfo.vue')
        },
        {
          path: '/wasteInfo',
          name: '危废信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/wasteInfo.vue')
        },
        {
          path: '/storagePoint',
          name: '贮存点',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/storagePoint.vue')
        },
        {
          path: '/licenseInfo',
          name: '许可证信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/licenseInfo.vue')
        },
        {
          path: '/licenseInfoAdd',
          name: '新增许可证',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/licenseInfoAdd.vue')
        },
        {
          path: '/businessProjectManagement',
          name: '经营项目管理',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/baseDataManagement/businessProjectManagement.vue')
        },
        {
          path: '/authManagement',
          name: 'authManagement',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/systemManagement/authManagement.vue')
        }
      ]
    },
    // 填埋管理
    {
      path: '/landfillManagement',
      name: '填埋管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/landfillsBasicInfo',
          name: '填埋场基础信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement/landfillsBasicInfo.vue')
        },
        {
          path: '/landfillOperatingAccount',
          name: '填埋场经营台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement/landfillOperatingAccount.vue')
        }
      ]
    },
    // 填埋管理2.0
    {
      path: '/landfillManagement2.0',
      name: '填埋管理2.0',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/landfillsBasicInfo2.0',
          name: '填埋场基础信息',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement2.0/landfillsBasicInfo.vue')
        },
        {
          path: '/landfillOperatingAccount2.0',
          name: '填埋场经营台账',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement2.0/landfillOperatingAccount.vue')
        }
      ]
    },
    // 实验室管理
    {
      path: '/labManagement',
      name: 'labManagement',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/analysisParam',
          name: 'analysisParam',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/labManagement/analysisParam.vue')
        },
        {
          path: '/analysisTemplate',
          name: 'analysisTemplate',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/labManagement/analysisTemplate.vue')
        }
      ]
    },
    {// 安环
      path: '/annulus',
      name: '安环',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/enterpriseSafeRingSystem',
          name: '企业安环制度',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/annulus/enterpriseSafeRingSystem.vue')
        },
        {
          path: '/trainRecordsList',
          name: '培训记录',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/annulus/trainRecordsList.vue')
        },
        {
          path: '/routineInspection',
          name: '日常巡检',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/annulus/routineInspection.vue')
        }
      ]
    },
    {// 采购管理
      path: '/purchaseManagement',
      name: '采购管理',
      component: Main,
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      children: [
        {
          path: '/purchaseAuxiliaryList',
          name: '原辅料',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/purchaseAuxiliaryList.vue')
        },
        {
          path: '/purchaseProviderList',
          name: '供应商管理',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/purchaseProviderList.vue')
        },
        {
          path: '/purchaseBillApplyList',
          name: '采购申请',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/purchaseBillApplyList.vue')
        },
        {
          path: '/addPurchaseBillApplyInfo',
          name: '采购申请',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/dialog/addPurchaseBillApplyInfo.vue')
        },
        {
          path: '/purchaseStorageList',
          name: '采购及入库',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/purchaseStorageList.vue')
        },
        {
          path: '/purchaseDepositList',
          name: '原辅料出库',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/purchaseManagement/purchaseDepositList.vue')
        }
      ]
    },
    // 全屏展示路由
    {
      path: '/fullScreenPage',
      name: 'fullScreenPage',
      meta: {
        requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
        keepAlive: true
      },
      component: FullScreenPage,
      children: [
        {
          path: '/fullproductionPlan',
          name: '生产计划',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/compatibility/productionPlan.vue')
        },
        {
          path: '/fullScreenPage/wasteSupervise',
          name: 'fullWasteSupervise',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/mapScreen/wasteSupervise.vue')
        },
        {
          path: '/viewAuditInfo',
          name: '合同审核',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/viewAuditInfo.vue')
        },
        {
          path: '/auditCompatibility',
          name: '配伍审核',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/compatibility/auditCompatibility.vue')
        },
        {
          path: '/auditAddCompatibility',
          name: '创建配伍单',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/compatibility/addCompatibility.vue')
        },
        {
          path: '/auditCompatibilityPlan',
          name: '配伍',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () =>
            import('./views/compatibility/compatibilityPlan.vue')
        },
        {
          path: '/viewCusDetailInfo',
          name: 'viewCusDetailInfo',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/customerManagement/customerInfoAdd.vue')
        },
        {
          path: '/printPickList',
          name: '打印领料单',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/compatibility/components/printPickList.vue')
        },
        {
          path: '/printCommonList',
          name: '打印领料单',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/materialization/components/printCommonList.vue')
        },
        {
          path: '/reModifyContract',
          name: 'reModifyContract',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/contract/components/addNewSign.vue')
        },
        {
          path: '/reModifyCompatibility',
          name: 'reModifyCompatibility',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/compatibility/components/addProductionPlan.vue')
        },
        {
          path: '/fullScreenPage/landfillsBasicInfo',
          name: 'fullLandfillsBasicInfo',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement/landfillsBasicInfo.vue')
        },
        {
          path: '/fullScreenPage/landfillOperatingAccount',
          name: 'fullLandfillsBasicInfo',
          meta: {
            requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
            keepAlive: true
          },
          component: () => import('./views/landfillManagement/landfillOperatingAccount.vue')
        }
      ]
    },
    {
      path: '/sysMange',
      name: '系统管理',
      component: Main,
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      children: [
        { name: '密码管理', path: '/sysChangePasswordConfigManage', component: () => import('@/views/backstageManagement/sysManagement/sysChangePassWordConfigMangeList.vue') },
        { name: 'changePassword', path: '/changePassword', component: () => import('@/views/backstageManagement/sysManagement/dialog/changePasswordOfHeadPage.vue') },
        { name: '菜单管理', path: '/menuManagement', component: () => import('@/views/backstageManagement/sysManagement/menuManagement.vue') },
        { name: '机构管理', path: '/organizationalManagement', component: () => import('@/views/backstageManagement/organizationalManagement/organizationalManagementHome.vue') },
        { name: '角色管理', path: '/roleManageListNew', component: () => import('@/views/backstageManagement/organizationalManagement/roleManageList.vue') },
        { name: '用户管理', path: '/userManageHome', component: () => import('@/views/backstageManagement/userManage/userManageHome.vue') },
        { name: '字典管理', path: '/dicMangeListNew', component: () => import('@/views/backstageManagement/sysManagement/dicMangeList.vue') },
        { name: 'app-update-management', path: '/appUpdateManagement', component: () => import('@/views/backstageManagement/appUpdateManagement/appUpdateManagement.vue') }
      ]
    }
    // 测试erp2.0
    // {
    //   path: '/testErp',
    //   name: 'testErp',
    //   component: Main,
    //   meta: {
    //     requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
    //     keepAlive: true
    //   },
    //   children: [
    //     {
    //       path: '/compatibilityRecordList',
    //       name: '配伍明细',
    //       meta: {
    //         requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
    //         keepAlive: true
    //       },
    //       component: () => import('./views/testErp/compatibilityRecordList.vue')
    //     }
    //   ]
    // },
    // {
    //   path: '*',
    //   redirect: '/404'
    // }
  ]
})
