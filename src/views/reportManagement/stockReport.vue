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
        <el-form-item label="八位码：">
          <el-input v-model="queryForm.wasteCode" placeholder="请输入八位码" clearable></el-input>
        </el-form-item>
        <el-form-item label="危废俗称：">
          <el-input v-model="queryForm.wasteName" placeholder="请输入危废俗称" clearable></el-input>
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
import { getListStorageInfo, getPageStorageAccount, getExportStorageAccount } from '@/assets/js/API/api'

export default {
  name: 'stockReport',
  data () {
    return {
      selection: false,
      queryForm: {
        storageId: '',
        wasteCode: '',
        wasteName: ''
      },
      listStorageInfo: [],
      records: {
        pageResult: {}
      },
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
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
          this.listStorageInfo = res.data
        }).catch(() => {
        })
    },
    getData () {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        storageId: this.queryForm.storageId,
        wasteCode: this.queryForm.wasteCode,
        wasteName: this.queryForm.wasteName,
        current: this.page.current,
        size: this.page.size
      }
      getPageStorageAccount(postData)
        .then(res => {
          res.data.tableHead = [{
            'value': 'storageName',
            'name': '仓库'
          }, {
            'value': 'wasteCode',
            'name': '八位码'
          }, {
            'value': 'entWasteName',
            'name': '危废俗称'
          }, {
            'value': 'quantity',
            'name': '数量',
            'type': 'Number'
          }, {
            'value': 'unit',
            'name': '单位'
          }, {
            'value': 'packageTypeName',
            'name': '包装类型'
          }, {
            'value': 'packageCount',
            'name': '包装数'
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
        storageId: this.queryForm.storageId,
        wasteCode: this.queryForm.wasteCode,
        wasteName: this.queryForm.wasteName
      }
      getExportStorageAccount(postData)
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
