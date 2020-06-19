<template>
  <div class="bussiness-info">
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">企业基本信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="发证机构：" :prop="(checkObj.type==='query') ? '' : 'certificationAuthority'">
                <el-input v-model="form.certificationAuthority" :disabled="checkObj.type==='query'" placeholder="请输入发证机构"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可证编号：" :prop="(checkObj.type==='query') ? '' : 'licenceNo'">
                <el-input v-model="form.licenceNo" :disabled="checkObj.type==='query'" placeholder="请输入许可证编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="经营设施地址：" :prop="(checkObj.type==='query') ? '' : 'address'">
                <el-input v-model="form.address" :disabled="checkObj.type==='query'" placeholder="请输入经营设施地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营设施邮编：" :prop="(checkObj.type==='query') ? '' : 'zipCode'">
                <el-input v-model="form.zipCode" :disabled="checkObj.type==='query'" placeholder="请输入经营设施邮编"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="初次发证日期：" :prop="(checkObj.type==='query') ? '' : 'firstReleaseTime'">
                <el-date-picker
                        v-model="form.firstReleaseTime"
                        type="date"
                        :editable="false"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :disabled="checkObj.type==='query'">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发证日期：" :prop="(checkObj.type==='query') ? '' : 'releaseTime'">
                <el-date-picker
                        v-model="form.releaseTime"
                        type="date"
                        :editable="false"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="checkObj.type==='query'">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="许可证类型：" :prop="(checkObj.type==='query') ? '' : 'businessRange'">
                <el-select :disabled="checkObj.type==='query'" v-model="form.businessRange" clearable filterable
                           placeholder="请选择许可证类型">
                  <el-option
                          v-for="item in businessRanges"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型：" :prop="(checkObj.type==='query') ? '' : 'licenceType'">
                <el-select :disabled="checkObj.type==='query'" v-model="form.licenceType" clearable filterable
                           placeholder="请选择类型">
                  <el-option
                          v-for="item in licenceTypes"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="许可证有效期：" :prop="(checkObj.type==='query') ? '' : 'licenseInfoDate'">
                <el-date-picker :disabled="checkObj.type==='query'"
                        v-model="form.licenseInfoDate"
                        :editable="false"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text"><span>项目信息</span><el-button type="text" :disabled="checkObj.type==='query'" @click="addProjectItem">新增项目</el-button></div>
        </div>
        <div class="item-body">
          <el-table
                  v-if="tableVisible"
                  :data="records"
                  style="width: 100%"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  row-key="id"
                  lazy>
            <el-table-column
                    label="序号"
                    type="index">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="项目名称">
              <template slot-scope="scope">
                <el-select v-if="scope.row.editFlag" v-model="scope.row.id" clearable filterable @change="changeProjects(scope.row, scope.$index)">
                  <el-option
                          v-for="item in listProjects"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
                <span v-if="!scope.row.editFlag">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
                    prop="dispositionType"
                    label="处置方式">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="年处理能力">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="计量单位">
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
        </div>
      </div>
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">附件信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="24">
              <v-upload v-if="fileVisible" :disabled="true" class="business-license" :uploadList="fileList" @changeFiles="changeFilesP"
                        @pictureCardPreview="pictureCardPreviewP"></v-upload>
            </el-col>
          </el-row>
          <el-row :gutter="100" v-if="checkObj.type!=='query'">
            <el-col :span="24">
              <div class="save-btn-group">
                <el-button type="primary" @click="saveData('form')">保存</el-button>
                <el-button @click="cancelData">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Upload from '@/components/upload'
import { getSysCanton, getDispCodeAndNameDic, getIndustry, getSysRoleEmploee, listLicenceAuthType, listProject, saveLicence, editLicence, listLicenceDetail, listDispositonByTypeCode } from '@/assets/js/API/api'

