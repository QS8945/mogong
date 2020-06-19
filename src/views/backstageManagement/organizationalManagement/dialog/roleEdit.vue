<!-- 角色新增或者更新 -->
<template>
    <el-dialog :title="$t('elForm.add')+$t('roleManage.name')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="100px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('roleManage.name')+':'" prop="name">
                        <el-input v-model="tableForm.name" :placeholder="$t('elForm.input')+$t('roleManage.name')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('roleManage.code')+':'" prop="code">
                        <el-input v-model="tableForm.code" :placeholder="$t('elForm.input')+$t('roleManage.code')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('roleManage.orgName')+':'" prop="upOrgIds">
                        <el-cascader :options="orgsTreeList" clearable change-on-select :show-all-levels="false"
                         v-model="tableForm.upOrgIds" placeholder="" :props="props" ></el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item :label="$t('roleManage.remark')+':'" prop="remark">
                        <el-input v-model="tableForm.remark" type="textarea"
                                  :placeholder="$t('elForm.input')+$t('roleManage.remark')"></el-input>
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
import { sysOrgsTree, sysPriListMenu, sysRoleOrgList, sysRolesAdd, sysRolFind } from '@/assets/js/API/api'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'role',
  data () {
    return {
      dialogVisible: false,
      dataId: '',
      menuList: [],
      orgList: [],
      orgsTreeList: [],
      tableForm: {
        code: '',
        orgId: null,
        menuId: null,
        id: '',
        name: '',
        upOrgIds: []
      },
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      rules: {
        code: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('roleManage.code'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('elForm.input') + this.$t('roleManage.name'),
            trigger: 'blur'
          }
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
    show: function (id) {
      this.dialogVisible = true
      console.log(localStorage.getItem('userInfo'))
      debugger
      this.tableForm = {
        code: '',
        orgId: null,
        id: '',
        name: '',
        upOrgIds: localStorage.getItem('userInfo') ? [JSON.parse(localStorage.getItem('userInfo')).orgId] : []
      }
      this.$nextTick(() => {
        this.listOrgsTree()
        if (id) {
          this.getById(id)
        }
      })
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
        if (arr.children && arr.children.length === 0) { arr.children = null }
        if (arr.children && arr.children.length > 0) { this.handleList(arr.children) }
      }
      return array
    },
    getById: function (id) {
      // var requestStr = 'sysRoles/find'
      var params = { id: id }
      sysRolFind(params).then(res => {
        this.tableForm = res.data
      }).catch(() => {
      })
      // v.post(requestStr, params)
      //   .then(res => {
      //     this.tableForm = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    listMenu: function () {
      // var requestStr = 'sysPrivilegeMenu/listMenu'
      // var params = {}
      sysPriListMenu().then(res => {
        this.menuList = res.data
      }).catch(() => {
      })
      // v.get(requestStr, params)
      //   .then(res => {
      //     this.menuList = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    listOrg: function () {
      // var requestStr = 'sysRoleOrg/listSysRoleOrg'
      // var params = {}
      sysRoleOrgList().then(res => {
        if (res.data) {
          this.orgList = res.data
        } else {
          this.$message.warning(this.$t('otherTips.noOrg'))
        }
      }).catch(() => {
      })
      // v.get(requestStr, params)
      //   .then(res => {
      //     if (res.data) {
      //       this.orgList = res.data
      //     } else {
      //       this.$message.warning(this.$t('otherTips.noOrg'))
      //     }
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    saveData: function (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          if (self.tableForm.upOrgIds.length > 0) { self.tableForm.orgId = self.tableForm.upOrgIds[self.tableForm.upOrgIds.length - 1] } else { self.tableForm.orgId = '' }
          let params = self.tableForm
          // var requestStr = 'sysRoles/add'
          sysRolesAdd(params).then(res => {
            COMMONJS.showToast(self.$t('validate.saveSuccess'))
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
      this.$refs.tableForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style>
</style>
