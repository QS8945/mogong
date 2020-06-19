<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="开始日期：">
          <el-date-picker v-model="queryForm.startTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker v-model="queryForm.endTime"  @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束日期"
           >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" clearable placeholder="请选择状态">
            <el-option
                    v-for="item in statusOptions"
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
    <div class="table-content">
      <el-table size="mini" row-key="compatibilityPlanId" :expand-row-keys="expandKeys" @expand-change="expandChange" v-loading="loading"
        stripe border :header-cell-style="headClass" ref="multipleTable" :data="tableData" style="width: 100%" height="250"
        @selection-change="handleSelectionChange">
        <!--<el-table-column type="expand">-->
          <!--<template slot-scope="props">-->
            <!--<el-table size="mini" v-loading="subLoading" border :header-cell-style="headClass" stripe ref="multipleTable" :data="props.row.subRecords"-->
              <!--style="width: 100%" height="150">-->
              <!--<el-table-column type="index" width="50" label="顺序"></el-table-column>-->
              <!--<el-table-column align="center" prop="entName" label="产废单位">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" prop="matCode" label="八位码" width="150">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" prop="matName" label="危废俗称" width="150">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" prop="qty" label="配伍总量" width="150">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" prop="reltkcode" label="联单号" width="150">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" prop="storageName" label="所在库位" width="150">-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</template>-->
        <!--</el-table-column>--><el-table-column
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
        <el-table-column align="center" prop="operation" label="操作" width="188">
          <template slot-scope="scope">
            <div class="opt-group">
                            <span class="opt-base" v-if="scope.row.auditStatus === '待出库'"
                                  @click="outStorage(scope.row,'update')" type="text" size="small">
                              出库
                            </span>
              <span class="opt-base"
                    @click="printStorage(scope.row)" type="text" size="small">
                                打印领料单
                            </span>
            </div>
            <!--<span v-if="scope.row.auditStatus === '待出库'" class="operateBtnCls" @click="outStorage(scope.row,'update')" type="text" size="small">-->
              <!--出库-->
            <!--</span>-->
            <!--<span class="operateBtnCls" @click="printStorage(scope.row)" type="text" size="small">-->
              <!--打印领料单-->
            <!--</span>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!-- 打印领料单 -->
    <div v-if="dialogFormVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}出库单</div>
        </div>
        <v-view-pick-list @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-view-pick-list>
      </el-dialog>
    </div>
    <!-- 出库 -->
    <div v-if="dialogFormOutVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormOutVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>出库单</div>
        </div>
        <v-out-storage @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormOutVisibleP" @reload="reloadP"></v-out-storage>
      </el-dialog>
    </div>
    <!-- 查看生产计划 -->
    <div v-if="dialogFormPlanVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormPlanVisible" :close-on-click-modal="false" width="60%">
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
import COMMONJS from '@/assets/js/common.js'
import AddProductionPlan from './components/addProductionPlan.vue'
import ViewPickList from './dialog/viewPickList.vue'
import OutStorage from './dialog/outStorage.vue'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  pageCompatibilityReceive,
  pageCompatibilityPlanNo,
  listPhchPickRecord,
  fwListDictionary
} from '@/assets/js/API/api'

