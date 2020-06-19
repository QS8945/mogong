<template>
  <div id="header" :class="{'header-bg':this.$route.path!=='/login' && this.$route.path!='/forgetPwd','header-border':this.$route.path === '/forgetPwd'}">
    <div class="header_main_style">
      <div class="header-left">
        <div class="header_left_block"><!-- class="{'header_left_block1':this.$route.path=='/login'}"-->
          <!--<i class="iconfont eil-icon-SR_Logo_Blue logo_img_style"></i>-->
          <!-- <img @click="getHomePage" src="./../../assets/img/login/logo.png"> -->
          <!-- <span class="header_left_title">{{$t('projectName')}}</span> -->
          <div class="header-name">墨工</div>
          <div class="header-intro">工程&nbsp;"利器"</div>
        </div>
        <span v-if="this.$route.path =='/forgetPwd'" class="grey-line"></span>
        <span v-if="this.$route.path =='/forgetPwd'" class="header_text">忘记密码</span>
      </div>
      <div class="header-right">
        <div class="user_div_style">
          <el-button class="user-item" type="text" v-if="this.$route.path!='/login' && this.$route.path!='/forgetPwd' && (type === '1')" @click="hrefManagement()">{{sourceType === 'back' ? '业务后台' : '管理后台'}}</el-button>
          <el-dropdown @command="handleCommand" v-if="this.$route.path!='/login' && this.$route.path!='/forgetPwd'">
          <span class="el-dropdown-link">
            <span>{{entName}} / {{userName}}</span>
            <i class="el-icon-arrow-down el-icon--right">
            </i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="right-link" v-if="this.$route.path ==='/forgetPwd'">
          <!--<router-link to="/forgetPwd">注册</router-link>-->
          <!--<span class="grey-line"></span>-->
          <router-link to="/">登录</router-link>
        </div>
      </div>
      <!--<div class="lang_div_style">-->
        <!--<el-select v-model="langValue" @change="changeLang">-->
          <!--<el-option-->
            <!--v-for="item in langOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
import GLB_CONFIG from '@/assets/js/glb-constant'
import COMMONJS from '@/assets/js/common.js'
import { getTreeUser } from '@/assets/js/API/api'

