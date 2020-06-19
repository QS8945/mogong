<!--账号管理列表-->
<template>
    <div style="display: flex;">
        <div :style="isShowAssign?'width:80%':'width:100%'">
            <div class="eil_search_main">
                <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                    <el-form-item :label="$t('accountManage.loginName')">
                    <el-input  v-model="queryForm.loginName" :placeholder="$t('elForm.input') +$t('accountManage.loginName')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('accountManage.userName')">
                        <el-input v-model="queryForm.userName" :placeholder="$t('elForm.input') + $t('accountManage.userName')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('accountManage.mobilephoneNum')">
                        <el-input v-model="queryForm.mobilephoneNum" :placeholder="$t('elForm.input') + $t('accountManage.mobilephoneNum')"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-btn">
                    <el-button type="primary" size="small" @click="queryList">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="eil_list_main">
                <div class="eil_list_main_opt" style="margin-bottom:10px">
                    <el-button :loading="loading" icon="el-icon-plus" type="primary" @click="addAccount" >{{$t('button.add')}}</el-button>
                    <!-- <el-button plain @click="delSection">删除</el-button> -->
                </div>
                <el-table  v-loading="loading" border  ref="tableData" :data="tableData" :height="tableHeight" @selection-change="handleSelectionChange" size="medium" @row-click='productRowToggleSelection' >
                    <!-- <el-table-column type="selection" width="55" :selectable="checkboxInit" :height="tableHeight"></el-table-column> -->
                    <el-table-column :label="$t('accountManage.loginName')" show-overflow-tooltip prop="loginName"></el-table-column>
                    <el-table-column :label="$t('accountManage.userName')" show-overflow-tooltip prop="userName"></el-table-column>
                    <el-table-column :label="$t('accountManage.mobilephoneNum')" show-overflow-tooltip prop="mobilephoneNum"></el-table-column>
                    <el-table-column :label="$t('accountManage.role')" show-overflow-tooltip prop="roleNameList" :formatter="roleNameFormat"></el-table-column>
                    <el-table-column :label="$t('accountManage.org')" show-overflow-tooltip prop="orgName"></el-table-column>
                    <el-table-column prop="type"  align="center" :label="$t('accountManage.type')">
                        <template slot-scope="scope">
                            <span> {{scope.row.type==1?'管理员':'普通用户'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enabled"  align="center" :label="$t('accountManage.status')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.enabled?'启用':'停用'" placement="right">
                                <el-switch v-model="scope.row.enabled" :disabled="scope.row.loginName==loginName" :active-value="1" :inactive-value="0" @change="handleEnable(scope.row)">
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('button.operation')" show-overflow-tooltip  width="400">
                        <template slot-scope="scope">
                            <div class="starnd_color" v-if="scope.row.loginName!=loginName" >
                                <span class="Margin_font" @click="resetPassword(scope.row,scope.$index)">{{$t('button.resetPassword')}}</span>
                                <span class="Margin_font" @click="handleEdit(scope.row,scope.$index)">{{$t('button.edit')}}</span>
                                <span class="Margin_font" @click="selectPree(scope.row)">分配权限</span>
                                <span class="Margin_font" v-if="scope.row.type==2" @click="setAdmin(scope.row,1)">设置为管理员</span>
                                <span class="Margin_font" v-if="scope.row.type==1" @click="setAdmin(scope.row,2)">取消管理员</span>
                                <span class="Margin_font" @click="handleDel(scope.row,scope.$index)">{{$t('button.del')}}</span>
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
                <accountDialog ref="accountDg" @reLoad="initData"></accountDialog>
                <passwordDialog ref="resetPasswordDg" @reLoad="initData"></passwordDialog>
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
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { pageSysRoleLoginUser, sysTree, sysMenuUser, sysAccountAdd, sysRoleLoginUserType, resetPassword, removeSysRoleLoginUser, changeUserStatus } from '@/assets/js/API/api'
import accountDialog from './dialog/accountEdit.vue'
// import menuSelect from "./formDialog/menuSelect.vue";
import passwordDialog from './dialog/resetPassword.vue'
export default {
  components: {
    accountDialog,
    passwordDialog
    // menuSelect
  },
  data () {
    return {
      loading: false,
      queryForm: {
        userName: '',
        current: '',
        size: ''
      },
      searchForm: {},
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      loginName: localStorage.getItem('loginName'),
      isShowAssign: false,
      locationUserId: '',
      locationKeys: [],
      multipleSelection: [],
      tableData: [],
      menuTreeList: [],
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
  mounted: function () {
    this.initData()
    this.listMenuTree()
  },
  methods: {
    initData: function () {
      // var requestStr = 'sysRoleLoginUser/pageSysRoleLoginUser'
      this.queryForm.current = this.pageIndex
      this.queryForm.size = this.pageSize
      this.loading = true
      pageSysRoleLoginUser(this.queryForm).then(res => {
        if (res.data) {
          for (var i in res.data.records) {
            res.data.records[i].childList = []
          }
          this.tableData = res.data.records
        }
        this.totalRecord = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // v.get(requestStr, this.queryForm)
      //   .then(res => {
      //     if (res.data) {
      //       for (var i in res.data.records) {
      //         res.data.records[i].childList = []
      //       }
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
    checkboxInit (row, index) {
      if (row.loginName === this.loginName) { return 0 } else { return 1 }
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
      //     this.menuTreeList = res.data
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    queryList: function () {
      this.pageIndex = 1
      this.initData()
    },
    addAccount: function () {
      this.$refs.accountDg.show('', 'add')
    },
    selectPree: function (row) {
      this.locationUserId = row.id
      this.locationKeys = []
      this.isShowAssign = false
      let self = this
      setTimeout(function () {
        self.isShowAssign = true
        self.getlocationUser()
      }, 200)
      // 调用服务
    },
    getlocationUser: function () {
      let params = {
        userId: this.locationUserId
      }
      // let requestStr = 'sysMenu/list/user'
      sysMenuUser(params).then(res => {
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
        accountId: this.locationUserId
      }
      // var requestStr = 'sysAccount/menu/add'
      this.loading = true
      sysAccountAdd(params).then(res => {
        COMMONJS.showToast(this.$t('validate.optationSuccess'))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     v.showSuccessToast(this.$t('validate.optationSuccess'))
      //     this.loading = false
      //     // this.initData();
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    setAdmin: function (row, type) {
      this.$confirm(
        type === 1 ? this.$t('accountManage.setAdmintips') : this.$t('accountManage.cancelAdmintips'),
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
          let params = {
            id: row.id,
            type: type
          }
          // let requestStr = 'sysRoleLoginUser/type'
          sysRoleLoginUserType(params).then(res => {
            this.$message.success(this.$t('validate.optationSuccess'))
            this.initData()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(this.$t('validate.optationSuccess'))
          //     this.initData()
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //   })
        })
        .catch(() => {

        })
    },
    sendInvitationCode: function (row, index) { },
    bindingMenu: function (row) {
      this.$refs.menuSelect.show(row, 'user_mp_menu')
    },
    resetPassword: function (row) {
      this.$confirm(
        this.$t('accountManage.resetTips'),
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
          // var requestStr = 'sysRoleLoginUser/resetPassword'
          this.loading = true
          var params = {
            id: row.id
          }
          resetPassword(params).then(res => {
            this.$message.success(
              this.$t('validate.resetSuccess') + ',重置密码为"' + res.data + '"'
            )
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.$message.success(
          //       this.$t('validate.resetSuccess') + ',重置密码为"' + res.data + '"'
          //     )
          //     this.loading = false
          //   })
          //   .catch(error => {
          //     this.$message.error(error)
          //     this.loading = false
          //   })
        })
        .catch(() => { })
    },
    handleEdit: function (row) {
      this.$refs.accountDg.show(row.id, 'edit')
    },
    handleDel: function (row) {
      this.$confirm(
        this.$t('accountManage.delTips'),
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
          // var requestStr = 'sysRoleLoginUser/removeSysRoleLoginUser'
          removeSysRoleLoginUser(params).then(res => {
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
    delSection () {
      if (this.multipleSelection.length) {
        this.$confirm(
          this.$t('accountManage.delTips'),
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
            // let requestStr = 'sysRoleLoginUser/removeSysRoleLoginUser'
            let params = { ids: ids }
            _this.loading = true
            removeSysRoleLoginUser(params).then(res => {
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
    handleEnable: function (row) {
      this.$confirm(
        row.enabled === 0
          ? this.$t('accountManage.disabledTips')
          : this.$t('accountManage.enabledTips'),
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
          // var requestStr = 'sysRoleLoginUser/changeUserStatus'
          var params = { id: row.id, enabled: row.enabled }
          changeUserStatus(params).then(res => {
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     // v.showSuccessToast(
          //     //     this.$t("validate.optationSuccess")
          //     // );
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
    roleNameFormat: function (row, column) {
      var roleNameList = row[column.property]
      if (roleNameList === undefined) {
        return ''
      }
      return roleNameList.join('、')
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
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    productRowToggleSelection: function (row) {
      if (row.loginName !== this.loginName) { this.$refs.tableData.toggleRowSelection(row) }
    }
  }
}
</script>
<style>
.Margin_font {
    margin-right: 5px;
}
.auth_tree {
    max-height: 72vh;
}
</style>
