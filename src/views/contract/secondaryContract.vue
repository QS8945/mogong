<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="开始日期：">
          <el-date-picker v-model="queryForm.startDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker v-model="queryForm.endDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产废单位：">
          <el-input v-model="queryForm.baseCustomerCusName" @keyup.enter.native="queryData" placeholder="请输入产废单位"></el-input>
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input v-model="queryForm.hetongCode" @keyup.enter.native="queryData" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="签订类型：">
          <el-select v-model="queryForm.signType" clearable placeholder="请选择签订类型">
            <el-option v-for="item in listSignType" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同状态：">
          <el-select v-model="queryForm.contractStatus" clearable placeholder="请选择合同状态">
            <el-option v-for="item in listContractStatus" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-dropdown>
          <el-button type="text" :disabled="addDisabled" icon="el-icon-plus" @click="addNewSign">新签
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="addSupplement">补签</el-dropdown-item>
            <el-dropdown-item @click.native="addContinuous">续签</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="text" :disabled="editDisabled" icon="el-icon-edit" @click="edit">编辑
        </el-button>
        <el-button type="text" :disabled="submitDisabled" icon="el-icon-check" @click="startContractProcess">提交</el-button>
        <el-button type="text" :disabled="cancelDisabled" icon="el-icon-document-remove" @click="cancelContractProcess">撤销</el-button>
        <el-button type="text" :disabled="auditDisabled" icon="el-icon-document-copy" @click="auditContractProcess">审核</el-button>
        <el-button type="text" :disabled="changeDisabled" icon="el-icon-top-right" @click="change">变更</el-button>
        <el-button type="text" :disabled="delDisabled" icon="el-icon-delete" @click="delBatch">删除</el-button>
        <el-button type="text" :disabled="viewDisabled" icon="el-icon-document-copy" @click="viewOrg">查看原合同</el-button>

      </div>
      <v-table :dataTable="records" :selection="true" @operation="operationP" @reloadSelect="chkSelectChange"></v-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!--新签-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" @close="closeNewDialogClick" :close-on-click-modal="false" width="70%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}经营合同</div>
        </div>
        <v-add-new-sign @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-add-new-sign>
      </el-dialog>
    </div>

    <!--查看原合同-->
    <div v-if="dialogViewOrgVisible">
      <el-dialog :visible.sync="dialogViewOrgVisible" :close-on-click-modal="false" width="70%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}经营合同</div>
        </div>
        <v-sign-all-info :headId="headId"></v-sign-all-info>
      </el-dialog>
    </div>

    <!--续签补签选择页面-->
    <div v-if="dialogSelSignVisible">
      <el-dialog :visible.sync="dialogSelSignVisible" :close-on-click-modal="false" width="70%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>请选择要{{checkObjP.type=='supplement'?'补签':'续签'}}的经营合同</div>
        </div>
        <v-sel-sign-info @changeSelDialogVisible="changeSelDialogFormVisibleP" :signType="checkObjP.type"></v-sel-sign-info>
      </el-dialog>
    </div>

    <div v-if="cancelContractVisible">
      <el-dialog :visible.sync="cancelContractVisible" :close-on-click-modal="false" width="30%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>撤销合同申请</div>
        </div>
        <el-input type="textarea" :rows="4" placeholder="请输入撤销原因......" v-model="cancelReason">
        </el-input>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button @click="cancelContractVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureCancelContract">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import AddNewSign from './components/addNewSign'
