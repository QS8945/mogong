<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="参数名称：">
          <el-input v-model="queryForm.classCode" @keyup.enter.native="queryData" placeholder="请输入参数名称" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
        <!--<el-form-item class="form-item-btn">-->
          <!--<el-button @click="queryData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>
      <!--<v-table :dataTable="records" :selection="false" :btnVisible="true" :deleteBtn="true" :enableBtn="true" @operation="operationP"></v-table>-->
      <el-table
              v-if="tableVisible"
              :data="records"
              style="width: 100%"
              :height="tableHeight"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              row-key="id"
              lazy>
        <el-table-column
                prop="name"
                label="项目名称"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="dispositionTypeText"
                label="处置方式"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="quantity"
                label="年处理能力"
                :show-overflow-tooltip="true"
                align="center">
          <template slot-scope="scope">
            {{scope.row.quantity | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="unit"
                label="计量单位"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="status"
                label="状态"
                :show-overflow-tooltip="true"
                align="center">
          <template slot-scope="scope">
            {{(scope.row.status==='1') ? '启用' : '停用'}}
          </template>
        </el-table-column>
        <el-table-column
                prop="operation"
                label="操作"
                align="center">
          <template slot-scope="scope">
            <div class="opt-group">
              <span class="opt-base"
                    @click="operationP({data: scope.row, operation: 'query'})" type="text" size="small">
                              查看
                            </span>
              <span class="opt-base"
                    @click="operationP({data: scope.row, operation: 'update'})" type="text" size="small">
                              编辑
                            </span>
              <span class="opt-base"
                    @click="operationP({data: scope.row, operation: 'enable'})" type="text" size="small">
                              {{scope.row.status==='1' ? '停用' : '启用'}}
                            </span>
              <span v-if="scope.row.status==='1'" class="opt-base"
                    @click="operationP({data: scope.row, operation: 'delete'})" type="text" size="small">
                              删除
                            </span>
              <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
              <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!--//添加危废信息-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}经营项目</div>
        </div>
        <el-dialog
                width="30%"
                title="内层 Dialog"
                :visible.sync="treeVisible"
                append-to-body
                left>
          <span slot="title" class="title">
          </span>
          <v-tree ref="tree" :treeObj="treeObj" :defaultProps="treeProps" @getChooseTreeData="getChooseTreeDataP" @changeTreeVisible="changeTreeVisibleP"></v-tree>
        </el-dialog>
        <v-add-bus-pro-management :chooseRecords="chooseRecords" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @changeTreeVisible="changeTreeVisibleP" @reload="reloadP"></v-add-bus-pro-management>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import AddBusProManagement from '@/views/baseDataManagement/dialog/addBusProManagement'
import Tree from '@/components/tree'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { projectListProject, deleteProject, setStatusOnOrOff } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
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
      tableHeight: '100%',
      tableVisible: false,
      queryForm: {
        valid: false,
        classCode: '',
        wasteCode: '',
        entWasteName: ''
      },
      checkObjP: {},
      dialogFormTitle: '添加',
      queryFormRules: {
        tel: [
          { validator: validateContactWay, trigger: 'change' }
        ]
      },
      statusOptions: [{
        label: '启动',
        value: '1'
      }, {
        label: '停用',
        value: '2'
      }],
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
      // 树节点
      treeVisible: false,
      treeObj: {},
      chooseRecords: [],
      treeProps: {
        label: 'name',
        children: 'wasteCodes',
        isLeaf: 'leaf'
      },
      addForm: {
        tel: '',
        name: '',
        password: ''
      },
      addFormRules: {
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: validateContactWay, trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      },
      resetPwdFormVisible: false,
      resetPwdForm: {
        newPassword: ''
      },
      resetPwdFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      }
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-tree': Tree,
    'v-add-bus-pro-management': AddBusProManagement
  },
  created () {
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  methods: {
    enterpriseEntry () {
      this.$router.push(
        { path: '/enterpriseEntry' }
      )
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        current: this.page.current,
        size: this.page.size,
        deletedWaste: this.queryForm.deletedWaste,
        classCode: this.queryForm.classCode,
        wasteCode: this.queryForm.wasteCode,
        entWasteName: this.queryForm.entWasteName,
        valid: this.queryForm.valid ? 0 : 1
      }
      projectListProject(postData)
        .then(res => {
          _this.records = res.data.records
          _this.page.total = res.data.total
          _this.tableVisible = true
        }).catch(() => {
        })
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
      // this.$emit('reload', 3)
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
      // this.$emit('reload', 3)
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
          this.checkObjP.data = JSON.parse(JSON.stringify(obj.data))
          this.dialogFormTitle = '查看'
          this.dialogFormVisible = true
          break
        case 'update':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = JSON.parse(JSON.stringify(obj.data))
          this.dialogFormTitle = '更新'
          this.dialogFormVisible = true
          break
        case 'delete':
          this.delSection(JSON.parse(JSON.stringify(obj.data)))
          break
        case 'enable':
          this.enableSection(JSON.parse(JSON.stringify(obj.data)))
          break
      }
    },
    enableSection (obj) {
      let _this = this
      let postData = {
        projectId: obj.id
      }
      setStatusOnOrOff(postData).then(res => {
        let msg = (obj.status === '1') ? '停用' : '启用'
        COMMONJS.showToast(`${msg}成功`)
        _this.getData()
      }).catch(() => {
      })
    },
    addUserData () {
      this.checkObjP = {
        type: 'add',
        data: {}
      }
      this.dialogFormVisible = true
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
    delSection (obj) {
      let _this = this
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          id: obj.id
        }
        deleteProject(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
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
    changeTreeVisibleP (obj) {
      // this.treeData = obj.treeData
      this.treeVisible = obj.treeVisible
      this.treeObj = {
        data: obj.treeData,
        type: obj.type
      }
    },
    getChooseTreeDataP (obj) {
      this.treeVisible = obj.treeVisible
      this.chooseRecords = obj.treeData
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
