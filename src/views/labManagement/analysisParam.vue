<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="参数名称：">
          <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入参数名称" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addData">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>
      <v-table :dataTable="records" :selection="false" @operation="operationP"></v-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}参数信息</div>
        </div>
        <v-param-info :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-param-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import ParamInfo from '@/views/labManagement/dialog/paramInfo'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { pageAnalysisParam, deleteAnalysisParam } from '@/assets/js/API/api'

export default {
  name: 'analysisParam',
  data () {
    return {
      queryForm: {
        name: ''
      },
      dialogFormTitle: '添加',
      records: {},
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      multipleSelection: [],
      dialogFormVisible: false
    }
  },
  // 组件
  components: {
    'v-table': CustomTable,
    'v-pagination': Pagination,
    'v-param-info': ParamInfo
  },
  created () {
    this.getData()
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
        name: this.queryForm.name
      }
      pageAnalysisParam(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'name',
            'name': '参数名称'
          }, {
            'value': 'valueName',
            'name': '值类型'
          }, {
            'value': 'unitTypeName',
            'name': '单位类型'
          }, {
            'value': 'abbreviation',
            'name': '默认单位'
          }, {
            'value': 'remark',
            'name': '备注'
          }, {
            'value': 'operation',
            'name': '操作'
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
    addData () {
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
    delSection (obj) {
      let _this = this
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         let ids  = [];
         ids.push(obj.id);
        let postData = {
          ids
        }
        deleteAnalysisParam(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
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
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
