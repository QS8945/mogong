import GLB_CONFIG from '../glb-constant'
import { httpGet, httpPost } from './http'

// export const getLogin = (data = {}, params = {}) => httpPost({ url: 'login/doLogin.do', data, params })
// export const getLogin = (params = {}) => httpGet({ url: 'sysRoleLoginUser/login', params })
//主页弹窗
export const getDialogData = (data = {}, params = {}) => httpPost({ url: '', data, params })
export const getLogin = (data = {}, params = {}) => httpPost({ url: 'web/login/userLogin', data, params })
export const changePassword = (data = {}, params = {}) => httpPost({ url: '/web/login/changePassword', data, params })
export const getPageStorageAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/pageStorageAccount', data, params })
export const getPageProduceWasteAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/pageProduceWasteAccount', data, params })
export const getPageOutgoingAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/pageOutgoingAccount', data, params })
export const getPageTransferAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/pageTransferAccount', data, params })
// 导出产废台账
export const getExportProduceWasteAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/exportProduceWasteAccount', data, params })
// 导出转移台账
export const getExportTransferAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/exportTransferAccount', data, params })
// 导出出入库台账
export const getExportOutgoingAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/exportOutgoingAccount', data, params })
// 导出库存台账
export const getExportStorageAccount = (data = {}, params = {}) => httpPost({ url: 'web/production/account/exportStorageAccount', data, params })
// 仓库
export const getListStorageInfo = (data = {}, params = {}) => httpPost({ url: 'web/production/storage/listStorageInfo', data, params })

// 获取地图点位
export const getListEntWeighbridgeInfo = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listEntWeighbridgeInfo', params })
// 获取产废单位数据
export const getTotalProdEntInfoStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/totalProdEntInfoStatistics', params })
// 获取产废单位数据
// export const getListNewestWeighRecord = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listNewestWeighRecord', params })
// 获取产废单位数据
export const getProdProduceWasteStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/prodProduceWasteStatistics', params })
// 获取产废单位数据
export const getProdStorageStatisticsEchart = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getProdStorageStatisticsEchart', params })
// 获取产废单位数据
export const getProdInventoryWasteStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/prodInventoryWasteStatistics', params })
// 获取经营单位数据
export const totalDispEntInfoStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/totalDispEntInfoStatistics', params })
// 获取经营单位数据
export const listDispReceiveWasteStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listDispReceiveWasteStatistics', params })
// 获取经营单位数据
export const listDispInvWasteStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listDispInvWasteStatistics', params })
// 获取经营单位数据
export const getDispProduceSecWasteEchart = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getDispProduceSecWasteEchart', params })
// 获取经营单位数据
export const getDispStorageStatisticsEchart = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getDispStorageStatisticsEchart', params })
// 获取经营单位数据
export const getDispInvSecWasteEchart = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getDispInvSecWasteEchart', params })
// 获取表格分页数据
export const getStatisticsTableResut = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getStatisticsTableResut', params })
// 获取表格分页数据
export const getDayAndMonthAndYearWeighRecordNum = (params = {}) => httpGet({ url: 'EntWasteMapInfo/getDayAndMonthAndYearWeighRecordNum', params })
// 获取表格分页数据
export const getListNewestWeighRecord = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listNewestWeighRecord', params })
// 获取表格分页数据
export const totalProdEntInfoStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/totalProdEntInfoStatistics', params })
// 获取表格分页数据
export const entWeighbridgeStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/entWeighbridgeStatistics', params })
// 获取表格分页数据
export const listInventoryWasteStatisticsByWasteCode = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listInventoryWasteStatisticsByWasteCode', params })
// 获取表格分页数据
export const listInventoryWasteStatisticsByEnt = (params = {}) => httpGet({ url: 'EntWasteMapInfo/listInventoryWasteStatisticsByEnt', params })

// 危废查询
export const getEnterpriseWaste = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/getEnterpriseWaste', data, params })
// 危废存储
export const saveEnterpriseWaste = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/saveEnterpriseWaste', data, params })
// 危废删除
export const deleteEnterpriseWaste = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/deleteEnterpriseWaste', data, params })
// 危废修改
export const modifyEnterpriseWaste = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/modifyEnterpriseWaste', data, params })
// 贮存点查询
export const getStorage = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/getStorage', data, params })
// 贮存点新增
export const saveStorage = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/saveStorage', data, params })
// 贮存点删除
export const deleteStorage = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/deleteStorage', data, params })
// 贮存点修改
export const modifyStorage = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/modifyStorage', data, params })
// 企业信息新增
export const saveEnterpriseAndEnterpriseDetail = (data = {}, params = {}) => httpPost({ url: '/web/production/enterprise/saveEnterpriseAndEnterpriseDetail', data, params })
// 企业信息新增
export const modifyEnterpriseAndEnterpriseDetail = (data = {}, params = {}) => httpPost({ url: '/web/production/enterprise/modifyEnterpriseAndEnterpriseDetail', data, params })
// 企业信息查看
export const getEnterpriseAndEnterpriseDetail = (data = {}, params = {}) => httpPost({ url: '/web/production/enterprise/getEnterpriseAndEnterpriseDetail', data, params })
// 字典表
export const getCodeAndNameDic = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/getCodeAndNameDic', data, params })
// 字典树
export const getCodeAndNameDicTree = (data = {}, params = {}) => httpPost({ url: '/web/production/storage/getCodeAndNameDicTree', data, params })
// 行政区
export const getSysCanton = (data = {}, params = {}) => httpPost({ url: '/web/production/enterprise/getSysCanton', data, params })
// 二位码
export const getClassCode = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/getClassCode', data, params })
// 八位码
export const getWasteCode = (data = {}, params = {}) => httpPost({ url: '/web/production/enterpriseWaste/getWasteCode', data, params })
// 获取客户企业信息
export const getCustomerEnterprise = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/getCustomerEnterprise', data, params })
// 获取负责人下拉信息
export const getSysRoleEmploee = (data = {}, params = {}) => httpPost({ url: '/web/disposition/chargedContacts/getSysRoleEmploee', data, params })
// 获取所有行政区
export const getAllSySCanton = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/getAllSySCanton', data, params })

