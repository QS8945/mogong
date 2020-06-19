<template>
  <div>
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="产废企业：">
          <el-input v-model="queryForm.cusName" @keyup.enter.native="queryData" placeholder="请输入产废企业" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input v-model="queryForm.hetongCode" @keyup.enter.native="queryData" placeholder="请输入合同编号" clearable></el-input>
        </el-form-item>
          <el-button @click="queryData">查询</el-button>
          <el-button :disabled="!selectItems||selectItems.length!=1" @click="selectContract">选择</el-button>
          <el-button :disabled="!selectItems||selectItems.length!=1" @click="viewContract">查看</el-button>
      </el-form>
    </div>
    <div class="table-content">
      <el-table :data="records" style="width: 100%" height="250" @selection-change="selectChange">
        <el-table-column label="顺序" type="index" width="50">
        </el-table-column>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="sysParamParameter" label="经营合同状态" width="120">
        </el-table-column>
        <el-table-column prop="hetongCode" label="合同编号" width="120">
        </el-table-column>
        <el-table-column prop="baseCustomerCusName" label="产废单位">
        </el-table-column>
        <el-table-column prop="dateF" :formatter="formatDate" label="开始日期" width="120">
        </el-table-column>
        <el-table-column prop="dateT" :formatter="formatDate" label="截止日期" width="120">
        </el-table-column>
        <el-table-column prop="baseEmpName" label="业务员" width="120">
        </el-table-column>
        <el-table-column prop="isTotalAmt" label="是否整单金额" width="120">
          <template slot-scope="scope">
            {{isTotalAmt==='1'?'是':'否'}}
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
      <div v-if="dialogFormVisible">
        <el-dialog append-to-body title="查看经营合同详细信息" left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
          <v-sign-all-info :headId="selectItems[0].guid" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
            @reload="reloadP"></v-sign-all-info>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import SignAllInfo from './signAllInfo.vue'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageContractAboutRenewAndSupplement
  } from '@/assets/js/API/api'

  export default {
    name: 'selSignInfo',
    data() {
      let validateContactWay = (rule, value, callback) => {
        if (!value) callback()
        let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
        let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPhone.test(value) && !regTel.test(value)) {
          callback(
            new Error(this.$t('enterprise_info.link_phone') + this.$t('validate.format'))
          )
        } else {
          callback()
        }
      }
      let checkPwd = (rule, value, callback) => {
        if (!value) callback()
        let regPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,64}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPwd.test(value)) {
          callback(
            new Error('由字母、数字、符号组成，长度不能少于8位')
          )
        } else {
          callback()
        }
      }
      return {
        queryForm: {
          valid: false,
          classCode: '',
          wasteCode: '',
          entWasteName: '',
          tableData: []
        },
        checkObjP: {},
        dialogFormTitle: '添加',
        queryFormRules: {
          tel: [{
            validator: validateContactWay,
            trigger: 'change'
          }]
        },
        statusOptions: [{
          label: '启动',
          value: '1'
        }, {
          label: '停用',
          value: '2'
        }],
        selectItems: [],
        openDelay: 500,
        records: [],
        page: {
          current: GLB_CONSTANT.page.current,
          size: GLB_CONSTANT.page.size,
          total: 0
        },
        // dialog
        multipleSelection: [],
        dialogFormVisible: false,
        addForm: {
          tel: '',
          name: '',
          password: ''
        },
        addFormRules: {
          tel: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'change'
            },
            {
              validator: validateContactWay,
              trigger: 'change'
            }
          ],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'change'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              validator: checkPwd,
              trigger: 'change'
            }
          ]
        },
        resetPwdFormVisible: false,
        resetPwdForm: {
          newPassword: ''
        },
        resetPwdFormRules: {
          newPassword: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              validator: checkPwd,
              trigger: 'change'
            }
          ]
        }
      }
    },
    // 组件
    components: {
      'v-sign-all-info': SignAllInfo,
      'v-pagination': Pagination
    },
    created() {
      this.getData()
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    props: {
      signType: { // 默认数据
        type: String
      }
    },
    methods: {
      selectContract(){
        var vm = this;
        this.selectItems.forEach(element => {
          element.currentSignType = vm.signType;
        });
        this.$emit('changeSelDialogVisible', this.selectItems)
      },
      viewContract() {
        this.dialogFormVisible = true;
      },
      formatDate(row, column) {
        var time = row[column.property];
        if (time === undefined) {
          return "";
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      enterpriseEntry() {
        this.$router.push({
          path: '/enterpriseEntry'
        })
      },
      selectChange(data) {
        this.selectItems = data;
      },
      selectWaste() {
        this.$emit('changeSelDialogVisible', this.selectItems)
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id'),
          current: this.page.current,
          size: this.page.size,
          state: 'check',
          signType: this.signType,
          hetongCode: this.queryForm.hetongCode,
          cusName: this.queryForm.cusName
        }
        pageContractAboutRenewAndSupplement(postData)
          .then(res => {
            _this.records = res.data.records
            _this.page.total = res.data.total
          }).catch(() => {})
      },
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      },
      addUserData() {
        this.checkObjP = {
          type: 'add',
          data: {}
        }
        this.dialogFormVisible = true
      },
      handleCurrentChange(index) {
        this.page.current = index
        this.getData()
      },
      handleSizeChange(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      lookInfo(row) {
        console.log(row)
      },
      delSection(obj) {
        let _this = this
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            enterpriseWasteId: obj.id
          }
          deleteEnterpriseWaste(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleCommand(command) {
        if (command.act === 'on') {
          console.log(command.row)
          this.enableONOFF(command.row)
          // COMMONJS.getLoginOut()
        } else if (command.act === 'resetPwd') {
          this.resetPwdFormVisible = true
          console.log(command.row)
          // this.$router.push('/changePassword')
        } else if (command.act === 'setAdmin') {
          console.log(command.row)
          this.setAdmin(command.row)
        }
      },
      submitResetDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.resetPwdFormVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      enableONOFF(rowData) {
        if (rowData) {
          this.$confirm('确认' + (rowData.status === '0' ? '启用' : '停用') + '？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(rowData.status === '0' ? '启用' : '停用')
            rowData.status = rowData.status === '0' ? '1' : '0'
            rowData.statusName = rowData.status === '1' ? '启用' : '停用'
          })
        }
      },
      setAdmin(rowData) {
        if (rowData) {
          this.$confirm('确认设为管理员？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {})
        }
      }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .el-form--inline .el-form-item{
    margin-right: 5px;
  }

</style>
