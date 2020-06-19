<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="模板名称：">
          <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select >

          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>
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
                label="模板名称"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="paramQty"
                label="参数数量"
                :show-overflow-tooltip="true"
                align="center">
          <template slot-scope="scope">
            {{scope.row.paramQty | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="remark"
                label="备注"
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
              <span v-if="scope.row.status==='1'" class="opt-base"
                    @click="operationP({data: scope.row, operation: 'apply'})" type="text" size="small">
                              应用
                            </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}模板信息</div>
        </div>
        <v-param-info :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-param-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import templateInfo from '@/views/labManagement/dialog/templateInfo'
import Pagination from '@/components/pagination'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { pageAnalysisTemplate } from '@/assets/js/API/api'

export default {
  name: 'analysisTemplate',
  data () {
    return {
      tableHeight: '100%',
      tableVisible: false,
      dialogFormVisible: false,
      queryForm: {
        valid: false,
        classCode: '',
        wasteCode: '',
        entWasteName: ''
      },
      checkObjP: {},
      dialogFormTitle: '添加',
      records: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      }
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-param-info': templateInfo
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
        name: this.queryForm.name
      }
      pageAnalysisTemplate(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'name',
            'name': '模板名称'
          }, {
            'value': 'paramQty',
            'name': '参数数量'
          }, {
            'value': 'remark',
            'name': '备注'
          }, {
            'value': 'status',
            'name': '状态',
            'type': 'YesOrNo'
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
          _this.records = res.data.records
          _this.page.total = res.data.total
          _this.tableVisible = true
        }).catch(() => {
        })
    },
    pageAnalysisTemplate () {
      let postData = {
        entId: localStorage.getItem('id'),
        current: this.page.current,
        size: this.page.size
      }
      pageAnalysisTemplate(postData).then(
        res => {
          this.listParams = res.data.records
        }
      ).catch(() => {
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
    reloadP (val) {
      val && this.getData()
      this.dialogFormVisible = false
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
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
        let msg = obj.enabled ? '停用' : '启用'
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
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
