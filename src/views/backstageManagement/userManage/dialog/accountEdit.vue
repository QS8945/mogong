<!-- 账号新增或者修改 -->
<template>
    <el-dialog :title="operation === 'add'? $t('elForm.add') + $t('accountManage.loginName'): $t('elForm.edit') + $t('accountManage.loginName')" :close-on-click-modal="false"
               :visible.sync="dialogVisible"  width="700px" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="100px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('accountManage.loginName')+':'" prop="loginName">
                        <el-input :disabled="operation != 'add'"  v-model="tableForm.loginName" :placeholder="$t('elForm.input')+$t('accountManage.loginName')"></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="12">
                    <el-form-item :label="$t('accountManage.userName')+':'" prop="userName">
                        <el-input  autocomplete="off" v-model="tableForm.userName" :placeholder="$t('elForm.input')+$t('accountManage.userName')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item v-if="operation === 'add'" :label="$t('accountManage.password')+':'" prop="password">
                        <el-input  autocomplete="new-password" type="password" v-model="tableForm.password" :placeholder="$t('elForm.input')+$t('accountManage.password')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('accountManage.mobilephoneNum')+':'" prop="mobilephoneNum">
                        <el-input v-model="tableForm.mobilephoneNum" :placeholder="$t('elForm.input')+$t('accountManage.mobilephoneNum')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('accountManage.org')+':'" prop="upOrgIds">
                            <el-cascader :options="orgsTreeList" clearable change-on-select :show-all-levels="false"
                            @change="changeRoleList" v-model="tableForm.upOrgIds" :props="props" ></el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('accountManage.role')+':'" prop="roleIdList">
                        <el-select v-model="tableForm.roleIdList"
                                   multiple :placeholder="$t('elForm.select') + $t('accountManage.role')">
                            <el-option
                                    v-for="item in roleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('accountManage.setAdmin')+':'" prop="type">
                        <el-switch v-model="tableForm.type"  :active-value="1" :inactive-value="2" >
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="saveData('tableForm')">{{$t('button.save')}}</el-button>
                <el-button @click="handleClose">{{$t('button.cancel')}}</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import { sysOrgsTree, getSysRoleLoginUser, sysRoleOrgList, saveSysRoleLoginUser, sysRolesListOrg } from '@/assets/js/API/api'
export default {
  name: 'accountDg',
  data () {
    var validatePassword = (rule, value, callback) => {
      var reg1 = /[!@#$%^&*()_?<>{}.]{1}/
      var reg2 = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){6,18}/
      var reg3 = /[a-zA-Z]+/
      var reg4 = /[0-9]+/
      if (reg1.test(value) && reg2.test(value) && reg3.test(value) && reg4.test(value)) {
        callback()
      } else if (!reg3.test(value)) {
        callback(new Error(this.$t('accountManage.password') + this.$t('validate.haveletter')))
      } else if (!reg4.test(value)) {
        callback(new Error(this.$t('accountManage.password') + this.$t('validate.havenumber')))
      } else if (!reg1.test(value)) {
        callback(new Error(this.$t('accountManage.password') + this.$t('validate.specialData')))
      } else if (!reg2.test(value)) {
        callback(new Error(this.$t('accountManage.password') + this.$t('validate.datalength')))
      }
    }
    return {
      dialogVisible: false,
      tableForm: {
        id: '',
        loginName: '',
        userName: '',
        password: '',
        mobilephoneNum: '',
        orgId: null,
        roleIdList: null,
        type: 2,
        upOrgIds: []
      },
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      orgList: [],
      orgsTreeList: [],
      roleList: [],
      operation: '',
      rules: {
        loginName: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.loginName'),
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.userName'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.password'),
            trigger: 'blur'
          },
          { validator: validatePassword, required: true, trigger: 'blur' }
        ]
        // upOrgIds:[
        //       {
        //         required: true, message:  this.$t("elForm.select") + this.$t("accountManage.org"),
        //         trigger: "blur"
        //     }
        // ]
      }
    }
  },
  mounted: function () { },
  methods: {
    // 提供给父组件调用
    show: function (id, operation) {
      this.dialogVisible = true
      this.operation = operation
      this.tableForm = {
        id: '',
        loginName: '',
        userName: '',
        password: '',
        mobilephoneNum: '',
        orgId: '',
        roleIdList: null,
        type: 2,
        upOrgIds: localStorage.getItem('userInfo') ? [JSON.parse(localStorage.getItem('userInfo')).orgId] : []
      }
      this.$nextTick(() => {
        // this.listOrg();
        this.listOrgsTree()
        let orgId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).orgId : ''
        this.listRole(orgId)
        if (id) {
          this.getAccount(id)
        }
      })
      console.log(this.tableForm)
    },
    listOrgsTree: function () {
      // let requestStr = 'sysOrgs/tree'
      sysOrgsTree().then(res => {
        this.orgsTreeList = this.handleList(res.data)
      }).catch(() => {
      })
      // v.post(requestStr, {})
      //   .then(res => {
      //     this.orgsTreeList = this.handleList(res.data)
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    handleList: function (array) {
      for (let arr of array) {
        if (arr.children && arr.children.length == 0) { arr.children = null }
        if (arr.children && arr.children.length > 0) { this.handleList(arr.children) }
      }
      return array
    },
    getAccount: function (id) {
      // var requestStr = 'sysRoleLoginUser/getSysRoleLoginUser'
      var params = { id: id }
      getSysRoleLoginUser(params).then(res => {
        this.tableForm = res.data
        this.listRole(res.data.orgId)
      }).catch(() => {
      })
      // v.get(requestStr, params)
      //   .then(res => {
      //     this.tableForm = res.data
      //     this.listRole(res.data.orgId)
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    changeRoleList: function (val) {
      this.tableForm.roleIdList = []
      if (val && val.length > 0) { this.listRole(val[val.length - 1]) } else { this.listRole('') }
    },
    listRole: function (orgId) {
      // var requestStr = "sysRoleCustomActor/listSysRoleCustomActor";
      // var requestStr = 'sysRoles/list/org'
      var params = { orgId: orgId }

      sysRolesListOrg(params).then(res => {
        this.roleList = res.data
      }).catch(() => {
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     this.roleList = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    listOrg: function () {
      // var requestStr = 'sysRoleOrg/listSysRoleOrg'
      var params = {}
      sysRoleOrgList(params).then(res => {
        this.orgList = res.data
      }).catch(() => {
      })
      // v.get(requestStr, params)
      //   .then(res => {
      //     this.orgList = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    saveData: function (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          // var requestStr = 'sysRoleLoginUser/saveSysRoleLoginUser'
          if (self.tableForm.upOrgIds.length > 0) { self.tableForm.orgId = self.tableForm.upOrgIds[self.tableForm.upOrgIds.length - 1] } else { self.tableForm.orgId = '' }
          let params = self.tableForm
          saveSysRoleLoginUser(params).then(res => {
            COMMONJS.showToast(self.$t('validate.saveSuccess'))
            // v.showSuccessToast(self.$t('validate.saveSuccess'))
            self.$emit('reLoad')
            self.handleClose()
          }).catch(() => {
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     v.showSuccessToast(self.$t('validate.saveSuccess'))
          //     self.$emit('reLoad')
          //     self.handleClose()
          //   })
          //   .catch(error => {
          //     self.$message.error(error)
          //   })
        }
      })
    },
    handleClose: function () {
      this.dialogVisible = false
      this.$refs.tableForm.resetFields()
    }
  }
}
</script>

<style>
</style>
