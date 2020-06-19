<template>
  <div class="baseInfo baseForm">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="baseInfoForm" :rules="baseInfoFormRules" ref="baseInfoForm" :label-width="formLabelWidth">
          <el-form-item label="账号" prop="account">
            <el-input v-model="baseInfoForm.account"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="baseInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：">
            <el-select v-model="baseInfoForm.organization" placeholder="请选择机构">
              <el-option
                v-for="item in organizations"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门：">
            <el-select v-model="baseInfoForm.department" placeholder="请选择部门">
              <el-option
                v-for="item in departments"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属职位：">
            <el-select v-model="baseInfoForm.job" placeholder="请选择职位">
              <el-option
                v-for="item in jobs"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="tel">
            <el-input v-model="baseInfoForm.tel" :disabled="true"></el-input>
            <el-button type="text" @click="bindPhone">重新绑定</el-button>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="baseInfoForm.email" :disabled="true"></el-input>
            <el-button type="text" @click="bindEmail">绑定</el-button>
          </el-form-item>
          <el-form-item class="form-item-btn">
            <el-button type="primary" @click="saveUserData('baseInfoForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="second">
        <el-form :model="changePwdForm" :rules="changePwdFormRules" ref="changePwdForm" :label-width="formLabelWidth">
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="changePwdForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input type="password" v-model="changePwdForm.confirmNewPassword"></el-input>
          </el-form-item>
          <el-form-item class="form-item-btn">
            <el-button type="primary" @click="savePwdData('changePwdForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--//邮箱绑定-->
    <el-dialog left :visible.sync="emailFormVisible" width="624px">
      <div slot="title" class="dialog-title">
        <div><span class="green-line"></span>邮箱绑定</div>
      </div>
      <el-form class="emailForm" :model="emailForm" :rules="emailFormRules" ref="emailForm" :label-width="formLabelWidth">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode" class="clearfix">
          <el-input v-model="emailForm.verificationCode" class="verificationCode"  placeholder="请输入验证码"></el-input>
          <el-button class="email-btn" plain @click="sendCode" :disabled="sendCodeFlag">
            <span v-show="numFlag">发送验证码</span>
            <span v-show="!numFlag">{{'重新发送(' + count + ')'}}</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindEmailDialog('emailForm')">确 定</el-button>
        <!--<el-button class="email-btn" plain>发送验证码</el-button>-->
      </div>
    </el-dialog>
    <!--//手机号绑定-->
    <el-dialog left :visible.sync="phoneFormVisible" width="624px">
      <div slot="title" class="dialog-title">
        <div><span class="green-line"></span>手机号绑定</div>
      </div>
      <el-form v-if="!phoneSuccess" class="emailForm" :model="phoneForm" :rules="phoneFormRules" ref="phoneForm" :label-width="formLabelWidth">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode" class="clearfix">
          <el-input v-model="phoneForm.verificationCode" class="verificationCode"  placeholder="请输入验证码"></el-input>
          <el-button class="email-btn" plain @click="sendCode" :disabled="sendCodeFlag">
            <span v-show="numFlag">发送验证码</span>
            <span v-show="!numFlag">{{'重新发送(' + count + ')'}}</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div v-if="!phoneSuccess" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPhoneDialog('phoneForm')">确 定</el-button>
        <!--<el-button class="email-btn" plain>发送验证码</el-button>-->
      </div>
      <div v-if="phoneSuccess">操作成功！</div>
      <div v-if="phoneSuccess" slot="footer" class="dialog-footer phoneSuccess">
        <el-button type="primary" @click="confirmPhoneDialog">确 定</el-button>
        <!--<el-button class="email-btn" plain>发送验证码</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
