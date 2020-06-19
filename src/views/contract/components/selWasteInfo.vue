<template>
  <div>
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="二位码：">
          <el-input v-model="queryForm.classCode" @keyup.enter.native="queryData" placeholder="请输入二位码" clearable></el-input>
        </el-form-item>
        <el-form-item label="八位码：" v-if="selCode==8">
          <el-input v-model="queryForm.wasteCode" @keyup.enter.native="queryData" placeholder="请输入八位码" clearable></el-input>
        </el-form-item>
        <el-form-item label="危废俗称：" v-if="selCode==8">
          <el-input v-model="queryForm.entWasteName" @keyup.enter.native="queryData" placeholder="请输入危废俗称" clearable></el-input>
        </el-form-item>
        <el-form-item label="已删除危废：" v-if="selCode==8">
          <el-checkbox v-model="queryForm.valid"></el-checkbox>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <el-button :disabled="!selectItems||selectItems.length!=1" @click="selectWaste">选择</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <v-table :tableHeight="250" :dataTable="records" :selection="true" @reloadSelect="selectChange"></v-table>
    </div>
    <div class="block">
      <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
    </div>
  </div>
</template>

<script>
  import CustomTable from '@/components/customTable'
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getEnterpriseWaste,
    deleteEnterpriseWaste,
    getClassCode,
    pageClassCode
  } from '@/assets/js/API/api'

  export default {
    name: 'selWasteInfo',
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
          entWasteName: ''
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
        records: {},
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
      'v-table': CustomTable,
      'v-pagination': Pagination
    },
    created() {
      if (this.selCode == 8) {
        if (this.selClassCode && this.selClassCode != "") {
          this.queryForm.classCode = this.selClassCode;
        }
      }
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
      selCode: { // 默认数据
        type: String
      },
      selClassCode: {
        type: String
      }
    },
    methods: {
      dblClick(row, column, event) {
        alert(12);
        this.$emit('changeSelDialogVisible', row)
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
        if (_this.selCode == 8) {
          let postData = {
            // entId: localStorage.getItem('id'),
            current: this.page.current,
            size: this.page.size,
            deletedWaste: this.queryForm.deletedWaste,
            classCode: this.queryForm.classCode,
            wasteCode: this.queryForm.wasteCode,
            entWasteName: this.queryForm.entWasteName,
            valid: this.queryForm.valid ? 0 : 1
          }
          getEnterpriseWaste(postData)
            .then(res => {
              res.data.tableHead = [{
                'value': 'classCode',
                'name': '二位码'
              }, {
                'value': 'wasteCode',
                'name': '八位码'
              }, {
                'value': 'entWasteName',
                'name': '危废俗称'
              }, {
                'value': 'form',
                'name': '危废形态'
              }, {
                'value': 'wasteTypeCode',
                'name': '危废类型'
              }]
              _this.records = res.data
              _this.page.total = res.data.total
            }).catch(() => {})
        } else if (_this.selCode == 2) {
          pageClassCode({
              current: _this.page.current,
              size: _this.page.size,
              code: _this.queryForm.classCode
            })
            .then(res => {
              res.data.tableHead = [{
                'value': 'code',
                'name': '二位码'
              }, {
                'value': 'name',
                'name': '二位码名称'
              }]
              _this.records = res.data
              _this.page.total = res.data.total
            }).catch(() => {})
        }
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
        console.log(this.multipleSelection)
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

</style>
