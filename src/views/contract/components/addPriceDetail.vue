<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="费用类型" prop="type">
            <el-select v-model="addForm.type" :disabled="checkObj.type==='query'" clearable placeholder="请选择费用类型">
              <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计价方式" prop="priceManner">
            <el-select v-model="addForm.priceManner" :disabled="checkObj.type==='query'" clearable placeholder="请选择计价方式">
              <el-option v-for="item in priceMannerList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="是否含税">
            <el-checkbox v-model="chkTaxInclusive" @change="chkTaxInclusiveChange" :disabled="checkObj.type==='query'"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="税率" prop="taxRate">
            <el-select v-model="addForm.taxRate" :disabled="checkObj.type==='query'" clearable placeholder="请选择税率">
              <el-option v-for="item in taxRateList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="八位码" prop="wasteCode">
            <el-input clearable placeholder="请选择八位码" v-model="addForm.wasteCode" @clear="clearWaste">
              <el-button slot="append" icon="el-icon-more" @click="selWasteCodeList(8)"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二位码" prop="wasteClassCode">
            <el-input clearable placeholder="请选择二位码" v-model="addForm.wasteClassCode">
              <el-button slot="append" icon="el-icon-more" @click="selWasteCodeList(2)"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="危废俗称" prop="wasteName">
            <el-input disabled placeholder="请选择危废俗称" v-model="addForm.wasteName">
            </el-input>
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
          <el-form-item label="应收付类型" prop="arApType">
            <el-select v-model="addForm.arApType" :disabled="checkObj.type==='query'" clearable placeholder="请选择应收付类型">
              <el-option v-for="item in arApTypeList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="addForm.price" controls-position="right" @change="handleChange" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
      <el-button type="primary" @click="submitDialog('addForm')">保 存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
    <div v-if="dialogVisible">
      <el-dialog :title="dialogTitle" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%">
        <v-sel-waste-info :selCode="selCode" :selClassCode="addForm.wasteClassCode" @changeSelDialogVisible="changeDialogFormVisibleP"></v-sel-waste-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import SelWasteInfo from './selWasteInfo'
  import {
    saveContractPrice,
    listValidTaxRateInfo,
    getCodeAndNameDic,
    getClassCode,
    getWasteCode
  } from '@/assets/js/API/api'
  export default {
    name: 'addPriceDetail',
    data() {
      return {
        selCode: '',
        formLabelWidth: '110px',
        typeList: [],
        priceMannerList: [],
        chkTaxInclusive: true,
        taxRateList: [],
        wasteClassCodeList: [],
        wasteCodeList: [],
        packageTypeList: [],
        arApTypeList: [],
        dialogVisible: false,
        addForm: {
          contractId: '',
          type: 'dispose_expense',
          priceManner: 'unit_price',
          taxInclusive: 1,
          taxRate: '17',
          wasteClassCode: '',
          wasteCode: '',
          wasteName: '',
          wasteId: '',
          packageType: 'ALL',
          arApType: 'R',
          price: 0,
          remark: ''
        },
        classCodes: [],
        wasteCodes: [],
        wasteForm: [],
        wasteFeatures: [],
        addFormRules: {
          type: [{
            required: true,
            message: '请选择费用类型',
            trigger: 'change'
          }],
          priceManner: [{
            required: true,
            message: '请选择计价方式',
            trigger: 'change'
          }],
          taxRate: [{
            required: true,
            message: '请选择税率',
            trigger: 'change'
          }],
          packageType: [{
            required: true,
            message: '请选择包装类型',
            trigger: 'change'
          }],
          arApType: [{
            required: true,
            message: '请选择应收应付类型',
            trigger: 'change'
          }],
          price: [{
            required: true,
            message: '请输入价格',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      'v-sel-waste-info': SelWasteInfo
    },
    mounted() {
      this.getCodeAndNameDicCostType();
      this.getCodeAndNameDicPriceManner();
      this.getCodeAndNameDicTaxRate();
      this.getCodeAndNameDicPackageType();
      this.getCodeAndNameDicArApType();
      if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
        this.addForm = this.checkObj.data
        this.chkTaxInclusive = this.addForm.taxInclusive == 1 ? true : false;
        this.addForm.contractId = this.checkObj.data.headGuid;
      } else {
        this.addForm.contractId = this.checkObj.data.headGuid;
      }
    },
    props: ['checkObj'],
    methods: {
      chkTaxInclusiveChange() {
        this.addForm.taxInclusive = this.chkTaxInclusive ? 1 : 0
      },
      clearWaste() {
        var vm = this;
        vm.addForm.wasteClassCode = ''
        vm.addForm.wasteCode = '';
        vm.addForm.wasteId = '';
        vm.addForm.wasteName = '';
      },
      changeDialogFormVisibleP(data) {
        var vm = this;
        vm.dialogVisible = false;
        if (vm.selCode == 8) {
          vm.addForm.wasteClassCode = data[0].classCode;
          vm.addForm.wasteCode = data[0].wasteCode;
          vm.addForm.wasteId = data[0].id;
          vm.addForm.wasteName = data[0].entWasteName;
        } else if (vm.selCode == 2) {
          if (vm.addForm.wasteClassCode != data[0].code) {
            vm.addForm.wasteClassCode = data[0].code;
            vm.addForm.wasteCode = '';
            vm.addForm.wasteId = '';
            vm.addForm.wasteName = '';
          }
        }

      },
      selWasteCodeList(val) {
        this.selCode = val;
        if (val == 8) {
          this.dialogTitle = "选择国家八位码";
          this.dialogVisible = true;
        } else if (val == 2) {
          this.dialogTitle = "选择国家二位码";
          this.dialogVisible = true;
        }

      },
      getCodeAndNameDicArApType() {
        let _this = this
        let postData = {
          typeCode: 'RPTYPE'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.arApTypeList = res.data
          }).catch(() => {})
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
      getCodeAndNameDicTaxRate() {
        let _this = this
        let postData = {
          startTime: new Date().getFullYear() + '-01-01 00:00:00',
          endTime: new Date().getFullYear() + '-12-31 23:59:59'
        }
        listValidTaxRateInfo(postData)
          .then(res => {
            _this.taxRateList = res.data
          }).catch(() => {})
      },
      getCodeAndNameDicPriceManner() {
        let _this = this
        let postData = {
          typeCode: 'price_type'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.priceMannerList = res.data
          }).catch(() => {})
      },
      getCodeAndNameDicCostType() {
        let _this = this
        let postData = {
          typeCode: 'contract_expense_type'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.typeList = res.data
          }).catch(() => {})
      },
      handleChange(value) {
        console.log(value);
      },
      submitDialog(formName) {
        let _this = this
        let postData = this.addForm
        postData.entId = localStorage.getItem('id')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            saveContractPrice(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                this.$emit('reload', true)
              }).catch(() => {})
          }
        })
      },
      cancelForm() {
        this.$emit('changeDialogFormVisible', false)
      },
      getCodeAndNameDicWasteForm() {
        let _this = this
        let postData = {
          typeCode: 'wasteForm'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.addForm.form || (_this.addForm.form = res.data[0].code)
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
            _this.addForm.features || (_this.addForm.features = res.data[0].code)
            _this.wasteFeatures = res.data
          }).catch(() => {})
      },
      getClassCode() {
        let _this = this
        getClassCode()
          .then(res => {
            _this.classCodes = res.data
          }).catch(() => {})
      },
      getWasteCode() {
        let _this = this
        getWasteCode()
          .then(res => {
            _this.wasteCodes = res.data
          }).catch(() => {})
      },
      getWasteCodes() {
        let _this = this
        this.addForm.wasteCode = ''
        // if (!_this.addForm.wasteCode) {
        getWasteCode({
          code: _this.addForm.classCode
        }).then(res => {
          _this.addForm.wasteCode = res.data.length ? res.data[0].code : ''
          _this.wasteCodes = res.data
          // console.log(res)
        }).catch(() => {})
        // }
      },
      getClassCodes() {
        let _this = this
        // if (!_this.addForm.classCode) {
        getClassCode({
          code: _this.addForm.wasteCode
        }).then(res => {
          _this.addForm.classCode = res.data[0].code
          // _this.classCodes = res.data
          // console.log(res)
        }).catch(() => {})
        // }
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
