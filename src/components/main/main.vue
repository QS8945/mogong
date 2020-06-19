<template>
  <el-container>
    <el-header>
      <v-header v-if="this.$route.path!=='/login'"></v-header>
      <!-- <v-header1 v-else></v-header1> -->
    </el-header>
    <el-container>
      <el-aside v-if="this.$route.path!='/login' && this.$route.path!='/forgetPwd' && this.$route.path!='/404'">
        <v-aside v-if="reload"></v-aside>
      </el-aside>
      <el-main>
        <v-content></v-content>
      </el-main>
    </el-container>
    <el-footer>
      <v-footer v-if="$route.path == '/login' || $route.path == '/forgetPwd'"></v-footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './header'
import Aside from './aside'
import Content from './content'
import Footer from './footer'
export default {
  data () {
    return {
      reload: true
    }
  },
  watch: {
    'sourceType' (to, from) {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    }
  },
  components: {
    'v-header': Header,
    'v-header1': Header,
    'v-aside': Aside,
    'v-content': Content,
    'v-footer': Footer
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
  .el-container{
    height: 100%;
    overflow: hidden;
    /*height: 100vh;*/
    .el-header,.el-footer{
      height: auto !important;
      z-index: 1;
    }
    .el-main{
      padding: 0;
      margin: 0;
      overflow-y: hidden;
    }
    /*.el-aside{*/
      /*width: 219px !important;*/
    /*}*/
    .el-aside{
      width: auto !important;
    }
  }
.el-header{
  padding: 0;
}
.el-footer{
  position: fixed;
  bottom: 0;
  width: 100%;
}
/*.el-aside{*/
  /*height: 100%;*/
  /*overflow: hidden;*/
/*}*/
/*.el-main{*/
  /*-webkit-box-sizing: border-box;*/
  /*-moz-box-sizing: border-box;*/
  /*box-sizing: border-box;*/
  /*overflow-y: hidden;*/
/*}*/
</style>