// import { getUserData } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    let _this = this
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
      let regPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,64}$/
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
      if (_this.changePwdForm.newPassword !== value) {
        callback(
          new Error('请确认密码是否相同')
        )
      } else {
        callback()
      }
    }
    let checkEmail = (rule, value, callback) => {
      if (!value) callback()
      if (value) {
        let reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
          this.sendCodeFlag = true
        } else {
          this.sendCodeFlag = false
          callback()
        }
      }
    }
    let checkPhone = (rule, value, callback) => {
      if (!value) callback()
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
      //  ilnPhone = /^([0-9]|[-])+$/g;
      if (!regPhone.test(value) && !regTel.test(value)) {
        this.sendCodeFlag = true
        callback(
          new Error(this.$t('enterprise_info.link_phone') + this.$t('validate.format'))
        )
      } else {
        this.sendCodeFlag = false
        callback()
      }
    }
    return {
      baseInfoForm: {
        account: '',
        name: '',
        organization: '',
        department: '',
        job: '',
        tel: '',
        email: ''
      },
      formLabelWidth: '120px',
      baseInfoFormRules: {
        tel: [
          { validator: validateContactWay, trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      },
      activeName2: 'first',
      organizations: [{
        label: '阿里巴巴/淘宝',
        value: '1'
      }, {
        label: '京东商城',
        value: '2'
      }],
      departments: [{
        label: '企业事业部',
        value: '1'
      }, {
        label: '研发部',
        value: '2'
      }],
      jobs: [{
        label: '职位1',
        value: '1'
      }, {
        label: '职位2',
        value: '2'
      }],
      changePwdForm: {
        newPassword: '',
        confirmNewPassword: ''
      },
      changePwdFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }],
        confirmNewPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: confirmPwd, trigger: 'change' }]
      },
      emailFormVisible: false,
      emailForm: {
        email: ''
      },
      emailFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { validator: checkEmail, trigger: 'change' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { min: 4, max: 4, message: '长度在 4 个字符', trigger: 'change' }]
      },
      phoneFormVisible: false,
      phoneForm: {
        phone: ''
      },
      phoneFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: checkPhone, trigger: 'change' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { min: 4, max: 4, message: '长度在 4 个字符', trigger: 'change' }]
      },
      sendCodeFlag: true,
      timer: null,
      count: '',
      numFlag: true,
      phoneSuccess: false
    }
  },
  created () {
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    getData () {
      this.baseInfoForm = {
        account: 'zhanghj',
        name: '张慧君',
        organization: '',
        department: '',
        job: '',
        tel: '18013179094',
        email: '1119225757@qq.com'
      }
    },
    saveUserData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    savePwdData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    bindEmail () {
      this.emailFormVisible = true
    },
    bindEmailDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.emailFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    bindPhone () {
      this.phoneFormVisible = true
    },
    bindPhoneDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          // this.phoneFormVisible = false
          this.phoneSuccess = true
          clearInterval(this.timer) // 清除定时器
          this.timer = null
          this.numFlag = true
          this.sendCodeFlag = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmPhoneDialog () {
      let _this = this
      this.phoneFormVisible = false
      this.phoneForm.verificationCode = ''
      this.phoneForm.phone = ''
      setTimeout(function () {
        _this.phoneSuccess = false
      }, 500)
    },
    sendCode () {
      if (!this.timer) {
        this.count = GLB_CONSTANT.TIME_COUNT
        this.sendCodeFlag = true
        this.numFlag = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= GLB_CONSTANT.TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
            this.numFlag = true
            this.sendCodeFlag = false
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
  .baseInfo {
    background: #fff;
    height: 100%;

    .form-item-btn {
      text-align: left;
    }

    .el-tabs__content {
      padding-top: 30px;

      .el-form-item__content {
        text-align: left;
        .el-select, .el-input {
          width: 376px;
        }
      }
    }
    .emailForm{
      .el-form-item__content {
        text-align: left;
        .el-select, .el-input {
          width: 376px;
        }
        .verificationCode{
          width: 260px;
        }
        .email-btn{
          width: 111px;
          margin-left: 5px;
        }
      }
    }
    .dialog-footer{
      width: 376px;
      display: flex;
      justify-content: space-between;
      .email-btn{
        width: 111px;
      }
    }
    .dialog-footer.phoneSuccess{
      justify-content: center;
      width: auto;
      margin: auto;
    }
  }
</style>
