<template>
    <div>
      enterpriseEntry
      <div class="form_main_style">
        <el-steps :active="activeIndex" :align-center="true">
          <el-step title="步骤 1" icon="el-icon-edit"></el-step>
          <el-step title="步骤 2" icon="el-icon-upload"></el-step>
          <el-step title="步骤 3" icon="el-icon-picture"></el-step>
          <el-step title="步骤 4" icon="el-icon-edit"></el-step>
          <el-step title="步骤 5" icon="el-icon-upload"></el-step>
        </el-steps>
      </div>
      <transition name="entry" mode="out-in">
        <entry-component-1 v-if="activeIndex === 0" @pNextStep="nextStep"></entry-component-1>
        <entry-component-2 v-if="activeIndex === 1" @pNextStep="nextStep"></entry-component-2>
      </transition>
    </div>
</template>

<script>
import entryComponent1 from '@/components/enterpriseEntry/entryComponent1'
import entryComponent2 from '@/components/enterpriseEntry/entryComponent2'
export default {
  name: 'enterpriseEntry',
  data () {
    return {
      activeIndex: 0
    }
  },
  components: {
    'entry-component-1': entryComponent1,
    'entry-component-2': entryComponent2
  },
  methods: {
    nextStep (val) {
      this.activeIndex = val
    }
  }
}
</script>

<style scoped>
.entry-enter,.entry-leave-to{
  opacity: 0;
  transform: translateX(1000px);
  position: absolute;
}
.entry-enter-active,.entry-leave-active{
  position: absolute;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
  /*opacity: 1;*/
  /*transform: translateX(0px);*/
}
</style>
