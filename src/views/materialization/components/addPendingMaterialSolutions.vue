<template>
  <div class="divCard">
    <el-row class="cardRow" :gutter="24">
      <el-col class="cardRol" :span="firstCardCols">
        <div class="card-items">
          <div class="card-item">
            <div class="card-item-header">
              <span class="cardTitle" v-if="isLeftExpand">处置方案信息</span>
              <i @click="firstCardClick" v-if="isLeftExpand" class="shousuo el-icon-d-arrow-left"></i>
              <i @click="firstCardClick" v-else class="shousuo el-icon-d-arrow-right"></i>
            </div>
            <div class="card-item-content" v-if="isLeftExpand">
              <el-form ref="form" :model="postForm" :rules="formRules" label-width="85px">
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-table
                            :data="records"
                            style="width: 100%"
                            element-loading-background="rgba(0, 0, 0, 0.8)"
                            row-key="id"
                            lazy>
                      <el-table-column
                              prop="matName"
                              label="原辅料">
                      </el-table-column>
                      <el-table-column
                              prop="amount"
                              label="添加量">
                      </el-table-column>
                      <el-table-column
                              prop="unit"
                              label="单位">
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="方案总量：">
                      <el-input :disabled="true" v-model="qty">
                        <template slot="append">吨</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="已领用量：">
                      <el-input :disabled="true" v-model="hasQty">
                        <template slot="append">吨</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="处置说明：">
                      <el-input :rows="5" :disabled="true" type="textarea" v-model="dealDesc"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="备注：">
                      <el-input :disabled="true" type="textarea" v-model="remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="cardRol" :span="secondCardCols">
        <el-card class="box-card">
          <div class="cardContent">
            <div class="item-header">
              <div class="item-header-text">待领区域</div>
            </div>
            <el-table height="350" size="mini" border :row-key="getRowKeys" :expand-row-keys="expandKeys" @expand-change="expandChange" :header-cell-style="headClass" stripe ref="multipleBottomTable" :data="topRecords"
                      style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" border :header-cell-style="headClass" stripe ref="multipleTopSubTable" :data="props.row.packageList"
                            style="width: 100%" height="150" @selection-change="handleSubSelectionChange">
                    <el-table-column v-if="checkObj.type!=='queryList' && checkObj.type!=='queryPlan'" :selectable="selectable" type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="化验单">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="pick" label="是否已领">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="pickTime" label="领用日期">
                      <template slot-scope="scope">
                        {{scope.row.pickTime | formatDate}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="cusname" label="产废单位">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="matcode" label="八位码">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="matname" label="危废俗称">
              </el-table-column>
              <el-table-column align="center" prop="actqty" label="数量" width="80">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--<div class="block">-->
              <!--<v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>-->
            <!--</div>-->
            <!-- 分割线 -->
            <div class="topBottomCls">
              <el-button @click="toBottomClick" :disabled="!(multipleSubSelection && multipleSubSelection.length)" size="samll" type="primary" icon="el-icon-bottom" circle></el-button>
              <el-button @click="toTopClick" :disabled="!(multipleBottomSubSelection&&multipleBottomSubSelection.length)" size="samll"
                         type="primary" icon="el-icon-top" circle></el-button>
            </div>
            <!-- 分割线 -->
            <div class="item-header">
              <div class="item-header-text">已选择区</div>
            </div>
            <el-table height="350" size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomTable" :data="bottomRecords" :row-key="getRowKeys" :expand-row-keys="expandBottomKeys" @expand-change="expandBottomChange"
                      style="width: 100%" @selection-change="handleBottomSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomSubTable" :data="props.row.packageList"
                            style="width: 100%" height="150" @selection-change="handleBottomSubSelectionChange">
                    <el-table-column v-if="checkObj.type!=='queryList' && checkObj.type!=='queryPlan'" type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="化验单">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="pick" label="是否已领">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="pickTime" label="领用日期">
                      <template slot-scope="scope">
                        {{scope.row.pickTime | formatDate}}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="cusname" label="产废单位">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="matcode" label="八位码">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="matname" label="危废俗称">
              </el-table-column>
              <el-table-column align="center" prop="actqty" label="数量" width="80">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" v-if="false">
              <v-pagination :current="bottomPage.current" :sizes="bottomPage.sizes" :size="bottomPage.size" :total="bottomPage.total" @reloadPage="jumpBottomPage"
                            @reloadSize="jumpBottomSize"></v-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col class="cardRol" :span="thirdCardCols">
        <div class="card-items">
          <div class="card-item">
            <div class="card-item-header">
              <span class="cardTitle" v-if="isRightExpand">本次领用信息</span>
              <i @click="thirdCardClick" v-if="isRightExpand" class="shousuo el-icon-d-arrow-right"></i>
              <i @click="thirdCardClick" v-else class="shousuo el-icon-d-arrow-left"></i>
            </div>
            <div class="card-item-content" v-if="isRightExpand">
              <el-form ref="postForm" :model="postForm" :rules="formRules" label-width="85px">
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="领料单日期：" :prop="(checkObj.type==='queryList' || checkObj.type==='queryPlan') ? '' : 'pickDate'">
                      <el-date-picker
                              :disabled="checkObj.type==='queryList' || checkObj.type==='queryPlan'"
                              v-model="postForm.pickDate"
                              type="date"
                              :editable="false"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择领料单日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="本地领用量：">
                      <el-input :disabled="true" v-model="usedqty">
                        <template slot="append">吨</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                  <el-col :span="24">
                    <el-form-item label="备注：">
                      <el-input type="textarea" v-model="postForm.remark" :disabled="checkObj.type==='queryList' || checkObj.type==='queryPlan'"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="100">
                      <el-col :span="24">
                        <el-table
                                :data="records"
                                style="width: 100%"
                                element-loading-background="rgba(0, 0, 0, 0.8)"
                                row-key="id"
                                lazy>
                          <el-table-column
                                  prop="matName"
                                  label="原辅料">
                          </el-table-column>
                          <el-table-column
                                  prop="addAmount"
                                  label="添加量">
                            <template slot-scope="scope">
                              <el-input :disabled="checkObj.type==='queryList' || checkObj.type==='queryPlan'" @change="checkInput(scope.row)" v-model.number="scope.row.addAmount"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column
                                  prop="unit"
                                  label="单位">
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <div class="business-license">
                          <el-button v-if="checkObj.type!=='queryList' && checkObj.type!=='queryPlan'" :loading="saveLoading" size="small" type="primary" @click="saveData('postForm')">保存</el-button>
                          <el-button :loading="saveLoading" size="small" type="primary" @click="cancelData">取消</el-button>
                        </div>
                      </el-col>
                    </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--自动配伍模态框-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="80%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}</div>
        </div>
        <v-auto-compatibility @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-auto-compatibility>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import AutoCompatibility from './autoCompatibility.vue'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  listCompatibilityTemplate,
  listParam,
  listInvcurOfCompatibility,
  listStorage,
  listEnt,
  listInvcurOftransferPackage,
  listInvcurOfAutoCompatibility,
  saveCompatibility,
  listCompatibilityTransferInfo,
  getCompatibilityById,
  enterpriseListEnt,
  getListStorage,
  getListInvcurOfPhysicochemical,
  phyListInvcurOftransferPackage,
  phyListMaterial,
  savePhchPlan,
  getPhchPlanById,
  savePhchPickRecord,
  getPhchPickRecordById,
  listTopPhchPickRecord
} from '@/assets/js/API/api'