export default {
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
      loading: false,
      tableData: [],
      queryForm: {
        valid: false,
        classCode: '',
        wasteCode: '',
        entWasteName: ''
      },
      dialogFormPlanVisible: false,
      checkObjP: {},
      dialogFormTitle: '打印',
      queryFormRules: {
        tel: [{
          validator: validateContactWay,
          trigger: 'change'
        }]
      },
      dialogFormOutVisible: false,
      statusOptions: [],
      openDelay: 500,
      records: {},
      page: {
        current: GLB_CONSTANT.page.current,
        size: 10,
        total: 0,
        sizes: [5, 10, 50]
      },
      multipleSelection: [],
      dialogFormVisible: false,
      addForm: {
        tel: '',
        name: '',
        password: ''
      },
      expandKeys: [],
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
    'v-pagination': Pagination,
    'v-view-pick-list': ViewPickList,
    'v-out-storage': OutStorage,
    'v-add-production-plan': AddProductionPlan
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
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  methods: {
    fwListDictionary () {
      let _this = this
      let postData = {
        dictionaryTypeCode: 'Phch_Record_Status'
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      fwListDictionary(postData, params)
        .then(res => {
          _this.statusOptions = res.data
        }).catch(() => {
        })
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
    viewProductionPlan (row) {
      var vm = this
      vm.checkObjP = {
        type: 'query',
        data: row.id
      }
      vm.dialogFormTitle = '查看'
      vm.dialogFormPlanVisible = true
    },
    expandChange (row, expandedRows) {
      if (this.expandKeys.indexOf(row.compatibilityPlanId) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getSubRecords(row, expandedRows)
    },
    getSubRecords (row, expandedRows) {
      var vm = this
      vm.subLoading = true
      pageCompatibilityPlanNo({
        ticket: localStorage.getItem('token'),
        compatibilityPlanId: row.compatibilityPlanId
      })
        .then(res => {
          row.subRecords = res.data.records
          vm.subLoading = false
          vm.expandKeys.shift() /** 新增 **/
          vm.expandKeys.push(row.compatibilityPlanId)
        }).catch(() => {})
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    getListContractStatus () {
      var vm = this
      vm.statusOptions = [
        {
          code: 'in',
          name: '待出库'
        },
        {
          code: 'out',
          name: '已出库'
        }
      ]
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
    outStorage (row) {
      var vm = this
      vm.checkObjP = {
        type: 'out',
        data: row.id
      }
      this.dialogFormOutVisible = true
    },
    printStorage (row) {
      var vm = this
      vm.checkObjP = {
        type: 'print',
        data: row.id
      }
      this.dialogFormVisible = true
    },
    deletePlan (row) {
      let _this = this
      this.$confirm('确认删除所勾选的生产计划吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = []
        let params = {
          ticket: localStorage.getItem('token')
        }
        _this.multipleSelection.forEach(element => {
          postData.push(element.id)
        })
        removeProductionPlan(postData, params).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    deleteSinglePlan (row) {
      let _this = this
      this.$confirm('确认删除生产计划【' + row.planNo + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = [row.id]
        let params = {
          ticket: localStorage.getItem('token')
        }
        removeProductionPlan(postData, params).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    submitPlan (row) {
      let _this = this
      this.$confirm('确认删除所勾选的生产计划吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = []
        _this.multipleSelection.forEach(element => {
          postData.push(element.id)
        })
        removeProductionPlan(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {})
      })
    },
    editPlan (row, type) {
      var vm = this
      if (type == 'query') {
        vm.dialogFormTitle = '查看'
      } else {
        vm.dialogFormTitle = '编辑'
      }
      vm.checkObjP = {
        type: type,
        data: row.id
      }
      this.dialogFormVisible = true
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      _this.loading = true
      let postData = {
        status: _this.queryForm.status,
        startTime: _this.queryForm.startTime,
        endTime: _this.queryForm.endTime,
        current: _this.page.current,
        size: _this.page.size
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listPhchPickRecord(postData, params)
        .then(res => {
          _this.tableData = res.data.records
          _this.page.total = res.data.total
          _this.loading = false
        }).catch(() => {
          _this.loading = false
        })
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
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    changeDialogFormOutVisibleP (val) {
      this.dialogFormOutVisible = val
    },
    reloadP (val) {
      val && this.getData()
      this.dialogFormVisible = false
      this.dialogFormOutVisible = false
    },
    operationP (obj) {
      switch (obj.operation) {
        case 'query':
          this.$alert('nothing！')
          break
        case 'update':
          this.checkObjP.type = obj.operation
          this.checkObjP.data = obj.data
          // this.dialogFormTitle = '发起'
          // this.dialogFormVisible = true
          window.open('http://localhost:8082/jsite/a/act/task/form?procDefId=' + obj.data.id)
          break
        case 'delete':
          this.$alert('nothing！')
          break
      }
    }
  }
}

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
