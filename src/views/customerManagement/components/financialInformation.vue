<template>
  <div class="bussiness-info">
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="财务编号：" :prop="(checkObj.type==='query') ? '' : 'financeCode'">
                <el-input v-model="form.financeCode" :disabled="checkObj.type==='query'" placeholder="请输入财务编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式：" :prop="(checkObj.type==='query') ? '' : 'payment'">
                <el-select :disabled="checkObj.type==='query'" v-model="form.payment" clearable filterable
                           placeholder="请选择结算方式">
                  <el-option
                          v-for="item in payments"
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
              <el-form-item label="开户银行：" :prop="(checkObj.type==='query') ? '' : 'openingBank'">
                <el-select :disabled="checkObj.type==='query'" v-model="form.openingBank" clearable filterable
                           placeholder="请选择开户银行">
                  <el-option
                          v-for="item in openingBanks"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号：" :prop="(checkObj.type==='query') ? '' : 'account'">
                <el-input v-model="form.account" :disabled="checkObj.type==='query'" placeholder="请输入银行账号"></el-input>
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
                <el-button type="primary" @click="saveData('form')">保存</el-button>
                <el-button @click="cancelData">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { getSysCanton, addCustomerEnterprise, editCustomerEnterprise, getDispCodeAndNameDic, getIndustry, getEnterpriseInfo, getSysRoleEmploee, addFinacialInformation, getFinacialInformation, editFinacialInformation, getCodeAndNameDic } from '@/assets/js/API/api'

export default {
  name: 'businessBaseInfo',
  data () {
    return {
      form: {
        account: '',
        openingBank: '',
        payment: '',
        financeCode: '',
        remark: ''
      },
      checkObj: {
        type: 'add'
      },
      formRules: {
        openingBank: [{ required: true, message: '请输入', trigger: 'change' }],
        account: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      openingBanks: [],
      payments: [],
      optType: 'add'
    }
  },
  created () {
    this.getData()
    this.getCodeAndNameDicSettlementMethod()
    this.getCodeAndNameDicOpeningBank()
  },
  methods: {
    getData () {
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
      let _this = this
      let postData = {
        entRelationId: this.$route.query.data
      }
      getFinacialInformation(postData)
        .then(res => {
          if (res.data) {
            this.optType = 'update'
            _this.form = res.data
          } else {
            this.optType = 'add'
          }
        }).catch(() => {
        })
    },
    saveData (formName) {
      let _this = this
      let postData = JSON.parse(JSON.stringify(this.form))
      postData.entRelationId = this.$route.query.data
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.optType === 'add') {
            addFinacialInformation(postData)
              .then(res => {
                COMMONJS.showToast('新增成功')
                _this.getData()
              }).catch(() => {
              })
          } else if (_this.optType === 'update') {
            editFinacialInformation(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                _this.getData()
              }).catch(() => {
              })
          }
        } else {
          return false
        }
      })
      // console.log(this.form)
    },
    getCodeAndNameDicSettlementMethod () {
      let _this = this
      let postData = {
        typeCode: 'settlementMethod'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.form.payment || (_this.form.payment = res.data[0].code)
          _this.payments = res.data
        }).catch(() => {
        })
    },
    getCodeAndNameDicOpeningBank () {
      let _this = this
      let postData = {
        typeCode: 'openingBank'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.form.openingBank || (_this.form.openingBank = res.data[0].code)
          _this.openingBanks = res.data
        }).catch(() => {
        })
    },
    cancelData () {
      this.$router.push({
        path: '/customerInfoManagement'
      })
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
  }
  .add-dialog-footer{
    margin-left: 120px;
  }
  .padding-left-none{
    padding-left: 0 !important;
  }
</style>