export default {
  data () {
    return {
      langValue: localStorage.getItem('localeLanguage') || 'zh',
      type: localStorage.getItem('type'),
      userName: COMMONJS.getUserName(),
      entName: COMMONJS.getEntName(),
      langOptions: [{
        label: 'ZH',
        value: 'zh'
      }, {
        label: 'EN',
        value: 'en'
      }]
      // sourceType: localStorage.getItem('sourceType')
    }
  },
  // watch: {
  //   userName (newValue, oldValue) {
  //     this.toggleLang(newValue)
  //   }
  // },
  methods: {
    toggleLang (val) {
      if (val === 'zh') {
        localStorage.setItem('localeLanguage', val)
        this.$i18n.locale = val
        this.$message({
          message: '切换为中文！',
          type: 'success'
        })
        locale.use(zhLocale)
        document.getElementById('app').style.fontFamily = 'NSimsun'
      } else if (val === 'en') {
        localStorage.setItem('localeLanguage', val)
        this.$i18n.locale = val
        this.$message({
          message: 'switch to English!',
          type: 'success'
        })
        locale.use(enLocale)
        document.getElementById('app').style.fontFamily = 'Arial'
      }
      history.go(0)
    },
    openFullScreen () {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })

    },
    handleCommand (command) {
      if (command === 'loginOut') {
        COMMONJS.getLoginOut()
      } else if (command === 'changePwd') {
        this.$router.push('/changePassword')
      }
    },
    changeLang (val) {
      this.toggleLang(val)
    },
    getHomePage () {
      COMMONJS.getHomePage()
    },
    hrefManagement () {
      let _this = this
      // 初始化菜单路由
      COMMONJS.routesList = []
      this.$store.commit('delete_tabs', '')
      // let postData = {
      //   sourceType: 'back'
      // }
      // getTreeUser(postData)
      //   .then(res => {
      //     COMMONJS.initMenu(res.data)
      //   })
      // console.log((localStorage.getItem('sourceType') === 'back') ? 'web' : 'back')
      // localStorage.setItem('sourceType', (localStorage.getItem('sourceType') === 'back') ? 'web' : 'back')

      this.$store.commit('set_source_type', (localStorage.getItem('sourceType') === 'back') ? 'web' : 'back')
      // localStorage.setItem('refreshHome', 'true')
      COMMONJS.getHomePage()
      // console.log(localStorage.getItem('sourceType'))
      // COMMONJS.getHomePage()
      // this.$nextTick(() => {
      //   _this.$router.go(0)
      // })
      // const href = GLB_CONFIG.devUrl.managementUrl + '?token=' + localStorage.getItem('token')
      // window.open(href, '_blank')
    }
  },
  mounted () {
    // this.openFullScreen()
  },
  computed: {
    sourceType: {
      get () {
        return this.$store.state.sourceType
      },
      set (val) {
        this.$store.commit('set_source_type', val)
      }
    }
    // ...mapGetters([
    //   'getSsourceType'
    // ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../../element-variables.scss';
  #header {
    display: flex;
    height: 70px;
    line-height: 70px;
    background: #fff;
    color: #fff;
    .user-item{
      margin-right: 30px;
    }
    &.header-bg{
      height: 65px;
      line-height: 70px;
      .header_main_style{
        box-shadow:0px 3px 10px 0px rgba(69,90,112,0.07);
        // background: rgba(246,246,246,1);
        background: rgba(25,160,148,1);
        height: 65px;
        line-height: 65px;
        .header_left_block{
          .header-name{
            color: rgba(80, 80, 80, 1);
            font-size: 30px;
            font-weight: bold;
          }
          .header-intro{
            color: rgba(80, 80, 80, 1);
	          font-size: 14px;
            margin-left: 6px;
          }
          img{
            height: 39px;
            width: 61px;
            cursor: pointer;
          }
        }
        .header_left_block>.header_left_title{
          color: #455A70;
          font-size: 16px;
        }
      }
    }
    &.header-border{
      border-bottom: 1px solid #DFDFDF;
    }
    .grey-line{
      width:1px;
      height:21px;
      background: #bfbfbf;
      margin: 0 20px;
      display: inline-block;
    }
    .header_text{
      color: rgb(34, 34, 34);
      font-size: 16px;
      font-weight: 400;
      color: #898989;
    }
    .header_main_style {
      padding: 0 27px;
      display: flex;
      width: 100vw;
      position: relative;
      height: 70px;
      justify-content: space-between;
      .header-right{
        .right-link{
          display: flex;
          align-items: center;
          .grey-line{
            height: 16px;
          }
          a{
            font-size:14px;
            color: #898989;
            text-decoration: none;
            &:hover{
              color: $--color-primary;
            }
          }
        }
      }
      .header-left{
        display: flex;
        align-items: center;
      }
      .header_left_block {
        /*padding-left: 25px;*/
        /*border-right: 1px solid rgb(210, 210, 210);*/
        display: flex;
        align-items: center;
        /*width: 188px;*/
        img{
          height: 47px;
          width: 74px;
        }
        .header_left_title{
          margin-left: 10px;
          font-size: 22px;
          color: #42454D;
          font-weight:400;
        }
        .logo_img_style {
          float: left;
          color: rgb(15, 77, 188);
          font-size: 28px !important;
          padding-left: 14px;
        }
      }
      .header_left_block1{
        border-right: none;
      }
      .user_div_style{
        position: absolute;
        right: 95px;
        cursor: pointer;
        .el-dropdown{
          .el-dropdown-link{
            color: rgb(111, 124, 137);
            font-size: 14px;
          }
        }
      }
      .lang_div_style{
        width: 70px;
        position: absolute;
        right: 14px;
        .el-input__inner{
          background: transparent ;
          /*border: 1px solid #DCDFE6;*/
          /*border: 1px solid transparent;*/
          color: rgb(210, 210, 210);
          font-size: 14px;
          /*border-color: transparent !important;*/
          &:focus,&:hover{
            /*border:1px solid transparent !important;*/
          }
        }
      }
    }
  }
</style>
