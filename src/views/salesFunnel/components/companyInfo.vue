<template>
  <div class="bussiness-info" v-loading="loading">
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">客户基本信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="客户编号：">
                <el-input v-model="form.code" disabled placeholder="请输入客户编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户简称：" :prop="(checkObj.type==='query') ? '' : 'abbreviation'">
                <el-input v-model="form.abbreviation" :disabled="checkObj.type==='query'" placeholder="请输入客户简称"></el-input>
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
              <el-form-item label="企业种类：" :prop="(checkObj.type==='query') ? '' : 'type'">
                <el-select :disabled="true" v-model="form.type" clearable filterable placeholder="请选择企业种类">
                  <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="所属行政区：" :prop="(checkObj.type==='query') ? '' : 'cantonName'">
                <v-canton v-if="cantonVisible" :disabled="checkObj.type==='query'" :cantonName="form.cantonName" :cantonPlaceholder="'请选择行政区'"
                  @changeCantonName="changeCantonNameP"></v-canton>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮政编码：" :prop="(checkObj.type==='query') ? '' : 'postcode'">
                <el-input v-model="form.postcode" :disabled="checkObj.type==='query'" placeholder="请输入邮政编码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="工商注册地址：" :prop="(checkObj.type==='query') ? '' : 'address'">
                <el-input v-model="form.address" :disabled="checkObj.type==='query'" placeholder="请输入工商注册地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">客户产废信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="年产废量：" :prop="(checkObj.type==='query') ? '' : 'wasteProductionAmt'">
                <el-input v-model="form.wasteProductionAmt" :disabled="checkObj.type==='query'" placeholder="请输入年产废量">
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前库存总量：" :prop="(checkObj.type==='query') ? '' : 'currentStorageAmt'">
                <el-input v-model="form.currentStorageAmt" :disabled="checkObj.type==='query'" placeholder="请输入当前库存总量">
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">客户详细信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业性质：" :prop="(checkObj.type==='query') ? '' : 'property'">
                <el-select v-model="form.property" :disabled="checkObj.type==='query'" clearable filterable placeholder="请选择企业性质">
                  <el-option v-for="item in properties" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业规模：" :prop="(checkObj.type==='query') ? '' : 'industryScale'">
                <el-input v-model="form.industryScale" :disabled="checkObj.type==='query'" placeholder="请输入企业规模"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="行业类型：" :prop="(checkObj.type==='query') ? '' : 'industryId'">
                <el-select v-model="form.industryValue" :disabled="checkObj.type==='query'" clearable filterable placeholder="请选择行业类型">
                  <el-option v-for="item in industryIds" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人：" :prop="(checkObj.type==='query') ? '' : 'legalPerson'">
                <el-input v-model="form.legalPerson" :disabled="checkObj.type==='query'" placeholder="请输入法人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="联系人：" :prop="(checkObj.type==='query') ? '' : 'contacts'">
                <el-row :gutter="20" class="init-row-margin">
                  <el-col :span="18" class="padding-left-none">
                    <el-input v-model="form.contacts" :disabled="true" placeholder="点击联系人管理设置主要联系人"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" @click="contactManage" class="el-btn-address">联系人管理</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" :prop="(checkObj.type==='query') ? '' : 'contactsPhone'">
                <el-input v-model="form.contactsPhone" :disabled="checkObj.type==='query'" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业电话：" :prop="(checkObj.type==='query') ? '' : 'telephone'">
                <el-input v-model="form.telephone" :disabled="checkObj.type==='query'" placeholder="请输入企业电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真：" :prop="(checkObj.type==='query') ? '' : 'fax'">
                <el-input v-model="form.fax" :disabled="checkObj.type==='query'" placeholder="请输入传真"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="生产设施地址：" :prop="(checkObj.type==='query') ? '' : 'equipmentAddress'">
                <el-input v-model="form.equipmentAddress" :disabled="checkObj.type==='query'" placeholder="请输入生产设施地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="注册资本：" :prop="(checkObj.type==='query') ? '' : 'registeredCapital'">
                <el-input v-model.number="form.registeredCapital" :disabled="checkObj.type==='query'" placeholder="请输入注册资本">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年产值：" :prop="(checkObj.type==='query') ? '' : 'yield'">
                <el-input v-model.number="form.yield" :disabled="checkObj.type==='query'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="总投资：" :prop="(checkObj.type==='query') ? '' : 'investment'">
                <el-input v-model.number="form.investment" :disabled="checkObj.type==='query'" placeholder="请输入总投资">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售额：" :prop="(checkObj.type==='query') ? '' : 'productSalesVolume'">
                <el-input v-model.number="form.productSalesVolume" :disabled="checkObj.type==='query'" placeholder="请输入销售额">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="经营开始日期：" :prop="(checkObj.type==='query') ? '' : 'startTime'">
                <el-date-picker v-model="form.startTime" type="date" :editable="false" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions" :disabled="checkObj.type==='query'">
                </el-date-picker>
                <!--<el-input v-model="form.startTime"></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营结束日期：" :prop="(checkObj.type==='query') ? '' : 'endTime'">
                <el-date-picker v-model="form.endTime" type="date" :editable="false" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="checkObj.type==='query'">
                </el-date-picker>
                <!--<el-input v-model="form.startTime"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="归属地环保局：" :prop="(checkObj.type==='query') ? '' : 'epaName'">
                <el-input v-model="form.epaName" :disabled="checkObj.type==='query'" placeholder="请输入归属地环保局"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户地址：">
                <el-row :gutter="20" class="init-row-margin">
                  <el-col :span="9" class="padding-left-none">
                    <el-tooltip :disabled="!form.longitude" :content="form.longitude.toString()" placement="top" :enterable="false">
                      <el-input v-model="form.longitude" :disabled="true">
                        <template slot="prepend">经度</template>
                      </el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="9">
                    <el-tooltip :content="form.latitude.toString()" placement="top" :enterable="false">
                      <el-input v-model="form.latitude" :disabled="true">
                        <template slot="prepend">纬度</template>
                      </el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" icon="icon iconfont iconaddress" @click="choosePosition" :disabled="checkObj.type==='query'" class="el-btn-address">地图选择</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="客户负责人：" :prop="(checkObj.type==='query') ? '' : 'customerCharger'">
                <el-row :gutter="20" class="init-row-margin">
                  <el-col :span="18" class="padding-left-none">
                    <!--<el-input v-model="form.customerCharger" :disabled="checkObj.type==='query'" placeholder="请输入客户负责人"></el-input>-->
                    <el-select v-model="form.customerCharger" :disabled="checkObj.type==='query'" clearable filterable placeholder="请选择客户负责人">
                      <el-option v-for="item in customerChargers" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="text" @click="historyCustomerCharger" class="el-btn-address">历史负责人</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="派车区域：">
                <v-canton v-if="cantonVisible" :type="'areaCode'" :disabled="checkObj.type==='query'" :cantonName="form.areaCode" @changeCantonName="changeCantonNameArea"></v-canton>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="备注：" :prop="(checkObj.type==='query') ? '' : 'remark'">
                <el-input v-model="form.remark" :disabled="checkObj.type==='query'" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
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
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="mapVisible" :close-on-click-modal="false" :show-close="false" class="map-dialog">
      <span slot="title" class="title">
        <el-button icon="el-icon-close" size="mini" circle @click="closeMap"></el-button>
      </span>
      <v-map-search :searchKey="searchKeyP" @changePosition="changePositionP"></v-map-search>
    </el-dialog>
    <div class="view-total" v-if="contactsVisible">
      <el-dialog left :visible.sync="contactsVisible" :close-on-click-modal="false">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>联系人管理</div>
        </div>
        <el-alert show-icon title="只能存在一个主要联系人，如新增联系人时主要联系人选择为是，则将自动默认新联系人为主要联系人！" type="warning">
        </el-alert>
        <v-contacts-management ref="contactsManagement" :entId="$route.query.data" :ownerEntId="ownerEntId" :entRelationId="form.entRelationId"
          @changeContactsVisible="changeContactsVisibleP" @optContact="optContactP" @reload="reloadContacts" @setCurrentContact="setCurrentContactP"></v-contacts-management>
        <el-dialog width="30%" title="内层 Dialog" :visible.sync="optContactsVisible" append-to-body>
          <div slot="title" class="dialog-title">
            <div>
              <span class="green-line"></span>新增联系人</div>
          </div>
          <v-contacts-add v-if="optContactsVisible" @reload="reloadP" :entRelationId="form.entRelationId" :editContactsData="editContactsData"
            :addCheckObj="addCheckObj" @changeAddContactsVisible="changeAddContactsVisibleP"></v-contacts-add>
        </el-dialog>
      </el-dialog>
    </div>
    <div class="view-total" v-if="historyCustomerVisible">
      <el-dialog left :visible.sync="historyCustomerVisible" :close-on-click-modal="false">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>历史负责人</div>
        </div>
        <v-history-customer :entRelationId="form.entRelationId"></v-history-customer>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import MapSearch from '@/components/map/mapPosition'
  import ContactsManagement from '@/views/salesFunnel/dialog/contactsManagement'
  import AddContactsManagement from '@/views/salesFunnel/dialog/addContactsManagement'
  import HistoryCustomer from '@/views/salesFunnel/dialog/historyCustomer'
  import Canton from '@/components/canton'
  import {
    getSysCanton,
    addCustomerEnterprise,
    modifyCustomerEnterprise,
    getDispCodeAndNameDic,
    getIndustry,
    getEnterpriseInfo,
    getCustomerEnterpriseDetail,
    getSysRoleEmploee,
    editCustomerEnterprise
  } from '@/assets/js/API/api'

  export default {
    name: 'businessBaseInfo',
    data() {
      return {
        saveLoading: false,
        loading: true,
        dialogImageUrl: '',
        // 预览
        dialogVisible: false,
        // 地图
        mapVisible: false,
        searchKeyP: {},
        ownerEntId: localStorage.getItem('id'),
        form: {
          code: '',
          cantonName: [],
          areaCode: [],
          name: '',
          type: '',
          abbreviation: '',
          postcode: '',
          address: '',
          property: '',
          industryScale: '',
          industryId: '',
          legalPerson: '',
          contacts: '',
          contactsPhone: '',
          telephone: '',
          fax: '',
          equipmentAddress: '',
          registeredCapital: '',
          investment: '',
          productSalesVolume: '',
          startTime: '',
          endTime: '',
          epaName: '',
          customerCharger: '',
          remark: '',
          longitude: '',
          latitude: '',
          yield: ''
        },
        formRules: {
          wasteProductionAmt: [{
            required: true,
            message: '请输入年产废量',
            trigger: 'change'
          }],
          currentStorageAmt: [{
            required: true,
            message: '请输入当前库存总量',
            trigger: 'change'
          }],
          abbreviation: [{
            required: true,
            message: '请输入客户简称',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '请输入客户类型',
            trigger: 'change'
          }],
          code: [{
            required: true,
            message: '请输入客户编号',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入客户名称',
            trigger: 'change'
          }]
        },
        checkObj: {
          type: 'add'
        },
        addCheckObj: {
          type: 'add'
        },
        properties: [],
        types: [],
        industryIds: [],
        cantonOptions: [],
        customerChargers: [],
        chooseArea: '',
        fileVisible: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }]
        },
        editContactsData: {},
        contactsVisible: false,
        historyCustomerVisible: false,
        addContactsVisible: false,
        optContactsVisible: false,
        cantonVisible: false
      }
    },
    created() {
      this.getData()
      this.getDispCodeAndNameDicEntType()
      this.getIndustry()
      this.getSysRoleEmploee()
      this.getDispCodeAndNameDicEntProperty()
    },
    components: {
      'v-map-search': MapSearch,
      'v-canton': Canton,
      'v-contacts-management': ContactsManagement,
      'v-contacts-add': AddContactsManagement,
      'v-history-customer': HistoryCustomer
    },
    methods: {
      getData() {
        let _this = this
        switch (this.$route.query.type) {
          case 'query':
            this.checkObj.type = this.$route.query.type
            break
          case 'update':
            this.checkObj.type = this.$route.query.type
            break
          case 'add':
            this.checkObj.type = this.$route.query.type
            break
        }
        if (this.$route.query.type !== 'add') {
          let postData = {
            id: _this.$route.query.data,
            ownerEntId: localStorage.getItem('id')
          }
          getCustomerEnterpriseDetail(postData)
            .then(res => {
              if (res.data.areaCode) {
                if (Object.prototype.toString.call(res.data.areaCode) !== '[object Array]') {
                  res.data.areaCode = JSON.parse(res.data.areaCode)
                }
              } else {
                res.data.areaCode = []
              }
              if (res.data.cantonName) {
                if (Object.prototype.toString.call(res.data.cantonName) !== '[object Array]') {
                  res.data.cantonName = JSON.parse(res.data.cantonName)
                }
              } else {
                res.data.cantonName = []
              }
              res.data.longitude = res.data.longitude || ''
              res.data.latitude = res.data.latitude || ''
              _this.form = res.data
              if(_this.form.industryId&&_this.form.industryId!=''){
                _this.form.industryValue = JSON.parse(_this.form.industryId)[0]
              }
              _this.cantonVisible = true
              _this.loading = false
            }).catch(() => {})
        } else {
          this.cantonVisible = true
        }
      },
      saveData(formName) {
        let _this = this
        if (this.form.cantonName && this.form.cantonName.length) {
          let postData = JSON.parse(JSON.stringify(this.form))
          postData.cantonName = JSON.stringify(this.form.cantonName)
          postData.areaCode = JSON.stringify(this.form.areaCode)
          if(this.form.industryValue&&this.form.industryValue!=''){
            postData.industryId = JSON.stringify([this.form.industryValue]);
          }else{
            postData.industryId =''
          }
          if (this.checkObj.type === 'add') {
            postData.entId = localStorage.getItem('id')
          } else {
            postData.id = this.$route.query.data
            postData.ownerEntId = localStorage.getItem('id')
          }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.saveLoading = true;
              if (_this.checkObj.type === 'add') {
                addCustomerEnterprise(postData)
                  .then(res => {
                    setTimeout(function () {
                      _this.saveLoading = false;
                      COMMONJS.showToast('新增成功')
                      _this.getData()
                    }, 500)
                  }).catch(() => {})
              } else if (_this.checkObj.type === 'update') {
                modifyCustomerEnterprise(postData)
                  .then(res => {
                    setTimeout(function () {
                      _this.saveLoading = false;
                      COMMONJS.showToast('保存成功')
                      _this.getData()
                    }, 500)
                  }).catch(() => {})
              }
            } else {
              return false
            }
          })
        } else {
          COMMONJS.showToast('请您先选择行政区', 'warning')
        }
        // console.log(this.form)
      },
      pictureCardPreviewP(obj) {
        this.dialogImageUrl = obj.dialogImageUrl
        this.dialogVisible = obj.dialogVisible
      },
      choosePosition() {
        if (this.chooseArea) {
          let searchKeyP = {
            value: this.form.name,
            lat: this.form.latitude,
            lng: this.form.longitude
          };
          (searchKeyP.lat && searchKeyP.lng) || (searchKeyP.range = this.chooseArea)
          this.searchKeyP = searchKeyP
          this.mapVisible = true
        } else {
          COMMONJS.showToast('请您先选择行政区', 'warning')
        }
        //   .value = this.form.businessName
        // this.searchKeyP.value = this.form.businessName
        // this.searchKeyP.value = this.form.businessName
        // this.searchKeyP.value = this.form.businessName
      },
      contactManage() {
        this.contactsVisible = true
      },
      historyCustomerCharger() {
        this.historyCustomerVisible = true
      },
      closeMap() {
        this.mapVisible = false
      },
      changePositionP(obj) {
        this.form.longitude = obj.lng
        this.form.latitude = obj.lat
        this.mapVisible = false
      },
      getSysCanton() {
        // { parentId: 'c3e3e089-77d2-11e9-9917-60eb6907d626' }
        // let cantonName = this.form.cantonName
        this.getAreaRange('', 0)
      },
      getAreaRange(val, level) {
        let _this = this
        getSysCanton({
            parentId: val
          })
          .then(res => {
            if (level === 0) {
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].level !== 3) {
                  res.data[i].cities = []
                }
              }
              _this.cantonOptions = res.data
            }
            if (level === 1) {
              for (var j = 0; j < res.data.length; j++) {
                if (res.data[j].level !== 3) {
                  res.data[j].cities = []
                }
              }
              for (var k = 0; k < _this.cantonOptions.length; k++) {
                if (_this.cantonOptions[k].id === val) {
                  _this.cantonOptions[k].cities = res.data
                }
              }
            }
            if (level === 2) {
              for (var l = 0; l < _this.cantonOptions.length; l++) {
                for (var m = 0; m < _this.cantonOptions[l].cities.length; m++) {
                  if (_this.cantonOptions[l].cities[m].id === val) {
                    _this.chooseArea = _this.cantonOptions[l].cities[m].name
                    _this.cantonOptions[l].cities[m].cities = res.data
                  }
                }
              }
            }
            level++
            if (_this.form.cantonName.length > level && (level < 3)) {
              _this.getAreaRange(_this.form.cantonName[level - 1], level)
            }
          }).catch(() => {})
      },
      handleItemChange(val) {
        let _this = this
        let parentId = val[1] || val[0]
        getSysCanton({
            parentId: parentId
          })
          .then(res => {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].level !== 3) {
                res.data[i].cities = []
              }
            }
            // console.log(res)
            for (var j = 0; j < _this.cantonOptions.length; j++) {
              if (val.length > 1) {
                for (var k = 0; k < _this.cantonOptions[j].cities.length; k++) {
                  if (_this.cantonOptions[j].cities[k].id === parentId) {
                    _this.chooseArea = _this.cantonOptions[j].cities[k].name
                    _this.cantonOptions[j].cities[k].cities = res.data
                  }
                }
              } else {
                if (_this.cantonOptions[j].id === parentId) {
                  _this.cantonOptions[j].cities = res.data
                }
              }
            }
          }).catch(() => {})
      },
      getDispCodeAndNameDicEntProperty() {
        let _this = this
        let postData = {
          typeCode: 'entProperty'
        }
        getDispCodeAndNameDic(postData)
          .then(res => {
            _this.form.property || (_this.form.property = res.data[0].code)
            _this.properties = res.data
          }).catch(() => {})
      },
      getDispCodeAndNameDicEntType() {
        let _this = this
        let postData = {
          typeCode: 'entType'
        }
        getDispCodeAndNameDic(postData)
          .then(res => {
            _this.form.type || (_this.form.type = res.data[0].code)
            _this.types = res.data
          }).catch(() => {})
      },
      getIndustry() {
        let _this = this
        getIndustry()
          .then(res => {
            _this.form.industryId || (_this.form.industryId = res.data[0].name)
            _this.industryIds = res.data
          }).catch(() => {})
      },
      getSysRoleEmploee() {
        let _this = this
        getSysRoleEmploee()
          .then(res => {
            _this.form.customerCharger || (_this.form.customerCharger = res.data[0].id)
            _this.customerChargers = res.data
          }).catch(() => {})
      },
      changeCantonNameP(val, area) {
        this.chooseArea = area
        this.form.cantonName = val
      },
      changeCantonNameArea(val) {
        this.form.areaCode = val
      },
      changeContactsVisibleP(val) {
        this.contactsVisible = val
      },
      changeAddContactsVisibleP(val) {
        this.optContactsVisible = val
      },
      optContactP(type, data) {
        var vm = this;
        switch (type) {
          case 'add':
            this.addCheckObj = {
              type: 'customerAdd',
              entId: vm.$route.query.data
            }
            this.editContactsData = {}
            this.optContactsVisible = true
            break
          case 'update':
            this.addCheckObj = {
              type: 'update',
              entId: vm.$route.query.data
            }
            this.editContactsData = data
            this.optContactsVisible = true
            break
        }
      },
      reloadP(val) {
        if (val) {
          this.$refs.contactsManagement.getData()
        }
      },
      cancelData() {
        this.$router.push({
          path: '/salesFunnel'
        })
      },
      reloadContacts(val) {
        if (val) {
          this.$refs.contactsManagement.getData()
        }
      },
      setCurrentContactP(val) {
        if (Object.prototype.toString.call(val) === '[object Object]') {
          this.form.contacts = val.contacts
          this.form.contactsPhone = val.contactsPhone
        }
      }
    }
  }

</script>

<style lang="scss">
  @import '../../../element-variables.scss';

  .bussiness-info {
    .el-dialog__header .dialog-title {
      text-align: left;
    }
  }

  .add-dialog-footer {
    margin-left: 120px;
  }

  .padding-left-none {
    padding-left: 0 !important;
  }

  .el-loading-spinner {
    top: 20%
  }

</style>
