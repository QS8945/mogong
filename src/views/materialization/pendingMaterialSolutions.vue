<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <!--<el-form-item label="计划单号：">-->
          <!--<el-input v-model="queryForm.planNo" clearable @keyup.enter.native="queryData" placeholder="请输入计划单号"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="开始日期：">
          <el-date-picker v-model="queryForm.startTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker v-model="queryForm.endTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" clearable filterable
                     placeholder="请选择状态">
            <el-option
                    v-for="item in statuses"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs type="border-card" @tab-click="tabClick" v-model="defaultTabName">
      <el-tab-pane label="处置方案" name="list">
        <div class="table-content">
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
                    label="辅料添加"
                    :show-overflow-tooltip="true"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="recordStatus"
                    label="状态"
                    :show-overflow-tooltip="true"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    align="center">
              <template slot-scope="scope">
                <div class="opt-group">
                            <span class="opt-base"
                                  @click="operationP({operation: 'queryList', data: scope.row})" type="text" size="small">
                              查看
                            </span>
                  <span class="opt-base" v-if="scope.row.recordStatus!=='领料完成'"
                        @click="operationP({operation: 'list', data: scope.row})" type="text" size="small">
                                领料单
                            </span>
                  <!--<span class="opt-base" v-if="scope.row.recordStatus!=='领料完成'"-->
                        <!--@click="operationP({operation: 'close', data: scope.row})" type="text" size="small">-->
                                <!--关闭-->
                            <!--</span>-->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="领料单" name="plan">
        <div class="table-content">
          <el-table
                  :data="actTableData"
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
                    prop="pickDate"
                    label="领料日期"
                    :show-overflow-tooltip="true"
                    align="center">
              <template slot-scope="scope">
                {{scope.row.pickDate | formatDate}}
              </template>
            </el-table-column>
            <el-table-column
                    prop="usedqty"
                    label="领料数量(吨)"
                    :show-overflow-tooltip="true"
                    align="center">
              <template slot-scope="scope">
                {{scope.row.usedqty | formatNum}}
              </template>
            </el-table-column>
            <el-table-column
                    prop="matName"
                    label="辅料添加"
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
                    align="center">
              <template slot-scope="scope">
                <div class="opt-group">
                            <span class="opt-base"
                                  @click="operationP({operation: 'queryPlan', data: scope.row})" type="text" size="small">
                              查看
                            </span>
                  <span class="opt-base" v-if="scope.row.auditStatus!=='出库'"
                        @click="operationP({operation: 'plan', data: scope.row})" type="text" size="small">
                                编辑
                            </span>
                  <span class="opt-base"
                        @click="operationP({operation: 'delete', data: scope.row})" type="text" size="small">
                                删除
                            </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <v-pagination :current="actPage.current" :sizes="actPage.sizes" :size="actPage.size" :total="actPage.total" @reloadPage="jumpActPage"
              @reloadSize="jumpActSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 查看生产计划 -->
    <div v-if="dialogFormVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}生产计划</div>
        </div>
        <v-add-production-plan @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
          @reload="reloadP"></v-add-production-plan>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import AddMaterialSolutions from './components/addMaterialSolutions.vue'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  fwListDictionary,
  listPhchPlan,
  listPhchPickRecord,
  deletePhchPickRecord
} from '@/assets/js/API/api'

