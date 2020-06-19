<template>
  <div>
    <div class="table-form">
      <el-form size="mini" :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="产废企业：">
          <el-autocomplete @keyup.enter.native="queryData" style="width:100%" clearable v-model="state" :fetch-suggestions="queryEntNameAsync"
            placeholder="输入关键字搜索产废单位" @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="八位码：">
          <el-input v-model="queryForm.basematerialmatcode" @keyup.enter.native="queryData" placeholder="请输入八位码" clearable></el-input>
        </el-form-item>
        <el-form-item label="联单号：">
          <el-input v-model="queryForm.reltkcode" @keyup.enter.native="queryData" placeholder="请输入联单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="危废俗称：">
          <el-input v-model="queryForm.basematerialmatname" @keyup.enter.native="queryData" placeholder="请输入危废俗称" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
          <el-button :disabled="enableSelFlag" @click="selectWaste">选择</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <el-table size="mini" :header-cell-style="headClass" :loading="loading" stripe border ref="multipleTable" :data="records"
        style="width: 100%" height="250" row-key="pk" :expand-row-keys="expandKeys" @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-button v-if="false" type="primary" size="mini" @click="outStorage()">出 库</el-button>
            <el-table size="mini" :loading="subLoading" border stripe ref="multipleTopSubTable" :data="subRecords" style="width: 100%"
              height="150" @selection-change="handleSubSelectionChange">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
              </el-table-column>
              <el-table-column align="center" prop="qty" label="库存量" width="100">
              </el-table-column>
            </el-table>
            <div class="block" v-if="subRecords&&subRecords.length>0">
              <v-pagination :current="subPage.current" :sizes="subPage.sizes" :size="subPage.size" :total="subPage.total" @reloadPage="jumpSubPage"
                @reloadSize="jumpSubSize"></v-pagination>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="entName" label=产废单位>
        </el-table-column>
        <el-table-column align="center" prop="basematerialmatcode" label="八位码" width="120">
        </el-table-column>
        <el-table-column align="center" prop="basematerialmatname" label="危废俗称" width="120">
        </el-table-column>
        <el-table-column align="center" prop="reltkcode" label="联单号" width="120">
        </el-table-column>
        <el-table-column align="center" prop="totalqty" label="库存总量" width="80">
        </el-table-column>
        <el-table-column align="center" prop="totalPackageSize" label="总包装数" width="80">
        </el-table-column>
        <el-table-column align="center" :show-overflow-tooltip="true" prop="basestorehousename" label="库位" width="80">
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
    </div>
  </div>
</template>

