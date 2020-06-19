<template>
  <div class="bussiness-info">
    <div class="bus-info-item">
      <el-tabs v-loading="pointLoading" v-model="defaultTabName" type="card" class="">
        <el-tab-pane v-for="item in recordList" :label="item.storageName" :name="item.storageId">
          <div class="item-header">
            <div class="item-header-text">物化处置方案信息</div>
          </div>
          <div class="item-body">
            <el-form class="palnFormCls" :model="item" :label-width="formLabelWidth">
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="计划开始日期：">
                    <span>{{formatDate(item.startTime)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计划结束日期：">
                    <span>{{formatDate(item.endTime)}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="生产线：">
                    <span>{{item.productionLine}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计划用量：">
                    <span>{{item.planQty}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="配伍总量：">
                    <span>{{item.totalCompatibilityQty|amtFormat}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="领用仓库：">
                    <span>{{item.storageName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="领用量：">
                    <span>{{item.compatibilityQty|amtFormat}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="打印日期：">
                    <span>{{item.printDate}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="item-header">
            <div class="item-header-text">出库明细</div>
          </div>
          <div class="item-body">
            <el-table size="mini" stripe border :header-cell-style="headClass" ref="multipleTable" :data="item.printDetailList"
                      height="250">
              <el-table-column :show-overflow-tooltip="true" align="center" prop="prodEntName" label=产废单位>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="wasteCode" label="八位码">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="wasteName" label="危废俗称">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="storageName" label="所在库位">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkCode" label="联单号">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="qty" label="领用量">
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div>
        <table class="table-user-info">
          <tbody>
          <tr>
            <td rowspan="2">仓储部</td>
            <td>
              出库人:
            </td>
            <td rowspan="2">生产部</td>
            <td>接收人:</td>
            <td rowspan="2">外包</td>
            <td>执行人:</td>
          </tr>
          <tr>
            <td>出库日期:</td>
            <td>接受日期:</td>
            <td>执行日期:</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" v-if="checkObj">
      <el-button type="primary" @click="submitDialog('addForm')">打 印</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  listCompatibilityPrint,
  exportOutStorageBill
} from '@/assets/js/API/api'
export default {
  name: 'viewPickList',
  data () {
    return {
      pointLoading: false,
      recordList: [],
      defaultTabName: '',
      formLabelWidth: '110px',
      productionLineList: '',
      dialogVisible: false,
      tableData: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: 10,
        total: 0,
        sizes: [5, 10, 50]
      },
      addForm: {
        id: '',
        planNo: '',
        startTime: '',
        endTime: '',
        productionLine: '',
        planQty: '',
        createUserName: '',
        createTime: '',
        remark: ''
      },
      addFormRules: {}
    }
  },
  filters: {
    amtFormat: function (data) {
      if (isNaN(parseFloat(data))) {
        return data
      }
      return parseFloat(data).toFixed(4)
    }
  },
  components: {
    'v-pagination': Pagination
  },
  mounted () {
    var vm = this
    vm.getData()
  },
  props: ['checkObj'],
  methods: {
    headClass ({
      row,
      rowIndex
    }) {
      return 'background:#F8F8F9;color:#8F99A2'
    },
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    getFormatDate (arg) {
      if (arg == undefined || arg == '') {
        return ''
      }

      var re = arg + ''
      if (re.length < 2) {
        re = '0' + re
      }

      return re
    },
    getData () {
      let _this = this
      _this.pointLoading = true
      let postData = {
        id: _this.checkObj ? _this.checkObj.data : _this.$route.query.id
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      exportOutStorageBill(postData, params)
        .then(res => {
          _this.recordList = res.data
          _this.recordList.forEach(element => {
            var date = new Date()
            element['printDate'] = date.getFullYear() + '-' + _this.getFormatDate(date.getMonth() + 1) + '-' +
                _this.getFormatDate(date.getDate())
          })
          if (_this.recordList && _this.recordList.length > 0) {
            _this.defaultTabName = _this.recordList[0].storageId
            if (_this.$route.query && _this.$route.query.defaultTabName && _this.$route.query.defaultTabName != '') {
              _this.defaultTabName = _this.$route.query.defaultTabName
            }
          }
          _this.pointLoading = false
          // if (!_this.checkObj && _this.$route.query.id != '') {
          //   setTimeout(() => {
          //     window.print()
          //   }, 500)
          // }
        }).catch(() => {})
    },
    changeDialogFormVisibleP (data) {
      var vm = this
      vm.dialogVisible = false
      if (vm.selCode == 8) {
        vm.addForm.wasteClassCode = data[0].classCode
        vm.addForm.wasteCode = data[0].wasteCode
        vm.addForm.wasteId = data[0].id
        vm.addForm.wasteName = data[0].entWasteName
      } else if (vm.selCode == 2) {
        if (vm.addForm.wasteClassCode != data[0].code) {
          vm.addForm.wasteClassCode = data[0].code
          vm.addForm.wasteCode = ''
          vm.addForm.wasteId = ''
          vm.addForm.wasteName = ''
        }
      }
    },
    getClientHost () {
      var curWwwPath = window.document.location.href
      var pathname = window.document.location.pathname
      var pos = curWwwPath.indexOf(pathname)
      var localhostPath = curWwwPath.substring(0, pos)
      var projectName = pathname.substring(0, pathname.substr(1).indexOf('/') + 1)
    },
    submitDialog (formName) {
      var vm = this
      var curWwwPath = window.document.location.href
      var pathname = window.document.location.pathname
      var pos = curWwwPath.indexOf(pathname)
      var localhostPath = curWwwPath.substring(0, pos)
      window.open(localhostPath + pathname + '/#/printPickList?id=' + vm.checkObj.id +
          '&defaultTabName=' + vm.defaultTabName)
    },
    cancelForm () {
      this.$emit('changeDialogFormVisible', false)
    }
  }
}

</script>

<style lang="scss">
  @import '../../../element-variables';

  .dialog-footer {
    text-align: center;
    padding: 10px 20px 20px 10px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

  .bussiness-info {
    position: relative;
    background: #fff;
    padding: 17px 30px;
    flex-grow: 1;
    overflow: scroll;
    .back-to-customer {
      position: absolute;
      right: 110px;
      top: 22px;
      padding: 5px 10px;
      z-index: 1;
    }
    /*.el-form-item{*/
    /*margin-bottom: 16px;*/
    /*}*/
    .el-btn-address {
      .iconaddress {
        font-size: 24px;
      }
    }
    .el-form-item.is-success .el-input__inner {
      border: 1px solid #DCDFE6;
    }
    .el-cascader,
    .el-date-editor {
      width: 100%;
    }
    .map-address {
      position: absolute;
      left: 60px;
      top: 67px;
      color: #455A70;
      text-align: left;
      padding: 15px 20px;
      white-space: nowrap;
      background: #fff;
      .map-form-item {
        padding: 5px;
        font-size: 14px;
      }
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    form {
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }

    .map-dialog.el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dialog {
        margin: auto !important;

        .el-dialog__header {
          padding: 0;
          position: relative;
          .title {
            position: absolute;
            right: -26px;
            top: -21px;
          }
        }
      }
    }

    .map-dialog {
      .el-dialog {
        width: 50%;
        height: 70%;
        display: flex;
        flex-direction: column;

        .el-dialog__body {
          flex-grow: 1;
        }
      }

      .el-dialog__body {
        padding: 0;
      }
    }

    .init-row-margin {
      margin: 0 !important;
    }

    .bus-info-item {
      .item-header {
        padding: 13px 0;
        border-bottom: 1px solid #EEEEEE;

        .item-header-text {
          text-align: left;
          padding-left: 20px;
          border-left: 2px solid $--color-primary;
          color: #555D66;
          font-size: 16px;
        }
      }

      .item-body {
        padding: 30px 50px;

        .el-input {
          .el-input-group__prepend {
            border-radius: 4px 0px 0px 4px !important;
          }
          .el-input-group__append,
          .el-input-group__prepend {
            padding: 0 13px;
          }
        }

        .business-license {
          .el-form-item__content {
            text-align: center;
          }
        }
      }
    }
  }

  .add-dialog-footer {
    margin-left: 120px;
  }

  .padding-left-none {
    padding-left: 0 !important;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

  .palnFormCls .el-row .el-col {
    height: 40px;
  }

  @page {
    size: landscape;
  }

  .el-tabs__header {
    display: none;
  }
  .table-user-info{
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    /*border: 1px solid #EBEEF5;*/
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    tr{
      /*&:hover{*/
        /*td{*/
          /*background-color: #f5f7fa;*/
        /*}*/
      /*}*/
      td{
        transition: background-color .25s ease;
        border: 1px solid #ebeef5;
        min-width: 0;
        height: 80px;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: top;
        position: relative;
        text-align: left;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        /*&:nth-child(1){*/
          /*background:rgba(250,250,250,1);*/
        /*}*/
        /*&:nth-child(2){*/
          /*text-align: left;*/
        /*}*/
      }
    }
  }

</style>
