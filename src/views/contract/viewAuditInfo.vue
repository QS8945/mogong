<template>
  <div class="form-format">
    <v-sign-all-info v-if="headId&&headId!=''" :headId="headId" activeName="4" isAccordion></v-sign-all-info>
    <div style="text-align:center;margin-top:10px;" v-if="headId&&headId!=''&&(state=='save'||state=='refuse')">
      <el-button type="primary" icon="el-icon-edit-outline" v-if="state=='refuse'" @click="reHandle">调整合同
      </el-button>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import SignAllInfo from './components/signAllInfo.vue'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getPrimaryKeyByProcInsId,
    queryMSWMSAOrderHeadByID
  } from '@/assets/js/API/api'

  export default {
    name: 'viewAuditInfo',
    data() {
      return {
        checkObjP: {},
        headId: '',
        state: ''
      }
    },
    // 组件
    components: {
      'v-sign-all-info': SignAllInfo
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
      reHandle() {
        this.$router.push({
          path: '/reModifyContract',
          query: {
            type: 'update',
            data: {
              guid: this.headId
            }
          }
        })
      },
      getData() {
        let _this = this
        let postData = {
          procInsId: this.$route.query.procInsId,
          tableName: 'saorderhead',
          keyName: "guid"
        }
        getPrimaryKeyByProcInsId(postData)
          .then(res => {
            _this.headId = res.data;
            queryMSWMSAOrderHeadByID(_this.headId)
              .then(res => {
                _this.state = res.data.state;
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
