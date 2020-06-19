<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="出/入库：">
          <el-select v-model="queryForm.billType" clearable placeholder="请选择出入库">
            <el-option
                    v-for="item in listStorageInfo"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
                  v-model="queryForm.startDate"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
                  v-model="queryForm.endDate"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束日期"
                  :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <!--<div class="table-content-opt">-->
      <!--<el-button type="primary" @click="addUserData">新增</el-button>-->
      <!--<el-button plain @click="delSection">删除</el-button>-->
      <!--</div>-->
      <v-table :dataTable="records" :selection="false"></v-table>
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant'
import { formatDate } from '@/assets/js/date'
import { getPageOutgoingAccount, getExportOutgoingAccount } from '@/assets/js/API/api'

export default {
  name: 'stockReport',
  data () {
    return {
      selection: false,
      queryForm: {
        billType: '',
        startDate: '',
        endDate: ''
      },
      listStorageInfo: [{
        id: 'O',
        name: '出库'
      }, {
        id: 'I',
        name: '入库'
      }],
      records: {
        pageResult: {}
      },
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    setTimeout(function () {
      this.tableHeight = 'auto'
    }, 500)
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
  components: {
    'v-table': CustomTable,
    'v-pagination': Pagination
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
        billType: this.queryForm.billType,
        startDate: this.queryForm.startDate,
        endDate: this.queryForm.endDate,
        current: this.page.current,
        size: this.page.size
      }
      getPageOutgoingAccount(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'storageName',
            'name': '仓库'
          }, {
            'value': 'billTypeName',
            'name': '出/入库'
          }, {
            'value': 'billTime',
            'name': '出/入库日期',
            'type': 'Date'
          }, {
            'value': 'wasteCode',
            'name': '八位码'
          }, {
            'value': 'entWasteName',
            'name': '危废俗称'
          }, {
            'value': 'packageTypeName',
            'name': '包装类型'
          }, {
            'value': 'packageCount',
            'name': '包装数'
          }, {
            'value': 'quantity',
            'name': '数量',
            'type': 'Number'
          }, {
            'value': 'unit',
            'name': '单位'
          }]
          this.records = res.data
          this.page.total = res.data.total
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
    exportExcel () {
      let postData = {
        entId: localStorage.getItem('id'),
        billType: this.queryForm.billType,
        startDate: this.queryForm.wasteDate[0],
        endDate: this.queryForm.wasteDate[1]
      }
      getExportOutgoingAccount(postData)
        .then(res => {
          let url
          url = GLB_CONSTANT.devUrl.serviceSiteRootUrl + '/' + res.data
          window.location.href = url
        }).catch(() => {
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
