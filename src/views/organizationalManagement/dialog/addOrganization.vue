<template>
  <el-dialog left :visible.sync="dialogVisible" width="624px">
    <div slot="title" class="dialog-title">
      <div><span class="green-line"></span>添加机构</div>
    </div>
    <el-form :model="form" :rules="formRules" ref="form" :label-width="formLabelWidth">
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog('form')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addOrganization',
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
    return {
      dialogVisible: false,
      form: {
        tel: '',
        name: '',
        password: ''
      },
      formLabelWidth: '120px',
      formRules: {
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: validateContactWay, trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      }
    }
  },
  methods: {
    // 提供给父组件调用
    show (row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        if (row) {
          this.dataId = row.id
          //  this.initData();
          this.tableForm = row
        }
      })
    },
    submitDialog (formName) {
      let _this = this
      _this.$refs[formName].validate(function (valid) {
        if (valid) {
          // 提交成功后
          _this.$emit('reLoad')
          _this.handleClose(formName)
        }
      })
    },
    handleClose (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
