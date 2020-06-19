<template>
    <div>
      <el-form label-width="420px">
        <el-form-item>
          <div style="line-height: 20px;">
            新密码设置成功！<br>请您牢记新密码
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-top: 24px;width: 141px;" @click="next">马上登陆</el-button>
        </el-form-item>

        <div></div>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'successPwd',
  methods: {
    next () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
