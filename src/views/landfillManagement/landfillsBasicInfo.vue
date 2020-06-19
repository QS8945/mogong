<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="填埋场名称：">
          <el-input v-model="queryForm.fillLocation" @keyup.enter.native="queryData" placeholder="请输入填埋场名称" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData" v-loading="searchLoading" :disabled="searchLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData" v-loading="searchLoading" :disabled="searchLoading">新增</el-button>
      </div>
      <el-table
              v-loading="searchLoading"
              :data="records"
              :show-summary="showSummary"
              :summary-method="getSummaries"
              style="width: 100%"
              :height="tableHeight"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              row-key="id"
              lazy
              :load="load">
        <el-table-column
                prop="fillLocation"
                label="填埋场名称"
                :show-overflow-tooltip="true"
                align="left">
        </el-table-column>
        <el-table-column
                prop="planFillArea"
                label="计划填埋体积(m³)"
                width="150"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.planFillArea | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="finishFillArea"
                label="已填埋体积(m³)"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.finishFillArea | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="canFillArea"
                label="可填埋体积(m³)"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.canFillArea | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="planFillWeight"
                label="计划填埋量(吨)"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.planFillWeight | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="finishFillWeight"
                label="已填埋量(吨)"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.finishFillWeight | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="canFillWeight"
                label="可填埋量(吨)"
                :show-overflow-tooltip="true"
                align="right">
          <template slot-scope="scope">
            {{scope.row.canFillWeight | formatNum}}
          </template>
        </el-table-column>
        <el-table-column
                prop="operation"
                label="操作"
                align="center"
                fixed="right"
                width="180">
          <template slot-scope="scope">
            <div class="opt-group">
                            <span class="opt-base"
                                  @click="operationP(scope.row, 'query')" type="text" size="small">
                              查看
                            </span>
              <span class="opt-base"
                    @click="operationP(scope.row, 'update')" type="text" size="small">
                                编辑
                            </span>
              <span class="opt-base"
                    @click="operationP(scope.row, 'delete')" type="text" size="small">
                                删除
                            </span>
              <!--<span class="opt-base opt-more"-->
                    <!--@click="operationP(scope.row, 'addChild')" type="text" size="small">-->
                                <!--新增-->
                            <!--</span>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<v-table :dataTable="records" :selection="false" :showSummary="showSummary" @operation="operationP"></v-table>-->
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!--//添加危废信息-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="625px">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}填埋场</div>
        </div>
        <v-add-landfillsBasicInfo ref="landfills" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-add-landfillsBasicInfo>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/pagination'
import AddLandfillsBasicInfo from '@/views/landfillManagement/dialog/addLandfillsBasicInfo'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { getFillBaseInfoListPage, deleteFillBaseInfo } from '@/assets/js/API/api'

export default {
  name: 'landfillsBasicInfo',
  data () {
    return {
      tableHeight: '100%',
      queryForm: {
        fillLocation: ''
      },
      checkObjP: {},
      dialogFormTitle: '添加',
      records: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      dialogFormVisible: false,
      tableVisible: false,
      showSummary: true,
      searchLoading: false
    }
  },
  filters: {
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-add-landfillsBasicInfo': AddLandfillsBasicInfo
  },
  created () {
    this.getData()
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
        fillLocation: this.queryForm.fillLocation
      }
      this.searchLoading = true
      getFillBaseInfoListPage(postData)
        .then(res => {
          _this.records = JSON.parse(JSON.stringify(res.data.records))
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
    operationP (data, opt) {
      switch (opt) {
        case 'query':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data.id))
          this.dialogFormTitle = '查看'
          this.dialogFormVisible = true
          break
        case 'update':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data.id))
          this.dialogFormTitle = '更新'
          this.dialogFormVisible = true
          break
        case 'addChild':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data.id))
          this.dialogFormTitle = '新增子'
          this.dialogFormVisible = true
          break
        case 'delete':
          this.delSection(data)
          break
      }
      // this.$refs.landfills.getFilBaseInfoById(data.id)
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
          fillId: obj.id
        }
        deleteFillBaseInfo(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
    },
    load (tree, treeNode, resolve) {
      getFillBaseInfoListPage({
        entId: localStorage.getItem('id'),
        parentId: tree.id
      }).then(res => {
        var records = res.data.records
        resolve(records)
      }).catch(() => {
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return parseFloat(parseFloat((prev + curr) || 0).toFixed(2))
            } else {
              return parseFloat(parseFloat(prev || 0).toFixed(2))
            }
          }, 0)
        } else {
          sums[index] = '-'
        }
      })
      // sums = parseFloat(parseFloat(sums || 0).toFixed(2))
      return sums
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
  .form-format .el-cascader {
    width: 100%;
  }
</style>
