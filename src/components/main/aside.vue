<template>
  <div class="tabs-aside">
    <!--<el-menu :default-active="activeIndex" :active="activeIndex" :router="true" @select="handleSelect"-->
    <!--class="el-menu-vertical-demo" @open="handleOpen" background-color="#545c64" text-color="#fff"-->
    <!--active-text-color="#fff"-->
    <!--@close="handleClose">-->
    <!--<div v-for="menu in menuList" :key="menu.menuCode">-->
    <!--<el-submenu :index="menu.menuCode" v-if="menu.children.length">-->
    <!--<template slot="title">-->
    <!--<i class="el-icon-location"></i>-->
    <!--<span v-if="$i18n.locale =='zh'">{{menu.menuName}}</span>-->
    <!--<span v-else>{{menu.menuEnglishName}}</span>-->
    <!--</template>-->
    <!--<el-menu-item v-for="menuItem in menu.children" :key="menuItem.menuUrl" :index="menuItem.menuUrl">-->
    <!--<span v-if="$i18n.locale =='zh'">{{menuItem.menuName}}</span>-->
    <!--<span v-else>{{menuItem.menuEnglishName}}</span>-->
    <!--</el-menu-item>-->
    <!--</el-submenu>-->
    <!--<el-menu-item v-if="menu.children.length==0" :key="menu.menuUrl" :index="menu.menuUrl">-->
    <!--<span v-if="$i18n.locale =='zh'">{{menu.menuName}}</span>-->
    <!--<span v-else>{{menu.menuEnglishName}}</span>-->
    <!--</el-menu-item>-->
    <!--</div>-->
    <!--</el-menu>-->
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :default-active="activeIndex"
      :active="activeIndex"
      :router="true"
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
      background-color="#f6f6f6"
      text-color="rgba(0, 0, 0, 1)"
      active-text-color="#fff">
      <nav-menu :menuList="menuList"></nav-menu>
      <!--<div v-for="menu in menuList" :key="menu.menuCode">-->
      <!--<template v-for="menu in menuList">-->
        <!--<el-submenu v-if="menu.children.length" :key="menu.menuCode" :index="menu.menuCode">-->
          <!--<template slot="title">-->
            <!--<i class="icon iconfont iconicon_user" v-if="menu.menuCode === 'enterpriseManageMent'"></i>-->
            <!--<i class="icon iconfont iconicon_can" v-if="menu.menuCode === 'organizationalManagement'"></i>-->
            <!--<i class="icon iconfont iconicon_set" v-if="menu.menuCode === 'systemManagement'"></i>-->
            <!--<i class="icon iconfont icontaizhangguanli" v-if="menu.menuCode === 'reportManagement'"></i>-->
            <!--<i class="icon iconfont icontianmailei-pressed" v-if="menu.menuCode === 'landfillManagement'"></i>-->
            <!--<i class="el-icon-office-building" v-if="menu.menuCode === 'businessInfo'"></i>-->
            <!--<i class="icon iconfont iconshuju" v-if="menu.menuCode === 'baseDataManagement'"></i>-->
            <!--<i class="icon iconfont iconkehu" v-if="menu.menuCode === 'customerManagement'"></i>-->
            <!--<i class="el-icon-position" v-if="menu.menuCode === 'workflow'"></i>-->
            <!--<i class="el-icon-collection-tag" v-if="menu.menuCode === 'contractManagement'"></i>-->
            <!--<span v-if="$i18n.locale =='zh'">{{menu.menuName}}</span>-->
            <!--<span v-else>{{menu.menuEnglishName}}</span>-->
          <!--</template>-->
          <!--<template v-for="menuItem in menu.children">-->
            <!--<el-menu-item v-if="menuItem.menuCode !== 'parkOverview'" :key="menuItem.menuUrl" :index="menuItem.menuUrl">-->
              <!--<span v-if="$i18n.locale =='zh'">{{menuItem.menuName}}</span>-->
              <!--<span v-else>{{menuItem.menuEnglishName}}</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item v-if="menuItem.menuCode === 'parkOverview'" :key="menuItem.menuUrl">-->
              <!--<span v-if="$i18n.locale =='zh'">{{menuItem.menuName}}</span>-->
              <!--<span v-else>{{menuItem.menuEnglishName}}</span>-->
            <!--</el-menu-item>-->
          <!--</template>-->
        <!--</el-submenu>-->
        <!--<el-menu-item v-if="!menu.children.length" :key="menu.menuCode" index="" @click="openScreen(menu.menuCode)">-->
          <!--<i class="icon iconfont iconaddress" v-if="menu.menuCode === 'parkOverview' || menu.menuCode === 'wasteSupervise'"></i>-->
          <!--<span v-if="$i18n.locale =='zh'">{{menu.menuName}}</span>-->
          <!--<span v-else>{{menu.menuEnglishName}}</span>-->
        <!--</el-menu-item>-->
      <!--</template>-->
        <!--<el-menu-item v-if="menu.children.length==0" :key="menu.menuUrl" :index="menu.menuUrl">-->
          <!--<span v-if="$i18n.locale =='zh'">{{menu.menuName}}</span>-->
          <!--<span v-else>{{menu.menuEnglishName}}</span>-->
        <!--</el-menu-item>-->
      <!--</div>-->
    </el-menu>
    <el-button @click="isCollapse = !isCollapse" class="toogle-el-menu" :class="{'toogle-el-menu-expand':!isCollapse}" icon="icon iconfont iconios-menu"></el-button>
  </div>
