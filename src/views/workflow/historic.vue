<template>
    <div class="view-total baseForm">
      <iframe style="height:100%;" frameborder="no" border="0" :src="historicUrl"></iframe>
    </div>
  </template>
  
  <script>
  import COMMONJS from '@/assets/js/common.js'

  
  export default {
    data () {
      return {
        historicUrl:""
      }
    },
    created(){
      let vm = this;
      vm.historicUrl = COMMONJS.getWorkflowSsoLoginUrl('/act/task/historic');
    }
  }
  </script>
  
  <style lang="scss">
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
  </style>
  