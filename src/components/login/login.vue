<template>
  <div class="login_bg_style">
    <div class="login_bg_carousel">
      <!-- <div class="block">
        <el-carousel :interval="5000">
          <el-carousel-item v-for="item in picList" :key="item.name">
            <h3><img :src="item.url" :alt="item.name"></h3>
          </el-carousel-item>
        </el-carousel>
      </div>-->
    </div>
    <div class="login-group" id="login-group">
      <!--<div class="login_main_style">-->
      <!--<div class="login-group-title">-->
      <!--<div class="login-title-style"><span>环境污染责任保险</span><i class="el-icon-circle-check-outline"></i></div>-->
      <!--<div class="login-group-br"></div>-->
      <!--<div class="login-content-style">全过程环境风险决策技术支持系统</div>-->
      <!--</div>-->
      <!--</div>-->
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="project-title">
          <div class="title-name">
            <img src="../../assets/img/login/logo-title.png" alt="图片" />
            <span>墨工</span>
          </div>
          <div class="title-intro">工程企业信息化解决方案</div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号密码登录" name="user">
            <el-form-item prop="loginName">
              <el-input
                ref="loginInput"
                v-model="loginForm.loginName"
                @keyup.enter.native="submitForm('loginForm')"
                placeholder="用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                autocomplete="off"
                @keyup.enter.native="submitForm('loginForm')"
                placeholder="密码"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="手机号码登录" name="phone">
            <el-form-item prop="loginName">
              <el-input
                ref="loginInput"
                v-model="loginForm.loginName"
                @keyup.enter.native="submitForm('loginForm')"
                prefix-icon="el-icon-mobile"
                placeholder="请输入手机号"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                autocomplete="off"
                @keyup.enter.native="submitForm('loginForm')"
                prefix-icon="el-icon-chat-dot-round"
                placeholder="请输入验证码"
              >
                <template slot="append">
                  <el-link @click="sendCode" :underline="false" :disabled="sendFlag">
                    <span v-show="!sendFlag">发送验证码</span>
                    <span v-show="sendFlag">重新发送({{count}})</span>
                  </el-link>
                </template>
              </el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="form-title">{{$t('login.title')}}</div> -->

        <!-- <el-form-item prop="verificationCode">
          <el-input
            type="text"
            v-model="loginForm.verificationCode"
            autocomplete="off"
            @keyup.enter.native="submitForm('loginForm')"
            :placeholder="$t('login.verificationCode')"
          >
            <template slot="append">
              <div @click="refreshCode">
                <v-edentity :identifyCode="identifyCode"></v-edentity>
              </div>
            </template>
          </el-input>
        </el-form-item>-->

        <!-- <el-form-item prop="isAgree">
          <el-checkbox-group v-model="loginForm.isAgree">
            <el-checkbox label="我已阅读并同意" name="isAgree"></el-checkbox>
            <el-button type="text" @click="lookIframe">点击打开 Dialog</el-button>
          </el-checkbox-group>
        </el-form-item>-->
        <div class="form-footer">
          <el-checkbox-group v-model="loginForm.autoLogin">
            <el-checkbox label="自动登录" name="isAgree"></el-checkbox>
            <!-- <el-button type="text" @click="lookIframe">点击打开 Dialog</el-button> -->
          </el-checkbox-group>
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="环保云登录暂未开放，敬请期待"
            :open-delay="500"
            placement="top-start"
          >
            <router-link to="/login">{{$t('login.amountLogin')}}</router-link>
          </el-tooltip>-->
          <div class="form-forget">
            <router-link to="/forgetPwd">{{$t('login.forgetPassword')}}</router-link>
          </div>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            v-loading="loginLoading"
            :disabled="loginLoading"
            @click="submitForm ('loginForm')"
          >{{$t('button.login')}}</el-button>
        </el-form-item>
        <div class="form-footer">
          <div>
            其他登录方式
            <el-button class="zhifubao" size="mini" icon="icon iconfont iconzhifubao1" circle></el-button>
            <el-button class="taobao" size="mini" icon="icon iconfont iconiconfonttaobao" circle></el-button>
            <el-button class="weibo" size="mini" icon="icon iconfont iconweibo1" circle></el-button>
          </div>
          <div class="form-forget">
            <router-link to="/forgetPwd">注册账户</router-link>
          </div>
        </div>

        <!--<el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>-->
        <!--&lt;!&ndash;<span>需要注意的是内容是默认不居中的</span>&ndash;&gt;-->
        <!--<iframe :src="framesrc" width="100%"></iframe>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="agreeIframe">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import JsEncrypt from "@/assets/js/jsencrypt.js"; // RSA加密