</template>

<script>
import Main from '@/components/main/main.vue'
import COMMONJS from '@/assets/js/common'
import NavMenu from '@/components/navMenu'
import { getTreeUser } from '@/assets/js/API/api'

export default {
  data () {
    return {
      isCollapse: false,
      activeIndex: '',
      menuList: [],
      dynamicRouterList: [{
        path: '/commonErp',
        name: 'commonErp',
        component: Main,
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        children: []
      }],
      dataRouter: []
    }
  },
  components: {
    'nav-menu': NavMenu
  },
  watch: {
    '$route': 'getPath'
  },
  created () {
  },
  mounted () {
    this.getMenuList()
  },
  computed: {
    sourceType: {
      get () {
        // return this.$store.state.sourceType
        return this.$store.commit('get_source_type')
      },
      set (val) {
        this.$store.commit('set_source_type', val)
      }
    }
  },
  methods: {
    getMenuList () {
      let _this = this
      if (COMMONJS.routesList && (COMMONJS.routesList.length === 0)) {
        let postData = {
          sourceType: localStorage.getItem('sourceType')
        }
        getTreeUser(postData)
          .then(res => {
            _this.menuList = res.data
            // COMMONJS.getHomePage(_this.menuList)
            _this.activeIndex = COMMONJS.getActiveIndex(this.$route.path)
          }).catch(() => {
          })
      } else if (COMMONJS.routesList && COMMONJS.routesList.length) {
        _this.menuList = JSON.parse(JSON.stringify(COMMONJS.routesList))
        // COMMONJS.getHomePage(_this.menuList)
        _this.activeIndex = COMMONJS.getActiveIndex(this.$route.path)
      }
      // if (localStorage.getItem('sourceType') === 'web') {
      //   this.$store.commit('add_tabs', { route: '/home', name: '工作台' })
      // }
    },
    getInitMenuRoutes (data) {
      let _this = this
      let dynamicRouter = {
        meta: {
          requireAuth: true, // 配置此条，进入页面前判断是否需要登陆
          keepAlive: true
        },
        component: () => import('@/views/commonErp/commonErpPage.vue')// (resolve) => require(['@/views/testErp/compatibilityRecordList.vue'], resolve)
      }
      for (var i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length) {
          _this.getInitMenuRoutes(data[i].children)
        } else {
          if (data[i].url.indexOf('/web/') === 0) {
            dynamicRouter.path = data[i].url
            dynamicRouter.name = data[i].name
            _this.dataRouter.push(dynamicRouter)
          }
        }
      }
      return _this.dataRouter
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    },
    getPath () {
      this.activeIndex = COMMONJS.getActiveIndex(this.$route.path)
    }
  }
}
</script>

