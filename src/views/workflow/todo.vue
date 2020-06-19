<template>
  <div class="view-total baseForm">
    <iframe  style="height:100%;" frameborder="no" border="0" :src="todoUrl"></iframe>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'


  export default {
    data() {
      return {
        todoUrl: '',
        isShow: false
      }
    },
    created() {
      let vm = this;
      vm.todoUrl = COMMONJS.getWorkflowSsoLoginUrl('/act/task/todo');
    },
    methods:{
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
          this.$router.push({ path: this.activeIndex })
        } else {
          // this.$router.push({ path: '/' })
        }
      }
    }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

</style>