// 获取企业数量
export const cantonEntNumStatistics = (params = {}) => httpGet({ url: 'EntWasteMapInfo/cantonEntNumStatistics', params })
// 添加客户企业信息
export const addCustomerEnterprise = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/addCustomerEnterprise', data, params })
// 添加客户企业信息
export const editCustomerEnterprise = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/editCustomerEnterprise', data, params })
// 获取联系人
export const getCustomerContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/getCustomerContacts', data, params })
// 新增联系人
export const addContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/addContacts', data, params })
// 修改联系人
export const editContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/editContacts', data, params })
// 获取行业类型
export const getIndustry = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/getIndustry', data, params })
// 获取通用处置字典
export const getDispCodeAndNameDic = (data = {}, params = {}) => httpPost({ url: '/web/disposition/storage/getCodeAndNameDic', data, params })
// 删除联系人
export const deleteContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/deleteContacts', data, params })
// 设置当前联系人
export const setCustomerContactsPrincipal = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/setCustomerContactsPrincipal', data, params })
// 获取企业信息
export const getEnterpriseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/getEnterpriseInfo', data, params })
// 获取企业信息
export const getHistoryChargeContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/getHistoryChargeContacts', data, params })
// 删除企业信息list
export const deleteCustomerEnterprise = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerEnterprise/deleteCustomerEnterprise', data, params })
// 获取危废信息二位码
export const getDisClassCode = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/getClassCode', data, params })
// 获取危废信息八位码
export const getDisWasteCode = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/getWasteCode', data, params })
// 新增财务信息
export const addFinacialInformation = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FinacialInformation/addFinacialInformation', data, params })
// 获取财务信息
export const getFinacialInformation = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FinacialInformation/getFinacialInformation', data, params })
// 获取财务信息
export const editFinacialInformation = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FinacialInformation/editFinacialInformation', data, params })
// 添加危废
export const addWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/addWaste', data, params })
// 获取危废
export const getWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/getWaste', data, params })
// 删除危废
export const deleteWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/deleteWaste', data, params })
// 修改危废
export const editWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/editWaste', data, params })
// 获取许可证信息
export const listLicence = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listLicence', data, params })
// 删除许可证信息
export const deleteLicence = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/deleteLicence', data, params })
// 获取许可证类型
export const listLicenceType = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listLicenceType', data, params })
// 获取类型
export const listLicenceAuthType = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listLicenceAuthType', data, params })
// 获取项目
export const listProject = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listProject', data, params })
// 新增许可证
export const saveLicence = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/saveLicence', data, params })
// 修改许可证
export const editLicence = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/editLicence', data, params })
// 许可证管理-查询许可证危废
export const licenceWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/licenceWaste', data, params })
// 获取萤石云token
export const getVideoToken = (data = {}, params = {}) => httpPost({ url: 'https://open.ys7.com/api/lapp/token/get', data, params })
// 获取萤石云视频
export const getVideoList = (data = {}, params = {}) => httpPost({ url: 'https://open.ys7.com/api/lapp/live/video/list', data, params })
// 流程列表
export const getWorkflowProcess = (data = {}, params = {}) => httpPost({ url: '/web/workflow/getWorkflowProcess', data, params })
// 签收任务
export const signProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/signProcess', data, params })
// 启动合同流程
export const startContractProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/startProcess', data, params })
// 审核合同流程
export const auditContractProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/auditProcess', data, params })
// 启动合同流程
export const cancelContractProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/cancelProcess', data, params })
// 通用字典获取
export const listDictionary = (data = {}, params = {}) => httpPost({ url: '/web/sysmanage/dictionary/listDictionary', data, params })

