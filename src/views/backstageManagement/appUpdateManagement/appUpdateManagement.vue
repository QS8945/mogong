<template>
    <div>
        <div class="eil_search_main">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="">
                    <el-input :placeholder="$t('elForm.input')+$t('dicMange.name')"
                            v-model.trim="queryForm.keyword"></el-input>
                </el-form-item>
                <el-form-item class="form-item-btn">
                    <el-button type="primary" size="small" @click="queryList">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="eil_list_main">
            <div style="margin-bottom:10px">
                <el-button :loading="loading" type="primary" icon="el-icon-plus" @click="addDic(1)">{{$t('button.add')}}</el-button>
                <!-- <el-button plain @click="delSection">删除</el-button> -->
            </div>
            <el-table v-loading="loading" border  @selection-change="handleSelectionChange"  ref="tableData" :height="tableHeight" :data="tableData" size="medium"
                :row-key="getRowKeys" :expand-row-keys="expands" @row-click='productRowToggleSelection'>
                <!-- <el-table-column type="selection" width="50"> </el-table-column> -->
                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column :label="$t('appUpdateManagement.version')" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.currentVersion ? '[当前版本]' : ''}}{{scope.row.version}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('appUpdateManagement.description')"  show-overflow-tooltip prop="description" align="center"></el-table-column>
                <el-table-column :label="$t('appUpdateManagement.address')"  show-overflow-tooltip prop="address" align="center"></el-table-column>
                <el-table-column :label="$t('appUpdateManagement.status')"  show-overflow-tooltip prop="status" align="center">
                    <template slot-scope="scope">
                        <span>{{(scope.$index === 0) ? (scope.row.forcedUpdate ? '[强制更新]' : '[不强制更新]') : ''}}{{scope.row.status}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('appUpdateManagement.updateTime')" show-overflow-tooltip prop="updateTime" align="center"></el-table-column>
                <el-table-column :label="$t('appUpdateManagement.issuer')" show-overflow-tooltip prop="issuer" align="center"></el-table-column>
                <el-table-column :label="$t('button.operation')" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <div class="starnd_color">
                            <span class="Margin_font" v-if="scope.row.status === '已保存'" @click="handleEdit(scope.row,1)">{{$t('button.edit')}}</span>
                            <span class="Margin_font" v-if="scope.row.status === '已保存'" @click="handleDel(scope.row,1)">{{$t('button.del')}}</span>
                            <span class="Margin_font" v-if="(scope.row.status === '已发布')" @click="handleStopReleaseVersion(scope.row,1)">{{$t('button.stopReleaseVersion')}}</span>
                            <span class="Margin_font" v-if="(scope.row.status === '已发布') && (!scope.row.currentVersion)" @click="handleSetCurrentVersion(scope.row,1)">{{$t('button.setCurrentVersion')}}</span>
                            <span class="Margin_font" v-if="scope.row.status === '已保存'" @click="handleReleaseVersion(scope.row,1)">{{$t('button.releaseVersion')}}</span>
                            <span class="Margin_font" @click="handleCheckUpdate(scope.row,1)">{{$t('button.checkUpdate')}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div style="height:7vh"></div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="totalRecord">
                </el-pagination>
            </div>
            <AppTypeEditDialog ref="appType" @reLoad="initData"></AppTypeEditDialog>
            <AppUpdateLogs ref="appUpdateLogs"></AppUpdateLogs>
        </div>
    </div>

</template>
<script>
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import AppTypeEditDialog from './dialog/appEdit'
import AppUpdateLogs from './dialog/appUpdateLogs'
import { listSysAppUpdatePage, enableSysDictionaryType, sysDelete, deleteSysAppUpdatePage, setCurrentVersion, stopReleaseVersion, releaseVersion } from '@/assets/js/API/api'
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      queryForm: {
        keyword: '', // 关键字
        current: '',
        size: ''
      },
      getRowKeys (row) {
        return row.id
      },
      expands: [],
      multipleSelection: [],
      // 分页
      pageIndex: GLB_CONSTANT.page.current,
      pageSize: GLB_CONSTANT.page.size,
      pageSizes: GLB_CONSTANT.page.sizes,
      totalRecord: 0,
      layout: GLB_CONSTANT.page.layout,
      tableHeight: ''
    }
  },
  created: function () {
    if (document.body.clientWidth >= 1600) { this.tableHeight = '65vh' } else { this.tableHeight = '62vh' }
  },
  components: {
    AppTypeEditDialog,
    AppUpdateLogs
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData: function () {
      this.queryForm.current = this.pageIndex
      this.queryForm.size = this.pageSize
      this.loading = true
      listSysAppUpdatePage(this.queryForm).then(res => {
        if (res.data) {
          this.tableData = res.data.records
        }
        this.totalRecord = res.data.total
        this.loading = false
      }).catch(() => {
      })
      // var requestStr = 'sysAppUpdate/listSysAppUpdatePage'
      // v.post(requestStr, this.queryForm)
      //   .then(res => {
      //     if (res.data) {
      //       this.tableData = res.data.records
      //     }
      //     this.totalRecord = res.data.total
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //     this.loading = false
      //   })
    },
    queryList: function () {
      this.pageIndex = 1
      this.initData()
    },

    // expandChange: function (row) {
    //     console.log(row);
    //     var requestStr = "sysDictionary/listSysDictionary.do";
    //     this.loading = true;
    //     var params = { dictionaryTypeCode: row.code };
    //     v.post(requestStr, params)
    //         .then(res => {
    //             // this.$set(row.childList,res.data);
    //             row.childList = res.data;
    //             this.loading = false;
    //         })
    //         .catch(error => {
    //             this.$message.error(error);
    //             this.loading = false;
    //         });
    // },
    addDic: function (index, row) {
      // 1:类型 2:字典
      if (index === 1) this.$refs.appType.show('')
    },
    delDic: function () {
      var selection = []
      selection = this.$refs.tableData.selection
      if (selection == null || selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据'
        })
      } else {
        var ids = []
        for (var i = 0; i < selection.length; i++) {
          ids.push(selection[i].id)
        }
        this.tipRemove(ids)
      }
    },
    handleEdit: function (row, index) {
      if (index === 1) this.$refs.appType.show(row)
      else this.$refs.appType.show(row)
    },
    handleEnable: function (row) {
      this.$confirm(
        row.enabled === 0
          ? this.$t('dicMange.disabledTips')
          : this.$t('dicMange.enabledTips'),
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
          enableSysDictionaryType({ id: row.id, enabled: row.enabled }).then(res => {
          }).catch(() => {
          })
        })
        .catch(() => {
          this.initData()
        })
    },
    handleLineEnable: function (row, index) {
      enableSysDictionaryType({ id: row.id, enabled: row.enabled }).then(res => {
      }).catch(() => {
      })
      // var requestStr = 'sysDictionary/enableSysDictionary'
      // var params = { id: row.id, enabled: row.enabled }
      // v.post(requestStr, params)
      //   .then(res => {
      //     // v.showSuccessToast(this.$t("validate.optationSuccess"));
      //     // // this.initData();
      //     // this.getdicExandIndex(row);
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    getdicExandIndex: function (row) {
      for (var i in this.tableData) {
        if (this.tableData[i].code == row.typeCode) {
          this.expandChange(this.tableData[i])
          this.expands = []
          this.expands.push(this.tableData[i].id)
        }
      }
    },
    delSection () {
      if (this.multipleSelection.length) {
        this.$confirm(
          '此操作将永久删除该记录,是否继续',
          this.$t('messageBox.title'),
          {
            confirmButtonText: this.$t('messageBox.confirm'),
            confirmButtonClass: 'ConfirmButtonClass',
            cancelButtonText: this.$t('messageBox.cancel'),
            cancelButtonClass: 'CancelButtonClass',
            type: 'warning'
          }
        ).then(() => {
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
              _this.loading = false
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
    handleDel: function (row, index) {
      this.$confirm(
        '此操作将永久删除该记录,是否继续',
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
          var params = { id: row.id }
          // var requestStr = ''
          // requestStr = 'sysAppUpdate/deleteSysAppUpdatePage'
          deleteSysAppUpdatePage(params).then(res => {
            this.$message.success(
              this.$t('validate.delSuccess')
            )
            if (index === 1) this.initData()
            else this.getdicExandIndex(row)
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.delSuccess')
          //     )
          //     if (index == 1) this.initData()
          //     else this.getdicExandIndex(row)
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    handleSetCurrentVersion: function (row, index) {
      this.$confirm(
        '确定设为当前版本？',
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
          var params = { id: row.id }
          // var requestStr = ''
          // requestStr = 'sysAppUpdate/setCurrentVersion'
          setCurrentVersion(params).then(res => {
            this.$message.success(
              this.$t('validate.setSuccess')
            )
            this.initData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.setSuccess')
          //     )
          //     this.initData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    handleStopReleaseVersion: function (row, index) {
      this.$confirm(
        '确定撤销发布？',
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
          var params = { id: row.id }
          // var requestStr = ''
          // requestStr = 'sysAppUpdate/stopReleaseVersion'
          stopReleaseVersion(params).then(res => {
            this.$message.success(
              this.$t('validate.stopSuccess')
            )
            this.initData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.stopSuccess')
          //     )
          //     this.initData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    handleReleaseVersion: function (row, index) {
      this.$confirm(
        '确定发布当前版本？',
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
          var params = { id: row.id }
          // var requestStr = ''
          // requestStr = 'sysAppUpdate/releaseVersion'
          releaseVersion(params).then(res => {
            this.$message.success(
              this.$t('validate.releaseSuccess')
            )
            this.initData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.releaseSuccess')
          //     )
          //     this.initData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    handleCheckUpdate: function (row, index) {
      this.$refs.appUpdateLogs.show(row)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    productRowToggleSelection: function (row) {
      this.$refs.tableData.toggleRowSelection(row)
    },
    tipRemove: function (ids) { },

    // 分页事件
    handleSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.initData()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.initData()
    }
  }
}
</script>
<style>
.Margin_font {
    margin-right: 5px;
}
</style>
