<template>
  <div class="customer-manage bussiness-info">
    <el-tabs v-model="activeName" type="card" :before-leave="beforeClick">
      <el-tab-pane label="我的客户" name="myCustomer">
        <v-com-my-customer ref="comMyCustomer"></v-com-my-customer>
      </el-tab-pane>
      <el-tab-pane label="商务活动" name="businessActivities" :lazy="true">
        <v-waste-info></v-waste-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import ComMyCustomer from '@/views/customerManagement/components/comMyCustomer'
import WasteInfo from '@/views/customerManagement/components/wasteInfo'

export default {
  name: 'businessBaseInfo',
  data () {
    return {
      activeName: 'myCustomer'
    }
  },
  mounted () {
    // this.getListStorageInfo()
    // this.getData()
    // this.getSysCanton()
    // this.getCodeAndNameDicEntProperty()
  },
  components: {
    'v-com-my-customer': ComMyCustomer,
    'v-waste-info': WasteInfo
  },
  methods: {
    beforeClick (activeName, oldActiveName) {
      if (this.$route.query.type === 'add') {
        if ((activeName === 'financialInfo') || (activeName === 'wasteInfo')) {
          COMMONJS.showToast('请先保存企业信息', 'warning')
          return false
        }
      }
    },
    backToCustomer () {
      this.$router.push({
        path: '/customerInfoManagement'
      })
    },
    queryData (queryForm) {
      if (this.activeName === 'myCustomer') {
        this.$refs.comMyCustomer.queryData(queryForm)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../../../element-variables.scss';

  .customer-manage{
    .el-tabs{
      height: 100%;
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__content{
        height: calc(100% - 41px);
        overflow: auto;
        /*border-right: 1px solid #E4E7ED;*/
        /*border-left: 1px solid #E4E7ED;*/
        /*border-bottom: 1px solid #E4E7ED;*/
        .el-tab-pane{
          height: 100%;
        }
      }
    }
  }
  .bussiness-info {
    position: relative;
    background: #fff;
    padding: 17px 30px;
    flex-grow: 1;
    overflow: scroll;
    .back-to-customer{
      position: absolute;
      right: 110px;
      top: 22px;
      padding: 5px 10px;
      z-index: 1;
    }
    /*.el-form-item{*/
      /*margin-bottom: 16px;*/
    /*}*/
    .el-btn-address{
      .iconaddress{
        font-size: 24px;
      }
    }
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
    .el-cascader,.el-date-editor{
      width: 100%;
    }
    .map-address{
      position: absolute;
      left: 60px;
      top: 67px;
      color: #455A70;
      text-align: left;
      padding: 15px 20px;
      white-space: nowrap;
      background: #fff;
      .map-form-item{
        padding: 5px;
        font-size:14px;
      }
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    form {
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }

    .map-dialog.el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dialog {
        margin: auto !important;

        .el-dialog__header {
          padding: 0;
          position: relative;
          .title{
            position: absolute;
            right: -26px;
            top: -21px;
          }
        }
      }
    }

    .map-dialog {
      .el-dialog {
        width: 50%;
        height: 70%;
        display: flex;
        flex-direction: column;

        .el-dialog__body {
          flex-grow: 1;
        }
      }

      .el-dialog__body {
        padding: 0;
      }
    }

    .init-row-margin {
      margin: 0 !important;
    }

    .bus-info-item {
      .item-header {
        padding: 13px 0;
        border-bottom: 1px solid #EEEEEE;

        .item-header-text {
          text-align: left;
          padding-left: 20px;
          border-left: 2px solid $--color-primary;
          color: #555D66;
          font-size: 16px;
        }
      }

      .item-body {
        padding: 30px 50px;

        .el-input {
          .el-input-group__prepend{
            border-radius: 4px 0px 0px 4px !important;
          }
          .el-input-group__append,.el-input-group__prepend {
            padding: 0 13px;
          }
        }

        .business-license {
          text-align: left;
        }
      }
    }
  }
  .contacts-management{
    .el-card__header{
      background: rgb(246, 246, 246);
      padding: 8px 20px;
      color: #455A70;
    }
    .el-tooltip{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