// 经营合同列表
export const queryPageMSWMSAOrderHead = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/queryPageMSWMSAOrderHead', data, params })
// 保存经营合同
export const saveManageContractEntity = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/saveManageContractEntity', data, params })
// 企业列表
export const selectEnterpriseList = (data = {}, params = {}) => httpPost({ url: '/web/production/enterprise/selectEnterpriseList', data, params })
// 查询经营协议
export const queryMSWMSAOrderHeadByID = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/queryMSWMSAOrderHeadByID', data, params })
// 查询经营协议
export const queryMSWMSAOrderLineByHeadID = (data = {}, params = {}) => httpPost({ url: '/web/disposition/orderline/queryMSWMSAOrderLineByHeadID', data, params })
// 存储经营协议子表
export const saveMSWMSAOrderLineEntity = (data = {}, params = {}) => httpPost({ url: '/web/disposition/orderline/saveMSWMSAOrderLineEntity', data, params })
// 设置启用停用
export const setEnabledOnOrOff = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/setEnabledOnOrOff', data, params })
// 许可证管理-查看许可证详情
export const listLicenceDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listLicenceDetail', data, params })
// 合同管理-费用分页
export const pageContractPrice = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contractprice/pageContractPrice', data, params })
// 合同管理-保存费用
export const saveContractPrice = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contractprice/saveContractPrice', data, params })
// 合同管理-删除费用
export const removeContractPrice = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contractprice/removeContractPrice', data, params })
// 合同管理-税率列表
export const listValidTaxRateInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/taxRateInfo/listValidTaxRateInfo', data, params })
// 文件列表
export const pageFileList = (data = {}, params = {}) => httpPost({ url: '/web/sysmanage/file/pageFileList', data, params })
// 文件保存描述
export const saveFileList = (data = {}, params = {}) => httpPost({ url: '/web/sysmanage/file/saveFileList', data, params })
// 删除文件
export const deleteFileList = (data = {}, params = {}) => httpPost({ url: '/web/sysmanage/file/deleteFileList', data, params })
// 查询实验室参数
export const pageAnalysisParam = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisParam/pageAnalysisParam', data, params })
// 删除实验室参数
export const deleteAnalysisParam = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisParam/deleteAnalysisParam', data, params })
// 查询填埋场基础信息列表
export const getFillBaseInfoListPage = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/getFillBaseInfoListPage', data, params })
// 添加填埋位置信息
export const addFillBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/addFillBaseInfo', data, params })
// 修改填埋位置信息
export const updateFillBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/updateFillBaseInfo', data, params })
// 修改填埋位置信息
export const deleteFillBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/deleteFillBaseInfo', data, params })
// 查询经营项目列表
export const projectListProject = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/listProject', data, params })
// 处置方式选择下拉框
export const listDispositonTypes = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/listDispositonTypes', data, params })
// 计量单位选择下拉框
export const listCapacityUnit = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/listCapacityUnit', data, params })
// 查询项目详情和项目危废
export const listProjectDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project//listProjectDetail', data, params })
// 二位码、八位码弹窗树结构
export const getClassCodeAndWasteCode = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/getClassCodeAndWasteCode', data, params })
// 添加项目和项目危废
export const saveProject = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/saveProject', data, params })
// 更新项目和项目危废
export const updateProject = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/updateProject', data, params })
// 删除项目和项目危废
export const deleteProject = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/deleteProject', data, params })
// 项目设置启用/停用
export const setStatusOnOrOff = (data = {}, params = {}) => httpPost({ url: '/web/disposition/project/setStatusOnOrOff', data, params })
// 查询填埋场经营台账列表
export const getFillBusinessParameterList = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBusinessParameter/getFillBusinessParameterList', data, params })
// 查询填埋台账详情
export const getFillBusinessDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBusinessParameter/getFillBusinessDetail', data, params })
// 添加台账信息
export const addFillBusiness = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBusinessParameter/addFillBusiness', data, params })
// 修改台账信息
export const editFillBusinessParameter = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBusinessParameter/editFillBusinessParameter', data, params })
// 删除台账信息
export const deleteFillBusiness = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBusinessParameter/deleteFillBusiness', data, params })
// 修改填埋信息
export const editFillBusinessParameterDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FillBusinessParameterDetail/editFillBusinessParameterDetail', data, params })
// 删除填埋信息
export const deleteFillBusinessParameterDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FillBusinessParameterDetail/deleteFillBusinessParameterDetail', data, params })
// 查询填埋危废列表
export const getFillBusinessWasteList = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FillBusinessParameterDetail/getFillBusinessWasteList', data, params })
// 填埋位置下拉框
export const getFillLocationList = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FillBusinessParameterDetail/getFillLocationList', data, params })
// 查询字典（预处理工艺）
export const getSysDictionaryByTypeCode = (data = {}, params = {}) => httpPost({ url: '/web/disposition/FillBusinessParameterDetail/getSysDictionaryByTypeCode', data, params })
// 许可证管理-处置方式下拉框
export const licenceListDispositonTypes = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listDispositonTypes', data, params })
// 许可证管理-添加许可证危废
export const saveLicenceWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/saveLicenceWaste', data, params })
// 许可证管理-修改许可证危废
export const editLicenceWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/editLicenceWaste', data, params })
// 根据流程标识获取业务表主键的值
export const getPrimaryKeyByProcInsId = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/getPrimaryKeyByProcInsId', data, params })
// 获取流程流转信息
export const listHistoicFlow = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/listHistoicFlow', data, params })
// 删除合同
export const delMSWMSAOrderHeadByIDs = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/delMSWMSAOrderHeadByIDs', data, params })
// 获取单位类型
export const listUnitType = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisParam/listUnitType', data, params })
// 获取单位
export const listUnit = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisParam/listUnit', data, params })
// 保存化验室参数
export const saveAnalysisParam = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisParam/saveAnalysisParam', data, params })
// 保存化验室模板
export const saveAnalysisTemplate = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisTemplate/saveAnalysisTemplate', data, params })
// 分页查询化验室模板
export const pageAnalysisTemplate = (data = {}, params = {}) => httpPost({ url: '/web/disposition/analysisTemplate/pageAnalysisTemplate', data, params })
// 保存化验模板参数
export const saveTemplateMappingParam = (data = {}, params = {}) => httpPost({ url: '/web/disposition/templateMappingParam/saveTemplateMappingParam', data, params })
// 业务员列表
export const listSysRoleEmployee = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/listSysRoleEmployee', data, params })
// 续签补签选择列表
export const pageContractAboutRenewAndSupplement = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/pageContractAboutRenewAndSupplement', data, params })
// 补签插入
export const insertSupplementSAOrderHead = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/insertSupplementSAOrderHead', data, params })
// 续签插入
export const insertContinuousSAOrderHead = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/insertContinuousSAOrderHead', data, params })
// 删除合同子表
export const delMSWMSAOrderLineByIDs = (data = {}, params = {}) => httpPost({ url: '/web/disposition/orderline/delMSWMSAOrderLineByIDs', data, params })
// 填埋场下拉框
export const listBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/listBaseInfo', data, params })
// 获取填埋场详情
export const getFilBaseInfoById = (data = {}, params = {}) => httpPost({ url: '/web/disposition/fillBaseInfo/getFilBaseInfoById', data, params })
// 获取填埋场详情
export const listDispositonByTypeCode = (data = {}, params = {}) => httpPost({ url: '/web/disposition/licence/listDispositonByTypeCode', data, params })
// 获取填埋场详情
export const getServiceJsonCall = (params = {}) => httpGet({ url: '/service/json/call', params })
// 获取菜单
export const getUrlPermission = (data = {}, params = {}) => httpPost({ url: '/sysMenu/url', data, params })
// 获取用户详情
export const getTreeUser = (data = {}, params = {}) => httpPost({ url: '/sysMenu/tree/user', data, params })
// 向erp2.0传值token
export const getOldErpLogin = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/oldErp/login.do', params })
// 向workflow后台模拟登录
export const getWorkflowLogin = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.workflowUrl + '/login', params })
// 获取首页待办列表
export const getToDoList = (data = {}, params = {}) => httpPost({ url: '/web/disposition/enterprise/getToDoList', data, params })
// 销售漏斗我的客户-查询客户列表
export const getCustomerEnterpriseListPage = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/getCustomerEnterpriseListPage', data, params })
// 销售漏斗我的客户-导出客户列表
export const exportCustomerEnterpriseListPage = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/exportCustomerEnterpriseListPage', data, params })
// 销售漏斗商务活动-查询客户列表
export const listBusinessActivityBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/listBusinessActivityBaseInfo', data, params })
// 销售漏斗商务活动-导出客户列表
export const exportBusinessActivityBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/exportBusinessActivityBaseInfo', data, params })
// 销售漏斗商务活动-保存客户
export const saveBusinessActivityBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/saveBusinessActivityBaseInfo', data, params })
// 销售漏斗商务活动-保存客户联系人
export const saveBusinessActivityContactsInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/saveBusinessActivityContactsInfo', data, params })
// 销售漏斗商务活动-获取客户联系人列表
export const listBusinessActivityContactsInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/listBusinessActivityContactsInfo', data, params })
// 销售漏斗商务活动-保存危废
export const saveBusinessActivityWasteInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/saveBusinessActivityWasteInfo', data, params })
// 销售漏斗商务活动-修改危废
export const updateBusinessActivityWasteInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/updateBusinessActivityWasteInfo', data, params })
// 销售漏斗商务活动-获取危废列表
export const listBusinessActivityWasteInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/listBusinessActivityWasteInfo', data, params })
// 销售漏斗我的客户-查询客户详情
export const getCustomerEnterpriseDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/getCustomerEnterpriseDetail', data, params })
// 销售漏斗我的客户-查询商务活动详情
export const getBusinessActivityBaseInfoById = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/getBusinessActivityBaseInfoById', data, params })
// 销售漏斗我的客户-修改我的客户信息
export const modifyCustomerEnterprise = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/editCustomerEnterprise', data, params })
// 销售漏斗我的客户-查看联系人列表
export const getCustomerContactsListPage = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/getCustomerContactsListPage', data, params })
// 销售漏斗我的客户-新增联系人
export const addCustomerContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/addCustomerContacts', data, params })
// 销售漏斗我的客户-新增联系人
export const editCustomerContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/editCustomerContacts', data, params })
// 销售漏斗我的客户-删除联系人
export const deleteCustomerContacts = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/deleteCustomerContacts', data, params })
// 销售漏斗我的客户-查看联系人详情
export const getCustomerContactsDetail = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerContacts/getCustomerContactsDetail', data, params })
// 销售漏斗我的客户-查看危废列表
export const getCustomerWasteListPage = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/getCustomerWasteListPage', data, params })
// 销售漏斗我的客户-查看财务信息
export const getCustomerFinanceInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/financeInfo/getCustomerFinanceInfo', data, params })
// 销售漏斗我的客户-查看财务信息
export const addCustomerFinanceInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/financeInfo/addCustomerFinanceInfo', data, params })
// 销售漏斗我的客户-修改财务信息
export const editCustomerFinanceInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/financeInfo/editCustomerFinanceInfo', data, params })
// 销售漏斗我的客户-删除客户详情
export const deleteBusinessActivityBaseInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/deleteBusinessActivityBaseInfo', data, params })
// 销售漏斗我的客户-添加客户危废
export const addCustomerWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/addCustomerWaste', data, params })
// 销售漏斗我的客户-修改客户危废
export const editCustomerWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/editCustomerWaste', data, params })
// 销售漏斗我的客户-删除客户危废
export const deleteCustomerWaste = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerWaste/deleteCustomerWaste', data, params })
// 销售漏斗我的客户-删除客户联系人
export const deleteBusinessActivityContactsInfo = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/deleteBusinessActivityContactsInfo', data, params })
// 销售漏斗我的客户-查询业务经理
export const getChargeEmpbyId = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/getChargeEmpbyId', data, params })
// 销售漏斗我的客户-分配业务经理
export const setChargeEmp = (data = {}, params = {}) => httpPost({ url: '/web/disposition/salesFunnel/setChargeEmp', data, params })