export default {
  data () {
    return {
      tableHeight: '100%',
      records: {},
      loading: false,
      expandKeys: [],
      subLoading: false,
      cantonVisible: false,
      cantonOptions: [],
      subRecords: [],
      statusList: [],
      planLoading: true,
      listLoading: true,
      defaultTabName: 'list',
      tableData: [],
      actTableData: [],
      queryForm: {
        status: '',
        endTime: '',
        startTime: ''
      },
      statuses: [],
      checkObjP: {},
      dialogFormTitle: '查看',
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
      multipleSelection: []
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination
  },
  created () {
    if (this.$route.query && this.$route.query.defaultTabName && this.$route.query.defaultTabName !== '') {
      this.defaultTabName = this.$route.query.defaultTabName
    }
    // if (this.checkObj && this.checkObj.defaultTabName && this.checkObj.defaultTabName !== '') {
    //   this.defaultTabName = this.checkObj.defaultTabName
    // }
    this.getData()
    this.fwListDictionary()
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
  props: ['checkObj'],
  methods: {
    getRowKeys (row) {
      return row.compatibilityPlanId
    },
    checkTime (val) {
      var vm = this
      if (vm.queryForm.startTime && vm.queryForm.endTime) {
        var start = new Date(Date.parse(vm.queryForm.startTime))
        var end = new Date(Date.parse(vm.queryForm.endTime))
        if (start > end) {
          COMMONJS.showToast('开始日期不能晚于结束日期，请重新选择！', 'warning')
        }
      }
    },
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    headClass ({
      row,
      rowIndex
    }) {
      return 'background:#F8F8F9;color:#8F99A2'
    },
    tabClick (data) {
      let _this = this
      _this.queryForm.status = ''
      if (data.name === 'plan') {
        _this.fwListDictionary('Phch_Record_Status')
      } else {
        _this.fwListDictionary('Record_Status')
      }
      _this.defaultTabName = data.name
      _this.getData()
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      // if (_this.$route.query.productionPlanId && _this.$route.query.productionPlanId != '') {
      //   productionPlanId = _this.$route.query.productionPlanId
      // }
      if (this.defaultTabName === 'plan') {
        _this.planLoading = true
        let postData = {
          status: _this.queryForm.status,
          startTime: _this.queryForm.startTime,
          endTime: _this.queryForm.endTime,
          current: _this.actPage.current,
          size: _this.actPage.size
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        listPhchPickRecord(postData, params)
          .then(res => {
            _this.actTableData = res.data.records
            _this.actPage.total = res.data.total
            _this.planLoading = false
          }).catch(() => {})
      } else {
        _this.loading = true
        let postData = {
          status: _this.queryForm.status,
          current: this.page.current,
          size: this.page.size,
          type: 'check',
          startTime: this.queryForm.startTime,
          endTime: this.queryForm.endTime
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        // let postData = {
        //   ticket: localStorage.getItem('token'),
        //   planNo: _this.queryForm.planNo,
        //   startTime: _this.queryForm.startTime,
        //   endTime: _this.queryForm.endTime,
        //   current: _this.page.current,
        //   size: _this.page.size,
        //   productionPlanId: productionPlanId
        // }
        listPhchPlan(postData, params)
          .then(res => {
            _this.records.records = res.data.records || []
            _this.page.total = res.data.total
            _this.loading = false
          }).catch(() => {
            _this.loading = false
          })
      }
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
    jumpActPage (index) {
      this.actPage.current = index
      this.getData()
    },
    jumpActSize (val) {
      this.actPage.size = val
      this.actPage.current = 1
      this.getData()
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    reloadP (val) {
      val && this.getData()
      this.dialogFormVisible = false
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
          recordId: obj.id
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        deletePhchPickRecord(postData, params).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    fwListDictionary (key) {
      let _this = this
      let postData = {
        dictionaryTypeCode: key || 'Record_Status'
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      fwListDictionary(postData, params)
        .then(res => {
          _this.statuses = res.data
        }).catch(() => {
        })
    },
    operationP (obj) {
      let _this = this
      switch (obj.operation) {
        case 'queryList':
          COMMONJS.tabRemove('/addPendingMaterialSolutions')
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          this.dialogFormTitle = '查看'
          setTimeout(function () {
            _this.$router.push({
              path: '/addPendingMaterialSolutions',
              query: _this.checkObjP
            })
          })
          break
        case 'update':
          COMMONJS.tabRemove('/addPendingMaterialSolutions')
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          this.dialogFormTitle = '更新'
          setTimeout(function () {
            _this.$router.push({
              path: '/addPendingMaterialSolutions',
              query: _this.checkObjP
            })
          })
          break
        case 'list':
          COMMONJS.tabRemove('/addPendingMaterialSolutions')
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          setTimeout(function () {
            _this.$router.push({
              path: '/addPendingMaterialSolutions',
              query: _this.checkObjP
            })
          })
          break
        case 'queryPlan':
          COMMONJS.tabRemove('/addPendingMaterialSolutions')
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          setTimeout(function () {
            _this.$router.push({
              path: '/addPendingMaterialSolutions',
              query: _this.checkObjP
            })
          })
          break
        case 'plan':
          COMMONJS.tabRemove('/addPendingMaterialSolutions')
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data.id
          setTimeout(function () {
            _this.$router.push({
              path: '/addPendingMaterialSolutions',
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
          break
      }
    }
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
