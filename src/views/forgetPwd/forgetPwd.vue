<template>
    <div class="forget-content">
      <div class="forget-form">
        <el-steps :active="active" process-status="finish" :align-center="true">
          <el-step title="验证方式"></el-step>
          <el-step title="找回密码"></el-step>
          <el-step title="设置密码"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <v-verificationMode v-if="active === 0" @reload="jumpStep"></v-verificationMode>
        <v-verificationCode v-if="active === 1" @reload="jumpStep"></v-verificationCode>
        <v-setNewPwd v-if="active === 2" @reload="jumpStep"></v-setNewPwd>
        <v-successPwd v-if="active === 3" @reload="jumpStep"></v-successPwd>
        <!--<el-button style="margin-top: 12px;" @click="next">下一步</el-button>-->
      </div>
    </div>
</template>

<script>
import VerificationMode from './components/verificationMode'
import VerificationCode from './components/verificationCode'
import SetNewPwd from './components/setNewPwd'
import SuccessPwd from './components/successPwd'

export default {
  name: 'forgetPwd',
  data () {
    let validateContactWay = (rule, value, callback) => {
      if (!value) callback()
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
      //  ilnPhone = /^([0-9]|[-])+$/g;
      if (!regPhone.test(value) && !regTel.test(value)) {
        callback(
          new Error(this.$t('enterprise_info.link_phone') + this.$t('validate.format'))
        )
      } else {
        callback()
      }
    }
    return {
      active: 0,
      verificationModeForm: {
        findMode: '邮箱找回',
        email: '',
        phone: ''
      },
      verificationModeFormRules: {
        findMode: [{ required: true, message: '请选择找回方式', trigger: 'change' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: validateContactWay, trigger: 'change' }
        ]
      }
    }
  },
  components: {
    'v-verificationMode': VerificationMode,
    'v-verificationCode': VerificationCode,
    'v-setNewPwd': SetNewPwd,
    'v-successPwd': SuccessPwd
  },
  methods: {
    jumpStep (val) {
      this.active = val
    }
    // next () {
    //   console.log(this.verificationModeForm)
    //   this.$refs['verificationModeForm'].validate((valid) => {
    //     if (valid) {
    //       console.log('submit!')
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    //   // this.$ref['']
    //   if (this.active++ > 3) this.active = 0
    // }
  }
}
</script>

<style lang="scss">
  @import '../../element-variables.scss';
.forget-content{
  height: 100%;
  display: flex;
  padding-top: 50px;
  /*align-items: center;*/
  justify-content: center;
  .forget-form{
    padding: 50px 0;
    border-top: 1px solid $--color-primary;
    width: 981px;
    .el-form{
      padding-top: 55px;
    }
    .el-form-item__label{
      line-height: 50px;
    }
    .el-form-item__content{
      text-align: left;
      line-height: 50px;
      .el-input{
        width: 330px;
        .el-input__inner{
          height: 50px;
        }
      }
      .el-button{
        width: 330px;
        height: 50px;
      }
    }
  }
}
</style>
