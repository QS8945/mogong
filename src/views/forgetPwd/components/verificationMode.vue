<template>
    <div>
      <el-form :model="verificationModeForm" :rules="verificationModeFormRules" ref="verificationModeForm" label-width="320px">
        <el-form-item label="找回方式" prop="findMode">
          <el-radio-group v-model="verificationModeForm.findMode">
            <el-radio label="邮箱找回"></el-radio>
            <el-radio label="手机号码找回"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="verificationModeForm.findMode==='邮箱找回'" label="邮箱：" prop="email">
          <el-input size="large" v-model="verificationModeForm.email" placeholder="请输入您的邮箱账号"></el-input>
        </el-form-item>
        <el-form-item v-if="verificationModeForm.findMode==='手机号码找回'" label="手机号码：" prop="phone">
          <el-input v-model="verificationModeForm.phone" placeholder="请输入您的手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'verificationMode',
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
  props: ['active'],
  methods: {
    next () {
      this.$refs['verificationModeForm'].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.$refs['verificationModeForm'].resetFields()
          this.$emit('reload', 1)
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
