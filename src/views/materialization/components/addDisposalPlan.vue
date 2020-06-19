<template>
  <div class="divCard">
    <el-row class="cardRow" :gutter="24">
      <el-col class="cardRol" :span="secondCardCols">
        <el-card class="box-card">
          <div class="cardContent">
            <div class="item-header">
              <div class="item-header-text">待领区域</div>
            </div>
            <el-table size="mini" :row-key="getRowKeys" :expand-row-keys="expandKeys" @expand-change="expandChange"
                      height="350" v-loading="loading" border :header-cell-style="headClass" stripe ref="multipleTopTable" :data="topRecords"
                      style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" v-loading="subLoading" border :header-cell-style="headClass" stripe ref="multipleTopSubTable" :data="packageList"
                            style="width: 100%" height="150" @selection-change="handleSubSelectionChange">
                    <el-table-column v-if="checkObj.type!=='query'" type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="storage" label="仓库">
                    </el-table-column>
                  </el-table>
                  <div class="block" v-if="packageList&&packageList.length>0">
                    <v-pagination :current="topSubPage.current" :sizes="topSubPage.sizes" :size="topSubPage.size" :total="topSubPage.total" @reloadPage="jumpTopSubPage"
                                  @reloadSize="jumpTopSubSize"></v-pagination>
                  </div>
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
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
            </div>
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
            <el-table height="350" size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomTable" :data="bottomRecords"
                      style="width: 100%" @selection-change="handleBottomSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomSubTable" :data="props.row.packageList"
                            style="width: 100%" height="150" @selection-change="handleBottomSubSelectionChange">
                    <el-table-column v-if="checkObj.type!=='query'" type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="storage" label="仓库">
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
              <span class="cardTitle" v-if="isRightExpand">查询条件</span>
              <i @click="thirdCardClick" v-if="isRightExpand" class="shousuo el-icon-d-arrow-right"></i>
              <i @click="thirdCardClick" v-else class="shousuo el-icon-d-arrow-left"></i>
            </div>
            <div class="card-item-content" v-if="isRightExpand">
              <el-form ref="form" :model="queryForm" :rules="formRules" label-width="85px">
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="产废单位：">
                          <el-select v-model="queryForm.prodEntName" clearable filterable
                                     placeholder="请选择产废单位">
                            <el-option
                                    v-for="item in prodEntNames"
                                    :key="item.guid"
                                    :label="item.cusname"
                                    :value="item.cusname">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="仓库：">
                          <el-select v-model="queryForm.storageId" clearable filterable
                                     placeholder="请选择仓库">
                            <el-option
                                    v-for="item in storageIds"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="联单号：">
                          <el-input v-model="queryForm.reltkcode"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <div class="business-license">
                          <el-button :loading="saveLoading" size="small" type="primary" @click="queryData">查询</el-button>
                        </div>
                      </el-col>
                    </el-row>
              </el-form>
            </div>
          </div>
          <div class="card-item">
            <div class="card-item-header" v-if="isRightExpand">
              <span class="cardTitle">处置方案</span>
            </div>
            <div class="card-item-content" v-if="isRightExpand">
              <el-form ref="form" :model="postForm" :rules="formRules" label-width="85px">
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <div class="btn-group">
                          <!--<el-link type="primary">添加原辅料<i class="el-icon-circle-plus-outline"></i> </el-link>-->
                          <el-button icon="el-icon-circle-plus-outline" size="mini" type="primary" plain :disabled="checkObj.type==='query'" @click="addProjectItem">添加原辅料</el-button>
                        </div>
                        <el-table
                                :data="records"
                                style="width: 100%"
                                element-loading-background="rgba(0, 0, 0, 0.8)"
                                row-key="id"
                                lazy>
                          <el-table-column
                                  prop="name"
                                  label="原辅料">
                            <template slot-scope="scope">
                              <el-select v-if="scope.row.editFlag" v-model="scope.row.matId" clearable filterable @change="changeProjects(scope.row, scope.$index)">
                                <el-option
                                        v-for="item in matIds"
                                        :key="item.id"
                                        :label="item.wasteName"
                                        :value="item.id">
                                </el-option>
                              </el-select>
                              <span v-if="!scope.row.editFlag">{{scope.row.matName}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                                  prop="amount"
                                  label="添加量">
                            <template slot-scope="scope">
                              <el-input v-if="scope.row.editFlag" v-model="scope.row.amount"></el-input>
                              <span v-if="!scope.row.editFlag">{{scope.row.amount}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                                  prop="unit"
                                  label="单位">
                          </el-table-column>
                          <el-table-column
                                  prop="operation"
                                  label="操作"
                                  align="center">
                            <template slot-scope="scope">
                              <div v-if="!scope.row.editFlag">
                                <el-button type="text" @click="optContact(scope.row, 'update', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">编辑</el-button>
                                <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
                                <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
                                <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
                              </div>
                              <div v-if="scope.row.editFlag">
                                <el-button type="text" @click="optContact(scope.row, 'add', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">保存</el-button>
                                <el-button type="text" @click="optContact(scope.row, 'cancel', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">取消</el-button>
                                <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">保存</span>-->
                                <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">取消</span>-->
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="已选择量：">
                          <el-input :disabled="true" v-model="qty"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="处置说明：">
                          <el-input type="textarea" v-model="postForm.dealDesc" :disabled="checkObj.type==='query'"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <el-form-item label="备注：">
                          <el-input type="textarea" v-model="postForm.remark" :disabled="checkObj.type==='query'"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="100">
                      <el-col :span="24">
                        <div class="business-license">
                          <el-button v-if="checkObj.type!=='query'" :loading="saveLoading" size="small" type="primary" @click="saveData('postForm')">保存</el-button>
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
  enterpriseListEnt,
  getListStorage,
  getListInvcurOfPhysicochemical,
  phyListInvcurOftransferPackage,
  phyListMaterial,
  savePhchPlan,
  getPhchPlanById
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
      // postData
      // qty: '',
      postForm: {
        remark: '',
        dealDesc: ''
      },
      prodEntNames: [],
      storageIds: [],
      formRules: {},
      saveLoading: false,
      toBottomBtnFlag: true,
      toTopBtnFlag: true,
      subLoading: false,
      expandKeys: [],
      expandBottomKeys: [],
      loading: false,
      pointLoading: false,
      firstCardCols: 0,
      secondCardCols: 23,
      thirdCardCols: 1,
      isLeftExpand: false,
      isRightExpand: false,
      state: '',
      defaultTabName: 'first',
      cusList: [],
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
      matIds: []
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-auto-compatibility': AutoCompatibility
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
  created () {
    this.checkObj.type = this.$route.query.type
    this.checkObj.id = this.$route.query.data
    if (this.checkObj.type !== 'add') {
      this.getPhchPlanById()
    }
    // 获取产废单位
    this.enterpriseListEnt()
    // 获取仓库
    this.getListStorage()
    // 获取原辅料
    this.phyListMaterial()
    this.getData()
  },
  methods: {
    getRowKeys (row) {
      return row.selfKey
    },
    cancelData () {
      this.$router.push({
        path: '/disposalPlan'
      })
    },
    checkRecords (data) {
      debugger
      for (var i = 0; i < data.length; i++) {
        if (!data[i].matId || !data[i].amount || data[i].editFlag) {
          COMMONJS.showToast('请保存原辅料及内容信息！', 'warning')
          return false
        }
      }
      return true
    },
    saveData () {
      var vm = this
      if (vm.bottomRecords && vm.bottomRecords.length && vm.records && vm.records.length) {
        if (vm.checkRecords(vm.records)) {
          let phchPackageDetailVOList = []
          vm.bottomRecords.forEach(item => {
            for (var i = 0; i < item.packageList.length; i++) {
              phchPackageDetailVOList.push(item.packageList[i])
            }
          })
          let postData = {
            entId: localStorage.getItem('id'),
            id: vm.checkObj.id,
            qty: vm.qty,
            remark: vm.postForm.remark,
            dealDesc: vm.postForm.dealDesc,
            phchMaterialDetailVOList: vm.records,
            phchPackageDetailVOList: phchPackageDetailVOList
          }
          let params = {
            ticket: localStorage.getItem('token')
          }
          vm.saveLoading = true
          savePhchPlan(postData, params)
            .then(res => {
              COMMONJS.showToast('保存成功')
              vm.saveLoading = false
              vm.$router.push({
                path: '/disposalPlan'
              })
            }).catch(() => {})
        }
      } else {
        COMMONJS.showToast('请填写完整包装与原辅料！', 'warning')
      }
    },
    expandBottomChange (row, expandedRows) {
      if (this.expandBottomKeys.indexOf(row.batchno) >= 0) {
        this.expandBottomKeys.shift()
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
      var vm = this
      vm.subLoading = true
      vm.packageList = []
      vm.topSubPage = {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
      }
      phyListInvcurOftransferPackage({}, {
        ticket: localStorage.getItem('token'),
        reltkcode: row.reltkcode,
        matId: row.matId,
        entId: row.entId,
        size: vm.topSubPage.size,
        current: vm.topSubPage.current,
        exceptBatchNoStr: vm.bottomBatchNoList && vm.bottomBatchNoList.length > 0 ? vm.bottomBatchNoList.join(
          '\'\',\'\'') : ''
      })
        .then(res => {
          vm.packageList = res.data.records
          vm.topSubPage.total = res.data.total
          vm.subLoading = false
          // vm.expandKeys.shift() /** 新增 **/
          vm.expandKeys.splice(0, 1, row.selfKey)
        }).catch(() => {})
      // if (expandedRows.length > 1) {
      //   // 只展开当前选项
      //   expandedRows.shift()
      // }
    },
    getNowDate (time) {
      time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' 00:00:00'
      return time
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
          vm.bottomRecords[tempBottomItem].packageList.push(item)
          vm.bottomRecords.splice(tempBottomItem, 1, vm.bottomRecords[tempBottomItem])
        })
      } else {
        let parentItem = vm.topRecords.filter(
          item => item.selfKey === vm.expandKeys[0]
        )
        if (parentItem && parentItem.length) {
          parentItem[0].packageList = vm.multipleSubSelection
          vm.bottomRecords.push(parentItem[0])
        }
      }
      vm.multipleSubSelection.forEach(item => {
        vm.bottomBatchNoList.push(item.batchno)
      })
      vm.refreshSubTable()
    },
    toTopClick () {
      var vm = this
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
      vm.refreshSubTable()
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
    getData () {
      let _this = this
      _this.loading = true
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
      if (vm.expandKeys && vm.expandKeys.length) {
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
      }
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
    reloadP (callBackData) {
      // 覆盖自动配伍结果到下方的已选择区
      var vm = this
      vm.bottomRecords = []
      // 将手动选择的批次号先清空，再加入自动配伍的批次
      vm.curNotInBatchNoList = []
      callBackData.autoTopRecords.forEach(element => {
        element.packageList = element.packageList
        element.packageList.forEach(subItem => {
          vm.curNotInBatchNoList.push(subItem.batchno)
        })
        element.actqty = element.qty
        vm.bottomRecords.push(element)
      })
      // 设置自动配伍结果
      if (callBackData.resultForm) {
        if (callBackData.resultForm.pointList) {
          vm.pointList.forEach(element => {
            var index = callBackData.resultForm.pointList.findIndex(item => item.param === element.param)
            if (index > -1) {
              element.resultValue = callBackData.resultForm.pointList[index]['resultValue']
            }
          })
          vm.resultForm.compQuantity = callBackData.resultForm.compQuantity
        }
        vm.autoResultFlag = true
        vm.getData()
      }
      // 展开第三个卡片
      vm.thirdCardCols = 6
      vm.isRightExpand = true
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
      vm.dialogFormVisible = false
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
            _this.bottomRecords = res.data.compatibilityTransferBillVOList
            _this.changeZoom('close')
            // _this.isRightExpand = true
            // _this.thirdCardCols = 6
            // _this.secondCardCols = 24 - _this.firstCardCols - _this.thirdCardCols
          }
          _this.records = res.data.phchMaterialDetailVOList
          _this.postForm.remark = res.data.remark
          _this.postForm.dealDesc = res.data.dealDesc
        }).catch(() => {
        })
    },
    optContact (data, type, index) {
      let _this = this
      switch (type) {
        case 'add':
          if (data.matId && data.amount) {
            data.editFlag = false
            this.records.splice(index, 1, JSON.parse(JSON.stringify(data)))
            this.oldRecords.splice(index, 0, JSON.parse(JSON.stringify(data)))
          } else {
            COMMONJS.showToast('请填写完整包装与原辅料信息', 'warning')
          }
          break
        case 'update':
          data.editFlag = true
          this.records.splice(index, 1, JSON.parse(JSON.stringify(data)))
          this.oldRecords.splice(index, 1, JSON.parse(JSON.stringify(data)))
          // this.records[index].editFlag = true
          break
        case 'delete':
          this.records.splice(index, 1)
          this.oldRecords.splice(index, 1)
          break
        case 'cancel':
          if (data.matId || data.amount) {
            this.oldRecords[index].editFlag = false
            this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
          } else {
            this.records.splice(index, 1)
            this.oldRecords.splice(index, 1)
          }
          break
      }
    },
    changeProjects (item, index) {
      for (var j = 0; j < this.records.length; j++) {
        if ((this.records[j].matId === item.matId) && (j !== index)) {
          COMMONJS.showToast('该项已存在请重新选择', 'warning')
          item.matId = ''
          return
        }
      }
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
    }
  },
  computed: {
    qty () {
      let totalQty = 0
      this.bottomRecords.forEach(item => {
        for (var i = 0; i < item.packageList.length; i++) {
          if (!isNaN(Number(item.packageList[i].actqty))) {
            totalQty += item.packageList[i].actqty
          }
        }
      })
      return parseFloat(parseFloat(totalQty || 0).toFixed(2))
    }
  }
}

</script>

<style lang="scss">
  table .el-button{
    padding: 0;
  }
  .divCard{
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
  }
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
        .el-table{
          margin-bottom: 22px;
        }
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
  .divCard .el-card{
    border: none;
  }
</style>
