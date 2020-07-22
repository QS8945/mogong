<template>
  <div id="content" :class="{'content-padding':$route.path!=='/login','content-bg-white':$route.path === '/forgetPwd'}">
    <el-tabs v-if="$route.path!='/login' && $route.path!='/forgetPwd' && $route.path!='/404' && openTab.length"
            v-model="activeIndex"
            type="card"
            closable
            @tab-click='tabClick'
            @tab-remove='tabRemove'>
      <el-tab-pane
              :key="item.route"
              v-for="item in openTab"
              :label="item.name"
              :name="item.route">
        <!--<keep-alive>-->
        <!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
        <!--</keep-alive>-->
        <!--<router-view v-if="!$route.meta.keepAlive">-->
        <!--</router-view>-->
        <keep-alive>
          <router-view v-if="$route.path==item.route" />
        </keep-alive>
        <!--<router-view v-show="$route.path==item.route"></router-view>-->
      </el-tab-pane>
    </el-tabs>
    <router-view v-if="$route.path=='/login' || $route.path=='/forgetPwd' || $route.path=='/404'"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // 刷新时以当前路由做为tab加入tabs
    // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
    // 当当前路由是首页时，添加首页到store，并设置激活状态
    if (this.$route.path !== '/login' && this.$route.path !== '/404' && this.$route.path !== '/home') {
      // this.$store.commit('add_tabs', { route: '/main', name: 'main' })
      this.$store.commit('add_tabs', { route: this.$route.path, name: this.$route.name, query: this.$route.query })
      this.$store.commit('set_active_index', this.$route.path)
    } else {
      // this.$store.commit('add_tabs', { route: '/main', name: 'main' })
      // this.$store.commit('set_active_index', '/main')
      // this.$router.push('/')
    }
  },
  computed: {
    openTab () {
      return this.$store.state.openTab
    },
    activeIndex: {
      get () {
        return this.$store.state.activeIndex
      },
      set (val) {
        this.$store.commit('set_active_index', val)
      }
    }
  },
  watch: {
    '$route' (to, from) {
    // 判断路由是否已经打开
    // 已经打开的 ，将其置为active
    // 未打开的，将其放入队列里
      if (this.filterRoute(this.$route.path)) {
        let flag = false
        for (let item of this.openTab) {
          if (item.name === to.name) {
            this.$store.commit('set_active_index', to.path)
            flag = true
            break
          }
        }
        if (!flag) {
          this.$store.commit('add_tabs', { route: to.path, name: to.name, query: to.query })
          this.$store.commit('set_active_index', to.path)
        }
      }
    }
  },
  methods: {
    filterRoute (path) {
      let routes = ['/login', '/404']
      for (var i = 0; i < routes.length; i++) {
        if (routes[i] === path) {
          return false
        }
      }
      return true
    },
    tabClick (tab, event) {
      for (let item of this.openTab) {
        if (item.route === tab.name) {
          this.$router.push({ path: this.activeIndex, query: item.query })
        }
      }
    },
    // 移除tab标签
    tabRemove (targetName) {
      // 首页不删
      if (targetName === '/' || targetName === '/home') {
        return
      }
      this.$store.commit('delete_tabs', targetName)
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.openTab && this.openTab.length >= 1) {
          this.$store.commit('set_active_index', this.openTab[this.openTab.length - 1].route)
          // this.$router.push({ path: this.activeIndex })
          for (let item of this.openTab) {
            if (item.route === this.activeIndex) {
              this.$router.push({ path: this.activeIndex, query: item.query })
            }
          }
        } else {
          // this.$router.push({ path: '/' })
        }
      }
    }
  }
}
</script>

<style scope>
  #content {
    background: #ebf0f5;
    height: 100%;
    display: flex;
    justify-content: center;
    /*overflow: scroll;*/
    /*overflow: hidden;*/

  /*padding: 14px;*/
  /*height: calc(100vh - 60px);*/
  }

  #content::-webkit-scrollbar {
     display: none;
   }
  .content-padding {
    padding: 14px;
  }
  #content.content-bg-white{
    background: #fff;
  }
  #content .el-tabs{
    height: 100%;
    width: 100%;
    background: #fff;
  }
  #content .el-tabs .el-tabs__content{
    height: calc(100% - 41px);
    width: 100%;
  }
  #content .el-tabs .el-tabs__content .el-tab-pane{
    height: 100%;
    width: 100%;
    overflow-y: scroll;
  }
</style>
