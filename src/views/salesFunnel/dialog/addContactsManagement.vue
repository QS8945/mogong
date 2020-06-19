<template>
  <div class="form-format contacts-management">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-form-item label="联系人" prop="customerContact">
        <el-input v-model="addForm.customerContact" placeholder="请输入联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="customerContactPhone">
        <el-input v-model="addForm.customerContactPhone" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="addForm.contactEmail" placeholder="请输入联系人邮箱"></el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-input v-model="addForm.deptName" placeholder="请输入所属部门"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="addForm.contactPosition" placeholder="请输入职位"></el-input>
      </el-form-item>
      <el-form-item label="是否主要联系人" prop="principal">
        <el-checkbox v-model="isMainLinkMan"></el-checkbox>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="addForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer add-dialog-footer">
      <el-button :loading="saveLoading" type="primary" @click="submitDialog('addForm')">保存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import {
    getCodeAndNameDic,
    getClassCode,
    getWasteCode,
    addContacts,
    editContacts,
    addCustomerContacts,
    editCustomerContacts,
    saveBusinessActivityContactsInfo
  } from '@/assets/js/API/api'
  export default {
    name: 'addWaste',
    data() {
      let validateContactWay = (rule, value, callback) => {
        if (!value) callback()
        let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
        let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
        let regTelephone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPhone.test(value) && !regTel.test(value) && !regTelephone.test(value)) {
          callback(
            new Error('电话号码' + this.$t('validate.format'))
          )
        } else {
          callback()
        }
      }
      let checkEmail = (rule, value, callback) => {
        if (!value) callback()
        if (value) {
          let reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的邮箱'))
            this.sendCodeFlag = true
          } else {
            this.sendCodeFlag = false
            callback()
          }
        }
      }
      return {
        saveLoading: false,
        isMainLinkMan: true,
        addForm: {
          customerContact: '',
          customerContactPhone: '',
          contactEmail: '',
          deptName: '',
          contactPosition: '',
          principal: 0,
          remark: ''
        },
        addFormRules: {
          customerContactPhone: [{
              required: true,
              message: '请输入联系人电话',
              trigger: 'change'
            },
            {
              validator: validateContactWay,
              trigger: 'change'
            }
          ],
          customerContact: [{
            required: true,
            message: '请输入联系人名称',
            trigger: 'change'
          }],
          deptName: [{
            required: true,
            message: '请输入所属部门',
            trigger: 'change'
          }],
          contactPosition: [{
            required: true,
            message: '请输入职位',
            trigger: 'change'
          }],
          contactEmail: [{
              required: true,
              message: '请输入联系人邮箱',
              trigger: 'change'
            },
            {
              validator: checkEmail,
              trigger: 'change'
            }
          ]
        },
        formLabelWidth: '120px',
        dataList: []
      }
    },
    mounted() {
      if (Object.keys(this.editContactsData).length) {
        this.addForm = this.editContactsData
        this.isMainLinkMan = this.addForm.principal == 1 ? true : false;
      }
      if (this.addCheckObj.type == "activityAdd") {
        this.addForm.businessActivityId = this.addCheckObj.businessActivityId;
      }
      // this.getData()
    },
    props: ['entRelationId', 'addCheckObj', 'editContactsData'],
    methods: {
      submitDialog(formName) {
        let _this = this
        _this.addForm.principal = _this.isMainLinkMan ? 1 : 0;
        let postData = this.addForm
        if (!this.addCheckObj.type == "activityAdd") {
          postData.entRelationId = this.entRelationId
        }
        if (this.addCheckObj.type == "customerAdd") {
          postData.ownerEntId = localStorage.getItem('id');
          postData.entId = _this.addCheckObj.entId;
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.saveLoading = true;
            if (_this.addCheckObj.type === 'update') {
              editCustomerContacts(postData)
                .then(res => {
                    _this.saveLoading = false;
                    COMMONJS.showToast('更新成功')
                    this.$emit('changeAddContactsVisible', false)
                    this.$emit('reload', true)
                }).catch(() => {})
            } else if (_this.addCheckObj.type === 'customerAdd') {
              addCustomerContacts(postData)
                .then(res => {
                    _this.saveLoading = false;
                    COMMONJS.showToast('新增成功')
                    this.$emit('changeAddContactsVisible', false)
                    this.$emit('reload', true)
                }).catch(() => {})
            } else if (_this.addCheckObj.type === 'activityAdd') {
              saveBusinessActivityContactsInfo(postData)
                .then(res => {
                    _this.saveLoading = false;
                    COMMONJS.showToast('新增成功')
                    this.$emit('changeAddContactsVisible', false)
                    this.$emit('reload', true)
                }).catch(() => {})
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancelForm() {
        this.$emit('changeAddContactsVisible', false)
      },
      getCodeAndNameDicWasteForm() {
        let _this = this
        let postData = {
          typeCode: 'wasteForm'
        }
        getCodeAndNameDic(postData)
          .then(res => {
            _this.addForm.form = res.data[0].code
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
            _this.addForm.features = res.data[0].code
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
        getWasteCode({
          code: _this.addForm.classCode
        }).then(res => {
          _this.addForm.wasteCode = res.data.length ? res.data[0].code : ''
          _this.wasteCodes = res.data
        }).catch(() => {})
      },
      getClassCodes() {
        let _this = this
        getClassCode({
          code: _this.addForm.wasteCode
        }).then(res => {
          _this.addForm.classCode = res.data[0].code
        }).catch(() => {})
      },
      optContact(type) {
        switch (type) {
          case 'add':
            this.$emit('optContact', 'add')
            break
        }
      }
    }
  }

</script>

<style>


</style>
