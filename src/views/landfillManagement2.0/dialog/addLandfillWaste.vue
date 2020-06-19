<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="联单号：">
          <el-input v-model="queryForm.manifestNo" @keyup.enter.native="queryData" placeholder="请输入联单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="八位码：">
          <el-input v-model="queryForm.wasteCode" @keyup.enter.native="queryData" placeholder="请输入八位码" clearable></el-input>
        </el-form-item>
        <el-form-item label="危废俗称：">
          <el-input v-model="queryForm.entWasteName" @keyup.enter.native="queryData" placeholder="请输入危废俗称" clearable></el-input>
        </el-form-item>
        <el-form-item label="批次号：">
          <el-input v-model="queryForm.batchNumber" @keyup.enter.native="queryData" placeholder="请输入批次号" clearable></el-input>
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
      <el-table
              v-loading="dataTableVisible"
              ref="multipleTable"
              :data="records"
              @selection-change="handleSelectionChange"
              style="width: 100%"
              row-key="id"
              lazy>
        <!--多项选择-->
        <el-table-column  v-if="selection" type="selection">
        </el-table-column>
        <el-table-column
                prop="manifestNo"
                label="联单号"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="wasteCode"
                label="八位码"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="entWasteName"
                label="危废俗称"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="fillWeight"
                label="填埋量(吨)"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="batchNumber"
                label="批次号"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="storage"
                label="库位"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
      </el-table>
      <!--<v-table v-if="dataTableVisible" :dataTable="records" :selection="selection" @reloadSelect="reloadSelectP"></v-table>-->
      <div class="block">
        <div class="table-content-opt">
          <el-button type="primary" @click="addUserData" v-if="checkObj.type!=='query'">添加</el-button>
          <el-button plain @click="cancelForm" v-if="checkObj.type!=='query'">取消</el-button>
        </div>
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getFillbusinessWasteList } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    return {
      selection: false,
      dataTableVisible: false,
      multipleSelection: [],
      queryForm: {
        manifestNo: '',
        wasteCode: '',
        entWasteName: '',
        batchNumber: ''
      },
      records: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      dialogFormVisible: false
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination
  },
  props: ['checkObj'],
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted () {
    if (this.checkObj.type === 'query') {
      this.selection = false
    } else {
      this.selection = true
    }
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
        manifestNo: this.queryForm.manifestNo,
        wasteCode: this.queryForm.wasteCode,
        entWasteName: this.queryForm.entWasteName,
        batchNumber: this.queryForm.batchNumber
      }
      _this.dataTableVisible = true
      let params = {
        ticket: localStorage.getItem('token')
      }
      getFillbusinessWasteList(postData, params)
        .then(res => {
          _this.records = res.data.records
          _this.page.total = res.data.total
          let selectionItems = []
          _this.checkObj.dataList.forEach(function (val) {
            for (var i = 0; i < res.data.records.length; i++) {
              if (res.data.records[i].id === val.id) {
                selectionItems.push(res.data.records[i])
              }
            }
          })
          _this.$nextTick(() => {
            if (selectionItems.length) {
              _this.toggleSelection(selectionItems, true)
            }
          })
          _this.dataTableVisible = false
        }).catch(() => {
          _this.dataTableVisible = false
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
    cancelForm () {
      let obj = {
        addLandfillWasteVisible: false,
        type: this.checkObj.type
      }
      this.$emit('addLandfillData', obj)
    },
    addUserData () {
      let selections = this.multipleSelection
      if (selections.length) {
        let obj = {
          data: selections,
          visible: false,
          type: this.checkObj.type
        }
        this.$emit('getChooseLandfillData', obj)
      } else {
        COMMONJS.showToast('请先选择需添加项', 'warning')
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    toggleSelection (rows, flag) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, flag)
        })
      }
    }
  }
}
</script>

<style scoped>
  .dialog-footer {
    padding: 10px 20px 20px 20px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
    padding-bottom: 10px;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }
</style>