// 首页展示-我的客户(业务员版)-我的客户数量以及占比
export const getCustomerCount = (data = {}, params = {}) => httpPost({ url: '/web/disposition/indexPage/getCustomerCount', data, params })
// 首页展示-我的客户(业务员版)-已送样客户
export const listSampledCustomers = (data = {}, params = {}) => httpPost({ url: '/web/disposition/indexPage/listSampledCustomers', data, params })
// 首页展示-我的客户(业务员版)-已送样客户
export const getSignatureCount = (data = {}, params = {}) => httpPost({ url: '/web/disposition/indexPage/getSignatureCount', data, params })

// 首页-我的客户业务员版
export const getContractInfoOfSalesMan = (data = {}, params = {}) => httpPost({ url: '/web/disposition/contract/getContractInfoOfSalesMan', data, params })

// #region 安环模块 create by lijin
// 安环制度
export const getSecurityRuleInfoList = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityRuleInfo/getSecurityRuleInfoList', data, params })
export const getSecurityRuleInfoDetail = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityRuleInfo/getSecurityRuleInfoDetail', data, params })
export const addOrEditSecurityRuleInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityRuleInfo/addOrEditSecurityRuleInfo', data, params })
export const deleteSecurityRuleInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityRuleInfo/deleteSecurityRuleInfo', data, params })
export const getSecurityRuleInfoForWord = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityRuleInfo/getSecurityRuleInfoForWord', data, params })
// 培训记录
export const getSecurityTrainInfoList = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityTrainInfo/getSecurityTrainInfoList', data, params })
export const getSecurityTrainInfoDetail = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityTrainInfo/getSecurityTrainInfoDetail', data, params })
export const addOrEditSecurityTrainInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityTrainInfo/addOrEditSecurityTrainInfo', data, params })
export const deleteSecurityTrainInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityTrainInfo/deleteSecurityTrainInfo', data, params })

