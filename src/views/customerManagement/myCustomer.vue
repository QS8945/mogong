<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="客户：">
          <el-input v-model="queryForm.customer" @keyup.enter.native="queryData" placeholder="请输入客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属行政区：">
          <v-common-cascader v-if="cantonVisible" :cantonName="queryForm.cantonName" :cantonOptions="cantonOptions" :showAllLevels="false" :clearable="true" :cantonPlaceholder="'所有'" :filterable="true" :changeOnSelect="true" @changeCantonName="changeCantonNameP1"></v-common-cascader>
        </el-form-item>
        <el-form-item label="片区：">
          <v-common-cascader v-if="cantonVisible" :cantonName="queryForm.area" :cantonOptions="cantonOptions" :showAllLevels="false" :clearable="true" :cantonPlaceholder="'所有'" :filterable="true" :changeOnSelect="true" @changeCantonName="changeCantonNameP2"></v-common-cascader>
        </el-form-item>
        <el-form-item label="业务员：">
          <el-select v-model="queryForm.salesman" clearable placeholder="请选择业务员">
            <el-option
                    v-for="item in salesmen"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
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
      <v-customer-type ref="customerType" :queryForm="confirmQueryForm"></v-customer-type>
      <!--<div class="table-content-opt">-->
        <!--<el-button type="primary" @click="addUserData">新增</el-button>-->
        <!--&lt;!&ndash;<el-button plain @click="delSection">删除</el-button>&ndash;&gt;-->
      <!--</div>-->
      <!--&lt;!&ndash;<v-table :dataTable="records" :selection="false" :btnVisible="true" :deleteBtn="true" :enableBtn="true" @operation="operationP"></v-table>&ndash;&gt;-->
      <!--<el-table-->
              <!--v-if="tableVisible"-->
              <!--:data="records"-->
              <!--style="width: 100%"-->
              <!--:height="tableHeight"-->
              <!--element-loading-background="rgba(0, 0, 0, 0.8)">-->
        <!--<el-table-column-->
                <!--prop="name"-->
                <!--label="项目名称"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="dispositionTypeText"-->
                <!--label="处置方式"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="quantity"-->
                <!--label="年处理能力"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.quantity | formatNum}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="unit"-->
                <!--label="计量单位"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="status"-->
                <!--label="状态"-->
                <!--:show-overflow-tooltip="true"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{(scope.row.status==='1') ? '启用' : '停用'}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
                <!--prop="operation"-->
                <!--label="操作"-->
                <!--align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="opt-group">-->
              <!--<span class="opt-base"-->
                    <!--@click="operationP({data: scope.row, operation: 'query'})" type="text" size="small">-->
                              <!--查看-->
                            <!--</span>-->
              <!--<span class="opt-base"-->
                    <!--@click="operationP({data: scope.row, operation: 'update'})" type="text" size="small">-->
                              <!--编辑-->
                            <!--</span>-->
              <!--<span class="opt-base"-->
                    <!--@click="operationP({data: scope.row, operation: 'enable'})" type="text" size="small">-->
                              <!--{{scope.row.status==='1' ? '停用' : '启用'}}-->
                            <!--</span>-->
              <!--<span v-if="scope.row.status==='1'" class="opt-base"-->
                    <!--@click="operationP({data: scope.row, operation: 'delete'})" type="text" size="small">-->
                              <!--删除-->
                            <!--</span>-->
              <!--&lt;!&ndash;<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>&ndash;&gt;-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<div class="block">-->
        <!--<v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"-->
                      <!--@reloadSize="jumpSize"></v-pagination>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import CommonCascader from '@/components/commonCascader'
import CustomerType from '@/views/customerManagement/components/customerType'
import { formatDate } from '@/assets/js/date.js'
import { getAllSySCanton, getUrlPermission } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    return {
      tableHeight: '100%',
      tableVisible: false,
      confirmQueryForm: {},
      queryForm: {
        customer: '',
        cantonName: [],
        area: [],
        salesman: ''
      },
      salesmen: [{
        name: '业务员1',
        id: '1'
      }, {
        name: '业务员2',
        id: '2'
      }, {
        name: '业务员3',
        id: '3'
      }],
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
      cantonVisible: false,
      dialogFormVisible: false
    }
  },
  // 组件
  components: {
    'v-customer-type': CustomerType,
    'v-common-cascader': CommonCascader
  },
  mounted () {
    this.init()
    this.getAllSySCanton()
    // this.getData()
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
    // 权限验证
    init () {
      let postData = {
        url: this.$route.path
      }
      getUrlPermission(postData)
        .then(res => {
        }).catch(() => {
        })
    },
    queryData () {
      this.$refs.customerType.queryData(this.queryForm)
    },
    getAllSySCanton () {
      let _this = this
      getAllSySCanton()
        .then(res => {
          _this.cantonOptions = res.data
          _this.cantonVisible = true
        }).catch(() => {
        })
    },
    changeCantonNameP1 (val) {
      this.queryForm.cantonName = val
    },
    changeCantonNameP2 (val) {
      this.queryForm.area = val
    }
  }
}
</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }
</style>