import FWRSAHelper from "@/assets/js/RSA.js"; // RSA加密
import COMMONJS from "@/assets/js/common.js";
import GLB_CONFIG from "@/assets/js/glb-constant.js";
import Edentity from "./identity";
import {
  getLogin,
  getOldErpLogin,
  getWorkflowLogin
} from "@/assets/js/API/api";

export default {
  name: "login",
  data() {
    let _this = this;
    var checkIsAgree = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请阅读"));
      } else {
        callback();
      }
    };
    var checkCode = (rule, value, callback) => {
      if (value.toUpperCase() !== _this.identifyCode) {
        return callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      activeName: 'user',
      loginLoading: false,
      centerDialogVisible: false,
      framesrc: "",
      loginForm: {
        loginName: "",
        password: "",
        verificationCode: "",
        autoLogin: false
        // age: ''
      },
      loginRules: {
        loginName: [
          {
            required: true,
            message: this.$t("login.userTips"),
            trigger: "change"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "change"
          }
        ],
        verificationCode: [
          {
            required: true,
            message: this.$t("login.verificationCode"),
            trigger: "change"
          },
          { min: 4, max: 4, message: "长度在 4 个字符", trigger: "change" },
          { validator: checkCode, trigger: "change" }
        ],
        password: [
          {
            required: true,
            message: this.$t("login.pwdTips"),
            trigger: "change"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "change"
          }
        ],
        isAgree: [{ validator: checkIsAgree, trigger: "change" }]
      },
      identifyCodes: GLB_CONFIG.identifyCodes,
      identifyCode: "",
      timer: '',
      count: '',
      sendFlag: false
    };
  },
  mounted() {
    this.$refs["loginInput"].focus();
    this.refreshCode();
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      let postData = {
        loginName: this.loginForm.loginName,
        password: FWRSAHelper.encrypt(
          this.loginForm.password
        ) /*,
        password: JsEncrypt.encrypt(this.loginForm.password) */
        // verificationCode: this.loginForm.verificationCode
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          _this.loginLoading = true;
          // getLogin("", postData)
            getLogin()
            .then(res => {
              debugger
              COMMONJS.showToast(_this.$t("validate.loginSuccess"));
              _this.loginLoading = false;
              localStorage.setItem("token", res.data.token);
              COMMONJS.routesList = [];
              // if (res.data.type === 1 && res.data.userName === "超级管理员") {
              //   this.$store.commit("set_source_type", "back");
              //   this.$store.state.openTab = JSON.parse(JSON.stringify([]));
              //   // localStorage.setItem('sourceType', 'back')
              //   // localStorage.setItem('refreshHome', 'true')
              //   // const href = GLB_CONFIG.devUrl.managementUrl + '?token=' + localStorage.getItem('token')
              //   // window.open(href, '_self')
              // } else {
              //   // 初始化菜单路由
              //   // this.$store.commit('delete_tabs', '')
              //   this.$store.state.openTab = JSON.parse(
              //     JSON.stringify([
              //       {
              //         route: "/home",
              //         name: "工作台"
              //       }
              //     ])
              //   );
              //   // this.$store.state.openTab = JSON.parse(JSON.stringify([{
              //   //   route: '/home',
              //   //   name: '工作台'
              //   // }]))
              //   res.data.ents = res.data.ents || [{}];
              //   this.$store.commit("set_source_type", "web");
              //   // localStorage.setItem('sourceType', 'web')
              //   localStorage.setItem("refreshHome", "true");
              //   localStorage.setItem("typeCode", res.data.ents[0].typeCode);
              //   localStorage.setItem("loginName", res.data.loginName);
              //   localStorage.setItem("userName", res.data.userName);
              //   localStorage.setItem("entName", res.data.ents[0].entName);
              //   localStorage.setItem("id", res.data.ents[0].id);
              //   localStorage.setItem("userId", res.data.id);
              //   localStorage.setItem("type", res.data.type);
              // }
              // getOldErpLogin({ token: res.data.token }).then(res => {
              //   if (res.status === "Success") {
              //     localStorage.setItem("refreshToken", true);
              //   }
              // });
              COMMONJS.getHomePage();
            })
            .catch(() => {
              _this.refreshCode();
              _this.loginLoading = false;
            });
        } else {
          _this.refreshCode();
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    lookIframe() {
      this.centerDialogVisible = true;
      this.framesrc =
        GLB_CONFIG.devUrl.serviceSiteRootUrl + "doc/Placeholder.html";
    },
    agreeIframe() {
      this.centerDialogVisible = false;
      this.loginForm.isAgree = true;
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      // debugger
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    sendCode () {
      if (!this.timer) {
        this.count = GLB_CONFIG.TIME_COUNT
        this.sendFlag = true
        // this.numFlag = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= GLB_CONFIG.TIME_COUNT) {
            this.count--
          } else {
            // this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
            // this.numFlag = true
            this.sendFlag = false
          }
        }, 1000)
      }
    }
  },
  components: {
    "v-edentity": Edentity
  }
};
</script>