export const getSysRoleEmployee = (data = {}, params = {}) => httpPost({ url: 'web/disposition/salesFunnel/getSysRoleEmployee', data, params })// 获取培训参与人员
// 日常巡检
export const getSecurityCheckInfoList = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityCheckInfo/getSecurityCheckInfoList', data, params })
export const getSecurityCheckInfoDetail = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityCheckInfo/getSecurityCheckInfoDetail', data, params })
export const addOrEditSecurityCheckInfoList = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityCheckInfo/addOrEditSecurityCheckInfoList', data, params })
export const deleteSecurityCheckInfoList = (data = {}, params = {}) => httpPost({ url: 'web/disposition/securityCheckInfo/deleteSecurityCheckInfoList', data, params })

// #endregion

// #region 采购模块 create by lijin
// 原辅料
export const pagePurchaseAuxiliaryInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/pagePurchaseAuxiliaryInfo', data, params })
export const getPurchaseAuxiliaryInfoById = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/getPurchaseAuxiliaryInfoById', data, params })
export const savePurchaseAuxiliaryInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/savePurchaseAuxiliaryInfo', data, params })
export const updatePurchaseAuxiliaryInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/updatePurchaseAuxiliaryInfo', data, params })
export const deletePurchaseAuxiliaryInfoById = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/deletePurchaseAuxiliaryInfoById', data, params })
// 供应商管理
export const listPurchaseProviderInfoVO = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/listPurchaseProviderInfoVO', data, params })
export const getPurchaseProviderInfoVOById = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/getPurchaseProviderInfoVOById', data, params })
export const savePurchaseProviderInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/savePurchaseProviderInfo', data, params })
export const updatePurchaseProviderInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/updatePurchaseProviderInfo', data, params })
export const deletePurchaseProviderInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/deletePurchaseProviderInfo', data, params })
// 物品信息
export const listPurchaseProviderItemsInfoVO = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/listPurchaseProviderItemsInfoVO', data, params })
export const savePurchaseProviderItemsInfoVO = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/savePurchaseProviderItemsInfoVO', data, params })
export const updatePurchaseProviderItemsInfoVO = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/updatePurchaseProviderItemsInfoVO', data, params })
export const deletePurchaseProviderItemsInfoVO = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/deletePurchaseProviderItemsInfoVO', data, params })
// 采购申请单
export const pagePurchaseBillApplyInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/pagePurchaseBillApplyInfo', data, params })
export const getPurchaseBillApplyInfoById = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/getPurchaseBillApplyInfoById', data, params })
export const savePurchaseBillApplyInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/savePurchaseBillApplyInfo', data, params })
export const updatePurchaseBillApplyInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/updatePurchaseBillApplyInfo', data, params })
export const deletePurchaseBillApplyInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/deletePurchaseBillApplyInfo', data, params })
// 采购及入库
export const pagePurchaseBillInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/pagePurchaseBillInfo', data, params })
export const getPurchaseBillInfoByApplyId = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/getPurchaseBillInfoByApplyId', data, params })
export const savePurchaseBillInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/savePurchaseBillInfo', data, params })
export const updatePurchaseBillInfoStatus = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/updatePurchaseBillInfoStatus', data, params })
export const getPurchaseInventoryIn = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/getPurchaseInventoryIn', data, params })
export const listPurchaseProviderInfoByAuxiliaryId = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchase/listPurchaseProviderInfoByAuxiliaryId', data, params })
export const getPurchaseInventoryInfo = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/getPurchaseInventoryInfo', data, params })
export const listStorage1 = (data = {}, params = {}) => httpPost({ url: 'web/common/storage/listStorage', data, params })
export const savePurchaseInventoryIn = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/savePurchaseInventoryIn', data, params })
export const pagePurchaseInventoryIn = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/pagePurchaseInventoryIn', data, params })

