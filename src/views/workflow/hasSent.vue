<template>
  <div class="view-total baseForm">
    <iframe style="height:100%;" id="hasSent" frameborder="no" border="0" :src="hasSentUrl"></iframe>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'

  export default {
    data() {
      return {
        hasSentUrl: ''
      }
    },
    created() {　　
      let vm = this;
      vm.hasSentUrl = COMMONJS.getWorkflowSsoLoginUrl('/act/task/hasSent');

    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

</style>