import SelSignInfo from './components/selSignInfo.vue'
import SignAllInfo from './components/signAllInfo'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  getCodeAndNameDic,
  queryPageMSWMSAOrderHead,
  delMSWMSAOrderHeadByIDs,
  startContractProcess,
  auditContractProcess,
  cancelContractProcess
} from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    let validateContactWay = (rule, value, callback) => {
      if (!value) callback()
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
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
      if (!regPwd.test(value)) {
        callback(
          new Error('由字母、数字、符号组成，长度不能少于8位')
        )
      } else {
        callback()
      }
    }
    return {
      headId: '',
      cancelReason: '',
      dialogSelSignVisible: false,
      cancelContractVisible: false,
      selectItems: [],
      selectAuditItems: [],
      addDisabled: false,
      editDisabled: true,
      submitDisabled: true,
      cancelDisabled: true,
      auditDisabled: true,
      changeDisabled: true,
      delDisabled: true,
      viewDisabled: true,
      queryForm: {
        signType: 'new',
        contractStatus: ''
      },
      listSignType: [],
      listContractStatus: [],
      checkObjP: {},
      dialogFormTitle: '',
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
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      // dialog
      multipleSelection: [],
      dialogFormVisible: false,
      dialogViewOrgVisible: false,
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
    'v-pagination': Pagination,
    'v-add-new-sign': AddNewSign,
    'v-sign-all-info': SignAllInfo,
    'v-sel-sign-info': SelSignInfo
  },
  created () {
    this.getListSignType()
    this.getListContractStatus()
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    closeNewDialogClick () {
      this.queryData()
    },
    sureCancelContract () {
      var vm = this
      if (vm.cancelReason == '') {
        COMMONJS.showToast('请输入撤销原因！', 'warning')
        return
      }
      cancelContractProcess({
        guid: vm.selectItems[0].guid,
        procInsId: vm.selectItems[0].procInsId,
        reason: vm.cancelReason
      })
        .then(res => {
          vm.cancelContractVisible = false
          COMMONJS.showToast('撤销成功！')
          vm.getData()
        }).catch(() => {

        })
    },
    cancelContractProcess () {
      var vm = this
      vm.cancelContractVisible = true
    },
    startContractProcess () {
      let vm = this
      vm.$confirm('确认所选经营合同已经填写完整？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.selectItems.forEach(element => {
          let postData = element
          startContractProcess(postData)
            .then(res => {
              if (res.status == 'Success') {
                COMMONJS.showToast('合同提交成功！')
                vm.getData()
              }
            }).catch(() => {

            })
        })
      })
    },
    auditContractProcess () {
      let vm = this
      let postData = vm.selectItems[0]
      vm.$confirm('批量审核所选合同？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning'
      }).then(() => {
        postData.flowInfo = JSON.stringify({
          taskDefKey: 'deptLeaderAudit',
          flag: 'yes',
          procInsId: vm.selectItems[0].procInsId,
          comment: '同意'
        })
        auditContractProcess(postData)
          .then(res => {
            if (res.status == 'Success') {
              COMMONJS.showToast(res.data)
              vm.getData()
            }
          }).catch(() => {})
      }).catch((action) => {
        if (action === 'cancel') {
          postData.flowInfo = JSON.stringify({
            taskDefKey: 'deptLeaderAudit',
            flag: 'no',
            procInsId: vm.selectItems[0].procInsId,
            comment: '拒绝'
          })
          auditContractProcess(postData)
            .then(res => {
              if (res.status == 'Success') {
                COMMONJS.showToast(res.data)
                vm.getData()
              }
            }).catch(() => {})
        }
      })
    },
    edit () {
      var vm = this
      this.checkObjP = {
        type: 'update',
        data: {
          'guid': vm.selectItems[0].guid
        }
      }
      this.dialogFormTitle = '编辑'
      this.dialogFormVisible = true
    },
    change () {
      this.checkObjP = {
        type: 'change',
        data: {
          'guid': this.selectItems[0].guid
        }
      }
      this.dialogFormTitle = '变更'
      this.dialogFormVisible = true
    },
    viewOrg () {
      this.headId = this.selectItems[0].sourceId
      this.dialogFormTitle = '查看原'
      this.dialogViewOrgVisible = true
    },
    chkSelectChange (selection) {
      var vm = this
      vm.selectItems = selection
      if (vm.selectItems.length > 0) {
        if (vm.selectItems.length == 1) {
          if (vm.selectItems[0].state == 'save' || vm.selectItems[0].state == 'refuse') {
            vm.editDisabled = false
          }
          if (vm.selectItems[0].state == 'check') {
            vm.changeDisabled = false
          } else {
            vm.changeDisabled = true
          }
          if (vm.selectItems[0].signType == 'supplement' || vm.selectItems[0].signType == 'continuous') {
            vm.viewDisabled = false
          }
          vm.cancelDisabled = false
        } else {
          vm.editDisabled = true
          vm.changeDisabled = true
          vm.viewDisabled = true
          vm.cancelDisabled = true
        }
        vm.delDisabled = false
        vm.submitDisabled = false
        vm.auditDisabled = false
        vm.selectItems.forEach(element => {
          if (!(element.state == 'save' || element.state == 'refuse')) {
            vm.submitDisabled = true
          }
          if (element.state == 'commit' || element.state == 'check') {
            vm.delDisabled = true
          }
          if (element.state != 'commit') {
            vm.auditDisabled = true
          }
          if (!(element.state == 'commit' || element.state == 'refuse')) {
            vm.cancelDisabled = true
          }
        })
        vm.selectItems.forEach(element => {
          vm.selectAuditItems = []
          if (element.state == 'commit') {
            vm.selectAuditItems.push(element)
          }
        })
      } else {
        vm.editDisabled = true
        vm.changeDisabled = true
        vm.viewDisabled = true
        vm.delDisabled = true
        vm.submitDisabled = true
        vm.auditDisabled = true
        vm.cancelDisabled = true
      }
    },
    getListContractStatus () {
      var vm = this
      let postData = {
        typeCode: 'contract_status'
      }
      getCodeAndNameDic(postData).then(res => {
        vm.listContractStatus = res.data
      }).catch(() => {})
    },
    getListSignType () {
      var vm = this
      let postData = {
        typeCode: 'sign_type'
      }
      getCodeAndNameDic(postData).then(res => {
        vm.listSignType = res.data
      }).catch(() => {})
    },
    enterpriseEntry () {
      this.$router.push({
        path: '/enterpriseEntry'
      })
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      let postData = {
        'pageParams': {
          'pageIndex': _this.page.current,
          'pageSize': _this.page.size
        },
        'queryParams': {
          'cusId': '',
          'hetongCode': _this.queryForm.hetongCode,
          'state': _this.queryForm.contractStatus,
          'startDateF': _this.queryForm.startDate,
          'endDateF': _this.queryForm.endDate,
          'baseCustomerCusName': _this.queryForm.baseCustomerCusName,
          'agencyEntName': '',
          'signType': _this.queryForm.signType,
          'isTotalAmtOrNot': _this.queryForm.isTotalAmtOrNot
        }
      }
      queryPageMSWMSAOrderHead(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'baseCustomerCusName',
            'name': '产废单位'
          }, {
            'value': 'hetongCode',
            'name': '合同编号'
          }, {
            'value': 'dateF',
            'name': '开始日期',
            'type': 'Date'
          }, {
            'value': 'dateT',
            'name': '结束日期',
            'type': 'Date'
          }, {
            'value': 'baseEmpName',
            'name': '业务员'
          }, {
            'value': 'signTypeName',
            'name': '签订类型'
          },
          {
            'value': 'sysParamParameter',
            'name': '合同状态'
          },
          {
            'value': 'operation',
            'name': '操作',
            'type': [{
              'option': 'query',
              'name': '查看'
            }, {
              'option': 'update',
              'name': '编辑'
            }, {
              'option': 'delete',
              'name': '删除'
            }]
          }
          ]
          _this.records = res.data
          _this.page.total = res.data.total
        }).catch(() => {})
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    changeSelDialogFormVisibleP (data) {
      this.dialogSelSignVisible = false
      this.dialogFormVisible = true
      this.dialogFormTitle = data[0].currentSignType == 'supplement' ? '补签' : '续签'
      this.checkObjP = {
        type: data[0].currentSignType,
        isNewSC: true,
        data: {
          'sourceId': data[0].guid
        }
      }
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    reloadP (val) {
      val && this.getData()
      this.dialogFormVisible = false
    },
    operationP (obj) {
      switch (obj.operation) {
        case 'query':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data
          this.headId = this.checkObjP.data.guid
          this.dialogFormTitle = '查看'
          this.dialogViewOrgVisible = true
          break
        case 'update':
          if (!(obj.data.state == 'save' || obj.data.state == 'refuse')) {
            COMMONJS.showToast('已提交或已审核的合同禁止修改！', 'warning')
            return
          }
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data
          this.dialogFormTitle = '编辑'
          this.dialogFormVisible = true
          break
        case 'delete':
          if (!(obj.data.state == 'save' || obj.data.state == 'refuse')) {
            COMMONJS.showToast('已提交或已审核的合同禁止删除！', 'warning')
            return
          }
          this.delSection(obj.data)
          break
      }
    },
    // 新签
    addNewSign () {
      var vm = this
      this.checkObjP = {
        type: 'new',
        data: {}
      }
      this.dialogFormTitle = '新签'
      this.dialogFormVisible = true
    },
    // 补签
    addSupplement () {
      var vm = this
      this.checkObjP = {
        type: 'supplement',
        data: {}
      }
      this.dialogSelSignVisible = true
    },
    // 续签
    addContinuous () {
      var vm = this
      this.checkObjP = {
        type: 'continuous',
        data: {}
      }
      this.dialogSelSignVisible = true
    },
    handleCurrentChange (index) {
      this.page.current = index
      this.getData()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    lookInfo (row) {
      console.log(row)
    },
    delBatch () {
      let _this = this
      this.$confirm('确认删除所勾选的合同吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = []
        _this.selectItems.forEach(element => {
          postData.push(element.guid)
        })
        delMSWMSAOrderHeadByIDs(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    delSection (obj) {
      let _this = this
      this.$confirm('确认删除编号为【' + obj.hetongCode + '】的合同吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = [obj.guid]
        delMSWMSAOrderHeadByIDs(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    submitDialog (formName) {
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
    handleCommand (command) {
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
    submitResetDialog (formName) {
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
    enableONOFF (rowData) {
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
    setAdmin (rowData) {
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
