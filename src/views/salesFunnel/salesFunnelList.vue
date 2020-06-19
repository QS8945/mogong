<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="客户：">
          <el-input v-model="queryForm.name" clearable @keyup.enter.native="queryData" placeholder="请输入产废单位"></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <v-common-cascader v-if="cantonVisible" :cantonName="queryForm.cantonName" :cantonOptions="cantonOptions" :showAllLevels="false"
            :clearable="true" :cantonPlaceholder="'请选择区域'" :filterable="true" :changeOnSelect="true" @changeCantonName="changeCantonNameP"></v-common-cascader>
        </el-form-item>
        <el-form-item label="片区：">
          <v-common-cascader v-if="cantonVisible" :cantonName="queryForm.salesAreaName" :cantonOptions="cantonOptions" :showAllLevels="false"
            :clearable="true" :cantonPlaceholder="'请选择片区'" :filterable="true" :changeOnSelect="true" @changeCantonName="changeCantonNamePP"></v-common-cascader>
        </el-form-item>
        <el-form-item label="业务员：">
          <el-select filterable :disabled="isDisableSalesSelect" v-model="queryForm.salesId" clearable placeholder="请选择业务员">
            <el-option v-for="item in empList" :key="item.codide" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" v-if="defaultTabName=='activity'">
          <el-select v-model="queryForm.status" clearable placeholder="请选择状态">
            <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button icon="el-icon-search" @click="queryData">查询</el-button>
          <el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs type="border-card" @tab-click="tabClick" v-model="defaultTabName">
      <el-tab-pane label="我的客户" name="customer">
        <div class="table-content">
          <el-table size="mini" border v-loading="customerLoading" :row-style="rowStyle" :header-cell-style="headClass" stripe ref="multipleTable"
            :data="tableData" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
            <el-table-column align="center" fixed prop="name" label="客户" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="viewEntDetail(scope.row.id)">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cantonName" label="区域">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="salesAreaName" label="片区" width="150">
            </el-table-column>
            <el-table-column align="center" prop="wasteProductionAmt" label="年产废量" width="120">
            </el-table-column>
            <el-table-column align="center" prop="num" label="合同量" width="80">
              <template slot-scope="scope">
                <el-button type="text">{{scope.row.num}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="money" label="合同金额" width="120">
            </el-table-column>
            <el-table-column align="center" prop="transNum" label="转移量" width="80">
              <template slot-scope="scope">
                <el-button type="text">{{scope.row.transNum}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="backMoney" label="回款额" width="120">
            </el-table-column>
            <el-table-column align="center" prop="contacts" label="联系人" width="100">
            </el-table-column>
            <el-table-column align="center" prop="contactsPhone" label="联系电话" width="120">
            </el-table-column>
            <el-table-column align="center" prop="customerCharger" label="业务员" width="100">
            </el-table-column>
            <el-table-column align="center" label="操作" width="188">
              <template slot-scope="scope">
                <span class="operateBtnCls" @click="editEntpriseInfo(scope.row, 'update')" type="text" size="small">
                  编辑
                </span>
                <span class="operateBtnCls" @click="editEntpriseInfo(scope.row, 'query')" type="text" size="small">
                  企业信息
                </span>
                <span class="operateBtnCls" @click="viewCusContractInfo(scope.row,'customer')" type="text" size="small">
                  合同信息
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商务活动" name="activity">
        <div class="table-content">
          <div class="table-content-opt">
            <el-button icon="el-icon-plus" type="primary" size="mini" @click="addBusinessActivity">新增客户</el-button>
            <el-button icon="el-icon-close" :disabled="!(multipleSelection&&multipleSelection.length>0)" size="mini" @click="delBusinessActivity">删除客户</el-button>
          </div>
          <el-table size="mini" border v-loading="activityLoading" :header-cell-style="headClass" stripe ref="multipleTable" :data="actTableData"
            style="width: 100%" height="100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column align="center" fixed prop="name" label="客户" width="180">
              <template slot-scope="scope">
                <el-button v-if="scope.row.businessActivityStatus!=''&&scope.row.businessActivityStatus!='潜在'" type="text" @click="viewEntDetail(scope.row.cusId)">{{scope.row.name}}</el-button>
                <span v-else v-html="scope.row.name"></span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cantonName" label="区域">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="salesAreaName" label="片区" width="150">
            </el-table-column>
            <el-table-column align="center" prop="wasteProductionAmt" label="年产废量" width="120">
            </el-table-column>
            <el-table-column align="center" prop="customerContact" label="联系人" width="120">
            </el-table-column>
            <el-table-column align="center" prop="customerContactPhone" label="联系电话" width="150">
            </el-table-column>
            <el-table-column align="center" prop="salesman" label="业务员" width="120">
              <!--<template slot-scope="scope">-->
                <!--{{getSaleman(scope)}}-->
              <!--</template>-->
            </el-table-column>
            <el-table-column align="center" prop="contractMoney" label="合同金额" width="120">
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="建档日期" width="150">
              <template slot-scope="scope">
                {{formatDate(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="businessActivityStatus" label="状态" width="120">
            </el-table-column>
            <el-table-column align="center" label="操作" width="188">
              <template slot-scope="scope">
                <span class="operateBtnCls" @click="editActivityInfo(scope.row, 'update')" type="text" size="small">
                  编辑
                </span>
                <span v-if="false" class="operateBtnCls" @click="editActivityInfo(scope.row, 'waste')" type="text" size="small">
                  危废信息
                </span>
                <span class="operateBtnCls" @click="viewCusContractInfo(scope.row,'activity')" type="text" size="small">
                  合同信息
                </span>
                <span class="operateBtnCls" @click="setChargeEmp(scope.row,'setCharge')" type="text" size="small">
                  分配业务经理
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="dialogFormVisible">
            <el-dialog left :visible.sync="dialogFormVisible" @close="closeNewDialogClick" :close-on-click-modal="false" width="50%">
              <div slot="title" class="dialog-title" style="text-align:left;">
                <div>
                  <span class="green-line"></span>分配业务经理</div>
              </div>
              <v-set-chargeemp @reload="reloadP" :setCheckObj="checkObjP" @changeAddContactsVisible="changeAddContactsVisibleP"></v-set-chargeemp>
            </el-dialog>
          </div>
          <div class="block">
            <v-pagination :current="actPage.current" :sizes="actPage.sizes" :size="actPage.size" :total="actPage.total" @reloadPage="jumpActPage"
              @reloadSize="jumpActSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import SetChargeEmp from '@/views/salesFunnel/dialog/setChargeEmp'
  import Pagination from '@/components/pagination'
  import Canton from '@/components/canton'
  import CommonCascader from '@/components/commonCascader'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getCodeAndNameDic,
    getAllSySCanton,
    getCustomerEnterpriseListPage,
    getSysRoleEmploee,
    listBusinessActivityBaseInfo,
    deleteBusinessActivityBaseInfo,
    getSysEmpId,
    exportBusinessActivityBaseInfo,
    exportCustomerEnterpriseListPage

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
        isDisableSalesSelect: false,
        empList: [],
        cantonVisible: false,
        cantonOptions: [],
        statusList: [],
        activityLoading: true,
        customerLoading: true,
        defaultTabName: 'customer',
        tableData: [],
        actTableData: [],
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
        actPage: {
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
      'v-canton': Canton,
      'v-common-cascader': CommonCascader,
      'v-set-chargeemp': SetChargeEmp
    },
    created() {
      var vm = this;
      if (this.$route.query && this.$route.query.defaultTabName && this.$route.query.defaultTabName != "") {
        this.defaultTabName = this.$route.query.defaultTabName;
      }
      this.getStatusList();
      this.getAllSySCanton()
      this.getSysRoleEmploee()
      getSysEmpId()
        .then(res => {
          if (res.data && res.data != '') {
            vm.queryForm.salesId = res.data
            vm.isDisableSalesSelect = true;
          }
          vm.getData();
        }).catch(() => {
          vm.getData();
        })
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
      closeNewDialogClick() {
        this.getData();
      },
      changeAddContactsVisibleP (val) {
        this.dialogFormVisible = val
      },
      reloadP (val) {
        this.getData();
      },
      setChargeEmp (row) {
        this.dialogFormVisible = true
        this.checkObjP = row
      },
      changeCantonNameP(val) {
        this.queryForm.cantonName = val
      },
      changeCantonNamePP(val) {
        this.queryForm.salesAreaName = val
      },
      getAllSySCanton() {
        let _this = this
        getAllSySCanton()
          .then(res => {
            _this.cantonOptions = res.data
            _this.cantonVisible = true
          }).catch(() => {})
      },
      getStatusList() {
        var vm = this;
        let postData = {
          typeCode: "businessActivityStatus"
        };
        getCodeAndNameDic(postData).then(res => {
          vm.statusList = res.data;
        }).catch(() => {});
      },
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      // getSaleman (scope) {
      //   if(scope.row.saleman2) {
      //     return scope.row.saleman2
      //   }else{
      //     return scope.row.salesman
      //   }
      // },
      rowStyle({
        row,
        rowIndex
      }) {
        if (rowIndex === 0) {
          return 'height:80px'
        } else {
          return ''
        }
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      addBusinessActivity() {
        var vm = this;
        vm.checkObjP.type = "add";
        this.$router.push({
          path: '/businessActivityAdd',
          query: vm.checkObjP
        })
      },
      delBusinessActivity() {
        let _this = this
        this.$confirm('确认删除所勾选的商务活动吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          _this.multipleSelection.forEach(element => {
            postData.push(element.id);
          });
          deleteBusinessActivityBaseInfo(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      viewCusContractInfo(row, type) {
        var vm = this;
        vm.checkObjP.cusId = row.cusId;
        if (type == 'activity') {
          vm.checkObjP.businessActivityId = row.id;
        }
        vm.checkObjP.type = type
        vm.$router.push({
          path: '/web/saorder/newOrderPage/saorderheadList.htm',
          query: vm.checkObjP
        })
      },
      editActivityInfo(row, type) {
        var vm = this;
        vm.checkObjP.data = row.id;
        vm.checkObjP.type = type
        vm.$router.push({
          path: '/businessActivityAdd',
          query: vm.checkObjP
        })
      },
      viewEntDetail(cusId) {
        var vm = this;
        vm.checkObjP.data = cusId;
        vm.checkObjP.type = 'query'
        vm.checkObjP.activeName = 'companyInfo'
        vm.$router.push({
          path: '/enterpriseInfoAdd',
          query: vm.checkObjP
        })
      },
      editEntpriseInfo(row, type) {
        var vm = this;
        vm.checkObjP.data = row.id;
        vm.checkObjP.type = type
        vm.checkObjP.activeName = 'companyInfo'
        vm.$router.push({
          path: '/enterpriseInfoAdd',
          query: vm.checkObjP
        })
      },
      tabClick(data) {
        let _this = this;
        _this.defaultTabName = data.name;
        _this.getData();
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
      getSysRoleEmploee() {
        let _this = this
        getSysRoleEmploee()
          .then(res => {
            _this.empList = res.data
          }).catch(() => {})
      },
      getData() {
        let _this = this
        if (this.defaultTabName == "activity") {
          _this.activityLoading = true;
          let postData = {
            entId: localStorage.getItem('id'),
            current: this.actPage.current,
            size: this.actPage.size,
            name: _this.queryForm.name, //客户
            createUserId: _this.queryForm.salesId, //        业务员
            businessActivityStatus: _this.queryForm.status
          }
          postData.cantonName = JSON.stringify(this.queryForm.cantonName)
          postData.salesAreaName = JSON.stringify(this.queryForm.salesAreaName)
          listBusinessActivityBaseInfo(postData)
            .then(res => {
              _this.actTableData = res.data.page.records;
              _this.actPage.total = res.data.page.total
              _this.activityLoading = false;
            }).catch(() => {})
        } else {
          let _this = this
          _this.customerLoading = true;
          let postData = {
            id: localStorage.getItem('id'),
            size: this.page.size,
            current: this.page.current,
            name: _this.queryForm.name, //客户
            customerCharger: _this.queryForm.salesId, //        负责人
          }
          postData.cantonName = JSON.stringify(this.queryForm.cantonName)
          postData.salesAreaName = JSON.stringify(this.queryForm.salesAreaName)
          getCustomerEnterpriseListPage(postData)
            .then(res => {
              _this.tableData = res.data.records;
              _this.page.total = res.data.total
              _this.customerLoading = false;
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
      jumpActPage(index) {
        this.actPage.current = index
        this.getData()
      },
      jumpActSize(val) {
        this.actPage.size = val
        this.actPage.current = 1
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
      },
      //导出
      exportExcel () {
        let _this = this
        if (this.defaultTabName == "activity") {
          let postData = {
            entId: localStorage.getItem('id'),
            name: _this.queryForm.name, //客户
            createUserId: _this.queryForm.salesId, //        业务员
            businessActivityStatus: _this.queryForm.status
          }
          postData.cantonName = JSON.stringify(this.queryForm.cantonName)
          postData.salesAreaName = JSON.stringify(this.queryForm.salesAreaName)
          exportBusinessActivityBaseInfo(postData)
          .then(res => {
            let url
            url = GLB_CONSTANT.devUrl.serviceSiteRootUrl + '/' + res.data
            window.location.href = url
          }).catch(() => {})
        } else {
          let _this = this
          let postData = {
            id: localStorage.getItem('id'),
            name: _this.queryForm.name, //客户
            customerCharger: _this.queryForm.salesId, //        负责人
          }
          postData.cantonName = JSON.stringify(this.queryForm.cantonName)
          postData.salesAreaName = JSON.stringify(this.queryForm.salesAreaName)
          exportCustomerEnterpriseListPage(postData)
          .then(res => {
            let url
            url = GLB_CONSTANT.devUrl.serviceSiteRootUrl + '/' + res.data
            window.location.href = url
          }).catch(() => {})
        }

      },
    }
  }

</script>

<style lang="scss">
  .el-tabs {
    height: 100%;
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      height: calc(100% - 41px);
      overflow: auto;
      /*border-right: 1px solid #E4E7ED;*/
      /*border-left: 1px solid #E4E7ED;*/
      /*border-bottom: 1px solid #E4E7ED;*/
      .el-tab-pane {
        height: 100%;
      }
    }
  }

  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
