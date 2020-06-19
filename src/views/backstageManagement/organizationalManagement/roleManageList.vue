<!-- 角色权限列表-->
<template>
    <div style="display: flex;">
        <div :style="isShowAssign?'width:80%':'width:100%'">
            <div class="eil_search_main">
                <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                    <el-form-item :label="$t('roleManage.name')">
                        <el-input :placeholder="$t('elForm.input')+$t('roleManage.name')" v-model.trim="queryForm.keyword"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-btn">
                        <el-button type="primary" size="small" @click="queryData">{{$t('button.query')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="eil_list_main">
                <div class="eil_list_main_opt" style="margin-bottom:10px">
                    <el-button :loading="loading" type="primary" icon="el-icon-plus" @click="handleAdd">{{$t('button.add')}}</el-button>
                    <!-- <el-button plain @click="delSection">{{$t('button.del')}}</el-button> -->
                </div>
                <el-table v-loading="loading" border  ref="tableData" :data="tableData" size="medium" @selection-change="handleSelectionChange" @row-click='productRowToggleSelection' :height="tableHeight">
                    <!-- <el-table-column type="selection" width="55" :height="tableHeight"></el-table-column> -->
                    <el-table-column :label="$t('roleManage.name')" show-overflow-tooltip prop="name"></el-table-column>
                    <el-table-column :label="$t('roleManage.code')" show-overflow-tooltip prop="code"></el-table-column>
                    <el-table-column :label="$t('roleManage.orgName')" show-overflow-tooltip prop="orgName"></el-table-column>
                    <el-table-column prop="enabled"  align="center" label="状态">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.enabled?'启用':'停用'" placement="right">
                                <el-switch v-model="scope.row.enabled"  :active-value="1" :inactive-value="0" @change="handleEnable(scope.row)">
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('button.operation')" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="starnd_color">
                                <span class="Margin_font" @click="handleEdit(scope.row,scope.$index)">{{$t('button.edit')}}</span>
                                <span class="Margin_font" @click="selectPree(scope.row)">分配权限</span>
                                <span class="starnd_color" @click="handleDel(scope.row,scope.$index)">{{$t('button.del')}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="height:7vh"></div>
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageIndex" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout"
                        :total="totalRecord">
                    </el-pagination>
                </div>
                <roleDialog ref="role" @reLoad="initData"></roleDialog>
            </div>
        </div>
        <div style="width:20%" v-if="isShowAssign">
            <div class="auth_role_body">
                <div class="search-header">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item>
                        <div>权限菜单</div>
                        <!-- <el-input v-model="searchForm.keyword" placeholder="请输入菜单名称"></el-input> -->
                    </el-form-item>
                    </el-form>
                </div>
                <div class="auth_tree innerbox">
                    <el-tree   :data="menuTreeList" ref="menuList" show-checkbox  node-key="code" default-expand-all :expand-on-click-node="false"
                    :default-checked-keys="locationKeys" :props="props">
                        <span class="custom-tree-node" slot-scope="{ node }">
                        <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    <el-button type="primary" :loading="loading" @click="assginPower">{{$t('button.save')}}</el-button>
                    <el-button @click="handleClose">{{$t('button.close')}}</el-button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import roleDialog from './dialog/roleEdit.vue'
import { sysTree, sysRolesEnable, sysRolesDelete, sysRolesList, sysButtonRemove, sysListRole, sysRolesMenuAdd } from '@/assets/js/API/api'
// import menuSelect from "./formDialog/menuSelect.vue";

export default {
  data () {
    return {
      loading: false,
      queryForm: {
        keyword: ''
      },
      searchForm: {},
      tableData: [],
      current: '',
      size: '',
      getRowKeys (row) {
        return row.id
      },
      menuTreeList: [],
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      isShowAssign: false,
      locationRoleId: '',
      locationKeys: [],
      expands: [],
      // 分页
      pageIndex: GLB_CONSTANT.page.current,
      pageSize: GLB_CONSTANT.page.size,
      pageSizes: GLB_CONSTANT.page.sizes,
      totalRecord: 0,
      layout: GLB_CONSTANT.page.layout,
      tableHeight: '',
      multipleSelection: []
    }
  },
  components: {
    roleDialog
    // menuSelect
  },
  created: function () {
    if (document.body.clientWidth >= 1600) { this.tableHeight = '65vh' } else { this.tableHeight = '62vh' }
  },
  mounted: function () {
    this.initData()
    this.listMenuTree()
  },
  methods: {
    initData: function () {
      this.getList()
    },
    queryData: function () {
      this.pageIndex = 1
      this.initData()
    },
    listMenuTree: function () {
      // let requestStr = 'sysMenu/tree'
      // let requestStr = "sysMenu/tree/user";
      let queryForm = {
        sourceTypes: [], //  * 菜单来源类型  1 : WEB; 2: APP
        parentId: ''
      }
      sysTree(queryForm).then(res => {
        this.menuTreeList = res.data
      }).catch(() => {
      })

      // v.post(requestStr, queryForm)
      //   .then(res => {
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    bindingMenu: function (row) {
      this.$refs.menuSelect.show(row, 'role_mp_menu')
    },
    handleAdd: function () {
      this.$refs.role.show('')
    },
    handleEdit: function (row, index) {
      this.$refs.role.show(row.id)
    },
    handleDiscontinue: function (row, index) { },
    handleEnable: function (row) {
      this.$confirm(
        row.enabled === 0
          ? this.$t('roleManage.disabledTips')
          : this.$t('roleManage.enabledTips'),
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
          // var requestStr = 'sysRoles/enable'
          var params = { id: row.id, enabled: row.enabled }
          sysRolesEnable(params).then(res => {
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => {
          this.initData()
        })
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
            // let requestStr = 'sysRoles/delete'
            let params = { ids: ids }
            _this.loading = true
            sysRolesDelete(params).then(res => {
              _this.loading = false
              _this.$message.success(this.$t('validate.delSuccess'))
              _this.initData()
            }).catch(() => {
              this.loading = false
            })
            // v.post(requestStr, params)
            //   .then(res => {
            //     _this.loading = false
            //     _this.$message.success(this.$t('validate.delSuccess'))
            //     _this.initData()
            //   })
            //   .catch(error => {
            //     this.loading = false
            //     this.$message.error(error)
            //   })
          }
        }).catch(() => { })
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
          var params = { ids: [row.id] }
          // var requestStr = 'sysRoles/delete'
          sysRolesDelete(params).then(res => {
            this.$message.success(
              this.$t('validate.delSuccess')
            )
            this.initData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.delSuccess')
          //     )
          //     this.initData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => { })
    },
    productRowToggleSelection: function (row) {
      this.$refs.tableData.toggleRowSelection(row)
    },
    getList: function () {
      // var requestStr = 'sysRoles/list'
      var queryParam = {
        size: this.pageSize,
        current: this.pageIndex,
        keyword: this.queryForm.keyword
      }
      sysRolesList(queryParam).then(res => {
        if (res.data) {
          this.tableData = res.data.records
          this.totalRecord = res.data.total
        }
      }).catch(() => {
      })
      // v.post(requestStr, queryParam)
      //   .then(res => {
      //     if (res.data) {
      //       this.tableData = res.data.records
      //       this.totalRecord = res.data.total
      //     }
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    doRemove: function (id) {
      var param = { id: id }
      // var serviceApi = 'sysButton/remove'
      sysButtonRemove(param).then(res => {
        if (res.code === 1) {
          this.$message.success('删除成功！')
          this.initData()
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
      })
      // return v.post(serviceApi, param).then(res => {
      //   if (res.code === 1) {
      //     this.$message.success('删除成功！')
      //     this.initData()
      //   } else {
      //     this.$message.error('删除失败！')
      //   }
      // })
    },
    tipRemove: function (ids) {
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
          // this.$message.info('批量删除服务..');
          this.doRemove(ids)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    selectPree: function (row) {
      this.locationRoleId = row.id
      this.locationKeys = []
      this.isShowAssign = false
      let self = this
      setTimeout(function () {
        self.isShowAssign = true
        self.getlocationrole()
      }, 200)
      // 调用服务
    },
    getlocationrole: function () {
      let params = {
        roleId: this.locationRoleId
      }
      // let requestStr = 'sysMenu/list/role'
      sysListRole(params).then(res => {
        this.locationKeys = res.data
      }).catch(() => {
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     this.locationKeys = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    handleClose: function () {
      this.isShowAssign = false
    },
    assginPower: function () {
      let halfList = this.$refs.menuList.getHalfCheckedKeys()
      let halfs = []
      let keys = this.$refs.menuList.getCheckedKeys()
      for (let half of halfList) {
        if (half.length !== 1) { halfs.push(half) }
      }
      let params = {
        menuIds: keys,
        halfMenuIds: halfs,
        roleId: this.locationRoleId
      }
      this.loading = true
      // let requestStr = 'sysRoles/menu/add'
      sysRolesMenuAdd(params).then(res => {
        COMMONJS.showToast(self.$t('validate.optationSuccess'))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     v.showSuccessToast(this.$t('validate.optationSuccess'))
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
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
.auth_role_body {
    margin: 14px 14px 14px 0px;
    height: 87vh;
    background: #fff;
    padding: 14px;
}
</style>
