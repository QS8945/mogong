<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="开始日期：">
          <el-date-picker
                  v-model="queryForm.beginTime"
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
        <el-form-item label=" ">
          <el-button @click="queryData" v-loading="searchLoading" :disabled="searchLoading">查询</el-button>
        </el-form-item>
        <!--<el-form-item class="form-item-btn">-->
          <!--<el-button @click="queryData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData" v-loading="searchLoading" :disabled="searchLoading">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>
      <v-table :searchLoading="searchLoading" :dataTable="records" :selection="false" @operation="operationP"></v-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!--//添加危废信息-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="80%">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}填埋场经营台账</div>
        </div>
        <el-dialog v-if="addLandfillWasteVisible"
                width="80%"
                title="内层 Dialog"
                :visible.sync="addLandfillWasteVisible"
                append-to-body
                left>
          <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}填埋危废</div>
          </div>
          <v-add-landfill-waste ref="tree" :checkObj="addLandfillWasteObj" @addLandfillData="addLandfillData" @getChooseLandfillData="getChooseLandfillData"></v-add-landfill-waste>
        </el-dialog>
        <v-add-landfillOperatingAccount :chooseRecords="chooseRecords" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @addLandfillData="addLandfillData" @reload="reloadP"></v-add-landfillOperatingAccount>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import AddLandfillOperatingAccount from '@/views/landfillManagement/dialog/addLandfillOperatingAccount'
import AddLandfillWaste from '@/views/landfillManagement/dialog/addLandfillWaste'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getFillBusinessParameterList, deleteFillBusiness } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    return {
      searchLoading: false,
      queryForm: {
        beginTime: '',
        endTime: ''
      },
      chooseRecords: [],
      addLandfillWasteVisible: false,
      addLandfillWasteObj: {},
      checkObjP: {},
      dialogFormTitle: '添加',
      openDelay: 500,
      records: {},
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      dialogFormVisible: false,
      showSummary: true,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  // 组件
  components: {
    'v-table': CustomTable,
    'v-pagination': Pagination,
    'v-add-landfillOperatingAccount': AddLandfillOperatingAccount,
    'v-add-landfill-waste': AddLandfillWaste
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
        beginTime: this.queryForm.beginTime,
        endTime: this.queryForm.endTime
      }
      this.searchLoading = true
      getFillBusinessParameterList(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'fillDate',
            'name': '填埋日期',
            'type': 'Date'
          }, {
            'value': 'weather',
            'name': '天气'
          }, {
            'value': 'rainFall',
            'name': '降雨量(mm)'
          }, {
            'value': 'fillArea',
            'name': '填埋体积(m³)'
          }, {
            'value': 'sumFillweight',
            'name': '填埋总量(吨)'
          }, {
            'value': 'userName',
            'name': '记录人'
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
          _this.searchLoading = false
        }).catch(() => {
          _this.searchLoading = false
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
      }
    },
    addUserData () {
      this.dialogFormTitle = '添加'
      this.checkObjP = {
        type: 'add',
        data: {}
      }
      this.dialogFormVisible = true
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
        deleteFillBusiness(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
    },
    addLandfillData (obj) {
      this.addLandfillWasteVisible = obj.addLandfillWasteVisible
      this.addLandfillWasteObj.type = obj.type
      this.addLandfillWasteObj.dataList = obj.dataList
    },
    getChooseLandfillData (obj) {
      this.chooseRecords = obj.data
      this.addLandfillWasteVisible = obj.addLandfillWasteVisible
      this.addLandfillWasteObj.type = obj.type
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