// 出库
export const pagePurchaseInventoryOut = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/pagePurchaseInventoryOut', data, params })
export const pagePurchaseInventory = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/pagePurchaseInventory', data, params })
export const getPurchaseInventoryById = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/getPurchaseInventoryById', data, params })
export const savePurchaseInventoryOut = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/savePurchaseInventoryOut', data, params })
export const getPurchaseInventoryOut = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/getPurchaseInventoryOut', data, params })
export const listPurchaseChangeRecords = (data = {}, params = {}) => httpPost({ url: 'web/disposition/purchaseInventory/listPurchaseChangeRecords', data, params })

// #endregion

// ERP2.0接口开始======================================================================================================================================================
//合同审核生成整单的费用
export const createCostDetail = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/createCostDetail.do', params })
// 生产线-列表
export const queryProjectName = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/queryProjectName.do', params })
// 生产计划-保存
export const saveProductionPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/saveProductionPlan.do', params })
// 生产计划-查看详情
export const getProductionPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/getProductionPlan.do', params })
// 生产计划-删除
export const removeProductionPlan = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/removeProductionPlan.do', data, params })
// 生产计划-分页
export const pageProductionPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/pageProductionPlan.do', params })
// 生产计划-提交
export const commitProductionPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/commitProductionPlan.do', params })
// 生产计划-审核
export const checkProductionPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/checkProductionPlan.do', params })

// 创建配伍单-配伍模板下拉
export const listCompatibilityTemplate = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listCompatibilityTemplate.do', params })
// 创建配伍单-仓库下拉
export const listStorage = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/storageAndStorageLocation/listStorage.do', params })
// 创建配伍单-配伍参数
export const listParam = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listParam.do', params })
// 创建配伍单-库存分析明细列表
export const listInvcurOfCompatibility = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listInvcurOfCompatibility.do', params })
// 创建配伍单-查联单下的包装
export const listInvcurOftransferPackage = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listInvcurOftransferPackage.do', params })
// 创建配伍单-产废单位列表
export const listEnt = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/enterprise/listEnt.do', params })
// 创建配伍单-自动配伍
export const listInvcurOfAutoCompatibility = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listInvcurOfAutoCompatibility.do', params })
// 创建配伍单- 保存配伍单
export const saveCompatibility = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/saveCompatibility.do', data, params })

