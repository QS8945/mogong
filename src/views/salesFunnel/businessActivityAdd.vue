<template>
  <div class="bussiness-info" v-loading="loading">
    <el-button class="back-to-customer" type="text" @click="backToCustomer" plain>
      <span class="icon iconfont iconfanhui"></span>返回
    </el-button>
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">客户基本信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="客户编号：">
                <el-input v-model="form.code" disabled placeholder="保存客户基本信息后自动生成"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="客户名称：" :prop="(checkObj.type==='query') ? '' : 'name'">
                <el-input v-model="form.name" :disabled="checkObj.type==='query'" placeholder="请输入客户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户简称：">
                <el-input v-model="form.abbreviation" :disabled="checkObj.type==='query'"
                          placeholder="请输入客户简称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item v-if="cantonVisible" label="区域" :prop="(checkObj.type==='query') ? '' : 'cantonName'">
                <v-canton :disabled="checkObj.type==='query'" :cantonName="form.cantonName" :cantonPlaceholder="'请选择区域'"
                          @changeCantonName="changeCantonNameP"></v-canton>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="cantonVisible" label="片区" :prop="(checkObj.type==='query') ? '' : 'salesAreaName'">
                <v-canton :disabled="checkObj.type==='query'" :cantonName="form.salesAreaName"
                          :cantonPlaceholder="'请选择片区'" @changeCantonName="changeCantonNameArea"></v-canton>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="年产废量：" :prop="(checkObj.type==='query') ? '' : 'wasteProductionAmt'">
                <el-input v-model="form.wasteProductionAmt" :disabled="checkObj.type==='query'" placeholder="请输入年产废量">
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前库存量：" :prop="(checkObj.type==='query') ? '' : 'currentStorageAmt'">
                <el-input v-model="form.currentStorageAmt" :disabled="checkObj.type==='query'" placeholder="请输入当前库存量">
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100" v-if="checkObj.type!=='query'">
            <el-col :span="24">
              <el-form-item class="business-license">
                <el-button :loading="saveLoading" type="primary" @click="saveData('form')">保存</el-button>
                <el-button @click="cancelData">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isShowLine">
          <div class="item-header">
            <div class="item-header-text">客户联系人信息</div>
          </div>
          <div class="item-body">
            <div class="table-content">
              <div style="text-align:left;">
                <el-button icon="el-icon-plus" type="primary" size="mini" @click="addBusinessActivityContract">新增联系人
                </el-button>
                <el-button icon="el-icon-close" :disabled="!(multipleSelection&&multipleSelection.length>0)" size="mini"
                           @click="delBusinessActivityContract">删除联系人
                </el-button>
              </div>
              <el-table size="mini" :header-cell-style="headClass" stripe ref="multipleTable" :data="tableData"
                        style="width: 100%" height="250"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column align="center" prop="customerContact" label="联系人" width="150">
                </el-table-column>
                <el-table-column align="center" prop="customerContactPhone" label="联系电话" width="150">
                </el-table-column>
                <el-table-column align="center" prop="contactEmail" label="邮箱" width="150">
                </el-table-column>
                <el-table-column align="center" prop="deptName" label="所属部门" width="120">
                </el-table-column>
                <el-table-column align="center" prop="contactPosition" label="职位" width="150">
                </el-table-column>
                <el-table-column align="center" prop="principal" label="是否主要联系人" width="90">
                  <template slot-scope="scope">
                    <span>{{scope.row.principal==1?'是':'否'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="remark" label="备注">
                </el-table-column>
              </el-table>
              <div class="block">
                <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total"
                              @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
              </div>
            </div>
          </div>

          <div class="item-header">
            <div class="item-header-text">客户危废信息</div>
          </div>
          <div class="item-body">
            <div class="table-content">
              <div style="text-align:left;">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBusinessActivityWaste">新增危废
                </el-button>
              </div>
              <el-table size="mini" :header-cell-style="headClass" stripe ref="multipleTable" :data="records"
                        style="width: 100%" height="250"
                        @selection-change="handleSelectionChange">
                <el-table-column align="center" prop="classCode" label="二位码">
                  <template slot-scope="scope">
                    <el-select @change="changeClassCode" v-if="scope.row.editFlag" v-model="scope.row.classCode"
                               clearable filterable>
                      <el-option v-for="item in classCodes" :key="item.code" :label="item.code" :value="item.code">
                      </el-option>
                    </el-select>
                    <span v-if="!scope.row.editFlag">{{scope.row.classCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="wasteCode" label="八位码">
                  <template slot-scope="scope">
                    <el-select @change="changeWasteCode" v-if="scope.row.editFlag" v-model="scope.row.wasteCode"
                               clearable filterable>
                      <el-option v-for="item in wasteCodes" :key="item.code" :label="item.code" :value="item.code">
                      </el-option>
                    </el-select>
                    <span v-if="!scope.row.editFlag">{{scope.row.wasteCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="120" align="center" prop="entWasteName" label="危废俗称">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.editFlag" v-model="scope.row.entWasteName"
                              placeholder="请输入危废俗称"></el-input>
                    <span v-if="!scope.row.editFlag">{{scope.row.entWasteName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="wasteProductionAmt" label="年产废量">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.editFlag" v-model="scope.row.wasteProductionAmt"
                              placeholder="请输入年产废量"></el-input>
                    <span v-if="!scope.row.editFlag">{{scope.row.wasteProductionAmt}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="150" align="center" prop="wasteStorageAmt" label="危废贮存量">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.editFlag" v-model="scope.row.wasteStorageAmt"
                              placeholder="请输入危废贮存量"></el-input>
                    <span v-if="!scope.row.editFlag">{{scope.row.wasteStorageAmt}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="wasteStorageAmt" label="处置方式">
                  <template slot-scope="scope">
                    <el-cascader v-if="scope.row.editFlag" v-model="scope.row.dealType" :options="dealTypeList"
                                 :props="{ multiple: false,value:'id',label:'name'}"
                                 filterable placeholder="请选择处置方式" collapse-tags clearable>
                    </el-cascader>
                    <span v-if="!scope.row.editFlag">{{scope.row.dealTypeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="offerPrice" label="报价">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.baojiaFlag" v-model="scope.row.offerPrice" placeholder="请输入报价"></el-input>
                    <span v-if="!scope.row.baojiaFlag">{{scope.row.offerPrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="80" align="center" prop="containFreight" label="是否包含运费">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.baojiaFlag" v-model="scope.row.containFreight" placeholder="请选择是否包含运费">
                      <el-option key="1" label="是" value="1">
                      </el-option>
                      <el-option key="0" label="否" value="0">
                      </el-option>
                    </el-select>
                    <span v-if="!scope.row.baojiaFlag">{{scope.row.containFreight==1?'是':'否'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="120" prop="freightPrice" label="运费">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.baojiaFlag" v-model="scope.row.freightPrice"
                              placeholder="请输入报价"></el-input>
                    <span v-if="!scope.row.baojiaFlag">{{scope.row.freightPrice}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="100" prop="statusName" label="状态">
                  <!-- <template slot-scope="scope">
                  <span v-html="getWasteStatus(scope.row)"></span>
                </template> -->
                </el-table-column>
                <el-table-column align="center" label="操作" width="188">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.editFlag">
                      <span class="operateBtnCls" @click="optContact(scope.row, 'update', scope.$index)" type="text"
                            size="small">
                        编辑
                      </span>
                      <span class="operateBtnCls" @click="optContact(scope.row, 'delete', scope.$index)" type="text"
                            size="small">
                        删除
                      </span>
                    </div>
                    <div v-if="scope.row.statusName!='待取样'&&!scope.row.editFlag">
                      <span  class="operateBtnCls" @click="optContact(scope.row, 'sampleBill', scope.$index)" type="text"
                            size="small">
                        查看送样单
                      </span>
                    </div>
                    <div v-if="scope.row.editFlag">
                      <span class="operateBtnCls" @click="optContact(scope.row, 'add', scope.$index)" type="text"
                            size="small">
                        保存
                      </span>
                      <span class="operateBtnCls" @click="optContact(scope.row, 'cancel', scope.$index)" type="text"
                            size="small">
                        取消
                      </span>
                    </div>
                    <div v-if="scope.row.statusName=='待取样'">
                      <span class="operateBtnCls" @click="optContact(scope.row, 'songjian', scope.$index)" type="text"
                            size="small">
                        取样送检
                      </span>
                    </div>
                    <div v-if="scope.row.statusName=='待报价'&&!scope.row.baojiaFlag">
                      <span class="operateBtnCls" @click="optContact(scope.row, 'baojia', scope.$index)" type="text"
                            size="small">
                        报价
                      </span>
                    </div>
                    <div v-if="scope.row.statusName=='待报价'&&scope.row.baojiaFlag">
                      <span class="operateBtnCls" @click="optContact(scope.row, 'saveBaoJia', scope.$index)" type="text"
                            size="small">
                        保存报价
                      </span>
                      <span class="operateBtnCls" @click="optContact(scope.row, 'cancel', scope.$index)" type="text"
                            size="small">
                        取消报价
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <v-pagination :current="wastePage.current" :sizes="wastePage.sizes" :size="wastePage.size"
                              :total="wastePage.total" @reloadPage="jumpWastePage"
                              @reloadSize="jumpWasteSize"></v-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" @close="closeNewDialogClick" :close-on-click-modal="false"
                 width="50%">
        <div slot="title" class="dialog-title" style="text-align:left;">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}联系人
          </div>
        </div>
        <v-contacts-add @reload="reloadP" :entRelationId="form.entRelationId" :editContactsData="editContactsData"
                        :addCheckObj="addCheckObj"
                        @changeAddContactsVisible="changeAddContactsVisibleP"></v-contacts-add>
      </el-dialog>
    </div>
    <div>
      <el-dialog :visible.sync="detailInfoVisible" :close-on-click-modal="false" :show-close="false" class="map-dialog">
      <span slot="title" class="title">
        <el-button icon="el-icon-close" size="mini" circle @click="closeDetailInfo"></el-button>
      </span>
        <iframe class="iframe-config" :src="detailInfoUrl"></iframe>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import Pagination from '@/components/pagination'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import ContactsManagement from '@/views/salesFunnel/dialog/contactsManagement'
  import AddContactsManagement from '@/views/salesFunnel/dialog/addContactsManagement'
  import Canton from '@/components/canton'
  import {
    getSysCanton,
    saveBusinessActivityBaseInfo,
    getCodeAndNameDicTree,
    listBusinessActivityContactsInfo,
    editCustomerEnterprise,
    saveBusinessActivityWasteInfo,
    listBusinessActivityWasteInfo,
    updateBusinessActivityWasteInfo,
    getBusinessActivityBaseInfoById,
    getClassCode,
    getWasteCode,
    getSampleAnalysisParam,
    deleteBusinessActivityContactsInfo
  } from '@/assets/js/API/api'

  export default {
    name: 'businessBaseInfo',
    data () {
      return {
        saveLoading: false,
        isShowLine: false,
        loading: true,
        cusId: '',
        dealTypeList: [],
        wasteCodes: [],
        classCodes: [],
        multipleSelection: [],
        dialogFormTitle: '新增',
        dialogFormVisible: false,
        editContactsData: {},
        detailInfoVisible: false,
        detailInfoUrl: '',
        detailInfoUrlParams: {
          action: 'query',
          status: 'agree',
          id: '',
          sampleId: '',
          templateId: '',
          ticket: localStorage.getItem('token')
        },
        addCheckObj: {
          type: 'activityAdd'
        },
        tableData: [],
        records: [],
        oldRecords: [],
        page: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        },
        wastePage: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        },
        cantonVisible: false,
        form: {
          code: '',
          cantonName: [],
          areaCode: [],
          name: '',
          type: '',
          abbreviation: '',
          wasteProductionAmt: 0,
          currentStorageAmt: 0
        },
        formRules: {
          code: [{
            required: true,
            message: '请输入客户编号',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入客户名称',
            trigger: 'change'
          }],
          wasteProductionAmt: [{
            required: true,
            message: '请输入年产废量',
            trigger: 'change'
          }],
          currentStorageAmt: [{
            required: true,
            message: '请输入当前库存量',
            trigger: 'change'
          }]
        },
        checkObj: {
          type: 'add'
        }
      }
    },
    created () {
      this.getData()
      this.getDisClassCode()
      this.getDisWasteCode()
      this.getCodeAndNameDicDispositionType()
    },
    components: {
      'v-canton': Canton,
      'v-pagination': Pagination,
      'v-contacts-management': ContactsManagement,
      'v-contacts-add': AddContactsManagement
    },
    methods: {
      getData () {
        let _this = this
        switch (this.$route.query.type) {
          case 'query':
            this.checkObj.type = this.$route.query.type
            break
          case 'update':
            this.checkObj.type = this.$route.query.type
            break
          case 'add':
            this.loading = false
            this.checkObj.type = this.$route.query.type
            break
        }
        if (this.$route.query.type !== 'add' || (this.form.id && this.form.id != '')) {
          getBusinessActivityBaseInfoById({
            id: _this.$route.query.data ? _this.$route.query.data : _this.form.id,
          })
          .then(res => {
            if (res.data.cantonName) {
              if (Object.prototype.toString.call(res.data.cantonName) !== '[object Array]') {
                res.data.cantonName = JSON.parse(res.data.cantonName)
              }
            } else {
              res.data.cantonName = []
            }
            if (res.data.salesAreaName) {
              if (Object.prototype.toString.call(res.data.salesAreaName) !== '[object Array]') {
                res.data.salesAreaName = JSON.parse(res.data.salesAreaName)
              }
            } else {
              res.data.salesAreaName = []
            }
            if (res.data.cusId) {
              _this.cusId = res.data.cusId
            }
            _this.form = res.data
            _this.cantonVisible = true
            _this.loading = false
            _this.isShowLine = true
          }).catch(() => {
          })
        } else {
          this.cantonVisible = true
        }
        if ((_this.$route.query.data && _this.$route.query.data != '') || (_this.form.id && _this.form.id != '')) {
          listBusinessActivityContactsInfo({
            businessActivityId: _this.$route.query.data ? _this.$route.query.data : _this.form.id,
            current: _this.page.current,
            size: _this.page.size,
          })
          .then(res => {
            _this.tableData = res.data.records
            _this.page.total = res.data.total
          }).catch(() => {
          })
          listBusinessActivityWasteInfo({
            businessActivityId: _this.$route.query.data ? _this.$route.query.data : _this.form.id,
            current: _this.wastePage.current,
            size: _this.wastePage.size,
          })
          .then(res => {
            if ((!res.data.records.length) && (_this.checkObj.type !== 'query')) {
              var addObj = {
                classCode: '',
                wasteCode: '',
                entWasteName: '',
                editFlag: true,
                wasteProductionAmt: 0,
                wasteStorageAmt: 0
              }
              res.data.records.push(addObj)
            } else {
              res.data.records.forEach(function (val, index) {
                val.editFlag = false
                val.baojiaFlag = false
              })
            }
            getCodeAndNameDicTree({
              typeCode: 'dealType'
            })
            .then(res => {
              res.data.records.forEach(function (val, index) {
                val.dealType = COMMONJS.changeDetSelect(val.dealType, res.data)
              })
            }).catch(() => {
            })
            _this.records = JSON.parse(JSON.stringify(res.data.records))
            _this.wastePage.total = res.data.total
            _this.oldRecords = JSON.parse(JSON.stringify(res.data.records))
          }).catch(() => {
          })
        }

      },
      dealTypeChange (data) {
        let vm = this
        vm.addForm.dealTypeId = ''
        if (data.length > 0) {
          vm.addForm.dealTypeId = data[data.length - 1]
        } else {
          vm.addForm.dealTypeId = ''
        }
      },
      closeDetailInfo () {
        this.detailInfoVisible = false
      },
      getCodeAndNameDicDispositionType () {
        let _this = this
        let postData = {
          typeCode: 'dealType'
        }
        getCodeAndNameDicTree(postData)
        .then(res => {
          _this.dealTypeList = res.data
        }).catch(() => {
        })
      },
      getDisClassCode () {
        let _this = this
        getClassCode()
        .then(res => {
          _this.classCodes = res.data
        }).catch(() => {
        })
      },
      changeWasteCode (val) {
        var vm = this
        vm.records.forEach(element => {
          if (element.editFlag) {
            var selItem = vm.wasteCodes.filter(
            item => item.code === val
            )
            if (selItem && selItem.length > 0) {
              element.classCode = selItem[0].classCode
            }
          }
        })
      },
      changeClassCode (val) {
        this.getDisWasteCode(val)
      },
      getDisWasteCode (classCode) {
        let _this = this
        getWasteCode({
          code: classCode
        })
        .then(res => {
          _this.wasteCodes = res.data
        }).catch(() => {
        })
      },
      getWasteStatus (row) {
        if (row.valid === 1) {
          return '正常'
        } else if (row.valid === 0) {
          return '<c style=\'color:red;\'>已删除</c>'
        } else {
          return ''
        }
      },
      param(data) {
        let url = "";
        for (let k in data) {
          let value = data[k] != undefined ? data[k] : "";
          url += `&${k}=${encodeURIComponent(value)}`;
        }
        return url ? url.substring(1) : "";
      },
      optContact (data, type, index) {
        let _this = this
        switch (type) {
          case 'add':
            if (data.id) {
              data.editFlag = false
              let postData = {
                id: data.id,
                businessActivityId: this.form.id,
                classCode: data.classCode,
                wasteCode: data.wasteCode,
                entWasteName: data.entWasteName,
                wasteStorageAmt: data.wasteStorageAmt,
                wasteProductionAmt: data.wasteProductionAmt
              }
              if (typeof data.dealType == 'string') {
                postData.dealType = data.dealType
              }
              if (typeof data.dealType == 'object') {
                postData.dealType = data.dealType[data.dealType.length - 1]
              }

              updateBusinessActivityWasteInfo(postData)
              .then(res => {
                _this.getData()
              })
            } else {
              if (!data.classCode || data.classCode == '') {
                COMMONJS.showToast('请先选择二位码', 'warning')
                return false
              } else if (!data.wasteCode || data.wasteCode == '') {
                COMMONJS.showToast('请先选择八位码', 'warning')
                return false
              } else if (!data.entWasteName || data.entWasteName == '') {
                COMMONJS.showToast('请先填写危废俗称', 'warning')
                return false
              } else if (!data.dealType || data.dealType.length == 0) {
                COMMONJS.showToast('请选择处置方式', 'warning')
                return false
              } else {
                data.editFlag = false
                let requestData = {
                  businessActivityId: this.form.id,
                  classCode: data.classCode,
                  wasteCode: data.wasteCode,
                  entWasteName: data.entWasteName,
                  wasteStorageAmt: data.wasteStorageAmt,
                  dealType: data.dealType[data.dealType.length - 1],
                  wasteProductionAmt: data.wasteProductionAmt
                }
                saveBusinessActivityWasteInfo(requestData)
                .then(res => {
                  _this.getData()
                })
              }
            }
            break
          case 'update':
            this.records[index].editFlag = true
            break
          case 'songjian':
            data.entId = localStorage.getItem('id')
            data.status = '3'
            updateBusinessActivityWasteInfo(data)
            .then(res => {
              _this.getData()
              _this.$message({
                type: 'success',
                message: '已发起取样送检流程'
              })
            })
            break
          case 'baojia':
            this.records[index].baojiaFlag = true
            break
          case 'saveBaoJia':
            updateBusinessActivityWasteInfo({
              id: data.id,
              entId: localStorage.getItem('id'),
              status: '4',
              offerPrice: data.offerPrice,
              containFreight: data.containFreight,
              freightPrice: data.freightPrice
            })
            .then(res => {
              _this.getData()
              _this.$message({
                type: 'success',
                message: '报价成功'
              })
            })
            break
          case 'delete':
            this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let postData = {
                id: data.id,
                valid: 0
              }
              updateBusinessActivityWasteInfo(postData)
              .then(res => {
                _this.getData()
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
            break
          case 'cancel':
            if (index < this.oldRecords.length) {
              this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
            } else {
              this.records.splice(index, 1)
            }
            break
          case 'sampleBill':
            if (_this.cusId) {
              let postData = {
                entId: _this.cusId,
                wasteCode: data.wasteCode,
                entWasteName: data.entWasteName
              }
              let params = {
                ticket: localStorage.getItem('token')
              }
              getSampleAnalysisParam(postData, params).then(res => {
                if (res.data.length > 0) {
                  this.detailInfoUrlParams.sampleId = res.data[0].sampleId
                  this.detailInfoUrlParams.id = res.data[0].id
                  this.detailInfoUrlParams.templateId = res.data[0].templateId
                  let params = this.param(this.detailInfoUrlParams)
                  this.detailInfoVisible = true
                  this.detailInfoUrl = GLB_CONSTANT.devUrl.childIframeAddress + '/web/lab/sampleAnalysisBill/analysisBillAndDetailInfoErp.htm?' + params
                } else {
                  this.$message({
                    type: 'info',
                    message: '该危废没有送样单'
                  })
                }
              })
            } else {
              this.$message({
                type: 'info',
                message: '该危废没有送样单'
              })
            }
            break
        }
      },
      closeNewDialogClick () {
        this.getData()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      addBusinessActivityWaste () {
        if (this.records[this.records.length - 1].editFlag) {
          COMMONJS.showToast('请先保存添加项', 'warning')
        } else {
          let addObj = {
            classCode: '',
            wasteCode: '',
            entWasteName: '',
            editFlag: true,
            wasteProductionAmt: 0,
            wasteStorageAmt: 0
          }
          this.getDisWasteCode()
          this.records.push(addObj)
        }
      },
      addBusinessActivityContract () {
        this.dialogFormVisible = true
        this.addCheckObj.businessActivityId = this.form.id
      },
      delBusinessActivityContract () {
        let _this = this
        this.$confirm('确认删除所勾选的联系人吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = []
          _this.multipleSelection.forEach(element => {
            postData.push(element.id)
          })
          deleteBusinessActivityContactsInfo(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {
          })
        })
      },
      backToCustomer () {
        this.$router.push({
          path: '/salesFunnel',
          query: {
            defaultTabName: 'activity'
          }
        })
      },
      headClass ({
                   row,
                   rowIndex
                 }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      saveData (formName) {
        let _this = this
        if (this.form.cantonName && this.form.cantonName.length) {
          let postData = JSON.parse(JSON.stringify(this.form))
          postData.cantonName = JSON.stringify(this.form.cantonName)
          if (this.form.salesAreaName && this.form.salesAreaName.length) {
            postData.salesAreaName = JSON.stringify(this.form.salesAreaName)
          } else {
            postData.salesAreaName = '[]'
          }
          if (this.checkObj.type === 'add') {
            postData.entId = localStorage.getItem('id')
          } else {
            postData.entRelationId = this.$route.query.data
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.saveLoading = true
              if (_this.checkObj.type === 'add' && (!_this.form.id || _this.form.id == '')) {
                saveBusinessActivityBaseInfo(postData)
                .then(res => {
                  setTimeout(function () {
                    COMMONJS.showToast('新增成功')
                    _this.form.id = res.data
                    _this.isShowLine = true
                    _this.saveLoading = false
                    _this.getData()
                    // _this.cancelData();
                  }, 500)
                }).catch(() => {
                })
              } else if (_this.checkObj.type === 'update' || (_this.form.id && _this.form.id != '')) {
                saveBusinessActivityBaseInfo(postData)
                .then(res => {
                  setTimeout(function () {
                    _this.saveLoading = false
                    COMMONJS.showToast('保存成功')
                    // _this.getData();
                  }, 500)
                }).catch(() => {
                })
              }
            } else {
              return false
            }
          })
        } else {
          COMMONJS.showToast('请选择区域', 'warning')
        }
      },
      reloadP (val) {
        // this.getData()
        var _this = this
        listBusinessActivityContactsInfo({
          businessActivityId: _this.$route.query.data || _this.form.id,
          current: _this.page.current,
          size: _this.page.size,
        })
        .then(res => {
          _this.tableData = res.data.records
          _this.page.total = res.data.total
        }).catch(() => {
        })
      },
      jumpPage (index) {
        this.page.current = index
        this.getData()
      },
      jumpSize (val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      jumpWastePage (index) {
        this.wastePage.current = index
        this.getData()
      },
      jumpWasteSize (val) {
        this.wastePage.size = val
        this.wastePage.current = 1
        this.getData()
      },
      getSysCanton () {
        this.getAreaRange('', 0)
      },
      changeCantonNameP (val, area) {
        this.chooseArea = area
        this.form.cantonName = val
      },
      changeCantonNameArea (val) {
        this.form.salesAreaName = val
      },
      changeAddContactsVisibleP (val) {
        this.dialogFormVisible = val
      },
      cancelData () {
        this.$router.push({
          path: '/salesFunnel',
          query: {
            defaultTabName: 'activity'
          }
        })
      }
    }
  }

</script>

<style lang="scss">
  @import '../../element-variables.scss';

  .bussiness-info {
    position: relative;
    background: #fff;
    padding: 17px 30px;
    flex-grow: 1;
    overflow: scroll;
    .back-to-customer {
      position: absolute;
      right: 110px;
      top: 22px;
      padding: 5px 10px;
      z-index: 1;
    }
    /*.el-form-item{*/
    /*margin-bottom: 16px;*/
    /*}*/
    .el-btn-address {
      .iconaddress {
        font-size: 24px;
      }
    }
    .iframe-config{
      border: none;
      height: 100%;
      width: 100%;
    }
    .el-dialog__header .el-button{
      min-height: 28px;
      height: 28px;
      line-height: 16px;
    }
    .el-form-item.is-success .el-input__inner {
      border: 1px solid #DCDFE6;
    }
    .el-cascader,
    .el-date-editor {
      width: 100%;
    }
    .map-address {
      position: absolute;
      left: 60px;
      top: 67px;
      color: #455A70;
      text-align: left;
      padding: 15px 20px;
      white-space: nowrap;
      background: #fff;
      .map-form-item {
        padding: 5px;
        font-size: 14px;
      }
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    form {
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }

    .map-dialog.el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dialog {
        margin: auto !important;

        .el-dialog__header {
          padding: 0;
          position: relative;
          .title {
            position: absolute;
            right: -26px;
            top: -21px;
          }
        }
      }
    }

    .map-dialog {
      .el-dialog {
        width: 50%;
        height: 70%;
        display: flex;
        flex-direction: column;

        .el-dialog__body {
          flex-grow: 1;
        }
      }

      .el-dialog__body {
        padding: 0;
      }
    }

    .init-row-margin {
      margin: 0 !important;
    }

    .bus-info-item {
      .item-header {
        padding: 13px 0;
        border-bottom: 1px solid #EEEEEE;

        .item-header-text {
          text-align: left;
          padding-left: 20px;
          border-left: 2px solid $--color-primary;
          color: #555D66;
          font-size: 16px;
        }
      }

      .item-body {
        padding: 30px 50px;

        .el-input {
          .el-input-group__prepend {
            border-radius: 4px 0px 0px 4px !important;
          }
          .el-input-group__append,
          .el-input-group__prepend {
            padding: 0 13px;
          }
        }

        .business-license {
          .el-form-item__content {
            text-align: center;
          }
        }
      }
    }
  }

  .add-dialog-footer {
    margin-left: 120px;
  }

  .padding-left-none {
    padding-left: 0 !important;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
