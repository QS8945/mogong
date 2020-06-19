<template>
  <!--<el-dialog title="修改密码" :visible.sync="dialogVisible">-->
  <div class="form-format">
    <el-form class="change-pwd-form" ref="tableForm" :model="tableForm" label-width="120px" label-position="right" :rules="rules">
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
        <!--<el-button @click="handleClose">{{$t('button.cancel')}}</el-button>-->
      </el-form-item>

    </el-form>
  </div>
    <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
    <!--</div>-->
  <!--</el-dialog>-->
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import FWRSAHelper from '@/assets/js/RSA.js' // RSA加密
import { changePassword } from '@/assets/js/API/api'
export default {
  name: 'changePassword',
  data () {
    var validatePasswordSame = (rule, value, callback) => {
      if (this.tableForm.newPassword !== this.tableForm.confirmPassword) {
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
      tableForm: {
        id: '',
        password: '',
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
          },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
        ],
        newPassword: [
          {
            required: true,
            message:
            this.$t('elForm.input') +
            this.$t('accountManage.newPassword'),
            trigger: 'blur'
          },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
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
  methods: {
    saveData (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          let postData = {
            id: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName'),
            oldPassword: FWRSAHelper.encrypt(self.tableForm.password),
            newPassword: FWRSAHelper.encrypt(self.tableForm.newPassword)
          }
          changePassword(postData)
            .then(res => {
              COMMONJS.showToast('请您重新登录')
              COMMONJS.getLoginOut()
            }).catch(() => { })
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
    handleClose () {
      // this.$emit('changeDialogFormVisible', false)
      // this.$refs.tableForm.resetFields()
    }
  }
}
</script>

<style scoped>
  .dialog-footer{
    padding: 10px 20px 20px 20px;
  }
  .form-format{
    padding-right: 30px;
    text-align: left;
  }
  .form-format .el-radio-group{
    padding-left: 10px;
  }
  .change-pwd-form{
    width: 600px;
    padding: 20px;
  }
</style>