<style lang="scss" scope>
#login-group .el-tabs{
  background: transparent;
}
#login-group .el-tab-pane{
  overflow: hidden;
}
.login_bg_style {
  position: relative;
  height: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;

  .login_bg_carousel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/img/login/bg-img.png") no-repeat;
    background-size: cover;
    .block,
    .block .el-carousel,
    .el-carousel__container,
    .block .el-carousel h3,
    .block .el-carousel h3 img {
      height: 100%;
      width: 100%;
    }
  }

  .login-group {
    z-index: 2;

    .el-form {
      width: 370px;
      // padding: 10px 20px;
      // background: #fff;
      // border-radius: 10px;
      // box-shadow: 0px 5px 10px 0px rgba(26, 64, 142, 0.32);
      .project-title {
        margin-bottom: 40px;
        .title-name {
          color: rgba(0, 0, 0, 0.85);
          font-size: 32px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            margin-left: 10px;
          }
          img {
            width: 44px;
            height: 35px;
          }
        }
        .title-intro {
          margin-top: 6px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 13px;
        }
      }
      .el-checkbox-group {
        display: inline-block;
      }
      .el-tabs {
        background: transparent;
        .el-tabs__nav-wrap::after {
          background-color: transparent;
        }
        .el-tabs__nav {
          transform: translateX(68px) !important;
          .el-tabs__item {
            font-size: 16px;
          }
        }
      }
      .el-input {
        .el-input-group__prepend {
          padding: 0 19px;
        }
        .el-input__inner {
        }
      }
      /*display: flex;*/
      .form-title {
        padding: 20px 0;
        font-size: 20px;
        font-weight: 400;
        color: rgba(107, 104, 104, 1);
        line-height: 24px;
      }
      .icon.iconfont {
        margin: 0;
      }
      .form-footer {
        line-height: 14px;
        font-size: 14px;
        margin-bottom: 15px;
        // text-align: left;
        // padding: 0 5px 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-button{
          &:hover{
            color: #fff;
          }
          &.zhifubao{
            margin-left: 10px;
            &:hover{
              background-color: rgba(32, 148, 252, 1);
            }
          }
          &.taobao:hover{
              background-color: rgba(237, 68, 3, 1);
          }
          &.weibo:hover{
              background-color: rgba(251, 85, 85, 1);
          }
        }
        a {
          color: #409eff;
          text-decoration: none;
        }
        .form-forget {
          float: right;
          a {
            color: #8c8c8c;
            font-size: 14px;
          }
        }
      }

      .login-btn {
        width: 100%;
        height: 48px;
      }

      .el-input-group__prepend {
        background-color: transparent !important;
      }

      .el-form-item__content {
        margin-left: 0 !important;
        .el-input__inner {
          height: 48px;
        }

        .el-input-group {
          .el-input-group__prepend {
            background: transparent !important;
          }

          .el-input-group__append {
            padding: 0 5px;
            .s-canvas {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

/* 超小设备（手机，小于 768px） */
/* 小型设备（平板电脑，768px 起） */
@media (max-width: 992px) {
  .login-group {
    // margin-left: 10%;
  }
}

/* 中型设备（台式电脑，992px 起） */
@media (min-width: 992px) {
  .login-group {
    // margin-left: 40%;
  }
}

/* 大型设备（大台式电脑，1200px 起） */
@media (min-width: 1200px) {
  .login-group {
    // margin-left: 60%;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
