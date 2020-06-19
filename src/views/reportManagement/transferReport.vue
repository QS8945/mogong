<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="八位码：">
                    <el-input v-model="queryForm.wasteCode" placeholder="请输入八位码" clearable></el-input>
                </el-form-item>
                <el-form-item label="联单号：">
                    <el-input v-model="queryForm.manifestNo" placeholder="请输入联单号" clearable></el-input>
                </el-form-item>
                <el-form-item label="处置单位：">
                    <el-input v-model="queryForm.receiveEnterpriseName" placeholder="请输入处置单位" clearable></el-input>
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
                <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                              @reloadSize="jumpSize"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant'
import { formatDate } from '@/assets/js/date'
import { getPageTransferAccount, getExportTransferAccount } from '@/assets/js/API/api'

export default {
  name: 'stockReport',
  data () {
    return {
      selection: false,
      queryForm: {
        startDate: '',
        endDate: '',
        receiveEnterpriseName: '',
        wasteName: '',
        wasteCode: ''
      },
      listStorageInfo: [],
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
        startDate: this.queryForm.startDate,
        endDate: this.queryForm.endDate,
        receiveEnterpriseName: this.queryForm.receiveEnterpriseName,
        manifestNo: this.queryForm.manifestNo,
        wasteCode: this.queryForm.wasteCode,
        current: this.page.current,
        size: this.page.size
      }
      getPageTransferAccount(postData)
        .then(res => {
          res.data.page.tableHead = [{
            'value': 'manifestNo',
            'name': '联单号'
          }, {
            'value': 'transDate',
            'name': '转移日期',
            'type': 'Date'
          }, {
            'value': 'receiveEnterpriseName',
            'name': '处置单位'
          }, {
            'value': 'wasteCode',
            'name': '八位码'
          }, {
            'value': 'wasteName',
            'name': '危废俗称'
          }, {
            'value': 'transferQuantity',
            'name': '转移量',
            'type': 'Number'
          }, {
            'value': 'unitName',
            'name': '单位'
          }, {
            'value': 'containerName',
            'name': '包装类型'
          }, {
            'value': 'transferPackageSize',
            'name': '包装数'
          }]
          res.data.page.mergeCellInfoList = res.data.cellRangeAddressVOList
          this.records = res.data.page
          this.page.total = res.data.page.total
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
        startDate: this.queryForm.wasteDate[0],
        endDate: this.queryForm.wasteDate[1]
      }
      getExportTransferAccount(postData)
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
