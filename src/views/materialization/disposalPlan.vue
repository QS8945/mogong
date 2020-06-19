<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="开始日期：">
          <el-date-picker
                  v-model="queryForm.startTime"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
                  v-model="queryForm.endTime"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束日期"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.type" clearable filterable
                     placeholder="请选择状态">
            <el-option
                    v-for="item in types"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="已删除危废：">-->
          <!--<el-checkbox v-model="queryForm.valid"></el-checkbox>-->
        <!--</el-form-item>-->
        <el-form-item label=" ">
          <el-button v-loading="loading" @click="queryData">查询</el-button>
        </el-form-item>
        <!--<el-form-item class="form-item-btn">-->
          <!--<el-button @click="queryData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button v-loading="loading" type="primary" @click="addUserData">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>

      <el-table
              :data="records.records"
              style="width: 100%"
              :height="tableHeight"
              size="mini"
              border
              v-loading="loading">
        <el-table-column
                prop="code"
                label="编号"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建日期"
                :show-overflow-tooltip="true"
                align="center">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
                prop="qty"
                label="处置数量(吨)"
                :show-overflow-tooltip="true"
                align="center">
          <template slot-scope="scope">
            {{scope.row.qty | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="matName"
                label="原辅料"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="auditStatus"
                label="状态"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="operation"
                label="操作"
                fixed='right'
                width="200"
                align="center">
          <template slot-scope="scope">
            <div class="opt-group">
                            <span class="opt-base"
                                  @click="operationP({operation: 'query', data: scope.row})" type="text" size="small">
                              查看
                            </span>
              <span class="opt-base" v-if="scope.row.auditStatus==='已保存'||scope.row.auditStatus==='已退回'"
                    @click="operationP({operation: 'update', data: scope.row})" type="text" size="small">
                                编辑
                            </span>
              <span class="opt-base" v-if="scope.row.auditStatus==='已保存'||scope.row.auditStatus==='已退回'"
                    @click="operationP({operation: 'delete', data: scope.row})" type="text" size="small">
                                删除
                            </span>
              <span class="opt-base" v-if="scope.row.auditStatus==='已保存'||scope.row.auditStatus==='已退回'"
                    @click="operationP({operation: 'commit', data: scope.row})" type="text" size="small">
                                提交
                            </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<v-table :dataTable="records" @operation="operationP"></v-table>-->
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { setEnabledOnOrOff, listPhchPlan, deletePhchPlanById, fwListDictionary, updatePlanStatusCheck } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    return {
      tableHeight: '100%',
      queryForm: {
        status: '',
        endTime: '',
        startTime: ''
      },
      types: [],
      optType: {

      },
      loading: false,
      checkObjP: {},
      dialogFormTitle: '添加',
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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination
  },
  created () {
    this.getData()
    this.fwListDictionary()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  methods: {
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      this.loading = true
      let postData = {
        current: this.page.current,
        size: this.page.size,
        type: this.queryForm.type,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listPhchPlan(postData, params)
        .then(res => {
          _this.records = res.data
          _this.page.total = res.data.total
          _this.loading = false
        }).catch(() => {
          _this.loading = false
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
          COMMONJS.tabRemove('/addDisposalPlan')
          setTimeout(function () {
            _this.$router.push({
              path: '/addDisposalPlan',
              query: _this.checkObjP
            })
          })
          break
        case 'update':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          this.dialogFormTitle = '更新'
          COMMONJS.tabRemove('/addDisposalPlan')
          setTimeout(function () {
            _this.$router.push({
              path: '/addDisposalPlan',
              query: _this.checkObjP
            })
          })
          break
        case 'delete':
          this.delSection(JSON.parse(JSON.stringify(obj.data)))
          break
        case 'enabled':
          this.enableSection(JSON.parse(JSON.stringify(obj.data)))
          break
        case 'commit':
          this.commitSection(JSON.parse(JSON.stringify(obj.data)))
          break
      }
    },
    addUserData () {
      let _this = this
      COMMONJS.tabRemove('/addDisposalPlan')
      setTimeout(function () {
        _this.$router.push({
          path: '/addDisposalPlan',
          query: {
            type: 'add'
          }
        })
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
    delSection (obj) {
      let _this = this
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          planId: obj.id
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        deletePhchPlanById(postData, params).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
    },
    commitSection (obj) {
      let _this = this
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          id: obj.id
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        updatePlanStatusCheck(postData, params).then(res => {
          COMMONJS.showToast('提交成功')
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
    submitResetDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetPwdFormVisible = false
        } else {
          return false
        }
      })
    },
    fwListDictionary () {
      let _this = this
      let postData = {
        dictionaryTypeCode: 'Phch_Status'
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      fwListDictionary(postData, params)
        .then(res => {
          _this.types = res.data
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
</style>
