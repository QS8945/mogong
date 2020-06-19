<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="许可证号：">
          <el-input v-model="queryForm.licenceNo" @keyup.enter.native="queryData" placeholder="请输入许可证号" clearable></el-input>
        </el-form-item>
        <!--<el-form-item label="已删除危废：">-->
          <!--<el-checkbox v-model="queryForm.valid"></el-checkbox>-->
        <!--</el-form-item>-->
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

      <!--<el-table-->
              <!--:data="records.records"-->
              <!--style="width: 100%"-->
              <!--:height="tableHeight"-->
              <!--element-loading-background="rgba(0, 0, 0, 0.8)">-->
        <!--<el-table-column-->
                <!--prop="licenceNo"-->
                <!--label="许可证号"-->
                <!--width="180"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="certificationAuthority"-->
                <!--label="发证机关"-->
                <!--width="180"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="beginTime"-->
                <!--label="开始日期"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.beginTime | formatDate}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="endTime"-->
                <!--label="结束日期"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.endTime | formatDate}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="isNotOverdue"-->
                <!--label="有效期内"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="right">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.isNotOverdue ? '是' : '否'}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="enabled"-->
                <!--label="是否可用"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.enabled ? '是' : '否'}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="operation"-->
                <!--label="操作"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="opt-group">-->
                            <!--<span class="opt-base"-->
                                  <!--@click="operationP({operation: 'query', data: scope.row})" type="text" size="small">-->
                              <!--查看-->
                            <!--</span>-->
              <!--<span class="opt-base" v-if="scope.row.isNotOverdue"-->
                    <!--@click="operationP({operation: 'update', data: scope.row})" type="text" size="small">-->
                                <!--编辑-->
                            <!--</span>-->
              <!--<span class="opt-base" v-if="scope.row.isNotOverdue && scope.row.enabled"-->
                    <!--@click="operationP({operation: 'delete', data: scope.row})" type="text" size="small">-->
                                <!--删除-->
                            <!--</span>-->
              <!--<span class="opt-base" v-if="scope.row.isNotOverdue"-->
                    <!--@click="operationP({operation: 'enable', data: scope.row})" type="text" size="small">-->
                                <!--{{scope.row.enabled ? '停用' : '启用'}}-->
                            <!--</span>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <v-table :dataTable="records" @operation="operationP"></v-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { listLicence, setEnabledOnOrOff, deleteLicence } from '@/assets/js/API/api'

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
      queryForm: {
        valid: false,
        licenceNo: ''
      },
      optType: {

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
    'v-table': CustomTable,
    'v-pagination': Pagination
  },
  created () {
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd')
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
        licenceNo: this.queryForm.licenceNo
      }
      listLicence(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'licenceNo',
            'name': '许可证号'
          }, {
            'value': 'certificationAuthority',
            'name': '发证机关'
          }, {
            'value': 'beginTime',
            'name': '开始日期',
            'type': 'Date'
          }, {
            'value': 'endTime',
            'name': '结束日期',
            'type': 'Date'
          }, {
            'value': 'isNotOverdue',
            'name': '有效期内',
            'type': 'YesOrNo'
          }, /* {
            'value': 'enabled',
            'name': '是否可用',
            'type': 'YesOrNo'
          }, */{
            'value': 'enabled',
            'name': '启用状态',
            'type': 'enabled'
          }, {
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
          }]
          _this.records = res.data
          _this.page.total = res.data.total
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
      let _this = this
      switch (obj.operation) {
        case 'query':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          this.dialogFormTitle = '查看'
          this.checkObjP.activeName = 'licenseBaseInfo'
          this.$router.push({
            path: '/licenseInfoAdd',
            query: _this.checkObjP
          })
          break
        case 'update':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          this.dialogFormTitle = '更新'
          this.checkObjP.activeName = 'licenseBaseInfo'
          this.$router.push({
            path: '/licenseInfoAdd',
            query: _this.checkObjP
          })
          break
        case 'delete':
          this.delSection(JSON.parse(JSON.stringify(obj.data)))
          break
        case 'enabled':
          this.enableSection(JSON.parse(JSON.stringify(obj.data)))
          break
      }
    },
    addUserData () {
      this.$router.push({
        path: '/licenseInfoAdd',
        query: {
          type: 'add',
          activeName: 'licenseBaseInfo'
        }
      })
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
        deleteLicence(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
    },
    enableSection (obj) {
      let _this = this
      let postData = {
        id: obj.id
      }
      setEnabledOnOrOff(postData).then(res => {
        let msg = obj.enabled ? '启用' : '停用'
        COMMONJS.showToast(`${msg}成功`)
        _this.getData()
      }).catch(() => {
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
        }).then(() => {
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
