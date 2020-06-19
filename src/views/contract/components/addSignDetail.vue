<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="八位码" prop="wasteCode">
            <el-autocomplete clearable v-model="state" :fetch-suggestions="queryMatClassAsync" placeholder="输入关键字搜索八位码" @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危废俗称" prop="matId">
            <el-autocomplete clearable v-model="stateA" :fetch-suggestions="queryMatAsync" placeholder="输入关键字搜索危废俗称" @select="handleSelectA">
              <el-button v-if="isShowAddWasteBtn" @click="addWasteInfo" slot="append">新增危废</el-button>
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="合同数量" prop="qty">
            <el-input-number v-model="addForm.qty" :disabled="checkObj.type==='query'" placeholder="请输入合同数量" :step="1" :min=1></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位">
            <el-input disabled v-model="addForm.unit" placeholder="选择危废俗称自动获取单位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="接收数量" prop="recQty">
            <el-input-number v-model="addForm.recQty" :disabled="checkObj.type==='query'" placeholder="请输入接收数量"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装类型" prop="packageType">
            <el-select v-model="addForm.packageType" :disabled="checkObj.type==='query'" clearable placeholder="请选择包装类型">
              <el-option v-for="item in packageTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="处置方式" prop="dealTypeId">
            <el-cascader @change="dealTypeChange" v-model="dealTypeValues" :options="dealTypeList" :props="{ multiple: false,value:'id',label:'name'}"
              filterable placeholder="请选择处置方式" collapse-tags clearable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="派车方式" prop="actRes">
            <el-select v-model="addForm.actRes" :disabled="checkObj.type==='query'" clearable placeholder="请选择派车方式">
              <el-option v-for="item in actResList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
      <el-button type="primary" @click="submitDialog('addForm')">保 存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
    <div v-if="newWasteFormVisible">
      <el-dialog append-to-body :close-on-click-modal="false" width="50%" :visible.sync="newWasteFormVisible">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}危废</div>
        </div>
        <el-form :model="newWasteForm" :rules="newWasteFormRules" ref="newWasteForm">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="二位码" label-width="150px">
                <el-input disabled v-model="newWasteForm.classCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="八位码" label-width="150px">
                <el-input disabled v-model="newWasteForm.wasteCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="危废俗称" label-width="150px" prop="entWasteName">
                <el-input clearable maxlength="256" v-model="newWasteForm.entWasteName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="危废形态" label-width="150px" prop="formCode">
                <el-select v-model="newWasteForm.formCode" clearable placeholder="请选择危废形态">
                  <el-option v-for="item in wasteForm" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="危废特性" label-width="150px" prop="featureCodes">
                <el-select v-model="newWasteForm.featureCodes" clearable placeholder="请选择危废特性">
                  <el-option v-for="item in wasteFeatures" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="计量单位" prop="unit" label-width="150px">
                <el-select v-model="newWasteForm.unit" :disabled="checkObj.type==='query'" clearable placeholder="请选择计量单位">
                  <el-option v-for="item in units" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转换率" prop="conversion" label-width="150px">
                <el-input v-model="newWasteForm.conversion" :disabled="checkObj.type==='query'" placeholder="请输入转换率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="newWasteClick">保 存</el-button>
          <el-button @click="cancelNewWaste">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import {
    saveEnterpriseWaste,
    getEnterpriseWaste,
    getCodeAndNameDic,
    getCodeAndNameDicTree,
    saveMSWMSAOrderLineEntity,
    getWasteCode
  } from '@/assets/js/API/api'
  export default {
    name: 'addSignDetail',
    data() {
      let vm = this
      let validateMatId = (rule, value, callback) => {
        if (vm.addForm.matClassId == '') {
          return callback(new Error('请先选择八位码！'))
        } else if (value == '' && vm.stateA == '') {
          return callback(new Error('危废俗称不能为空！'))
        } else {
          let postData = {
            current: 1,
            size: 1000000,
            entId: localStorage.getItem('id'),
            wasteCode: vm.addForm.wasteCode,
            valid: 1
          }
          getEnterpriseWaste(postData)
            .then(res => {
              vm.matList = [];
              res.data.records.forEach(element => {
                vm.matList.push({
                  'id': element.id,
                  'value': element.entWasteName,
                  'unit': element.unit,
                  'unitName': element.unitName
                })
              })
              let arr = vm.matList.filter(item => item.value === vm.stateA)
              if (arr.length == 0) {
                vm.isShowAddWasteBtn = true
                return callback(new Error('危废俗称不存在，请新增危废！'))
              } else {
                vm.isShowAddWasteBtn = false
                vm.addForm.matId = arr[0].id
                vm.addForm.matName = arr[0].value
                vm.addForm.unitId = arr[0].unit
                vm.addForm.unit = arr[0].unitName
                callback()
              }
            }).catch(() => {})
        }
      }
      return {
        dialogFormTitle: '新增',
        wasteForm: [],
        units: [],
        wasteFeatures: [],
        newWasteForm: {
          classCode: '',
          wasteCode: '',
          entWasteName: ''
        },
        newWasteFormVisible: false,
        dealTypeValues: [],
        state: '',
        stateA: '',
        tempStateA: '',
        timeout: null,
        matClassList: [],
        matList: [],
        actResList: [],
        dealTypeList: [],
        packageTypeList: [],
        isShowAddWasteBtn: false,
        formLabelWidth: '80px',
        addForm: {
          oldMatId: '',
          headGuid: '',
          wasteCode: '',
          matClassId: '',
          matId: '',
          matName: '',
          remark: '',
          qty: 0,
          unit: '',
          unitId: '',
          recQty: 0,
          packageType: 'ALL',
          dealTypeId: '',
          actRes: 'DIS'
        },
        wasteFeatures: [],
        newWasteFormRules: {
          entWasteName: [{
            required: true,
            message: '请输入危废俗称',
            trigger: 'change'
          }],
          featureCodes: [{
            required: true,
            message: '请选择危废特性',
            trigger: 'change'
          }],
          formCode: [{
            required: true,
            message: '请选择危废形态',
            trigger: 'change'
          }]
        },
        addFormRules: {
          dealTypeId: [{
            required: true,
            message: '请选择处置方式',
            trigger: 'change'
          }],
          wasteCode: [{
            required: true,
            message: '请输入八位码',
            trigger: 'change'
          }],
          qty: [{
            required: true,
            message: '请输入合同数量',
            trigger: 'change'
          }],
          packageType: [{
            required: true,
            message: '请选择包装类型',
            trigger: 'change'
          }],
          actRes: [{
            required: true,
            message: '请选择派车方式',
            trigger: 'change'
          }],
          recQty: [{
            required: true,
            message: '请输入接收数量',
            trigger: 'change'
          }],
          matId: [{
            required: true,
            validator: validateMatId,
            trigger: 'change'
          }]
        }
      }
    },
    components: {},
    mounted() {
      var vm = this
      vm.getWasteCode()
      vm.getCodeAndNameDicUnit();
      vm.getCodeAndNameDicPackageType()
      vm.getCodeAndNameDicActRes()
      vm.getCodeAndNameDicWasteForm()
      vm.getCodeAndNameDicWasteFeatures()
      vm.addForm.headGuid = vm.checkObj.data.headGuid
      if (this.checkObj.type === 'add') {
        vm.getCodeAndNameDicDispositionType()
      }
      if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
        vm.addForm = vm.checkObj.data
        vm.state = vm.addForm.baseMaterialMatCode;
        vm.addForm.wasteCode = vm.addForm.baseMaterialMatCode;
        vm.stateA = vm.addForm.baseMaterialMatName;
        vm.addForm.oldMatId = vm.addForm.matId;
        getCodeAndNameDicTree({
            typeCode: 'dealType'
          })
          .then(res => {
            vm.dealTypeList = res.data
            vm.dealTypeValues = COMMONJS.changeDetSelect(vm.addForm.dealTypeId, vm.dealTypeList);
          }).catch(() => {})
      }
    },
    props: ['checkObj'],
    methods: {
      getCodeAndNameDicUnit() {
        let _this = this
        let postData = {
          typeCode: 'capacityUnit'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.units = res.data
          }).catch(() => {})
      },
      newWasteClick() {
        let vm = this;
        let postData = vm.newWasteForm
        postData.entId = localStorage.getItem('id')
        vm.$refs['newWasteForm'].validate((valid) => {
          if (valid) {
            saveEnterpriseWaste(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                vm.newWasteFormVisible = false;
                vm.stateA = vm.newWasteForm.entWasteName;
              }).catch(() => {})
          } else {
            return false
          }
        })
      },
      cancelNewWaste() {
        let vm = this;
        vm.newWasteFormVisible = false;
      },
      addWasteInfo() {
        let vm = this;
        if (vm.stateA == '') {
          vm.$message.warning("请填写危废俗称！");
          return;
        }
        vm.newWasteFormVisible = true;
        //初始化八位码二位码信息
        vm.newWasteForm.wasteCode = vm.addForm.wasteCode;
        vm.newWasteForm.classCode = vm.addForm.classCode;
        vm.newWasteForm.classId = vm.addForm.matClassId;
        vm.newWasteForm.entWasteName = vm.stateA;
        vm.stateA = '';
      },
      getCodeAndNameDicWasteForm() {
        let _this = this
        let postData = {
          typeCode: 'wasteForm'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            // _this.newWasteForm.formCode || (_this.newWasteForm.formCode = res.data[0].code)
            _this.wasteForm = res.data
          }).catch(() => {})
      },
      getCodeAndNameDicWasteFeatures() {
        let _this = this
        let postData = {
          typeCode: 'wasteFeatures'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            // _this.newWasteForm.featureCodes || (_this.newWasteForm.featureCodes = res.data[0].code)
            _this.wasteFeatures = res.data
          }).catch(() => {})
      },
      dealTypeChange(data) {
        let vm = this
        vm.addForm.dealTypeId = ''
        if (data.length > 0) {
          // data.forEach(element => {
          //   vm.addForm.dealTypeId += element[element.length - 1] + ','
          // })
          // if (vm.addForm.dealTypeId.length > 0) {
          //   vm.addForm.dealTypeId = vm.addForm.dealTypeId.substr(0, vm.addForm.dealTypeId.length - 1)
          // }
          vm.addForm.dealTypeId = data[data.length - 1]
        } else {
          vm.addForm.dealTypeId = ''
        }
      },
      getEnterpriseWaste() {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id'),
          current: 1,
          size: 1000000,
          wasteCode: _this.addForm.wasteCode,
          valid: 1
        }
        getEnterpriseWaste(postData)
          .then(res => {
            _this.matList = [];
            res.data.records.forEach(element => {
              _this.matList.push({
                'id': element.id,
                'value': element.entWasteName,
                'unit': element.unit,
                'unitName': element.unitName,
              })

            })
          }).catch(() => {})
      },
      queryMatClassAsync(queryString, cb) {
        var vm = this
        var matClassList = vm.matClassList
        var results = queryString ? matClassList.filter(this.createStateFilter(queryString)) : matClassList
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 100 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        var vm = this
        vm.addForm.matClassId = item.id
        vm.addForm.wasteCode = item.value
        vm.addForm.classCode = item.classCode;
        //获取危废俗称列表
        vm.getEnterpriseWaste();
      },
      queryMatAsync(queryString, cb) {
        var vm = this
        var matList = vm.matList
        var results = queryString ? matList.filter(this.createStateAFilter(queryString)) : matList
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 100 * Math.random())
      },
      createStateAFilter(queryString) {
        return (stateA) => {
          return (stateA.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelectA(item) {
        var vm = this
        vm.addForm.matId = item.id
        vm.addForm.matName = item.value
        vm.addForm.unitId = item.unit
        vm.addForm.unit = item.unitName
      },
      submitDialog(formName) {
        let _this = this
        let postData = this.addForm
        postData.entId = localStorage.getItem('id')
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            saveMSWMSAOrderLineEntity(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                this.$emit('reload', true)
              }).catch(() => {})
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancelForm() {
        this.$emit('changeDialogFormVisible', false)
      },
      getCodeAndNameDicPackageType() {
        let _this = this
        let postData = {
          typeCode: 'PACKTYPE'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.packageTypeList = res.data
          }).catch(() => {})
      },
      getCodeAndNameDicActRes() {
        let _this = this
        let postData = {
          typeCode: 'TPACTRES'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.actResList = res.data
          }).catch(() => {})
      },
      getCodeAndNameDicDispositionType() {
        let _this = this
        let postData = {
          typeCode: 'dealType'
        }
        getCodeAndNameDicTree(postData)
          .then(res => {
            _this.dealTypeList = res.data
          }).catch(() => {})
      },
      getWasteCode() {
        let _this = this
        getWasteCode({
            entId: localStorage.getItem('id')
          })
          .then(res => {
            res.data.forEach(element => {
              _this.matClassList.push({
                'id': element.classId,
                'value': element.code,
                "classCode": element.classCode
              })
            })
          }).catch(() => {})
      }
    }
  }

</script>

<style scoped>
  .dialog-footer {
    text-align: center;
    padding: 10px 20px 20px 250px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

</style>
