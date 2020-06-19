<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="产废车间：">
          <el-select v-model="queryForm.storageId" clearable placeholder="请选择仓库">
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
        <!--<el-form-item label="产废日期：">-->
        <!--<el-date-picker-->
        <!--v-model="queryForm.wasteDate"-->
        <!--type="daterange"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--:default-time="['00:00:00', '23:59:59']">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <el-button type="primary" @click="queryData" icon="el-icon-download">导出</el-button>
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
import { getListStorageInfo, getPageProduceWasteAccount } from '@/assets/js/API/api'

export default {
  name: 'moveReport',
  data () {
    return {
      selection: false,
      queryForm: {
        storageId: '',
        startDate: '',
        endDate: ''
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
    this.getListStorageInfo()
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
    getListStorageInfo () {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id')
      }
      getListStorageInfo(postData)
        .then(res => {
          _this.listStorageInfo = res.data
        }).catch(() => {
        })
    },
    getData () {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        storageId: this.queryForm.storageId,
        startDate: this.queryForm.startDate,
        endDate: this.queryForm.endDate,
        current: this.page.current,
        size: this.page.size
      }
      getPageProduceWasteAccount(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'wastePointName',
            'name': '产废车间'
          }, {
            'value': 'produceTime',
            'name': '产出日期',
            'type': 'Date'
          }, {
            'value': 'classCode',
            'name': '二位码'
          }, {
            'value': 'wasteCode',
            'name': '八位码'
          }, {
            'value': 'entWasteName',
            'name': '危废俗称'
          }, {
            'value': 'quantity',
            'name': '产出量',
            'type': 'Number'
          }, {
            'value': 'unit',
            'name': '单位'
          }, {
            'value': 'createUserName',
            'name': '记录人'
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
