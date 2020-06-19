<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="合同编号：">
          <el-input v-model="queryForm.hetongCode" clearable @keyup.enter.native="queryData" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="合同开始日期：">
          <el-date-picker style="width:150px;" v-model="queryForm.startDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期：">
          <el-date-picker style="width:150px;" v-model="queryForm.endDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同状态：">
          <el-select v-model="queryForm.status" clearable placeholder="请选择合同状态">
            <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <el-button class="back-to-customer" type="text" @click="backToSalesFunnel" plain>
            <span class="icon iconfont iconfanhui"></span>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
      </div>
      <el-table show-summary stripe ref="multipleTable" :data="tableData" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
        <el-table-column fixed prop="hetongCode" label="合同编号" width="150">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.hetongCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" label="开始日期">
        </el-table-column>
        <el-table-column prop="fileType" label="结束日期" width="150">
        </el-table-column>
        <el-table-column prop="fileDesc" label="八位码" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="危废俗称" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="签单日期" width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="合同量" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="单价(不含税)" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="合同额" width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="含运费" width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="运输单价(吨/元)" width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="已收货" width="150">
          <template slot-scope="scope">
            <el-button type="text">{{scope.row.createTime}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="已回款" width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="业务状态" width="120">
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import Canton from '@/components/canton'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageFileList,
    saveFileList,
    deleteFileList
  } from '@/assets/js/API/api'

  export default {
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
        defaultTabName: 'customer',
        currentTabName: '',
        tableData: [],
        queryForm: {
          valid: false,
          classCode: '',
          wasteCode: '',
          entWasteName: ''
        },
        checkObjP: {},
        dialogFormTitle: '添加',
        dialogFormVisible: false,
        openDelay: 500,
        page: {
          current: GLB_CONSTANT.page.current,
          size: 10,
          total: 0,
          sizes: [5, 10, 50]
        },
        multipleSelection: [],
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
      'v-pagination': Pagination,
      'v-canton': Canton
    },
    created() {
      this.currentTabName = this.defaultTabName;
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
    methods: {
      backToSalesFunnel() {
        this.$router.push({
          path: '/salesFunnel'
        })
      },
      editEntpriseInfo() {
        var vm = this;
        vm.checkObjP.data = "b644591c68e946afb574fe7e3bfb908f";
        vm.checkObjP.type = "update"
        vm.checkObjP.activeName = 'companyInfo'
        vm.$router.push({
          path: '/enterpriseInfoAdd',
          query: vm.checkObjP
        })
      },
      tabClick(data) {
        this.currentTabName = data.name;
      },
      deleteFiles() {
        let _this = this
        this.$confirm('确认删除所勾选的文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          _this.multipleSelection.forEach(element => {
            postData.push(element.id);
          });
          deleteFileList(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          current: this.page.current,
          size: this.page.size,
          sourceId: this.headId,
          sourceType: 'contract',
          wasteName: this.queryForm.fileName,
          startDate: this.queryForm.startDate,
          endDate: this.queryForm.endDate
        }
        pageFileList(postData)
          .then(res => {
            _this.tableData = res.data.records;
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
      handleCurrentChange(index) {
        this.page.current = index
        this.getData()
      },
      handleSizeChange(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
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


  .mainArea {
    margin-top: 5px;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
