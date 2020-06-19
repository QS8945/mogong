<!--head页面下拉引用 账号新增或者修改 -->
<template>
    <el-dialog :title="$t('elForm.edit')+$t('accountManage.password')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="37%" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="120px" label-position="right" :rules="rules">
          <!--  <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item :label="$t('accountManage.loginName')+':'" prop="loginName">
                        <el-input type="text" v-model="tableForm.loginName"
                                  :placeholder="$t('elForm.input')+$t('accountManage.loginName')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>-->
            <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item :label="$t('accountManage.password')+':'" prop="password">
                        <el-input type="password" v-model="tableForm.password"
                                  :placeholder="$t('elForm.input')+$t('accountManage.password')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item :label="$t('accountManage.newPassword')+':'" prop="newPassword">
                        <el-input type="password" v-model="tableForm.newPassword"
                                  :placeholder="$t('elForm.input')+$t('accountManage.newPassword')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item :label="$t('accountManage.confirmPassword')+':'" prop="confirmPassword">
                        <el-input type="password" v-model="tableForm.confirmPassword"
                                  :placeholder="$t('elForm.input')+$t('accountManage.confirmPassword')"></el-input>
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
import { sysRolesChangePassword } from '@/assets/js/API/api'
export default {
  name: 'changePasswordDgForHead',
  data () {
    const validatePasswordSame = (rule, value, callback) => {
      if (this.tableForm.newPassword != this.tableForm.confirmPassword) {
        callback(
          new Error(
            this.$t('accountManage.password') +
        this.$t('validate.same')
          )
        )
      } else {
        callback()
      }
    }
    return {
      dialogVisible: true,
      dataId: '',
      tableForm: {
        id: '',
        newPassword: '',
        confirmPassword: ''
      },
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
        password: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.password'),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.newPassword'),
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('accountManage.confirmPassword'),
            trigger: 'blur'
          },
          {
            validator: validatePasswordSame,
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted: function () {},
  methods: {
    // 提供给父组件调用
    show: function () {
      this.tableForm = {}
      this.dialogVisible = true
    },
    saveData: function (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          // var requestStr = 'sysRoleLoginUser/changePassword'
          var param = {}
          param = self.tableForm
          sysRolesChangePassword(param).then(res => {
            COMMONJS.showToast(self.$t('validate.saveSuccess'))
            self.handleClose()
            COMMONJS.getLoginOut()
          }).catch(() => {
          })
          // v.post(requestStr, param)
          //   .then(res => {
          //     v.showSuccessToast(self.$t('validate.saveSuccess'))
          //     //  self.$emit('reLoad');
          //     v.loginOut()
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