export default {
  name: 'addCompatibility',
  data () {
    return {
      queryForm: {
        prodEntName: '',
        storageId: '',
        reltkcode: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      // postData
      qty: '',
      hasQty: '',
      remark: '',
      dealDesc: '',
      postForm: {
        remark: '',
        pickDate: ''
      },
      prodEntNames: [],
      storageIds: [],
      formRules: {
        pickDate: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      saveLoading: false,
      toBottomBtnFlag: true,
      toTopBtnFlag: true,
      subLoading: false,
      expandKeys: [],
      expandBottomKeys: [],
      loading: false,
      pointLoading: false,
      firstCardCols: 6,
      secondCardCols: 17,
      thirdCardCols: 1,
      isLeftExpand: true,
      isRightExpand: false,
      state: '',
      defaultTabName: 'first',
      cusList: [],
      ruleList: [{
        code: '1',
        name: '先进先出'
      }, {
        code: '2',
        name: '后进先出'
      },
      {
        code: '3',
        name: '量大先出'
      }
      ],
      resultForm: {
        compQuantity: ''
      },
      resultFormRules: {

      },
      pointLevelList: [],
      pointList: [{
        id: '1',
        name: '热值',
        start: '',
        end: '',
        pointLevel: ''
      }],
      warehouseList: [],
      formLabelWidth: '85px',
      resultFormLabelWidth: '85px',
      templateList: [],
      checkObjP: {},
      dialogFormTitle: '自动配伍',
      queryFormRules: {},
      statusOptions: [{
        label: '启动',
        value: '1'
      }, {
        label: '停用',
        value: '2'
      }],
      multipleSelection: [],
      multipleSubSelection: [],
      multipleBottomSelection: [],
      multipleBottomSubSelection: [],
      openDelay: 500,
      topRecords: [],
      bottomRecords: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: 5,
        total: 0,
        sizes: [5, 10, 20]
      },
      topSubPage: {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
      },
      bottomPage: {
        current: GLB_CONSTANT.page.current,
        size: 5,
        total: 0,
        sizes: [5, 10, 20]
      },
      dialogFormVisible: false,
      addForm: {},
      addFormRules: {},
      resetPwdFormVisible: false,
      resetPwdForm: {
        newPassword: ''
      },
      curOptReltkObj: {},
      curNotInBatchNoList: [],
      bottomBatchNoList: [],
      records: [],
      oldRecords: [],
      checkObj: {
        type: 'add'
      },
      // 原辅料list
      matIds: [],
      planId: ''
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-auto-compatibility': AutoCompatibility
  },
  created () {
    this.checkObj.type = this.$route.query.type
    this.checkObj.id = this.$route.query.data
    if (this.checkObj.type === 'queryList' || this.checkObj.type === 'list') {
      this.getPhchPlanById()
    } else if (this.checkObj.type === 'queryPlan' || this.checkObj.type === 'plan') {
      this.getPhchPickRecordById()
    }
    (this.checkObj.type === 'list') && (this.postForm.pickDate = this.getNowDate(new Date()))
    // 获取产废单位
    this.enterpriseListEnt()
    // 获取仓库
    this.getListStorage()
    // 获取原辅料
    this.phyListMaterial()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  methods: {
    getRowKeys (row) {
      return row.selfKey
    },
    getNowDate (time) {
      time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' 00:00:00'
      return time
    },
    cancelData () {
      let defaultTabName
      if (this.checkObj.type === 'queryList' || this.checkObj.type === 'list') {
        defaultTabName = 'list'
      } else if (this.checkObj.type === 'queryPlan' || this.checkObj.type === 'plan') {
        defaultTabName = 'plan'
      }
      this.$router.push({
        path: '/pendingMaterialSolutions',
        query: {
          defaultTabName: defaultTabName
        }
      })
    },
    saveData (formName) {
      var vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (vm.bottomRecords && vm.bottomRecords.length && vm.records && vm.records.length) {
            let phchPackageDetailVOList = []
            vm.bottomRecords.forEach(item => {
              for (var i = 0; i < item.packageList.length; i++) {
                phchPackageDetailVOList.push(item.packageList[i])
              }
            })
            let postData = {
              entId: localStorage.getItem('id'),
              usedqty: vm.usedqty,
              dealDesc: vm.dealDesc,
              remark: vm.postForm.remark,
              pickDate: vm.postForm.pickDate,
              phchMaterialDetailVOList: vm.records,
              phchPackageDetailVOList: phchPackageDetailVOList
            }
            if (vm.checkObj.type === 'list') {
              postData.planId = vm.checkObj.id
            } else if (vm.checkObj.type === 'plan') {
              postData.id = vm.checkObj.id
            }
            let params = {
              ticket: localStorage.getItem('token')
            }
            vm.saveLoading = true
            savePhchPickRecord(postData, params)
              .then(res => {
                COMMONJS.showToast('保存成功')
                vm.saveLoading = false
                vm.$router.push({
                  path: '/pendingMaterialSolutions',
                  query: {
                    defaultTabName: 'plan'
                  }
                })
              }).catch(() => {})
          } else {
            COMMONJS.showToast('请选择包装与原辅料！', 'warning')
          }
        }
      })
    },
    getTopRowClassName ({
      row,
      rowIndex
    }) {
      if (!row.isShowTopExpand) {
        return 'row-expand-cover'
      }
    },
    expandBottomChange (row, expandedRows) {
      if (this.expandBottomKeys.indexOf(row.batchno) >= 0) {
        this.expandBottomKeys.shift()
      } else {
        this.expandBottomKeys.splice(0, 1, row.selfKey)
      }
    },
    expandChange (row, expandedRows) {
      if (~this.expandKeys.indexOf(row.selfKey)) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getSubRecords(row, expandedRows)
    },
    getSubRecords (row, expandedRows) {
      this.expandKeys.splice(0, 1, row.selfKey)
    },
    toBottomClick () {
      if (!this.bottomRecords || !this.bottomRecords.length) {
        this.changeZoom('close')
      }
      let vm = this

      let tempBottomItem = vm.bottomRecords.findIndex(
        item => item.selfKey === vm.expandKeys[0]
      )
      if (~tempBottomItem) {
        vm.multipleSubSelection.forEach(item => {
          item.pick = '已领'
          vm.bottomRecords[tempBottomItem].packageList.push(item)
          vm.bottomRecords.splice(tempBottomItem, 1, vm.bottomRecords[tempBottomItem])
        })
      } else {
        let parentItem = JSON.parse(JSON.stringify(vm.topRecords.filter(
          item => item.selfKey === vm.expandKeys[0]
        )))
        if (parentItem && parentItem.length) {
          vm.multipleSubSelection.forEach(item => { item.pick = '已领' })
          parentItem[0].packageList = vm.multipleSubSelection
          vm.bottomRecords.push(parentItem[0])
        }
      }

      vm.multipleSubSelection.forEach(element => {
        // 从下方的table数组中移除
        vm.topRecords.forEach((item, indx) => {
          var i = item.packageList.findIndex(n => n.batchno === element.batchno)
          if (~i) {
            item.packageList.splice(i, 1)
            if (item.packageList && item.packageList.length === 0) {
              vm.topRecords.splice(indx, 1)
            }
          }
        })
      })
      // 初始化bottom选中项
      vm.multipleSubSelection = []
      // vm.multipleSubSelection.forEach(item => {
      //   vm.bottomBatchNoList.push(item.batchno)
      // })
      // vm.refreshSubTable()
    },
    toTopClick () {
      var vm = this
      let tempTopItem = vm.topRecords.findIndex(
        item => item.selfKey === vm.expandBottomKeys[0]
      )
      if (~tempTopItem) {
        vm.multipleBottomSubSelection.forEach(item => {
          item.pick = '未领'
          vm.topRecords[tempTopItem].packageList.push(item)
          vm.topRecords.splice(tempTopItem, 1, vm.topRecords[tempTopItem])
        })
      } else {
        let parentItem = JSON.parse(JSON.stringify(vm.topRecords.filter(
          item => item.selfKey === vm.expandBottomKeys[0]
        )))
        if (parentItem && parentItem.length) {
          vm.multipleBottomSubSelection.forEach(item => { item.pick = '未领' })
          parentItem[0].packageList = vm.multipleBottomSubSelection
          vm.topRecords.push(parentItem[0])
        }
      }

      vm.multipleBottomSubSelection.forEach(element => {
        var index = vm.bottomBatchNoList.findIndex(item => item === element.batchno)
        if (~index) {
          vm.bottomBatchNoList.splice(index, 1)
        }
        // 从下方的table数组中移除
        vm.bottomRecords.forEach((item, indx) => {
          var i = item.packageList.findIndex(n => n.batchno === element.batchno)
          if (~i) {
            item.packageList.splice(i, 1)
            if (item.packageList && item.packageList.length === 0) {
              vm.bottomRecords.splice(indx, 1)
            }
          }
        })
      })
      // 初始化bottom选中项
      vm.multipleBottomSubSelection = []
      // vm.refreshSubTable()

      // vm.multipleBottomSubSelection.forEach(element => {
      //   // 从全局的批次号数组中移除
      //   var index = vm.curNotInBatchNoList.findIndex(item => item === element.batchno)
      //   if (index > -1) {
      //     vm.curNotInBatchNoList.splice(index, 1)
      //   }
      //   // 从下方的table数组中移除
      //   vm.bottomRecords.forEach(item => {
      //     var i = item.subRecords.findIndex(n => n.batchno === element.batchno)
      //     if (i > -1) {
      //       item.subRecords.splice(i, 1)
      //     }
      //   })
      // })
      // vm.bottomRecords = vm.bottomRecords.filter(element => (element.subRecords && element.subRecords.length > 0))
      // // 重新计算配伍结果
      // vm.doValue()
      // vm.getData()
      // vm.multipleBottomSubSelection = []
    },
    thirdCardClick () {
      var vm = this
      if (vm.isRightExpand) {
        vm.changeZoom('open')
      } else {
        vm.changeZoom('close')
      }
      // vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
    },
    firstCardClick () {
      var vm = this
      if (vm.isLeftExpand) {
        vm.firstCardCols = 1
        vm.isLeftExpand = false
      } else {
        vm.firstCardCols = 6
        vm.isLeftExpand = true
      }
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
    },
    headClass ({
      row,
      rowIndex
    }) {
      return 'background:#F8F8F9;color:#8F99A2'
    },
    getPointLevelList () {
      var vm = this
      vm.pointList.forEach((element, index) => {
        vm.pointLevelList.push({
          code: index + 1,
          name: (index + 1) + '级'
        })
      })
    },
    listStorage () {
      let _this = this
      let postData = {
        ticket: localStorage.getItem('token'),
        valid: 1
      }
      listStorage(postData)
        .then(res => {
          _this.warehouseList = res.data
        }).catch(() => {})
    },
    listCompatibilityTemplate () {
      let _this = this
      let postData = {
        ticket: localStorage.getItem('token'),
        valid: 1
      }
      listCompatibilityTemplate(postData)
        .then(res => {
          _this.templateList = res.data
          if (_this.templateList && _this.templateList.length > 0) {
            _this.addForm.templateId = _this.templateList[_this.templateList.length - 1].id
            // 加载参数列表
            _this.pointLoading = true
            listParam({
              ticket: localStorage.getItem('token'),
              id: _this.addForm.templateId
            })
              .then(res => {
                _this.pointList = res.data
                _this.getPointLevelList()
                _this.pointLoading = false
              }).catch(() => {})
            _this.getData()
          } else {
            COMMONJS.showToast('请设置配伍模板！', 'error')
          }
        }).catch(() => {})
    },
    queryEntNameAsync (queryString, cb) {
      var vm = this
      var cusList = vm.cusList
      var results = queryString ? cusList.filter(this.createStateFilter(queryString)) : cusList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      var vm = this
      vm.addForm.baseCustomerCusCode = item.id
      vm.addForm.cusId = item.id
      vm.addForm.prodEntName = item.value
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    autoData () {
      var vm = this
      if (vm.addForm.compQuantity && vm.addForm.compQuantity != '') {
        if (isNaN(parseFloat(vm.addForm.compQuantity))) {
          COMMONJS.showToast('请正确填写配伍量！', 'warning')
          return
        }
        vm.checkObjP = {
          templateId: vm.addForm.templateId,
          compQuantity: vm.addForm.compQuantity,
          pointList: vm.pointList,
          isExistManualResult: !!(vm.bottomRecords && vm.bottomRecords.length > 0)
        }
        vm.dialogFormVisible = true
      } else {
        COMMONJS.showToast('请填写配伍量！', 'warning')
      }
    },
    getData () {
      let _this = this
      _this.loading = true
      // let postData = {
      //   ticket: localStorage.getItem('token'),
      //   planNo: _this.queryForm.planNo,
      //   current: _this.page.current,
      //   size: _this.page.size,
      //   templateId: _this.addForm.templateId,
      //   reltkcode: _this.addForm.reltkcode,
      //   prodEntName: _this.state,
      //   storageId: _this.addForm.storageId,
      //   exceptBatchNoStr: _this.curNotInBatchNoList && _this.curNotInBatchNoList.length > 0 ? _this.curNotInBatchNoList
      //     .join('\'\',\'\'') : ''
      // }
      let postData = {
      }
      let params = {
        current: _this.page.current,
        size: _this.page.size,
        storageId: _this.queryForm.storageId,
        reltkcode: _this.queryForm.reltkcode,
        prodEntName: _this.queryForm.prodEntName,
        ticket: localStorage.getItem('token')
      }
      // _this.pointList.forEach(element => {
      //   if (element.start && element.start != '') {
      //     postData[element.param + 'Start'] = element.start
      //     postData[element.param + 'Id'] = element.param
      //   }
      //   if (element.end && element.end != '') {
      //     postData[element.param + 'End'] = element.end
      //     postData[element.param + 'Id'] = element.param
      //   }
      // })
      getListInvcurOfPhysicochemical(postData, params)
        .then(res => {
          _this.topRecords = res.data.records
          _this.topRecords.forEach(element => {
            element.selfKey = element.entId + ' ' + element.matId + ' ' + element.reltkcode
          })
          // // 存在展开的就刷新下子table
          if (_this.expandKeys && _this.expandKeys.length) {
            _this.refreshSubTable()
          }
          _this.page.total = res.data.total
          _this.loading = false
        }).catch(() => {
          _this.loading = false
        })
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
    },
    refreshSubTable () {
      var vm = this
      vm.subLoading = true
      vm.packageList = []
      phyListInvcurOftransferPackage({}, {
        ticket: localStorage.getItem('token'),
        entId: vm.expandKeys[0].split(' ')[0],
        matId: vm.expandKeys[0].split(' ')[1],
        reltkcode: vm.expandKeys[0].split(' ')[2],
        size: vm.topSubPage.size,
        current: vm.topSubPage.current,
        exceptBatchNoStr: vm.bottomBatchNoList && vm.bottomBatchNoList.length > 0 ? vm.bottomBatchNoList.join(
          '\'\',\'\'') : ''
      })
        .then(res => {
          vm.packageList = res.data.records
          vm.topSubPage.total = res.data.total
          vm.subLoading = false
          if (vm.topSubPage.total === 0) {
            // 隐藏上方table 的expand
            vm.topRecords.forEach(element => {
              if (vm.curOptReltkObj.reltkcode && vm.curOptReltkObj.reltkcode === element.reltkcode) {
                // 收起上传table的expand
                if (vm.expandKeys.indexOf(element.selfKey) >= 0) {
                  // 收起当前行
                  vm.expandKeys.shift()
                  element.isShowTopExpand = false
                  // 刷新父级table过滤掉没有包装的联单
                  vm.getData()
                }
              }
            })
          }
        }).catch(() => {})
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    jumpTopSubPage (index) {
      this.topSubPage.current = index
      this.refreshSubTable()
    },
    jumpTopSubSize (val) {
      this.topSubPage.size = val
      this.topSubPage.current = 1
      this.refreshSubTable()
    },
    jumpBottomPage (index) {
      this.bottomPage.current = index
      this.getData()
    },
    jumpBottomSize (val) {
      this.bottomPage.size = val
      this.bottomPage.current = 1
      this.getData()
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    handleBottomSelectionChange (val) {
      var vm = this
      vm.multipleBottomSelection = val
      // vm.multipleBottomSelection.forEach(element => {
      //   vm.toggletBottomSubSelection(element.packageList);
      // });
    },
    handleBottomSubSelectionChange (val) {
      var vm = this
      val.forEach(element => {
        var index = vm.multipleBottomSubSelection.findIndex(item => item.batchno === element.batchno)
        if (index == -1) {
          vm.multipleBottomSubSelection.push(element)
        }
      })
    },
    handleSubSelectionChange (val) {
      var vm = this
      vm.multipleSubSelection = val
      // if (vm.multipleSubSelection && vm.multipleSubSelection.length > 0) {
      //   vm.toBottomBtnFlag = false
      // } else {
      //   vm.toBottomBtnFlag = true
      // }
    },
    handleSelectionChange (val) {
      var vm = this
      vm.multipleSelection = val
      if (vm.multipleSelection && vm.multipleSelection.length > 0) {
        vm.toBottomBtnFlag = false
      } else {
        vm.toBottomBtnFlag = true
      }
      // 选择联单将下面的包装当前页的所有数据默认都勾上
      // vm.toggletTopSubSelection(vm.packageList);
    },
    toggletTopSubSelection (rows) {
      if (rows) {
        rows.forEach(element => {
          this.$refs.multipleTopSubTable.toggleRowSelection(element)
        })
      } else {
        this.$refs.multipleTopSubTable.clearSelection()
      }
    },
    toggletBottomSubSelection (rows) {
      if (rows) {
        rows.forEach(element => {
          this.$refs.multipleBottomSubTable.toggleRowSelection(element)
        })
      } else {
        this.$refs.multipleBottomSubTable.clearSelection()
      }
    },
    enterpriseListEnt () {
      let _this = this
      let postData = {}
      let params = {
        ticket: localStorage.getItem('token')
      }
      enterpriseListEnt(postData, params)
        .then(res => {
          _this.prodEntNames = res.data
        }).catch(() => {
        })
    },
    getListStorage () {
      let _this = this
      let postData = {}
      let params = {
        ticket: localStorage.getItem('token')
      }
      getListStorage(postData, params)
        .then(res => {
          _this.storageIds = res.data
        }).catch(() => {
        })
    },
    phyListMaterial () {
      let _this = this
      let postData = {}
      let params = {
        ticket: localStorage.getItem('token')
      }
      phyListMaterial(postData, params)
        .then(res => {
          _this.matIds = res.data
        }).catch(() => {
        })
    },
    getPhchPlanById () {
      let _this = this
      let postData = {
        id: _this.checkObj.id
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      getPhchPlanById(postData, params)
        .then(res => {
          if (res.data.compatibilityTransferBillVOList && res.data.compatibilityTransferBillVOList.length) {
            _this.topRecords = res.data.compatibilityTransferBillVOList
            _this.topRecords.forEach(element => {
              element.selfKey = element.entId + ' ' + element.matId + ' ' + element.reltkcode
            })
            _this.changeZoom('close')
            // _this.isRightExpand = true
            // _this.thirdCardCols = 6
            // _this.secondCardCols = 24 - _this.firstCardCols - _this.thirdCardCols
          }
          // 处置方案自动添加添加量
          (this.checkObj.type === 'list') && res.data.phchMaterialDetailVOList.forEach(item => { item.addAmount = item.amount })
          _this.records = res.data.phchMaterialDetailVOList
          _this.remark = res.data.remark
          _this.dealDesc = res.data.dealDesc
          _this.qty = res.data.qty
          // 获取已领料总和
          _this.getHasQty()
        }).catch(() => {
        })
    },
    getPhchPickRecordById () {
      let _this = this
      let postData = {
        id: _this.checkObj.id
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      getPhchPickRecordById(postData, params)
        .then(res => {
          if (res.data.compatibilityTransferBillVOList && res.data.compatibilityTransferBillVOList.length) {
            _this.bottomRecords = res.data.compatibilityTransferBillVOList
            _this.bottomRecords.forEach(element => {
              element.selfKey = element.entId + ' ' + element.matId + ' ' + element.reltkcode
            })
            _this.bottomRecords.forEach(item => {
              if (item.packageList && item.packageList.length) {
                for (var i = 0; i < item.packageList.length; i++) {
                  _this.bottomBatchNoList.push(item.packageList[i].batchno)
                }
              }
            })
            _this.planId = res.data.planId
            _this.listTopPhchPickRecord()
            _this.changeZoom('close')
            // _this.isRightExpand = true
            // _this.thirdCardCols = 6
            // _this.secondCardCols = 24 - _this.firstCardCols - _this.thirdCardCols
          }
          _this.records = res.data.phchMaterialDetailVOList
          _this.remark = res.data.remark
          _this.dealDesc = res.data.dealDesc
          _this.qty = res.data.qty
          _this.postForm.pickDate = res.data.pickDate
        }).catch(() => {
        })
    },
    listTopPhchPickRecord () {
      let _this = this
      let postData = {
        planId: _this.planId,
        exceptBatchNoStr: _this.bottomBatchNoList && _this.bottomBatchNoList.length > 0 ? _this.bottomBatchNoList.join(
          '\'\',\'\'') : ''
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listTopPhchPickRecord(postData, params)
        .then(res => {
          _this.topRecords = res.data
          _this.topRecords.forEach(element => {
            element.selfKey = element.entId + ' ' + element.matId + ' ' + element.reltkcode
          })
          // 获取已领料总和
          _this.getHasQty()
        }).catch(() => {
        })
    },
    getHasQty () {
      let _this = this
      this.hasQty = 0
      this.bottomRecords.forEach((item, indx) => {
        if (item.packageList && item.packageList.length) {
          for (var i = 0; i < item.packageList.length; i++) {
            if (item.packageList[i].pick === '已领') {
              if (!isNaN(Number(item.packageList[i].actqty))) {
                _this.hasQty += item.packageList[i].actqty
              }
            }
          }
        }
      })
    },
    optContact (data, type, index) {
      switch (type) {
        case 'add':
          data.editFlag = false
          this.records.splice(index, 1, data)
          this.oldRecords.splice(index, 0, JSON.parse(JSON.stringify(data)))
          break
        case 'update':
          this.records[index].editFlag = true
          break
        case 'delete':
          let _this = this
          _this.records.splice(index, 1)
          _this.oldRecords.splice(index, 1)
          break
        case 'cancel':
          if (index < this.oldRecords.length) {
            this.oldRecords[index].editFlag = false
            this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
          }
          break
      }
    },
    changeProjects (item, index) {
      for (var i = 0; i < this.matIds.length; i++) {
        if (item.matId === this.matIds[i].id) {
          // this.matIds[i].editFlag = true
          this.records[index].unit = this.matIds[i].unitName
          this.records[index].matName = this.matIds[i].wasteName
          // this.records.splice(index, 1, JSON.parse(JSON.stringify(this.matIds[i])))
          return
        }
      }
    },
    addProjectItem () {
      if (~this.records.findIndex(item => item.editFlag === true)) {
        COMMONJS.showToast('请先保存添加项', 'warning')
      } else {
        let addObj = {
          matId: '',
          amount: '',
          unit: '',
          editFlag: true
        }
        // this.records.splice(this.records.length, 0, addObj)
        this.records.push(addObj)
      }
    },
    changeZoom (type) {
      let _this = this
      if (type === 'open') {
        this.thirdCardCols = 1
        setTimeout(() => {
          _this.isRightExpand = false
        }, 300)
      } else {
        this.thirdCardCols = 6
        setTimeout(() => {
          _this.isRightExpand = true
        }, 300)
      }
      this.secondCardCols = 24 - this.firstCardCols - this.thirdCardCols
    },
    selectable (row, index) {
      if (row.pick === '未领') {
        return true
      } else {
        return false
      }
    },
    checkInput (data) {
      if (this.checkNum(data.addAmount)) {
        if (data.addAmount > data.amount) {
          data.addAmount = 0
          COMMONJS.showToast('请勿输入大于本项添加量的最大值', 'warning')
        }
      } else {
        data.addAmount = 0
        COMMONJS.showToast('请输入数字', 'warning')
      }
    },
    checkNum (num) {
      let reg = /^\d+(\.\d+)?$/
      return reg.test(num)
    }
  },
  computed: {
    usedqty () {
      let totalQty = 0
      this.bottomRecords.forEach(item => {
        for (var i = 0; i < item.packageList.length; i++) {
          if (!isNaN(Number(item.packageList[i].actqty))) {
            totalQty += item.packageList[i].actqty
          }
        }
      })
      return totalQty
    }
  }
}

</script>

<style lang="scss">
  .card-items{
    height: 100%;
    overflow-y: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    .card-item{
      display: flex;
      flex-direction: column;
      .card-item-header{
        border-bottom: 1px solid #EBEEF5;
        padding: 18px 20px;
      }
      .card-item-content{
        padding: 20px;
      }
    }
  }
  .btn-group{
    text-align: left;
    .a-btn{
      padding: 0;
    }
  }
  .cardTitle {
    border-left: 2px solid #40C3AB;
    padding-left: 20px;
    float: left;

  }

  .cardContent {
    width: 100%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    height: calc(100% - 0px);
    overflow-y: auto !important;
    border-top: none;
  }

  .item-header {
    padding: 13px 0;
    border-bottom: 1px solid #EEEEEE;
  }
  .item-header .item-header-text {
    text-align: left;
    padding-left: 20px;
    border-left: 2px solid #40C3AB;
    color: #555D66;
    font-size: 16px;
  }

  .topBottomCls {
    margin-bottom: 20px;

  }

  .topBottomCls i {
    font-weight: bold;
  }

  .business-license {
    .el-form-item__content {
      text-align: center;
    }
  }

  .dialog-title {
    float: left;
  }

  .shousuo {
    cursor: pointer;
    float: right;
    color: #40C3AB;
  }

  .divCard {
    height: 100%;
    background-color: #DDE1E7;
  }

  .divCard .cardRow {
    height: 100%
  }

  .divCard .cardRow .cardRol {
    height: 100%;
    padding-left: 3px !important;
    padding-right: 3px !important;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    -ms-transition: all 0.5s;
    -o-transition: all 0.5s;
    transition: all 0.5s;
    white-space: nowrap;
  }

  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }

  .el-form-item__content {
    text-align: left;
  }

</style>
