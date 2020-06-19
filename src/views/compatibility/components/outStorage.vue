<template>
  <div class="bussiness-info">
    <div class="bus-info-item">
      <div class="item-header">
        <div class="item-header-text">生产及配伍信息</div>
      </div>
      <div class="item-body">
        <el-form class="palnFormCls" :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="计划开始日期：">
                <span>{{addForm.startTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划结束日期：">
                <span>{{addForm.endTime}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="生产线：">
                <span>{{addForm.productionLine}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划用量：">
                <span>{{addForm.planQty}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="配伍总量：">
                <span>{{addForm.compatibilityQty}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="item-header">
        <div class="item-header-text">出库</div>
      </div>
      <div class="item-body">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addWaste">添加危废</el-button>
        <el-table size="mini" :row-class-name="tableRowClassName" stripe border ref="multipleTable" :data="addForm.printDetailList"
          style="width: 100%" height="250" row-key="pk" :expand-row-keys="expandKeys" @expand-change="expandChange">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table size="mini" border stripe ref="multipleTopSubTable" :data="props.row.subRecords" style="width: 100%" height="150"
                @selection-change="handleSubSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="batchNumber" label="包装编码">
                </el-table-column>
                <el-table-column align="center" prop="qty" label="数量" width="80">
                </el-table-column>
              </el-table>
              <div class="block" v-if="false">
                <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="prodEntName" label=产废单位>
          </el-table-column>
          <el-table-column align="center" prop="wasteCode" label="八位码" width="120">
          </el-table-column>
          <el-table-column align="center" prop="wasteName" label="危废俗称" width="120">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="storageName" label="所在库位" width="120">
          </el-table-column>
          <el-table-column align="center" prop="reltkCode" label="联单号" width="120">
          </el-table-column>
          <el-table-column align="center" prop="qty" label="领用量" width="80">
          </el-table-column>
          <el-table-column align="center" prop="packageNum" label="出库包数" width="80">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="dialogWasteVisible">
      <el-dialog title="添加危废" append-to-body :visible.sync="dialogWasteVisible" :close-on-click-modal="false" width="70%">
        <v-sel-waste-info @changeSelDialogVisible="changeDialogFormVisibleP"></v-sel-waste-info>
      </el-dialog>
    </div>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
      <el-button type="primary" @click="submitDialog('addForm')">保 存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import Pagination from '@/components/pagination'
  import SelWasteInfo from './selWasteInfo.vue'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getCompatibilityOut,
    pageCompatibilityPackage,
    compatibilityOutStorage
  } from '@/assets/js/API/api'
  export default {
    name: 'viewPickList',
    data() {
      return {
        multipleSubSelection: [],
        expandKeys: [],
        formLabelWidth: '110px',
        productionLineList: '',
        dialogWasteVisible: false,
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
    components: {
      'v-pagination': Pagination,
      'v-sel-waste-info': SelWasteInfo
    },
    mounted() {
      var vm = this;
      vm.getData();
    },
    props: ['checkObj'],
    methods: {
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (row.isManual) {
          return 'success-row';
        }
        return '';
      },
      addWaste() {
        var vm = this;
        vm.dialogWasteVisible = true;
      },
      refreshSubTable() {
        var vm = this;
        vm.subLoading = true;
        vm.page = {
          current: GLB_CONSTANT.page.current,
          size: 10000,
          total: 0,
          sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
        }
        pageCompatibilityPackage({
            ticket: localStorage.getItem('token'),
            reltkcode: row.reltkCode,
            size: vm.page.size,
            current: vm.page.current,
            id: vm.checkObj.compatibilityPlanId
          })
          .then(res => {
            row.subRecords = res.data.records;
            vm.subLoading = false;
          }).catch(() => {})
      },
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      expandChange(row, expandedRows) {
        if (this.expandKeys.indexOf(row.pk) >= 0) {
          //收起当前行
          this.expandKeys.shift()
          return;
        }
        if (!row.isManual) {
          this.getSubRecords(row, expandedRows);
        } else {

        }
      },
      getSubRecords(row, expandedRows) {
        var vm = this;
        vm.subLoading = true;
        vm.page = {
          current: GLB_CONSTANT.page.current,
          size: 100000,
          total: 0,
          sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
        }
        pageCompatibilityPackage({
            ticket: localStorage.getItem('token'),
            reltkcode: row.reltkCode,
            size: vm.page.size,
            current: vm.page.current,
            id: vm.checkObj.compatibilityPlanId
          })
          .then(res => {
            row.subRecords = res.data.records;
            vm.page.total = res.data.total;
            vm.subLoading = false;
            vm.expandKeys.shift() /** 新增 **/
            vm.expandKeys.push(row.pk)
          }).catch(() => {})
        if (expandedRows.length > 1) {
          //只展开当前选项
          expandedRows.shift()
        }
      },
      getData() {
        let _this = this
        let postData = {
          ticket: localStorage.getItem('token'),
          id: _this.checkObj.compatibilityPlanId
        }
        getCompatibilityOut(postData)
          .then(res => {
            _this.addForm = res.data
            _this.addForm.printDetailList.forEach(element => {
              var pkArr = [element.reltkCode, element.storageId]
              element.pk = pkArr.join(',');
            });
          }).catch(() => {})
      },
      changeDialogFormVisibleP(data) {
        var vm = this;
        vm.dialogWasteVisible = false;
        if (!data) {
          COMMONJS.showToast('数据异常!', 'warning')
          return;
        }
        var isExist = false;
        //先根据库位标识和联单号校验下是否存在了
        vm.addForm.printDetailList.forEach(element => {
          if (element.reltkCode === data.reltkcode && element.storageId === data.whID) {
            COMMONJS.showToast('所选择库位下的联单已存在！', 'warning')
            isExist = true;
          }
        });
        if (!isExist) {
          //处理data
          data.subRecords.forEach(element => {
            element.batchNumber = element.batchno
            element.id = element.guid;
            vm.multipleSubSelection.push(element);
          });
          var record = {
            wasteCode: data.basematerialmatcode,
            wasteName: data.basematerialmatname,
            storageName: data.basestorehousename,
            reltkCode: data.reltkcode,
            qty: data.totalqty,
            packageNum: data.totalPackageSize,
            prodEntName: data.entName,
            isManual: true,
            subRecords: data.subRecords
          };
          vm.addForm.printDetailList.push(record);
        }
      },
      handleSubSelectionChange(val) {
        var vm = this;
        val.forEach(element => {
          var index = vm.multipleSubSelection.findIndex(item => item.batchNumber === element.batchNumber);
          if (index == -1) {
            vm.multipleSubSelection.push(element);
          }
        });
      },
      submitDialog(formName) {
        let _this = this
        if (_this.multipleSubSelection.length == 0) {
          COMMONJS.showToast('请选择需要出库的包装！', 'warning')
          return;
        }
        var idList = [];
        _this.multipleSubSelection.forEach(element => {
          idList.push(element.id);
        });
        let postData = {
          projectId: _this.addForm.projectId,
          idList: idList,
          id: _this.checkObj.compatibilityPlanId
        }
        let params = {
          ticket: localStorage.getItem('token')
        }
        compatibilityOutStorage(postData, params)
          .then(res => {
            COMMONJS.showToast('保存成功')
            this.$emit('reload', true)
          }).catch(() => {})
      },
      cancelForm() {
        this.$emit('changeDialogFormVisible', false)
      }
    }
  }

</script>

<style lang="scss">
  @import '../../../element-variables.scss';

  .dialog-footer {
    text-align: center;
    padding: 10px 20px 20px 250px;
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

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
