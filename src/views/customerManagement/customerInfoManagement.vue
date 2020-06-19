<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="客户名称：">
          <el-input v-model="queryForm.enterpriseName" @keyup.enter.native="queryData" placeholder="请输入客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责业务员：">
          <el-select v-model="queryForm.employeeName" clearable placeholder="请选择业务员">
            <el-option
                    v-for="item in employeeNames"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行政区：">
          <v-common-cascader v-if="cantonVisible" :cantonName="queryForm.cantonName" :cantonOptions="cantonOptions" :showAllLevels="false" :clearable="true" :cantonPlaceholder="'所有'" :filterable="true" :changeOnSelect="true" @changeCantonName="changeCantonNameP"></v-common-cascader>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <!--<el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>-->
        </el-form-item>
        <!--<el-form-item class="form-item-btn">-->
          <!--<el-button @click="queryData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData">新增</el-button>
        <el-button plain @click="delSectiones">删除</el-button>
      </div>
      <v-table :dataTable="records" @operation="operationP" @reloadSelect="reloadSelectP"></v-table>
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
import CommonCascader from '@/components/commonCascader'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getCustomerEnterprise, deleteEnterpriseWaste, getSysRoleEmploee, deleteCustomerEnterprise, getAllSySCanton } from '@/assets/js/API/api'

export default {
  name: 'cantonAllArea',
  data () {
    return {
      employeeNames: [],
      cantonOptions: [],
      queryForm: {
        enterpriseName: '',
        employeeName: '',
        cantonName: []
      },
      checkObjP: {},
      dialogFormTitle: '添加',
      openDelay: 500,
      records: {
        pageResult: {},
        tableHead: []
      },
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      cantonVisible: false
    }
  },
  // 组件
  components: {
    'v-table': CustomTable,
    'v-pagination': Pagination,
    'v-common-cascader': CommonCascader
  },
  created () {
    this.getAllSySCanton()
    this.getSysRoleEmploee()
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
    getSysRoleEmploee () {
      let _this = this
      getSysRoleEmploee()
        .then(res => {
          _this.employeeNames = res.data
        }).catch(() => {
        })
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
        enterpriseName: this.queryForm.enterpriseName,
        employeeName: this.queryForm.employeeName
      }
      // this.queryForm.cantonName = this.queryForm.cantonName.length || ''
      postData.cantonName = JSON.stringify(this.queryForm.cantonName)
      getCustomerEnterprise(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'name',
            'name': '客户名称'
          }, {
            'value': 'cantonName',
            'name': '所属行政区'
          }, {
            'value': 'type',
            'name': '企业类型'
          }, {
            'value': 'industryId',
            'name': '所属行业'
          }, {
            'value': 'contacts',
            'name': '联系人'
          }, {
            'value': 'contactsPhone',
            'name': '联系电话'
          }, {
            'value': 'customerCharger',
            'name': '业务员'
          }, {
            'value': 'operation',
            'name': '操作',
            'type': [{
              'option': 'query',
              'name': '查看'
            }, {
              'option': 'update',
              'name': '编辑'
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
          this.checkObjP.data = obj.data.entRelationId
          this.checkObjP.activeName = 'companyInfo'
          this.dialogFormTitle = '查看'
          this.$router.push({
            path: '/customerInfoAdd',
            query: _this.checkObjP
          })
          break
        case 'update':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.entRelationId
          this.checkObjP.activeName = 'companyInfo'
          this.dialogFormTitle = '更新'
          this.$router.push({
            path: '/customerInfoAdd',
            query: _this.checkObjP
          })
          break
        case 'delete':
          this.delSection(obj.data)
          break
      }
    },
    addUserData () {
      this.$router.push({
        path: '/customerInfoAdd',
        query: {
          type: 'add',
          activeName: 'companyInfo'
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
      this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          enterpriseWasteId: obj.id
        }
        deleteEnterpriseWaste(postData).then(res => {
          COMMONJS.showToast(`删除成功`)
          _this.getData()
        }).catch(() => {
        })
      })
    },
    delSectiones () {
      if (this.multipleSelection.length) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let rows = this.multipleSelection
          let _this = this
          if (rows.length) {
            let delObjList = []
            rows.forEach(row => {
              var delObj = {
                // entRelationId: row.entRelationId,
                id: row.entRelationId
              }
              delObjList.push(delObj)
            })
            let postData = {
              deleteList: JSON.stringify(delObjList)
            }
            deleteCustomerEnterprise(postData).then(res => {
              COMMONJS.showToast(`删除成功`)
              _this.getData()
            }).catch(() => {
            })
            console.log(postData)
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        COMMONJS.showToast('请先选择删除选项', 'warning')
      }
    },
    reloadSelectP (val) {
      this.multipleSelection = val
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
    },
    changeCantonNameP (val) {
      this.queryForm.cantonName = val
    },
    exportExcel () {
      let postData = {
        entId: localStorage.getItem('id'),
        storageId: this.queryForm.storageId,
        startDate: this.queryForm.wasteDate[0],
        endDate: this.queryForm.wasteDate[1]
      }
      // getExportProduceWasteAccount(postData)
      //   .then(res => {
      //     let url
      //     if (process.env.NODE_ENV === 'development') {
      //       url = GLB_CONSTANT.serviceSiteRootUrl + '/' + res.data
      //     } else if (process.env.NODE_ENV === 'production') {
      //       url = GLB_CONSTANT.serviceSiteProductionUrl + '/' + res.data
      //     }
      //     window.location.href = url
      //   }).catch(() => {
      // })
    },
    getAllSySCanton () {
      let _this = this
      getAllSySCanton()
        .then(res => {
          _this.cantonOptions = res.data
          _this.cantonVisible = true
        }).catch(() => {
        })
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
  .padding-left-none{
    padding-left: 0 !important;
  }
</style>