<style lang="scss" scope>
  .el-menu-item.is-active {
    color: #40C3AB !important;
    &:hover{
      color: #fff !important;
    }
  }
  .tabs-aside{
    overflow: scroll;
    height: 100%;
    position: relative;
    /*.iconfont{*/
      /*color: #EDEDED !important;*/
    /*}*/
    .el-menu--collapse{
      .el-submenu.is-active{
        .el-submenu__title{
          background: #40C3AB !important;
          i{
            color: #fff;
          }
        }
      }
    }
  }
  .el-aside{
    padding-bottom: 48px;
    background: rgba(246,246,246,1);
    .toogle-el-menu{
      position: fixed;
      bottom: 22px;
      /*right: 13px;*/
      left: 13px;
      /*background: rgb(246, 246, 246);*/
      width: auto;
      min-height: auto;
      min-width: auto;
      padding: 0;
      border: none;
      i{
        color: #40C3AB !important;
        font-size: 20px;
        margin: 0;
      }
    }
    .toogle-el-menu-expand{
      .iconios-menu:before{
        transition: all .5s;
        display: inline-block;
        transform: rotate(90deg);
      }
    }
    .el-menu-item{
      height: 44px;
      line-height: 44px;
    }
    .el-submenu{
      .el-submenu__title {
        height: 44px;
        line-height: 44px;
        i {
          color: #6F7C89;
        }
      }
      &.is-opened {
        background: rgba(246,246,246,1);
        .el-submenu__title, .el-menu, .el-menu-item {
          background: rgba(246,246,246,1) !important;
          color: #98aac0;
        }
        .el-menu-item{
          color: rgba(56, 56, 56, 1) !important;
        }
      }
      .el-menu {
        .el-menu-item.is-active {
          background: rgba(229, 244, 243, 1) !important;
          -webkit-transition: all .3s;
          -moz-transition: all .3s;
          -ms-transition: all .3s;
          -o-transition: all .3s;
          transition: all .3s;
          color: rgba(0, 150, 136, 1) !important;
          border-right: 3px solid rgba(0, 150, 136, 1);
          &:hover{
            background: #40C3AB !important;
          }
        }
        .el-menu-item {
          font-size: 13px;
          // line-height: 32px;
          // height: 32px;
          /*padding-left: 70px !important;*/
          /*text-align: left;*/
          background: transparent;

          &:hover {
            background: rgb(197,197,197) !important;
            color: #fff !important;
          }
        }
      }
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    text-align: left;
    width: 219px;
    min-height: 400px;
    border-right: 0;
  }
  .el-menu-vertical-demo.el-menu--collapse{
    .el-submenu__title{
      width: 64px;
    }
  }

  /*.tabs-aside {*/
    /*height: 100%;*/
    /*.el-menu {*/
      /*height: 100%;*/
      /*.el-submenu {*/
        /*.el-submenu__title {*/
          /*height: 44px;*/
          /*line-height: 44px;*/
          /*i {*/
            /*color: #EDEDED;*/
          /*}*/
        /*}*/
        /*&.is-opened {*/
          /*background: #3D5065;*/
          /*.el-submenu__title, .el-menu, .el-menu-item {*/
            /*background: #3D5065 !important;*/
            /*color: #98aac0;*/
          /*}*/
          /*.el-menu-item{*/
            /*color: #98aac0 !important;*/
          /*}*/
        /*}*/
        /*.el-menu {*/
          /*.el-menu-item.is-active {*/
            /*background: #409EFF !important;*/
            /*-webkit-transition: all .3s;*/
            /*-moz-transition: all .3s;*/
            /*-ms-transition: all .3s;*/
            /*-o-transition: all .3s;*/
            /*transition: all .3s;*/
            /*color: #fff !important;*/
            /*&:hover{*/
              /*background: #409EFF !important;*/
            /*}*/
          /*}*/
          /*.el-menu-item {*/
            /*font-size: 13px;*/
            /*line-height: 32px;*/
            /*height: 32px;*/
            /*padding-left: 70px !important;*/
            /*text-align: left;*/
            /*background: transparent;*/

            /*&:hover {*/
              /*background: rgb(55,72,90) !important;*/
            /*}*/
          /*}*/
        /*}*/

        /*.el-submenu__title {*/
          /*text-align: left;*/
        /*}*/
      /*}*/
    /*}*/
  /*}*/

  /*.el-menu{*/
  /*border-right: none;*/
  /*background-color: transparent;*/
  /*.el-submenu{*/
  /*.el-submenu__title:hover,.el-menu-item:hover{*/
  /*background-color: transparent;*/
  /*font-weight: 550;*/
  /*}*/
  /*.el-submenu__title,.el-menu{*/
  /*color: #fff;*/
  /*width: 188px;*/
  /*text-align: left;*/
  /*.el-menu-item{*/
  /*color: #fff;*/
  /*padding: 0;*/
  /*width: 188px;*/
  /*min-width: 188px;*/
  /*margin: 0;*/
  /*&.is-active{*/
  /*font-weight: 550;*/
  /*background-color: transparent !important;*/
  /*}*/
  /*}*/
  /*}*/
  /*}*/
  /*}*/
</style>
