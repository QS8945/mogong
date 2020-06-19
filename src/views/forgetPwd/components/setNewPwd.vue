<template>
    <div>
      <el-form :model="verificationModeForm" :rules="verificationModeFormRules" ref="verificationModeForm" label-width="320px">
        <el-form-item label="新密码：" prop="newPassword">
          <el-input type="password" v-model="verificationModeForm.newPassword" placeholder="请输入您的新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmNewPassword">
          <el-input type="password" v-model="verificationModeForm.confirmNewPassword" placeholder="请再次输入您的新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="next">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'setNewPwd',
  data () {
    let _this = this
    let checkPwd = (rule, value, callback) => {
      if (!value) callback()
      let regPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,64}$/
      //  ilnPhone = /^([0-9]|[-])+$/g;
      if (!regPwd.test(value)) {
        callback(
          new Error('由字母、数字、符号组成，长度不能少于8位')
        )
      } else {
        callback()
      }
    }
    let confirmPwd = (rule, value, callback) => {
      if (!value) callback()
      if (_this.verificationModeForm.newPassword !== value) {
        callback(
          new Error('请确认密码是否相同')
        )
      } else {
        callback()
      }
    }
    return {
      verificationModeForm: {
        newPassword: '',
        confirmNewPassword: ''
      },
      verificationModeFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }],
        confirmNewPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: confirmPwd, trigger: 'change' }]
      }
    }
  },
  props: ['active'],
  methods: {
    next () {
      this.$refs['verificationModeForm'].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.$refs['verificationModeForm'].resetFields()
          this.$emit('reload', 3)
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$ref['']
      // if (this.active++ > 3) this.active = 0
    }
  }
}
</script>

<style scoped>

</style>
