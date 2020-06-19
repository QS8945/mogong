<template>
  <div>
    <div class="eil_search_main">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item :label="$t('orgMange.name')" >
          <el-input  v-model="queryForm.name" :placeholder="$t('elForm.input') +$t('orgMange.name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('orgMange.code')" >
          <el-input v-model="queryForm.code" :placeholder="this.$t('elForm.input') + this.$t('orgMange.code')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('orgMange.status')" >
          <el-select v-model="queryForm.enabled" :placeholder="this.$t('elForm.select') + this.$t('orgMange.status')" clearable >
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('orgMange.typeDesc')">
            <el-select v-model="queryForm.category" :placeholder="this.$t('elForm.select') + this.$t('orgMange.category')" clearable >
                <el-option v-for="item in categoryOptions" :key="item.code"  :label="item.name" :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="form-item-btn">
          <el-button type="primary" size="small" @click="getData">{{$t('button.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="eil_list_main">
      <div class="eil_list_main_opt" style="margin-bottom:10px">
        <el-button type="primary" @click="addUserData">{{$t('button.add')}}</el-button>
        <!-- <el-button plain @click="delSection">{{$t('button.del')}}</el-button> -->
      </div>
      <el-table ref="dataTable" border :data="tableData" @selection-change="handleSelectionChange" v-loading="loadingTable" :height="tableHeight" size="medium">
        <!-- <el-table-column type="selection"  width="55"> </el-table-column> -->
        <el-table-column prop="name" align="left"  :label="$t('orgMange.name')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" align="left"  :label="$t('orgMange.code')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creditCode"  align="left"   :label="$t('orgMange.socialCreditCode')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentName" align="left" :label="$t('orgMange.parentOrgName')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" align="left"  :label="$t('orgMange.category')" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="property" align="left"  :label="$t('orgMange.property')" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="enabled"  align="center"  :label="$t('orgMange.status')">
           <template slot-scope="scope">
            <el-tooltip :content="scope.row.enabled?'启用':'停用'" placement="right">
                <el-switch v-model="scope.row.enabled"  :active-value="1" :inactive-value="0" @change="enabled(scope.row)">
                </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" width="180" :label="$t('button.operation')">
          <template slot-scope="scope">
            <span class="starnd_color Margin_font" @click="editInfo(scope.row)" type="text" size="small">{{$t('button.edit')}}</span>
            <!-- <span class="starnd_color"  type="text" size="small">设置管理员</span> -->
            <span class="starnd_color Margin_font" @click="handleDel(scope.row,scope.$index)">{{$t('button.del')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="height:7vh"></div>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
          :page-sizes="page.sizes" :page-size="page.size" :layout="page.layout" :total="page.total" :pager-count="page.pagerCount" background>
        </el-pagination>
      </div>
    </div>
    <v-addOrganization ref="addOrganization" @reLoad="getData"></v-addOrganization>
  </div>
</template>

<script>
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { sysOrgsList, sysListDictionary, sysEnable, sysDelete } from '@/assets/js/API/api'
import AddOrganization from './dialog/addOrganization'

export default {
  name: 'enterpriseList',
  data () {
    return {
      tableHeight: '',
      queryForm: {
        name: '',
        code: '',
        category: '',
        enabled: ''
      },
      statusOptions: [{ label: '启用', value: '1' }, { label: '停用', value: '0' }],
      categoryOptions: [],
      tableData: [
        {
          'accidentQty': null,
          'category': null,
          'code': '123121223',
          'creditCode': '2332112333122',
          'parentOrganization': '江苏环保厅',
          'organization': '江苏神彩科技股份有限公司',
          'organizationType': '企业',
          'organizationNature': '经营企业',
          'dicFixedSourceType': null,
          'employeesNumber': null,
          'enterpriseAccidentList': null,
          'factoryList': null,
          'factoryQty': null,
          'hasRiskReport': null,
          'id': 'fc58e5c1393e406c9a4c6b4322174e71',
          'income': null,
          'industryId': null,
          'industryIdDefault': null,
          'isHappenedAccident': null,
          'isMultipleFactory': 1,
          'licenseList': null,
          'linkPhone': '13179606910',
          'name': '用户体验优化测试数据（勿修改）',
          'rejectReason': null,
          'remark': null,
          'riskReportList': null,
          'showOther': false,
          'socialCreditCode': '92411722MA417MWW90',
          'status': '1',
          'statusName': '启动',
          'type': null,
          'contacts': '小李',
          'email': '1119225755@qq.com',
          'department': '企业事业部',
          'job': '无',
          'identity': '管理员'
        },
        {
          'accidentQty': null,
          'category': null,
          'code': '123121223',
          'creditCode': '2332112333122',
          'parentOrganization': '江苏环保厅',
          'organization': '江苏神彩科技股份有限公司',
          'organizationType': '企业',
          'organizationNature': '经营企业',
          'dicFixedSourceType': null,
          'employeesNumber': null,
          'enterpriseAccidentList': null,
          'factoryList': null,
          'factoryQty': null,
          'hasRiskReport': null,
          'id': 'fc58e5c1393e406c9a4c6b4322174e72',
          'income': null,
          'industryId': null,
          'industryIdDefault': null,
          'isHappenedAccident': null,
          'isMultipleFactory': 1,
          'licenseList': null,
          'linkPhone': '13179606910',
          'name': '用户体验优化测试数据（勿修改）',
          'rejectReason': null,
          'remark': null,
          'riskReportList': null,
          'showOther': false,
          'socialCreditCode': '92411722MA417MWW90',
          'status': '0',
          'statusName': '停用',
          'type': null,
          'contacts': '小李',
          'email': '1119225755@qq.com',
          'department': '企业事业部',
          'job': '无',
          'identity': '管理员'
        }],
      loadingTable: false,
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        sizes: GLB_CONSTANT.page.sizes,
        prevText: GLB_CONSTANT.page.prevText,
        nextText: GLB_CONSTANT.page.nextText,
        layout: GLB_CONSTANT.page.layout,
        pagerCount: GLB_CONSTANT.page.pagerCount,
        total: 0
      },
      // dialog
      multipleSelection: [],
      dialogFormVisible: false,
      resetPwdFormVisible: false
    }
  },
  created: function () {
    if (document.body.clientWidth >= 1600) { this.tableHeight = '65vh' } else { this.tableHeight = '62vh' }
  },
  mounted: function () {
    this.picklist()
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
    'v-addOrganization': AddOrganization
  },
  methods: {
    enterpriseEntry () {
      this.$router.push(
        { path: '/enterpriseEntry' }
      )
    },
    getData () {
      let _this = this
      // let requestStr = 'sysOrgs/list'
      this.queryForm.current = this.page.current
      this.queryForm.size = this.page.size
      this.loadingTable = true
      sysOrgsList(this.queryForm).then(res => {
        _this.loadingTable = false
        this.page.total = res.data.total
        this.tableData = res.data.records
      }).catch(() => {
        _this.loadingTable = false
      })
      // v.post(requestStr, this.queryForm)
      //   .then(res => {
      //     _this.loadingTable = false
      //     this.page.total = res.data.total
      //     this.tableData = res.data.records
      //   }).catch(error => {
      //     _this.loadingTable = false
      //     this.$message.error(error)
      //   })
    },
    picklist: function () {
      this.listSysDictionary('orgCategory', '')
    },
    // 字典服务
    listSysDictionary: function (dictionaryTypeCode, parentCode) {
      // var requestStr = 'sysDictionary/listDictionary'
      if (!parentCode) { parentCode = '' }
      var params = { typeCode: dictionaryTypeCode, parentCode: parentCode }
      sysListDictionary(params).then(res => {
        if (dictionaryTypeCode === 'orgCategory') {
          this.categoryOptions = res.data
        }
      }).catch(() => {
      })
      // return v.get(requestStr, queryParam)
      //   .then(res => {
      //     return res
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })

      // v.listSysDictionaryNew(dictionaryTypeCode, parentCode).then(res => {
      //   if (dictionaryTypeCode == 'orgCategory') {
      //     this.categoryOptions = res.data
      //   }
      // })
    },
    enabled: function (row) {
      this.$confirm(
        row.enabled === 0
          ? this.$t('orgMange.disabledTips')
          : this.$t('orgMange.enabledTips'),
        this.$t('messageBox.title'),
        {
          confirmButtonText: this.$t('messageBox.confirm'),
          confirmButtonClass: 'ConfirmButtonClass',
          cancelButtonText: this.$t('messageBox.cancel'),
          cancelButtonClass: 'CancelButtonClass',
          type: 'warning'
        }
      )
        .then(() => {
          // let requestStr = 'sysOrgs/enable'
          let params = {
            id: row.id, //  * 机构id
            enabled: row.enabled
          }
          sysEnable(params).then(res => {
          }).catch(() => {
          })
          // v.post(requestStr, queryForm)
          //   .then(res => {
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => {
          this.getData()
        })
    },
    addUserData () {
      this.$refs.addOrganization.show('')
    },
    editInfo: function (row) {
      this.$refs.addOrganization.show(row.id)
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
    delSection () {
      if (this.multipleSelection.length) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let rows = this.multipleSelection
          let _this = this
          if (rows) {
            let ids = []
            for (let row of rows) {
              ids.push(row.id)
            }
            // let requestStr = 'sysOrgs/delete'
            let params = { ids: ids }
            _this.loading = true
            sysDelete(params).then(res => {
              _this.loading = false
              _this.$message.success('删除成功')
              _this.getData()
            }).catch(() => {
              this.loading = false
            })
            // v.post(requestStr, params)
            //   .then(res => {
            //     _this.loading = false
            //     _this.$message.success('删除成功')
            //     _this.getData()
            //   })
            //   .catch(error => {
            //     this.loading = false
            //     this.$message.error(error)
            //   })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: '请先选择删除选项'
        })
      }
    },
    handleDel: function (row) {
      this.$confirm(
        this.$t('orgMange.delTips'),
        this.$t('messageBox.title'),
        {
          confirmButtonText: this.$t('messageBox.confirm'),
          confirmButtonClass: 'ConfirmButtonClass',
          cancelButtonText: this.$t('messageBox.cancel'),
          cancelButtonClass: 'CancelButtonClass',
          type: 'warning'
        }
      )
        .then(() => {
          var params = { ids: [row.id] }
          // var requestStr = 'sysOrgs/delete'
          sysDelete(params).then(res => {
            this.$message.success(
              this.$t('validate.delSuccess')
            )
            this.getData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.delSuccess')
          //     )
          //     this.getData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    },
    submitResetDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.resetPwdFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    enableONOFF (rowData) {
      if (rowData) {
        this.$confirm('确认' + (rowData.status === '0' ? '启用' : '停用') + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rowData.status = rowData.status === '0' ? '1' : '0'
          rowData.statusName = rowData.status === '1' ? '启用' : '停用'
        })
      }
    }
  }
}
</script>

<style>
.eil_search_main {
    padding: 14px 14px 2px 14px;
    background: #fff;
    margin: 14px 14px 5px 14px;
}
.starnd_color .el-dropdown {
    color: #00a9e0 !important;
}
.Margin_font{
  margin-right: 5px;
}
</style>