<script>
  import CustomTable from '@/components/customTable'
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageInventoryStatistics,
    pageInventory,
    listEnt,
    judgeInvtkHeadValid,
    batchOutStorageForHandle
  } from '@/assets/js/API/api'

  export default {
    name: 'selWasteInfo',
    data() {
      return {
        enableSelFlag: true,
        state: '',
        cusList: [],
        queryForm: {
          valid: false,
          classCode: '',
          wasteCode: '',
          entWasteName: ''
        },
        loading: false,
        subLoading: false,
        expandKeys: [],
        checkObjP: {},
        dialogFormTitle: '添加',
        statusOptions: [{
          label: '启动',
          value: '1'
        }, {
          label: '停用',
          value: '2'
        }],
        selectRecord: {},
        selectItems: [],
        openDelay: 500,
        records: [],
        page: {
          current: GLB_CONSTANT.page.current,
          size: 10,
          total: 0
        },
        subPage: {
          current: GLB_CONSTANT.page.current,
          size: 3,
          total: 0,
          sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
        },
        multipleSelection: [],
        dialogFormVisible: false,
        addForm: {
          tel: '',
          name: '',
          password: ''
        }
      }
    },
    // 组件
    components: {
      'v-table': CustomTable,
      'v-pagination': Pagination
    },
    created() {
      var vm = this;
      //加载产废单位
      vm.listCusList();
      vm.getData()
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    props: {
      selClassCode: {
        type: String
      }
    },
    methods: {
      handleSubSelectionChange(selItem) {
        let vm = this;
        if (selItem && selItem.length > 0) {
          vm.selectItems = selItem;
          vm.enableSelFlag = false;
          if (vm.expandKeys && vm.expandKeys.length > 0) {
            var pk = vm.expandKeys[0].split(',');
            var reltkcode = pk[0],
              whID = pk[1]
              var expandRecordArr = vm.records.filter(
                item => (item.reltkcode === reltkcode && item.whID === whID)
              )
            vm.selectRecord = expandRecordArr && expandRecordArr.length > 0 ? expandRecordArr[0] : {};
            vm.selectRecord.subRecords = vm.selectItems;
          }
        } else {
          vm.enableSelFlag = true;
        }
      },
      outStorage() {

      },
      judgeInvtkHeadValid() {
        judgeInvtkHeadValid({
            ticket: localStorage.getItem('token'),
            guid: '',
          })
          .then(res => {}).catch(() => {})
      },
      listCusList() {
        var vm = this;
        listEnt({
            ticket: localStorage.getItem('token'),
            cusclassid: '01'
          })
          .then(res => {
            res.data.forEach(element => {
              vm.cusList.push({
                "id": element.guid,
                "value": element.cusname
              });
            });
          }).catch(() => {})
      },
      queryEntNameAsync(queryString, cb) {
        var vm = this;
        var cusList = vm.cusList;
        var results = queryString ? cusList.filter(this.createStateFilter(queryString)) : cusList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 100 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        var vm = this;
        vm.queryForm.entName = item.value;
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      expandChange(row, expandedRows) {
        if (this.expandKeys.indexOf(row.pk) >= 0) {
          //收起当前行
          this.expandKeys.shift()
          return;
        }
        this.getSubRecords(row, expandedRows);
      },
      getSubRecords(row, expandedRows) {
        var vm = this;
        vm.subLoading = true;
        vm.subRecords = []
        vm.subPage = {
            current: GLB_CONSTANT.page.current,
            size: 3,
            total: 0,
            sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
          },
          pageInventory({
            ticket: localStorage.getItem('token'),
            whID: row.whID,
            reltkcode: row.reltkcode,
            matID: row.matID,
            size: vm.subPage.size,
            index: vm.subPage.current
          })
          .then(res => {
            vm.subRecords = res.data.entityList;
            vm.subPage.total = res.data.recordCount;
            vm.subLoading = false;
            vm.expandKeys.shift() /** 新增 **/
            vm.expandKeys.push(row.pk)
          }).catch(() => {})
        if (expandedRows.length > 1) {
          //只展开当前选项
          expandedRows.shift()
        }
      },
      selectWaste() {
        let vm = this;
        this.$emit('changeSelDialogVisible', vm.selectRecord)
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          ticket: localStorage.getItem('token'),
          entId: localStorage.getItem("id"),
          index: this.page.current,
          size: this.page.size,
          basematerialmatname: this.queryForm.basematerialmatname,
          whID: this.queryForm.whID,
          batchno: this.queryForm.batchno,
          bustype: this.queryForm.bustype,
          basematerialmatcode: this.queryForm.basematerialmatcode,
          cusID: this.queryForm.cusID,
          reltkcode: this.queryForm.reltkcode,
          receiveCode: this.queryForm.receiveCode,
          entName: this.state
        }
        pageInventoryStatistics(postData)
          .then(res => {
            _this.records = res.data.entityList
            _this.records.forEach(element => {
              var pkArr = [element.reltkcode, element.whID];
              element.pk = pkArr.join(',');
            });
            //存在展开的就刷新下子table
            if (_this.expandKeys && _this.expandKeys.length > 0) {
              _this.refreshSubTable();
            }
            _this.page.total = res.data.recordCount
            _this.loading = false;
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
      jumpSubPage(index) {
        this.subPage.current = index
        // this.refreshSubTable()
      },
      jumpSubSize(val) {
        this.subPage.size = val
        this.subPage.current = 1
        // this.refreshSubTable()
      },
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

</style>