// 创建配伍单- 删除配伍单
export const removeCompativilityPlan = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/removeCompativilityPlan.do', data, params })
// 创建配伍单- 配伍单列表
export const pageCompatibilityList = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/pageCompatibilityList.do', params })
// 创建配伍单- 配伍明细列表
export const pageCompatibilityPlanNo = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/pageCompatibilityPlanNo.do', params })
// 创建配伍单- 配伍单提交
export const commitCompatibilityPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/commitCompatibilityPlan.do', params })
// 创建配伍单-  配伍单审核
export const checkCompatibilityPlan = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/checkCompatibilityPlan.do', params })
// 超期预警
export const listOvertimeWaste = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listOvertimeWaste.do', data, params })
// 获取接收危废总量
export const listReceiveWaste = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listReceiveWaste.do', data, params })
// 获取接收次生危废总量 以及各个危废的百分比
export const listSecondWaste = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listSecondWaste.do', data, params })
// echarts 抽检
export const listSamplingStatistics = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/samplingStatistics/listSamplingStatistics.do', data, params })
// echarts 折线图
export const listDispatchBillExecutionStatistics = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listDispatchBillExecutionStatistics.do', data, params })
// 今日派车数据
export const listDispatchBillToday = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listDispatchBillToday.do', data, params })
// 今日派车数据
export const listFinancialByQuarter = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listFinancialByQuarter.do', data, params })
// 今日派车计划
export const getDispatchPlanStatistics = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/getDispatchPlanStatistics.do', data, params })
// 今日派车数据
export const listDispatchPlan = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/listDispatchPlan.do', data, params })
// 今日派车数据
export const getContractStatistics = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/newErp/getContractStatistics.do', data, params })
// ERP2.0接口结束=============================================================================================================================================================
// 仓库领料- 列表分页
export const pageCompatibilityReceive = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/pageCompatibilityReceive.do', params })
// 配伍联单下的包装
export const pageCompatibilityPackage = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/pageCompatibilityPackage.do', params })
// 打印领料单
export const listCompatibilityPrint = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listCompatibilityPrint.do', params })
//  领料出库详情
export const getCompatibilityOut = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/getCompatibilityOut.do', params })
//  领料出库
export const compatibilityOutStorage = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/compatibilityOutStorage.do', data, params })
//  删除出库
export const removeCompatibilityRecord = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/removeCompatibilityRecord.do', data, params })
//  配伍编辑回显
export const listCompatibilityTransferInfo = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/listCompatibilityTransferInfo.do', params })
// 查询配伍详情
export const getCompatibilityById = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/getCompatibilityById.do', params })
//导出配伍清单列表
export const exportCompatibilityList = (params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/exportCompatibilityList.do', params })
//导出待配伍生产计划列表
export const exportCompatibilityProducitonPlanList = (params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/productionPlan/exportCompatibilityProducitonPlanList.do', params })

// 领料出库挑选危废列表
export const pageInventoryStatistics = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/pageInventoryStatistics.do', params })
// 领料出库库存列表
export const pageInventory = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/pageInventory.do', params })
// 领料出库危废出库判断
export const judgeInvtkHeadValid = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/judgeInvtkHeadValid.do', params })
// 领料出库危废出库
export const batchOutStorageForHandle = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/compatibilityPlan/batchOutStorageForHandle.do', params })
// 刷新erp2.0token
export const refreshToken = (params = {}) => httpGet({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/refresh/token.do', params })
// 根据企业id 八位码 危废俗称 匹配送样分析单 所需要参数
export const getSampleAnalysisParam = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/sampleAnalysisBill/getSampleAnalysisParam.do', data, params })
// ERP2.0接口结束======================================================================================================================================================

// 启动配伍流程
export const startCompatibilityProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/productionplan/startProcess', data, params })
// 审核配伍流程
export const auditCompatibilityProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/productionplan/auditProcess', data, params })
// 终止配伍流程
export const cancelCompatibilityProcess = (data = {}, params = {}) => httpPost({ url: '/web/disposition/productionplan/cancelProcess', data, params })

// 查询生产计划详情
export const queryProductionPlan = (data = {}, params = {}) => httpPost({ url: '/web/disposition/productionplan/queryProductionPlan', data, params })
// 根据生产计划标识获取配伍单详情
export const getCompatibilityPlanFirstForMap = (data = {}, params = {}) => httpPost({ url: '/web/disposition/productionplan/getCompatibilityPlanFirstForMap', data, params })
// 获取用户对应的员工标识
export const getSysEmpId = (data = {}, params = {}) => httpPost({ url: '/web/disposition/customerInfo/getSysEmpId', data, params })
// 判断该用户是否有权限修改本企业信息
export const isEntInfoManger = (data = {}, params = {}) => httpPost({ url: '/sysRoles/menu/isEntInfoManger', data, params })

// 管理后台
export const listSysAppUpdatePage = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/listSysAppUpdatePage', data, params })
export const enableSysDictionaryType = (data = {}, params = {}) => httpPost({ url: '/sysDictionaryType/enableSysDictionaryType', data, params })
export const sysDelete = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/delete', data, params })
export const deleteSysAppUpdatePage = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/deleteSysAppUpdatePage', data, params })
export const setCurrentVersion = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/setCurrentVersion', data, params })
export const stopReleaseVersion = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/stopReleaseVersion', data, params })
export const releaseVersion = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/releaseVersion', data, params })
export const sysChangePasswordList = (data = {}, params = {}) => httpPost({ url: '/sysChangePasswordConfig/list.do', data, params })
export const sysOrgsList = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/list', data, params })
export const sysListDictionary = (params = {}) => httpGet({ url: '/sysDictionary/listDictionary', params })
export const sysEnable = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/enable', data, params })
export const addSysAppUpdatePage = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/addSysAppUpdatePage', data, params })
export const editSysAppUpdatePage = (data = {}, params = {}) => httpPost({ url: '/sysAppUpdate/editSysAppUpdatePage', data, params })
export const sysTree = (data = {}, params = {}) => httpPost({ url: '/sysMenu/tree', data, params })
export const sysRolesEnable = (data = {}, params = {}) => httpPost({ url: '/sysRoles/enable', data, params })
export const sysRolesDelete = (data = {}, params = {}) => httpPost({ url: '/sysRoles/delete', data, params })
export const sysRolesList = (data = {}, params = {}) => httpPost({ url: '/sysRoles/list', data, params })
export const sysButtonRemove = (data = {}, params = {}) => httpPost({ url: '/sysButton/remove', data, params })
export const sysListRole = (data = {}, params = {}) => httpPost({ url: '/sysMenu/list/role', data, params })
export const sysRolesMenuAdd = (data = {}, params = {}) => httpPost({ url: '/sysRoles/menu/add', data, params })
export const sysOrgsTree = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/tree', data, params })
export const sysPriListMenu = (data = {}, params = {}) => httpPost({ url: '/sysPrivilegeMenu/listMenu', data, params })
export const sysRolesAdd = (data = {}, params = {}) => httpPost({ url: '/sysRoles/add', data, params })
export const sysOrgsFind = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/find', data, params })
export const sysOrgsAdd = (data = {}, params = {}) => httpPost({ url: '/sysOrgs/add', data, params })
export const pageSysDictionaryType = (data = {}, params = {}) => httpPost({ url: '/sysDictionaryType/pageSysDictionaryType', data, params })
export const listSysDictionary = (data = {}, params = {}) => httpPost({ url: '/sysDictionary/listSysDictionary.do', data, params })
export const enableSysDictionary = (data = {}, params = {}) => httpPost({ url: '/sysDictionary/enableSysDictionary', data, params })
export const removeSysDictionaryType = (data = {}, params = {}) => httpPost({ url: '/sysDictionaryType/removeSysDictionaryType', data, params })
export const removeSysDictionary = (data = {}, params = {}) => httpPost({ url: '/sysDictionary/removeSysDictionary', data, params })
// export const sysMenuListModule = (data = {}, params = {}) => httpPost({ url: '/sysMenu/listModule', data, params })
export const sysMenuListModule = (params = {}) => httpGet({ url: '/sysMenu/listModule', params })
export const getSysRoleLoginUser = (params = {}) => httpGet({ url: '/sysRoleLoginUser/getSysRoleLoginUser', params })
export const sysRoleOrgList = (params = {}) => httpGet({ url: '/sysRoleOrg/listSysRoleOrg', params })
export const sysChangePasswordConfigGet = (params = {}) => httpGet({ url: '/sysChangePasswordConfig/get', params })
export const getSysDictionary = (params = {}) => httpGet({ url: '/sysDictionary/getSysDictionary', params })
export const getSysDictionaryType = (params = {}) => httpGet({ url: '/sysDictionaryType/getSysDictionaryType', params })
export const sysMenuDelete = (data = {}, params = {}) => httpPost({ url: '/sysMenu/delete', data, params })
export const sysMenuFind = (data = {}, params = {}) => httpPost({ url: '/sysMenu/find', data, params })
export const sysMenuAdd = (data = {}, params = {}) => httpPost({ url: '/sysMenu/add', data, params })
export const sysRolesChangePassword = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/changePassword', data, params })
export const saveSysDictionary = (data = {}, params = {}) => httpPost({ url: '/sysDictionary/saveSysDictionary', data, params })
export const saveSysDictionaryType = (data = {}, params = {}) => httpPost({ url: '/sysDictionaryType/saveSysDictionaryType', data, params })
export const sysChangePasswordConfigSave = (data = {}, params = {}) => httpPost({ url: '/sysChangePasswordConfig/save', data, params })
// export const pageSysRoleLoginUser = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/pageSysRoleLoginUser', data, params })
export const pageSysRoleLoginUser = (params = {}) => httpGet({ url: '/sysRoleLoginUser/pageSysRoleLoginUser', params })
export const sysMenuUser = (data = {}, params = {}) => httpPost({ url: '/sysMenu/list/user', data, params })
export const sysAccountAdd = (data = {}, params = {}) => httpPost({ url: '/sysAccount/menu/add', data, params })
export const saveSysRoleLoginUser = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/saveSysRoleLoginUser', data, params })
export const sysRolesListOrg = (data = {}, params = {}) => httpPost({ url: '/sysRoles/list/org', data, params })
export const sysRolFind = (data = {}, params = {}) => httpPost({ url: '/sysRoles/find', data, params })
export const sysRoleLoginUserType = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/type', data, params })
export const resetPassword = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/resetPassword', data, params })
export const removeSysRoleLoginUser = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/removeSysRoleLoginUser', data, params })
export const changeUserStatus = (data = {}, params = {}) => httpPost({ url: '/sysRoleLoginUser/changeUserStatus', data, params })

// 物化
export const enterpriseListEnt = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/enterprise/listEnt.do', data, params })
export const getListStorage = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/storageAndStorageLocation/listStorage.do', data, params })
export const getListInvcurOfPhysicochemical = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/listInvcurOfPhysicochemical.do', data, params })
export const phyListInvcurOftransferPackage = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/listInvcurOftransferPackage.do', data, params })
export const phyListMaterial = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/listMaterial.do', data, params })
export const savePhchPlan = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/savePhchPlan.do', data, params })
export const listPhchPlan = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/listPhchPlan.do', data, params })
export const deletePhchPlanById = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/deletePhchPlanById.do', data, params })
export const getPhchPlanById = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/getPhchPlanById.do', data, params })
export const fwListDictionary = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/fWDictionary/listDictionary.do', data, params })
export const savePhchPickRecord = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchPickRecord/savePhchPickRecord.do', data, params })
export const listPhchPickRecord = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchPickRecord/listPhchPickRecord.do', data, params })
export const deletePhchPickRecord = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchPickRecord/deletePhchPickRecord.do', data, params })
export const getPhchPickRecordById = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchPickRecord/getPhchPickRecordById.do', data, params })
export const listTopPhchPickRecord = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchPickRecord/listTopPhchPickRecord.do', data, params })
export const phcOutStorage = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/outStorage.do', data, params })
export const exportOutStorageBill = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/exportOutStorageBill.do', data, params })
export const listPhchAccount = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/listPhchAccount.do', data, params })
export const deletePhchAcoount = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/deletePhchAcoount.do', data, params })
export const savePhchAccount = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/savePhchAccount.do', data, params })
export const listPhchEmp = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/listPhchEmp.do', data, params })
export const getPhchAccountById = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/phchOutStorage/getPhchAccountById.do', data, params })

// 填埋
export const getFillBaseinfoListPage = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/getFillBaseInfoListPage.do', data, params })
export const addFillBaseinfo = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/addFillBaseInfo.do', data, params })
export const updateFillBaseinfo = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/updateFillBaseInfo.do', data, params })
export const deleteFillBaseinfo = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/deleteFillBaseInfo.do', data, params })
export const listBaseinfo = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/listBaseInfo.do', data, params })
export const listFillBaseinfo = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/listFillBaseInfo.do', data, params })
export const getFilBaseinfoById = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/getFilBaseInfoById.do', data, params })
export const getFillCount = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBaseInfo/getFillCount.do', data, params })

export const getFillbusinessParameterList = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBusinessParameter/getFillBusinessParameterList.do', data, params })
export const getFillbusinessDetail = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBusinessParameter/getFillBusinessDetail.do', data, params })
export const addFillbusiness = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBusinessParameter/addFillBusiness.do', data, params })
export const editFillbusinessParameter = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBusinessParameter/editFillBusinessParameter.do', data, params })
export const deleteFillbusiness = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/fillBusinessParameter/deleteFillBusiness.do', data, params })

export const getFillbusinessWasteList = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/FillBusinessParameterDetail/getFillBusinessWasteList.do', data, params })
export const getSysDicByTypeCode = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/web/disposition/FillBusinessParameterDetail/getSysDictionaryByTypeCode.do', data, params })
export const updatePlanStatusCheck = (data = {}, params = {}) => httpPost({ url: GLB_CONFIG.devUrl.serviceErpRootUrl + '/physicochemical/test/updatePlanStatusCheck.do', data, params })
