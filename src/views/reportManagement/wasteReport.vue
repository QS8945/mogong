<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <!--<el-form-item label="产废车间：" clearable>-->
        <!--<el-select v-model="queryForm.storageId" clearable placeholder="请选择车间">-->
        <!--<el-option-->
        <!--v-for="item in listStorageInfo"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
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
        <!--<el-form-item>-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--ref="upload"-->
        <!--action="https://jsonplaceholder.typicode.com/posts/"-->
        <!--:on-preview="handlePreview"-->
        <!--:on-remove="handleRemove"-->
        <!--:file-list="fileList"-->
        <!--:auto-upload="false">-->
        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
        <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器-->
        <!--</el-button>-->
        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
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
import { getListStorageInfo, getPageProduceWasteAccount, getExportProduceWasteAccount } from '@/assets/js/API/api'

export default {
  name: 'wasteReport',
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
      fileList: [],
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
            'value': 'produceTime',
            'name': '产出日期',
            'type': 'Date'
          }, {
            'value': 'wastePointName',
            'name': '产废车间'
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
    },
    exportExcel () {
      let postData = {
        entId: localStorage.getItem('id'),
        storageId: this.queryForm.storageId,
        startDate: this.queryForm.startDate,
        endDate: this.queryForm.endDate
      }
      getExportProduceWasteAccount(postData)
        .then(res => {
          let url
          url = GLB_CONSTANT.devUrl.serviceSiteRootUrl + '/' + res.data
          window.location.href = url
        }).catch(() => {
        })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
