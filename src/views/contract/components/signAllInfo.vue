<template>
  <div class="view-total baseForm">
    <el-collapse v-model="activeName" @change="handleChange" :accordion="isAccordion">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="header-icon el-icon-collection-tag"></i>
          <span class="colTitle">基本信息</span>
        </template>
        <el-form :model="addForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="合同编号：">
                <span>{{addForm.hetongCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否一次性合同：">
                <span>{{addForm.oneOffName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="开始日期：">
                <span>{{formatDate(addForm.dateF)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期：">
                <span>{{formatDate(addForm.dateT)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="产废单位：">
                <span>{{addForm.baseCustomerCusName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务员：">
                <span>{{addForm.baseEmpName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="经营合同状态：">
                <span>{{addForm.sysParamParameter}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型：">
                <span>{{addForm.signTypeName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <i class="header-icon el-icon-notebook-2"></i>
          <span class="colTitle">合同明细</span>
        </template>
        <el-table size="mini" :data="tableData" :sizes="page.sizes" style="width: 100%" height="250">
          <el-table-column prop="sampleStatus" label="送样状态" width="150">
          </el-table-column>
          <el-table-column prop="baseMaterialMatCode" label="八位码" width="120">
          </el-table-column>
          <el-table-column prop="baseMaterialMatName" label="危废俗称" width="120">
          </el-table-column>
          <el-table-column prop="packageTypeName" label="包装类型" width="120">
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="100">
          </el-table-column>
          <el-table-column prop="price" label="处置单价(含税)" width="120">
          </el-table-column>
          <el-table-column prop="priceNoTax" label="处置单价(不含税)" width="120">
          </el-table-column>
          <el-table-column prop="amt" label="处置金额" width="120">
          </el-table-column>
          <el-table-column prop="qty" label="合同量" width="120">
          </el-table-column>
          <el-table-column prop="recQty" label="已入库数量" width="120">
          </el-table-column>
          <el-table-column prop="actResName" label="派车方式" width="120">
          </el-table-column>
          <el-table-column prop="statusName" label="是否暂停" width="120">
          </el-table-column>
          </el-table-column>
        </el-table>
        <div class="block">
          <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <i class="header-icon el-icon-money"></i>
          <span class="colTitle">费用明细</span>
        </template>
        <el-table size="mini" :data="tableDataPrice" style="width: 100%" height="250">
          <el-table-column prop="typeName" label="费用类型" width="150">
          </el-table-column>
          <el-table-column prop="arApTypeName" label="收付类型" width="120">
          </el-table-column>
          <el-table-column prop="priceMannerName" label="计价方式" width="120">
          </el-table-column>
          <el-table-column prop="taxInclusiveName" label="是否含税" width="120">
          </el-table-column>
          <el-table-column prop="taxRateName" label="税率" width="100">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
          </el-table-column>
          <el-table-column prop="wasteCode" label="八位码" width="120">
          </el-table-column>
          <el-table-column prop="wasteName" label="危废俗称" width="120">
          </el-table-column>
          <el-table-column prop="packageTypeName" label="包装类型" width="120">
          </el-table-column>
          <el-table-column prop="vehicleTypeName" label="车辆类型" width="120">
          </el-table-column>
          <el-table-column prop="transportAreaName" label="运输区域" width="120">
          </el-table-column>
        </el-table>
        <div class="block">
          <v-pagination :current="pagePrice.current" :sizes="pagePrice.sizes" :size="pagePrice.size" :total="pagePrice.total" @reloadPage="jumpPagePrice"
            @reloadSize="jumpSizePrice"></v-pagination>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" v-if="addForm.state=='commit'">
        <template slot="title">
          <i class="header-icon el-icon-check"></i>
          <span class="colTitle">审核信息</span>
        </template>
        <el-form :model="auditForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="审核意见">
                <el-input :rows="5" placeholder="请输入审核意见" type="textarea" v-model="auditForm.comment"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:center">
          <el-button type="primary" @click="auditContractProcess('yes')">同意
          </el-button>
          <el-button @click="auditContractProcess('')">拒绝
          </el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5" v-if="addForm.procInsId&&addForm.procInsId!=''&&addForm.procInsId!=null">
        <template slot="title">
          <i class="header-icon el-icon-position"></i>
          <span class="colTitle">流转信息</span>
        </template>
        <v-list-process-info ref="mychild" :procInsId='addForm.procInsId'></v-list-process-info>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import AddWaste from '@/views/baseDataManagement/dialog/addWaste'
  import ListProcessInfo from './listProcessInfo.vue'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    queryMSWMSAOrderHeadByID,
    queryMSWMSAOrderLineByHeadID,
    pageContractPrice,
    auditContractProcess,
    createCostDetail
  } from '@/assets/js/API/api'

  export default {
    name: 'signAllInfo',
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
        formLabelWidth: '130px',
        addForm: {

        },
        auditForm: {
          comment: ''
        },
        tableData: [],
        tableDataPrice: [],
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
        openDelay: 500,
        records: {},
        page: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        },
        pagePrice: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        }
      }
    },
    // 组件
    components: {
      'v-pagination': Pagination,
      'v-list-process-info': ListProcessInfo
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
      headId: { // 默认数据
        type: String
      },
      activeName: { // 默认数据
        type: String,
        default: '1'
      },
      isAccordion: { // 默认数据
        type: Boolean
      }
    },
    methods: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submit() {
        startProcess();
      },
      chushen() {
        alert(2);
      },
      fushen() {
        alert(3);
      },
      enterpriseEntry() {
        this.$router.push({
          path: '/enterpriseEntry'
        })
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      //用来生成整单的费用
      createCostDetail() {
        var vm = this;
        let postData = {};
        postData.ticket = localStorage.getItem('token');
        postData.guid = vm.addForm.guid;
        createCostDetail(postData)
          .then(res => {}).catch(() => {})
      },
      auditContractProcess(flag) {
        let vm = this;
        let operation = flag == 'yes' ? "同意" : "拒绝";
        let postData = vm.addForm;
        vm.$confirm('您确认' + operation + '当前合同吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postData.flowInfo = JSON.stringify({
            taskDefKey: "deptLeaderAudit",
            flag: flag,
            procInsId: vm.addForm.procInsId,
            comment: vm.auditForm.comment
          })
          auditContractProcess(postData)
            .then(res => {
              if (res.status == "Success") {
                vm.$alert("审批完成，已" + operation + "！", {
                  type: 'success'
                }).then(function () {
                  vm.getData();
                  //刷新子组件
                  vm.$refs.mychild.getData();
                  vm.activeName = "5";
                  if(flag=='yes'){
                    vm.createCostDetail();
                  }
                });
              }
            }).catch(() => {})
        }).catch(() => {

        });
      },
      getContractDetail() {
        var vm = this;
        let postData = {
          "headId": vm.headId,
          "size": vm.page.size,
          "current": vm.page.current
        }
        queryMSWMSAOrderLineByHeadID(postData)
          .then(res => {
            console.log(res);
            vm.tableData = res.data.records;
            vm.page.total = res.data.total
          }).catch(() => {})
      },
      getPriceList() {
        var vm = this;
        let postDataPrice = {
          contractId: vm.headId,
          pageIndex: vm.pagePrice.current,
          pageSize: vm.pagePrice.size,
        }
        pageContractPrice(postDataPrice)
          .then(res => {
            vm.tableDataPrice = res.data.records
            vm.pagePrice.total = res.data.total
          }).catch(() => {})
      },
      getData() {
        let vm = this
        queryMSWMSAOrderHeadByID(this.headId)
          .then(res => {
            vm.addForm = res.data;
            vm.addForm.oneOffName = vm.addForm.oneOff == 1 ? "是" : "否";
          }).catch(() => {})
        this.getContractDetail();
        this.getPriceList();
      },
      jumpPage(index) {
        this.page.current = index
        this.getContractDetail()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getContractDetail()
      },
      jumpPagePrice(index) {
        this.pagePrice.current = index
        this.getPriceList()
      },
      jumpSizePrice(val) {
        this.pagePrice.size = val
        this.pagePrice.current = 1
        this.getPriceList()
      },
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      },
      operationP(obj) {
        switch (obj.operation) {
          case 'query':
            this.$alert('nothing！');
            break
          case 'update':
            console.log(obj);
            this.checkObjP.type = obj.operation
            this.checkObjP.data = obj.data
            // this.dialogFormTitle = '发起'
            // this.dialogFormVisible = true
            window.open("http://localhost:8082/jsite/a/act/task/form?procDefId=" + obj.data.id);
            break
          case 'delete':
            this.$alert('nothing！');
            break
        }
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

  .el-form-item__content {
    text-align: left;
  }

  .el-collapse-item {
    .header-icon {
      margin-right: 10px;
      font-size: 16px;
    }
    .colTitle {
      font-weight: bold;
      font-size: 16px;
    }
  }

</style>
