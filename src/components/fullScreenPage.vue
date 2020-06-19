<template>
  <el-container>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
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
