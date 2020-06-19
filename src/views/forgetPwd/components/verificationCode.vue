<template>
    <div>
      <el-form :model="verificationModeForm" :rules="verificationModeFormRules" ref="verificationModeForm" label-width="320px">
        <el-form-item label="验证码：" prop="verificationCode">
          <el-input v-model="verificationModeForm.verificationCode" placeholder="请输入您的验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'verificationCode',
  data () {
    return {
      verificationModeForm: {
        verificationCode: ''
      },
      verificationModeFormRules: {
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { min: 4, max: 4, message: '长度在 4 个字符', trigger: 'change' }]
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
          this.$emit('reload', 2)
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