export default {
  name: 'businessBaseInfo',
  data () {
    return {
      // 表格初始化
      tableVisible: false,
      dialogImageUrl: '',
      // 预览
      dialogVisible: false,
      // 地图
      mapVisible: false,
      searchKeyP: {},
      // select初始化
      certificationAuthorities: [],
      licenceTypes: [],
      businessRanges: [],
      listProjects: [],
      records: [],
      fileList: [],
      form: {
        certificationAuthority: '',
        licenceNo: '',
        address: '',
        zipCode: '',
        firstReleaseTime: '',
        releaseTime: '',
        licenceType: '',
        businessRange: '',
        licenseInfoDate: []
      },
      formRules: {
        certificationAuthority: [{ required: true, message: '请输入', trigger: 'change' }],
        licenceNo: [{ required: true, message: '请输入', trigger: 'change' }],
        address: [{ required: true, message: '请输入', trigger: 'change' }],
        zipCode: [{ required: true, message: '请输入', trigger: 'change' }],
        firstReleaseTime: [{ required: true, message: '请输入', trigger: 'change' }],
        releaseTime: [{ required: true, message: '请输入', trigger: 'change' }],
        licenceType: [{ required: true, message: '请输入', trigger: 'change' }],
        businessRange: [{ required: true, message: '请输入', trigger: 'change' }],
        licenseInfoDate: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      props: {
        label: 'name',
        value: 'id',
        children: 'cities',
        lazy: true
      },
      checkObj: {
        type: 'add'
      },
      addCheckObj: {
        type: 'add'
      },
      cantonOptions: [],
      chooseArea: '',
      fileVisible: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
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
  created () {
    this.getData()
    this.getWasteData()
    this.listDispositonByTypeCodeLicenceType()
    this.listDispositonByTypeCodeLicenceAuthType()
    this.listProject()
  },
  components: {
    'v-upload': Upload
  },
  methods: {
    getData () {
      let _this = this
      switch (this.$route.query.type) {
        case 'query':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'update':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'add':
          this.checkObj.type = this.$route.query.type
          break
      }
      if (this.$route.query.type !== 'add') {
        let postData = {
          id: this.$route.query.data
        }
        listLicenceDetail(postData)
          .then(res => {
            res.data.licenseInfoDate = []
            res.data.licenseInfoDate[0] = res.data.beginTime
            res.data.licenseInfoDate[1] = res.data.endTime
            _this.form = res.data
            if (res.data.projectInfo.length) {
              _this.records = res.data.projectInfo
            }
          }).catch(() => {
          })
      } else {
        this.cantonVisible = true
      }
    },
    getWasteData () {
      let _this = this
      switch (this.$route.query.type) {
        case 'query':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'update':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'add':
          this.checkObj.type = this.$route.query.type
          break
      }
      this.fileVisible = true
      var records = []
      if ((!records.length) && (_this.checkObj.type !== 'query')) {
        let addObj = {
          id: '',
          dispositionType: '',
          quantity: '',
          unit: '',
          editFlag: true
        }
        records.push(addObj)
      } else {
        records.forEach(function (val, index) {
          val.editFlag = false
        })
      }
      _this.records = JSON.parse(JSON.stringify(records))
      _this.oldRecords = JSON.parse(JSON.stringify(records))
      _this.tableVisible = true
      // if (this.$route.query.type !== 'add') {
      //   let postData = {
      //     entRelationId: this.$route.query.data
      //   }
      // getWaste(postData)
      //   .then(res => {
      //     console.log(res)
      //     // res = { 'status': 'Success', 'data': [{ 'classCode': 'peter', 'wasteCode': '789' }, { 'classCode': 'peter2', 'wasteCode': null, 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'david', 'wasteCode': '123', 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'peter', 'wasteCode': '789' }, { 'classCode': 'peter2', 'wasteCode': null, 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'david', 'wasteCode': '123', 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }], 'msg': null, 'code': 1 }
      //     if ((!res.data.length) && (_this.checkObj.type !== 'query')) {
      //       var addObj = {
      //         classCode: '',
      //         wasteCode: '',
      //         entWasteName: '',
      //         editFlag: true
      //       }
      //       res.data.push(addObj)
      //     } else {
      //       res.data.forEach(function (val, index) {
      //         val.editFlag = false
      //       })
      //     }
      //     _this.records = JSON.parse(JSON.stringify(res.data))
      //     _this.oldRecords = JSON.parse(JSON.stringify(res.data))
      //     _this.tableVisible = true
      //   }).catch(() => {
      //   })
      // if (Object.prototype.toString.call(this.form.areaCode) !== '[object Array]') {
      //   this.form.areaCode = JSON.parse(this.form.areaCode)
      // }
      // if (Object.prototype.toString.call(this.form.cantonName) !== '[object Array]') {
      //   this.form.cantonName = JSON.parse(this.form.cantonName)
      // }
      // }
    },
    saveData (formName) {
      let _this = this
      let postData = JSON.parse(JSON.stringify(this.form))
      postData.fileList = JSON.stringify(this.fileList)
      let records = this.records
      // 过滤未保存数据项
      if (records.length) {
        for (var i = 0; i < records.length; i++) {
          if (records[i].editFlag === true) {
            records.splice(i, 1)
            i--
          }
        }
      }
      if (records.length !== 0) {
        postData.projectIdList = records
      }
      postData.beginTime = JSON.parse(JSON.stringify(this.form.licenseInfoDate[0]))
      postData.endTime = JSON.parse(JSON.stringify(this.form.licenseInfoDate[1]))
      // postData.id = localStorage.getItem('id')
      postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'add') {
            saveLicence(postData)
              .then(res => {
                COMMONJS.showToast('新增成功')
                // _this.$refs[formName].resetFields()
                let obj = {}
                obj.type = 'update'
                obj.data = res.data.licenceId
                obj.activeName = 'licenseBaseInfo'
                this.$router.push({
                  path: '/licenseInfoAdd',
                  query: obj
                })
                // _this.form.latitude = ''
                // _this.form.longitude = ''
                // _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'update') {
            editLicence(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                // _this.$refs[formName].resetFields()
                // _this.form.latitude = ''
                // _this.form.longitude = ''
                // _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          }
          // this.$refs['verificationModeForm'].resetFields()
        } else {
          return false
        }
      })
      // console.log(this.form)
    },
    choosePosition () {
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
    contactManage () {
      this.contactsVisible = true
    },
    historyCustomerCharger () {
      this.historyCustomerVisible = true
    },
    closeMap () {
      this.mapVisible = false
    },
    changePositionP (obj) {
      this.form.longitude = obj.lng
      this.form.latitude = obj.lat
      this.mapVisible = false
    },
    getSysCanton () {
      // { parentId: 'c3e3e089-77d2-11e9-9917-60eb6907d626' }
      // let cantonName = this.form.cantonName
      this.getAreaRange('', 0)
    },
    getAreaRange (val, level) {
      let _this = this
      getSysCanton({ parentId: val })
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
        }).catch(() => {
        })
    },
    handleItemChange (val) {
      let _this = this
      let parentId = val[1] || val[0]
      getSysCanton({ parentId: parentId })
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
        }).catch(() => {
        })
    },
    changeCantonNameP (val, area) {
      this.chooseArea = area
      this.form.cantonName = val
    },
    changeCantonNameArea (val) {
      this.form.areaCode = val
    },
    changeContactsVisibleP (val) {
      this.contactsVisible = val
    },
    changeAddContactsVisibleP (val) {
      this.optContactsVisible = val
    },
    reloadP (val) {
      if (val) {
        this.$refs.contactsManagement.getData()
      }
    },
    cancelData () {
      this.$router.push({
        path: '/licenseInfo'
      })
    },
    reloadContacts (val) {
      if (val) {
        this.$refs.contactsManagement.getData()
      }
    },
    setCurrentContactP (val) {
      if (Object.prototype.toString.call(val) === '[object Object]') {
        this.form.contacts = val.contacts
        this.form.contactsPhone = val.contactsPhone
      }
    },
    listDispositonByTypeCodeLicenceType () {
      let _this = this
      let postData = {
        typeCode: 'licenceType'
      }
      listDispositonByTypeCode(postData)
        .then(res => {
          _this.form.businessRange || (_this.form.businessRange = res.data[0].code)
          _this.businessRanges = res.data
        }).catch(() => {
        })
    },
    listDispositonByTypeCodeLicenceAuthType () {
      let _this = this
      let postData = {
        typeCode: 'LicenceAuthType'
      }
      listDispositonByTypeCode(postData)
        .then(res => {
          _this.form.licenceType || (_this.form.licenceType = res.data[0].code)
          _this.licenceTypes = res.data
        }).catch(() => {
        })
    },
    listProject () {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id')
      }
      listProject(postData)
        .then(res => {
          _this.listProjects = res.data
        }).catch(() => {
        })
    },
    optContact (data, type, index) {
      switch (type) {
        case 'add':
          if (data.id) {
            data.editFlag = false
            if (index === (this.records.length - 1)) {
              this.records.splice(index, 1, data)
              this.oldRecords.splice(index, 0, data)
            } else {
              this.oldRecords[index] = JSON.parse(JSON.stringify(data))
            }
          } else {
            COMMONJS.showToast('请先选择项目名称', 'warning')
          }
          break
        case 'update':
          this.records[index].editFlag = true
          // if (index < this.oldRecords.length) {
          //   this.oldRecords[index] = data
          // }
          break
        case 'delete':
          this.records.splice(index, 1)
          if (index < this.oldRecords.length) {
            this.oldRecords.splice(index, 1)
            if (!this.records.length) {
              let addObj = {
                id: '',
                dispositionType: '',
                quantity: '',
                unit: '',
                editFlag: true
              }
              this.records.push(addObj)
            }
          }
          break
        case 'cancel':
          if (index < this.oldRecords.length) {
            // this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
            this.records.splice(index, 1)
            if (!this.records.length) {
              let addObj = {
                id: '',
                dispositionType: '',
                quantity: '',
                unit: '',
                editFlag: true
              }
              this.records.push(addObj)
            }
          } else {
            this.records.splice(index, 1)
            // this.records[index] = {
            //   classCode: '',
            //   wasteCode: '',
            //   entWasteName: '',
            //   editFlag: true
            // }
          }
          // this.records[index].editFlag = false
          break
      }
    },
    changeProjects (item, index) {
      for (var i = 0; i < this.listProjects.length; i++) {
        if (item.id === this.listProjects[i].id) {
          this.listProjects[i].editFlag = true
          this.records.splice(index, 1, JSON.parse(JSON.stringify(this.listProjects[i])))
          return false
        }
      }
    },
    addProjectItem () {
      if (this.records[this.records.length - 1].editFlag) {
        COMMONJS.showToast('请先保存添加项', 'warning')
      } else {
        let addObj = {
          id: '',
          dispositionType: '',
          quantity: '',
          unit: '',
          editFlag: true
        }
        // this.records.splice(this.records.length, 0, addObj)
        this.records.push(addObj)
      }
    },
    changeFilesP (obj) {
      this.fileList = JSON.parse(JSON.stringify(obj))
      // console.log(obj)
    },
    pictureCardPreviewP (obj) {
      this.dialogImageUrl = obj.dialogImageUrl
      this.dialogVisible = obj.dialogVisible
    }
  }
}
</script>

<style lang="scss">
  @import '../../../element-variables.scss';

  .bussiness-info {
    .el-dialog__header .dialog-title{
      text-align: left;
    }
    .business-license{
      text-align: left;
    }
    .save-btn-group{
      text-align: left;
      padding-top: 20px;
    }
  }
  .add-dialog-footer{
    margin-left: 120px;
  }
  .padding-left-none{
    padding-left: 0 !important;
  }
</style>
