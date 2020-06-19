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
            <div class="eil_list_main_opt" style="margin-bottom:10px;">
                <el-button :loading="loading" type="primary" icon="el-icon-plus" @click="addDic(1)">{{$t('button.add')}}</el-button>
                <!-- <el-button plain @click="delSection">删除</el-button> -->
            </div>
            <el-table v-loading="loading" border  @selection-change="handleSelectionChange"  ref="tableData" :height="tableHeight" :data="tableData" size="medium"
                :row-key="getRowKeys" :expand-row-keys="expands" @row-click='productRowToggleSelection' @expand-change="expandChange">
                <!-- <el-table-column type="selection" width="50"> </el-table-column> -->
                <el-table-column :label="$t('dicMange.typeCode')" show-overflow-tooltip prop="code"></el-table-column>
                <el-table-column :label="$t('dicMange.typeName')"  show-overflow-tooltip prop="name"></el-table-column>
                <el-table-column :label="$t('dicMange.status')"  show-overflow-tooltip prop="enabled">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.enabled?'启用':'停用'" placement="right">
                            <el-switch v-model="scope.row.enabled"  :active-value="1" :inactive-value="0" @change="handleEnable(scope.row)">
                            </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('button.operation')" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class="starnd_color">
                            <span class="Margin_font" @click="addDic(2,scope.row)">{{$t('button.add')}}</span>
                            <span class="Margin_font" @click="handleEdit(scope.row,1)">{{$t('button.edit')}}</span>
                            <span class="Margin_font" @click="handleDel(scope.row,1)">{{$t('button.del')}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-table border :data="scope.row.childList">
                            <el-table-column type="index" :label="$t('elTable.index')" width="100"> </el-table-column>
                            <el-table-column :label="$t('dicMange.code')" show-overflow-tooltip prop="code">
                            </el-table-column>
                            <el-table-column :label="$t('dicMange.name')"  show-overflow-tooltip prop="name">
                            </el-table-column>
                            <el-table-column :label="$t('dicMange.sortNum')"  show-overflow-tooltip prop="sortNum">
                            </el-table-column>
                            <el-table-column :label="$t('dicMange.status')"  show-overflow-tooltip prop="enabled">
                                <template slot-scope="scope">
                                    <el-tooltip :content="scope.row.enabled?'启用':'停用'" placement="right">
                                        <el-switch v-model="scope.row.enabled"  :active-value="1" :inactive-value="0" @change="handleLineEnable(scope.row)">
                                        </el-switch>
                                    </el-tooltip>
                                    <!-- <div :class="{'block_enable_color':scope.row.enabled,'block_disable_color':!scope.row.enabled}"></div> -->
                                    <!-- <span :class="{'enable_color':scope.row.enabled,'disable_color':!scope.row.enabled}">{{scope.row.enabled?$t('button.enable'):$t('button.disabled')}}</span> -->
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('button.operation')" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <div class="starnd_color">
                                        <span class="Margin_font" @click="handleEdit(scope.row,2)">{{$t('button.edit')}}</span>
                                        <!-- <span v-if="scope.row.enabled" class="Margin_font" @click="handleLineEnable(scope.row,0)">{{$t('button.disabled')}}</span>
                                        <span v-else class="Margin_font" @click="handleLineEnable(scope.row,1)">{{$t('button.enable')}}</span> -->
                                        <span class="Margin_font" @click="handleDel(scope.row,2)">{{$t('button.del')}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
            <div style="height:7vh"></div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="totalRecord">
                </el-pagination>
            </div>
            <dicTypeDialog ref="dicType" @reLoad="initData"></dicTypeDialog>
            <dicDialog ref="dic" @reLoad="getdicExandIndex"></dicDialog>
        </div>
    </div>

</template>
<script>
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import dicTypeDialog from './dialog/dicTypeEdit'
import dicDialog from './dialog/dicEdit'
import { pageSysDictionaryType, listSysDictionary, enableSysDictionaryType, enableSysDictionary, removeSysDictionaryType, removeSysDictionary, sysDelete } from '@/assets/js/API/api'
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
    dicTypeDialog,
    dicDialog
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData: function () {
      // var requestStr = 'sysDictionaryType/pageSysDictionaryType'
      this.queryForm.current = this.pageIndex
      this.queryForm.size = this.pageSize
      this.loading = true

      pageSysDictionaryType(this.queryForm).then(res => {
        if (res.data) {
          for (var i in res.data.records) {
            res.data.records[i].childList = []
          }
          this.tableData = res.data.records
          if (this.tableData.length > 0) {
            let self = this
            self.expands.push(self.tableData[0].id)
            this.expandChange(self.tableData[0])
          }
        }
        this.totalRecord = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // v.post(requestStr, this.queryForm)
      //   .then(res => {
      //     if (res.data) {
      //       for (var i in res.data.records) {
      //         res.data.records[i].childList = []
      //       }
      //       this.tableData = res.data.records
      //       if (this.tableData.length > 0) {
      //         let self = this
      //         self.expands.push(self.tableData[0].id)
      //         this.expandChange(self.tableData[0])
      //       }
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

    expandChange: function (row) {
      console.log(row)
      // var requestStr = 'sysDictionary/listSysDictionary.do'
      this.loading = true
      var params = { dictionaryTypeCode: row.code }
      listSysDictionary(params).then(res => {
        row.childList = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     // this.$set(row.childList,res.data);
      //     row.childList = res.data
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //     this.loading = false
      //   })
    },
    addDic: function (index, row) {
      // 1:类型 2:字典
      if (index === 1) this.$refs.dicType.show('')
      else this.$refs.dic.show('', row.code)
    },
    delDic: function () {
      var selection = []
      selection = this.$refs.tableData.selection
      if (selection == null || selection.length == 0) {
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
      if (index === 1) this.$refs.dicType.show(row.id)
      else this.$refs.dic.show(row.id)
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
          // var requestStr = 'sysDictionaryType/enableSysDictionaryType'
          var params = { id: row.id, enabled: row.enabled }
          enableSysDictionaryType(params).then(res => {
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     // v.showSuccessToast(this.$t("validate.optationSuccess"));
          //     // this.initData();
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => {
          this.initData()
        })
    },
    handleLineEnable: function (row, index) {
      // var requestStr = 'sysDictionary/enableSysDictionary'
      var params = { id: row.id, enabled: row.enabled }
      enableSysDictionary(params).then(res => {
      }).catch(() => {
      })
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
          if (index === 1) {
            // requestStr = 'sysDictionaryType/removeSysDictionaryType'
            removeSysDictionaryType(params).then(res => {
              this.$message.success(
                this.$t('validate.delSuccess')
              )
              if (index === 1) this.initData()
              else this.getdicExandIndex(row)
            }).catch(() => {
            })
          } else {
            // requestStr = 'sysDictionary/removeSysDictionary'
            removeSysDictionary(params).then(res => {
              this.$message.success(
                this.$t('validate.delSuccess')
              )
              if (index === 1) this.initData()
              else this.getdicExandIndex(row)
            }).catch(() => {
            })
          }
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
