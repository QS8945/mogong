<template>
  <div class="view-total baseForm">
    <iframe style="height:100%;" frameborder="no" border="0" :src="dealUrl"></iframe>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'


  export default {
    data() {
      return {
        dealUrl:''
      }
    },
    created() {
      let vm = this;
      vm.dealUrl = vm.$route.query;
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

</style>
