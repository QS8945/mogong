<template>
  <div id="app">
    <!--<div id="nav">-->
      <!--<router-link to="/">Home</router-link> |-->
      <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--<keep-alive>-->
      <!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
    <!--</keep-alive>-->
    <!--<router-view v-if="!$route.meta.keepAlive">-->
    <!--</router-view>-->
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scope>
*{
  box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
}
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: MicrosoftYaHei;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  /*min-width: 1200px;*/
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
*::-webkit-scrollbar {
  display: none;
}
.iconfont{
  vertical-align: middle;
  margin-right: 10px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}
/* 地图*/
.anchorBL{
  display: none;
}
.tangram-suggestion-main{
  z-index: 9999;
}
//全局主题色
$-theme-blue: #409EFF;
</style>
