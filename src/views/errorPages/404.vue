<template>
  <div class="not-found">
    <h1>404</h1>
    <el-row type="flex" justify="center">
      <el-col><el-button @click="getBack">返回</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
export default {
  methods: {
    getBack () {
      // COMMONJS.getHomePage()
      history.go(-1)
      // let _this = this
      // this.$Http.get('menu/listMenu').then(res => {
      //   console.log(res)
      //   _this.$router.push({
      //     path: res.data[0].children.length > 0 ? res.data[0].children[0].menuUrl : res.data[0].menuUrl
      //   })
      // })
    }
  }
}
</script>
<style scoped>
  .not-found {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
</style>
