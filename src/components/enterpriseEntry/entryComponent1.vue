<template>
  <div>
    <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="ruleForm.type"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="nextStep">entryComponent1</el-button>
  </div>
</template>

<script>
export default {
  name: 'entryComponent1',
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      labelPosition: 'text',
      ruleForm: {
        name: '',
        mobile: '',
        type: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请填写姓名',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请填写手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile
        }]
      }
    }
  },
  methods: {
    nextStep () {
      this.$emit('pNextStep', 1)
    }
  }
}
</script>

<style scoped>

</style>
