<template>
    <div class="view-total baseForm">
      <iframe style="height:100%;" frameborder="no" border="0" :src="processUrl"></iframe>
    </div>
  </template>
  
  <script>
  import COMMONJS from '@/assets/js/common.js'

  
  export default {
    data () {
      return {
        processUrl:''
      }
    },
    created(){
      let vm = this;
      vm.processUrl = COMMONJS.getWorkflowSsoLoginUrl('/act/model');
    }
  }
  </script>
  
  <style lang="scss">
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
  </style>
  