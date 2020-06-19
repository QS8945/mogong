<template>
  <div class="form-format">
    <!-- 生产部主管初审阶段-->
    <v-add-production-plan ref="mychild" v-if="state=='commit'||isAfterProductManageAudit" @refreshTable="getData" :checkObj="checkObjP"
      @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-add-production-plan>
    <!-- 配伍阶段显示 -->
    <v-compatibility-plan v-if="!isAfterProductManageAudit&&(state=='precheck'||isAfterEngAudit)" @refreshTable="getData" :checkObj="checkObjP"
      @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-compatibility-plan>
    <!-- 生产部主管终审阶段 -->
    <v-auto-compatibility v-if="!isAfterProductManageAudit&&(state=='compatibility'||isAfterEngAudit)&&isGetCompatibilityPlan"
      @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-auto-compatibility>
    <!-- 安环部审核 -->
    <v-auto-compatibility v-if="!isAfterProductManageAudit&&(state=='finalcheck'||isAfterEngAudit)&&isGetCompatibilityPlan" @refreshTable="getData"
      :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-auto-compatibility>
    <!-- <el-button type="primary" icon="el-icon-edit-outline" @click="reHandle">调整配伍
      </el-button> -->
    <v-add-production-plan ref="mychild" v-if="!isAfterProductManageAudit&&state=='refuse'" @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
      @reload="reloadP"></v-add-production-plan>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import AutoCompatibility from './autoCompatibility.vue'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import AddProductionPlan from './components/addProductionPlan.vue'
  import CompatibilityPlan from './compatibilityPlan.vue'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getPrimaryKeyByProcInsId,
    queryProductionPlan,
    getCompatibilityPlanFirstForMap
  } from '@/assets/js/API/api'

  export default {
    name: 'viewAuditInfo',
    data() {
      return {
        isGetCompatibilityPlan: false,
        isAfterProductManageAudit: false,
        isAfterEngAudit: false,
        checkObjP: {},
        headId: '',
        state: ''
      }
    },
    // 组件
    components: {
      'v-auto-compatibility': AutoCompatibility,
      'v-add-production-plan': AddProductionPlan,
      'v-compatibility-plan': CompatibilityPlan

    },
    created() {
      if (this.$route.query.procInsId == "" || this.$route.query.procInsId == null || !this.$route.query.procInsId) {
        alert('参数异常！');
        return;
      }
      //根据流程标识获取主键
      this.getData()
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      getCompatibilityPlanFirstForMap(productionId, callBack) {
        var vm = this
        getCompatibilityPlanFirstForMap(productionId)
          .then(res => {
            vm.isGetCompatibilityPlan = true;
            callBack && callBack(res);
          }).catch(() => {})
      },
      reHandle() {
        this.$router.push({
          path: '/reModifyCompatibility',
          query: {
            type: 'update',
            data: {
              guid: this.headId
            }
          }
        })
      },
      reloadP(val) {
        var vm = this;
        vm.isAfterProductManageAudit = true;
        vm.getData(val);
      },
      getData(isReload) {
        let _this = this
        let postData = {
          procInsId: this.$route.query.procInsId,
          tableName: 'production_plan',
          keyName: "id"
        }
        getPrimaryKeyByProcInsId(postData)
          .then(res => {
            _this.headId = res.data;
            queryProductionPlan(_this.headId)
              .then(res => {
                _this.state = res.data.status;
                _this.checkObjP.type = "audit";
                _this.checkObjP.procInsId = _this.$route.query.procInsId
                _this.checkObjP.status = res.data.status
                if (_this.state == 'commit') { //计划已提交，生产部主管初审
                  _this.checkObjP.data = _this.headId;
                }
                if (_this.state == 'refuse') { //计划已提交，生产部主管初审
                  _this.checkObjP.type = "update";
                  _this.checkObjP.data = _this.headId;
                }
                if (_this.state == 'precheck') { //初审完毕，开始配伍
                  _this.checkObjP.defaultTabName = 'plan';
                  _this.checkObjP.productionPlanId = _this.headId;
                }
                if (_this.state == 'compatibility') { //配伍完毕，终审
                  _this.getCompatibilityPlanFirstForMap(_this.headId, function (res) {
                    _this.checkObjP.compatibilityPlanId = res.data.id;
                    _this.checkObjP.productionPlanId = _this.headId;
                    _this.checkObjP.templateId = res.data.templateId;
                  })
                }
                if (_this.state == 'finalcheck') { //终审完毕，安环
                  _this.getCompatibilityPlanFirstForMap(_this.headId, function (res) {
                    _this.checkObjP.compatibilityPlanId = res.data.id;
                    _this.checkObjP.step = 'security';
                    _this.checkObjP.productionPlanId = _this.headId;
                    _this.checkObjP.templateId = res.data.templateId;
                  })
                }
                if (isReload) {
                  _this.$refs.mychild.afterAudit(_this.state);
                }
              }).catch(() => {})
          }).catch(() => {})
      }
    }
  }

</script>

<style scoped>
  .form-format {
    padding-right: 30px;
    text-align: left;
  }

</style>
