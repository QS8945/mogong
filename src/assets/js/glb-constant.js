let GLB_CONFIG = {
  // serviceSiteRootUrl: 'https://www.easy-mock.com/', // 服务器
  // serviceSiteRootUrl: 'http://192.168.253.45:8082', // zhiyu内网服务器
  // serviceErpRootUrl: 'http://192.168.253.45:8089', // zhiyu内网服务器
  // serviceErpRootUrl: 'http://192.168.253.224:8089', // erp2.0后端
  devUrl: {
    // serviceSiteRootUrl: 'http://192.168.253.210:8088', // xiaohui服务器
    serviceSiteRootUrl: 'http://192.168.253.45:8088', // zhiyu内网服务器
    // serviceSiteRootUrl: 'http://27.223.94.162:9930/api', // 外网服务器
    // serviceSiteRootUrl: 'http://58.210.204.106:7111/api/', // 测试服务器
    // serviceSiteRootUrl: 'http://192.168.253.224:8080', // hongjie服务器
    // serviceErpRootUrl: window.location.protocol + '//' + window.location.host + '/SWM', // erp2.0后端
    // serviceErpRootUrl: 'http://192.168.253.210:8090', // xiaohui erp2.0后端
    serviceErpRootUrl: 'https://teacher.moonknightsoft.com/teacher/web', // zhiyuerp2.0后端
    // serviceErpRootUrl: 'http://192.168.253.224:8089', // hongjie erp2.0后端
    // serviceErpRootUrl: 'http://58.210.204.106:7111/SWM', // 测试服务器erp2.0后端
    // serviceErpRootUrl: 'http://192.168.253.210:8090', // erp2.0后端
    fileServer: 'https://www.moonknightsoft.com', // ngx外网file
  },
  prodUrl: {
    serviceSiteRootUrl: window.location.protocol + '//' + window.location.host + '/api', // zhangren发布生产服务器
    serviceErpRootUrl: window.location.protocol + '//' + window.location.host + '/SWM', // erp2.0后端
    fileServer: window.location.protocol + '//' + window.location.host + '/file/', // zhangren网file
    parentIframeAddress: window.location.protocol + '//' + window.location.host + '/page', // parent iframe
    childIframeAddress: window.location.protocol + '//' + window.location.host + '/page', // parent iframe
    managementUrl: window.location.protocol + '//' + window.location.host + '/env-manage#/blankPage', // 管理后台
    workflowUrl: 'http://58.210.204.106:7111/jsite/a' // 工作流地址 production
  },
  // serviceErpRootUrl: window.location.protocol + '//' + window.location.host + '/SWM', // erp2.0后端
  // serviceSiteRootUrl: 'http://192.168.253.200:8080', // godv内网服务器
  // serviceSiteRootUrl: 'http://192.168.253.210:8088', // xiaohui服务器d
  // serviceSiteRootUrl: 'http://192.168.253.204:8080', // xiaohui服务器
  // serviceSiteRootUrl: 'http://192.168.253.224:8080', // hongjie服务器
  // serviceSiteRootUrl: 'http://47.111.67.87:7771/production', // 47服务器
  // serviceSiteRootUrl: 'http://192.168.242.50:8080/api/', // zhaoke服务器
  // serviceSiteRootUrl: window.location.protocol + '//' + window.location.host, // zhangren发布生产服务器
  // fileServer: window.location.protocol + '//' + window.location.host + '/file/', // zhangren网file
  // serviceSiteRootUrl: window.location.protocol + '//' + window.location.hostname + ':9999', // ngx服务器
  // fileServer: window.location.protocol + '//' + window.location.hostname + ':9999' + '/file/', // ngx外网file
  // serviceSiteProductionUrl: window.location.protocol + '//' + window.location.host + '/api', // zhangren发布生产服务器
  // productionFileServer: window.location.protocol + '//' + window.location.host + '/file/', // zhangren网file
  // parentIframeAddress: 'http://localhost:63342', // parent iframe
  // parentIframeAddress: window.location.protocol + '//' + window.location.host + '/page', // parent iframe
  // childIframeAddress: 'http://localhost:9999/SWMWeb', // child iframe
  // childIframeAddress: window.location.protocol + '//' + window.location.hostname + ':9999' + '/SWMWeb', // parent iframe
  // childIframeAddress: window.location.protocol + '//' + window.location.host + '/page', // parent iframe
  // managementUrl: window.location.protocol + '//' + window.location.hostname + ':8081/erp-manage#/blankPage', // 管理后台
  // managementUrl: window.location.protocol + '//' + window.location.host + '/env-manage#/blankPage', // 管理后台
  // managementUrl: window.location.protocol + '//' + window.location.host + '/env-manage#/userManageHome', // 管理后台
  // serviceSiteProductionUrl: 'http://192.168.253.224:8080', // hongjie发布生产服务器
  // serviceSiteProductionUrl: window.location.protocol + '//' + '47.111.67.87:7771/production', // 47生产服务器测试环境
  // serviceSiteRootUrl: 'http://192.168.242.50:8080/shencai-envcloud-web/', // zhaoke服务器
  // serviceSiteRootUrl: 'http://192.168.242.51:8081/api', // zhangren服务器
  // serviceSiteRootUrl: 'http://192.168.253.204:8088', // Godv服务器
  // serviceSiteRootUrl: 'http://192.168.253.200:8080', // dongliang服务器
  // serviceSiteProductionUrl: 'http://192.168.242.51:8081', // 生产服务器
  // serviceSiteProductionUrl: 'http://192.168.242.51:8081/api', // 生产服务器
  // serviceSiteProductionUrl: 'http://192.168.242.50:8080', // zhaoke生产服务器
  // serviceSiteProductionUrl: 'http://192.168.253.45:8080', // zhiyu生产服务器
  // serviceSiteProductionUrl: 'http://192.168.253.210:8080', // xiaohui生产服务器
  // serviceSiteProductionUrl: 'http://192.168.253.200:8080', // dongliang生产服务器
  // fileServer: 'http://116.62.19.73:7771/file/', // 内网file
  // fileServer: 'http://192.168.253.45:8088/', // zhiyu生产服务器
  // fileServer: 'http://116.62.58.171:8080/',
  // fileServer: 'http://192.168.242.51:7111/', //  zhangren文件服务器
  page: {
    current: 1,
    size: 10,
    sizes: [10, 50, 100],
    prevText: '上一页',
    nextText: '下一页',
    layout: 'total, sizes, prev, pager, next, jumper',
    pagerCount: 5
  },
  // workflowUrl: 'http://localhost:8082/jsite/a', // 工作流地址
  // workflowUrl: 'http://192.168.242.51:8099/jsite/a', // 工作流地址 production
  // identifyCodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  identifyCodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  TIME_COUNT: 60, // 更改倒计时
  LOGIN_VALIDATE: false
}
if (process.env.NODE_ENV === 'production') {
  GLB_CONFIG.devUrl = GLB_CONFIG.prodUrl
}
// GLB_CONFIG.serviceSiteRootUrl = 'http://116.62.19.73:8080/eil/' // 内网服务器

export default GLB_CONFIG
