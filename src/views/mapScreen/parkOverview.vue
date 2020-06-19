<template>
  <div class="park-overview">
    <v-map ref="mapContent" id="mapContent" :class="{'map-index': mapIndex}" @reload="changeFullWindowVisible" @companyData="childCompanyData"></v-map>
    <div class="header">
      <div class="charts-title">园区一览</div>
    </div>

    <!--左侧content-->
    <transition name="turn-left" v-cloak>
      <v-map-left-content v-if="leftShow" @companyData="childCompanyData" @changePositionCenter="getWeightPosition"></v-map-left-content>
    </transition>
    <!--向左按钮-->
    <transition name="turn-opacity-left">
      <div v-show="leftShow" class="turn-left">
        <el-button @click="leftShow = !leftShow" icon="el-icon-arrow-left"></el-button>
      </div>
    </transition>
    <!--向右按钮-->
    <transition name="turn-opacity">
      <div v-if="!leftShow" class="park-dynamics" @click="turnRight">园区动态
        <el-button @click.stop="leftShow = !leftShow" icon="el-icon-arrow-right" circle></el-button>
      </div>
    </transition>

    <!--右侧content-->
    <transition name="turn-right" v-cloak>
      <v-map-right-content v-if="rightShow" @companyData="childCompanyData" @getCompanyPosition="getCompanyPositionType"></v-map-right-content>
    </transition>
    <!--向右按钮-->
    <transition name="turn-opacity-right">
      <div v-show="rightShow" class="turn-left turn-right">
        <el-button @click="rightShow = !rightShow" icon="el-icon-arrow-right"></el-button>
      </div>
    </transition>
    <!--向左按钮-->
    <transition name="turn-opacity">
      <div v-if="!rightShow" class="park-dynamics park-right" @click="turnLeft">园区统计
        <el-button @click.stop="rightShow = !rightShow" icon="el-icon-arrow-left" circle></el-button>
      </div>
    </transition>

    <!--markers说明-->
    <div class="example-icons" :class="{'transition-move': !rightShow}">
      <div class="icons-items">
        <div class="icons-item"><img class="business-icon" src="../../assets/img/map/waste-enterprises.png">产废企业</div>
        <div class="icons-item"><img class="business-icon" src="../../assets/img/map/business-enterprise.png">经营企业</div>
      </div>
      <div class="icons-items">
        <div class="icons-item"><img class="online-type-icon" src="../../assets/img/map/online.png">地磅在线</div>
        <div class="icons-item"><img class="online-type-icon" src="../../assets/img/map/offline.png">地磅离线</div>
      </div>
    </div>

    <!--infoWindow弹出框-->
    <transition name="el-fade-in-linear">
      <v-common-table-info ref="vCommonTable" v-if="commonWindowVisible" @reload="changeCommonVisible"></v-common-table-info>
    </transition>
    <!--fullWindow弹出层-->
    <transition name="el-fade-in-linear">
      <v-full-window v-if="fullWindow" :busName="entName" @reload="changeFullWindowVisible" @companyData="childCompanyData"></v-full-window>
    </transition>
  </div>
</template>

<script>
import Map from '@/components/map/mapParkOverview'
import BusinessInfoWindow from '@/components/map/businessInfoWindow'
import CommonTableInfo from '@/components/map/commonTableInfo'
import MapLeftContent from '@/components/map/mapLeftContent'
import MapRightContent from '@/components/map/mapRightContent'
import { formatDate } from '@/assets/js/date.js'

export default {
  name: 'parkOverview',
  data: function () {
    return {
      mapIndex: 0,
      // 园区企业查询关键字
      leftShow: false,
      rightShow: false,
      commonWindowVisible: false,
      map: '',
      // 企业卡片式数据
      enterpriseList: [],
      entId: '',
      fullWindow: false
    }
  },
  mounted () {
    // this.initMap()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'MM-dd hh:mm')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  components: {
    'v-map': Map,
    'v-full-window': BusinessInfoWindow,
    'v-common-table-info': CommonTableInfo,
    'v-map-left-content': MapLeftContent,
    'v-map-right-content': MapRightContent
  },
  methods: {
    turnRight: function () {
      this.leftShow = !this.leftShow
    },
    turnLeft: function () {
      this.rightShow = !this.rightShow
    },
    getWeightPosition: function (obj) {
      this.$refs.mapContent.getWeightPosition(obj)
    },
    changeFullWindowVisible (flag) {
      if (flag.commonWindowVisible === false) {
        this.commonWindowVisible = flag.commonWindowVisible
      }
      this.fullWindow = flag.fullWindow
      this.entName = flag.entName
      // this.fullWindow = flag
    },
    // 子向父传递表格数据参数
    childCompanyData (data) {
      let _this = this
      this.commonWindowVisible = true
      setTimeout(function () {
        // console.log(this.$refs['vCommonTable'])
        _this.$refs.vCommonTable.getCompany(data)
      }, 100)
      // this.getCompany(data)
    },
    changeCommonVisible (flag) {
      this.commonWindowVisible = flag.commonWindowVisible
    },
    getCompanyPositionType (type) {
      this.$refs.mapContent.getCompanyPosition(type)
    }
  }
}
</script>

<style lang="scss">
  .park-overview{
    text-align: left;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: MicrosoftYaHei-Bold;
    position: relative;
    overflow: hidden;
    height: 100vh;
    margin: 0px;
    padding: 0px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    height: 100%;
    width: 100%;
    margin: 0px;
    padding: 0px;
    position: relative;
    .theme-orange{
      .link-point::after{
        background: #FEE982;
      }
    }
    .item-text-blue{
      .link-point::after{
        background: #46D7AD;
      }
    }
    .info-content-group{
      .link-point::after{
        background: rgba(0, 255, 238, 0);
      }
    }
    .theme-blue{
      .link-point::after{
        background: #44D7FD;
      }
    }
    .ysd-body,.data-bottom,.storage-progress{
      .link-point::after{
        background: #FED800;
      }
    }
    .weight-date,.business-ent-num,.content-center-item,.el-card__body{
      .link-point::after{
        background: #0EFCFF;
      }
    }
    .map-center-content{
      position: absolute;
      width: 40%;
      left: 30%;
      bottom: 10px;
      .content-center{
        position: relative;
        display: flex;
        width: 100%;
        height: 80px;
        .weight-title{
          position: absolute;
          top: -46px;
          text-align: left;
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          padding: 0 20px;
          border-left: 3px solid #54FEDF;
        }
        .icon-arrow{
          position: absolute;
          color: rgb(58, 253, 255);
          font-size: 60px;
          cursor: pointer;
        }
        .icon-arrow-left{
          left: -60px;
        }
        .icon-arrow-right{
          right: -60px;
        }
        .content-center-list{
          position: relative;
          width: 100%;
          cursor: pointer;
          height: 80px;
          white-space:nowrap;
          overflow: hidden;
          -webkit-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          user-select:none;
          .content-center-truth-length{
            position: absolute;
            -webkit-transition: all .7s ease;
            -moz-transition: all .7s ease;
            -ms-transition: all .7s ease;
            -o-transition: all .7s ease;
            transition: all .7s ease;
            display: inline-block;
            left: 0;
          }
          .content-center-item{
            display: inline-block;
            height: 70px;
            padding: 0 5px;
            width: 110px;
            .content-center-item-border{
              display: flex;
              height: 100%;
              align-items: center;
              flex-direction: column;
              justify-content: space-evenly;
              background: rgba(0, 45, 65, .53);
              border: 1px solid rgb(9, 95, 103);
              .center-item-value{
                font-size: 20px;
                color: #fff;
                .center-item-unit{
                  font-size: 14px;
                }
              }
              .center-item-name{
                font-size: 14px;
                color: #4dffe8;
              }
            }
          }
        }
      }
    }
    .search-item{
      position: absolute;
      top: 80px;
      left: 40px;
      width: 30%;
      input{
        background: rgba(1,49,60,.85);
        border-color: rgba(1,49,60,.85);
        color: #b8d6d4;
      }
      .el-input-group__prepend,.el-input-group__append{
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        background: rgba(1,49,60,.85);
        border-color: rgba(1,49,60,.85);
        color: #fff;
        cursor: pointer;
      }
      input::-webkit-input-placeholder {
        color: #b8d6d4;
      }
      input::-moz-placeholder {
        color: #b8d6d4;
      }
      input::-moz-placeholder {
        color: #b8d6d4;
      }
      input::-ms-input-placeholder {
        color: #b8d6d4;
      }
      .input:-moz-placeholder {
        color: #b8d6d4;
      }
      .input:-ms-input-placeholder {
        color: #b8d6d4;
      }
    }
    .search-item-right{
      left: auto;
      right: 40px;
      width: auto;
      cursor: pointer;
      .search-item-text{
        padding: 8px 20px;
        background: rgba(1,49,60,.85);
        border-color: rgba(1,49,60,.85);
        color: #fff;
      }
    }
    #mapContent {
      border: none;
      height: 100%;
      width: 100%;
      margin: 0px;
      padding: 0px
    }
    .anchorBL {
      display: none;
    }
    .link-point{
      cursor: pointer;
      position: relative;
    }
    .link-point::after{
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #fff;
      transition: .3s;
    }
    .link-point .num{
      color: #FED800;
    }
    .num-item{
      .link-point::after{
        background: #FED800;
      }
    }
    .link-point .num-unit{
      color: #fff;
    }
    .link-point:hover{
      opacity: .8;
    }
    /*.link-point:hover::after{*/
    /*width: 100%;*/
    /*}*/
    .no-data{
      color: #909399;
      align-self: center;
    }
    .el-tooltip{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    [v-cloak] {
      display: none;
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      display: none;
    }
    .el-table__body{
      width: 100% !important;
    }
    .text-center {
      text-align: center;
    }
    .is-dark{
      background: rgba(51,51,51,.75) !important;
    }
    .text-red{
      color: #FF7B7B;
    }
    .text-green{
      color: #61FFA4;
    }
    .header {
      padding: 0 20px;
      width: 100%;
      position: absolute;
      top: 0;
      .charts-title {
        height: 84px;
        width: 100%;
        /*padding: 0 20px;*/
        text-align: center;
        font-weight: bold;
        color: rgba(14, 252, 255, 1);
        font-size: 32px;
        line-height: 84px;
        background: url("../../assets/img/map/map_title.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .content-left {
      left: 0;
    }

    .content-right {
      right: 0;
    }
    .charts-common {
      position: absolute;
      top: 40px;
      width: 21%;
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
      background: rgba(4, 44, 55, 0.8);
      /*overflow: scroll;*/
      overflow: hidden;
      .full-content {
        white-space: nowrap;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .weighing-dynamics {
        &.list-style{
          flex-grow: 1;
        }
        display: flex;
        flex-direction: column;
        color: #fff;
        padding-bottom: 10px;
        /*flex-grow: 1;*/
        .weight-title {
          text-align: left;
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          padding: 0 20px;
          margin: 20px 20px;
          border-left: 3px solid #54FEDF;
        }
        .weight-date {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #0EFCFF;
          padding: 7px 20px 20px 20px;
          .date-num {
            font-size: 30px;
            font-weight: 400;
          }
          .date-type {
            font-size: 14px;
            color: #fff;
            margin-top: 10px;
          }
        }
        .weight-content-bg {
          background: linear-gradient(0deg, rgba(0, 255, 238, 0), rgba(0, 255, 238, .2));
          /*height: 35.75vh;*/
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          .weight-content {
            display: flex;
            font-size: 14px;
            color: #CAEFEC;
            padding: 0 27px;
            cursor: pointer;
            border-bottom: 1px solid rgba(84, 254, 223, 0.3);
            flex-grow: 1;
            justify-content: space-between;
            &:hover {
              color: #fff;
            }
            .item-title {
              display: flex;
              align-items: center;
              .item-title-num {
                font-size: 22px;
                color: #FED800;
              }
            }
            .item-body {
              display: flex;
              flex-direction: column;
              overflow: hidden;
              justify-content: space-evenly;
              width: 70%;
              .item-body-text {
                font-size: 16px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .item-body-foot {
                display: flex;
                justify-content: space-between;
                .foot-time,.foot-code{
                  width: 50%;
                }
              }
            }
          }
        }
        .num-item {
          font-size: 14px;
          .num {
            font-size: 22px;
          }
          .orange-num {
            color: #FEB900;
          }
          .blue-num {
            /*color: #00FFC6;*/
          }
        }
        .ysd-body{
          display: flex;
          padding: 0 5px 0 35px;
          .ysd-num {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          .total-transfer {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &.business-ent-num{
            flex-direction: column;
            .total-num{
              color: #0EFCFF;
              font-size: 22px;
              text-align: center;
            }
          }
        }
        .data-bottom {
          display: flex;
          padding: 15px 35px;
          .btm-margin {
            margin-left: 60px;
          }
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
      .theme-blue{
        .text-default {
          color: #44D7FD;
        }
      }
    }
    .turn-left {
      position: absolute;
      left: calc(21% + 10px);
      top: 40px;
      background: rgba(4, 44, 55, .8);
      color: #0EFCFF;
      border-radius: 3px;
      .el-button {
        background: rgba(166, 209, 216, 0.2);
        border: none;
        color: #0EF5F8;
        padding: 5px 5px;
        font-size: 37px;
        &:hover {
          background: rgba(166, 209, 216, 0.3);
          color: #fff;
        }
      }
    }
    .turn-right {
      right: calc(21% + 10px);
      left: auto;
    }
    /*左侧content向左动画*/
    .turn-left-enter-active, .turn-left-leave-active, .turn-right-enter-active, .turn-right-leave-active {
      transition: all .5s;
      width: 21%;
    }

    .turn-left-enter, .turn-left-leave-to, .turn-right-enter, .turn-right-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
    {
      /*transform: translateX(10px);*/
      width: 0;
      opacity: 0;
    }

    /*按钮跟随内容渐隐*/
    .turn-opacity-left-enter-active, .turn-opacity-left-leave-active {
      transition: all .5s;
    }

    .turn-opacity-left-enter, .turn-opacity-left-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
    {
      /*transform: translateX(10px);*/
      width: 0;
      left: 0;
      opacity: 0;
    }

    /*按钮跟随内容渐隐*/
    .turn-opacity-left-btn-enter-active, .turn-opacity-left-btn-leave-active {
      transition: all .5s;
    }

    .turn-opacity-left-btn-enter, .turn-opacity-left-btn-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
    {
      /*transform: translateX(10px);*/
      width: 0;
      left: 0;
      opacity: 0;
    }
    /*按钮跟随内容渐隐*/
    .turn-opacity-right-btn-enter-active, .turn-opacity-right-btn-leave-active {
      transition: all .5s;
    }

    .turn-opacity-right-btn-enter, .turn-opacity-right-btn-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
    {
      /*transform: translateX(10px);*/
      width: 0;
      right: 0;
      opacity: 0;
    }

    /*按钮跟随右侧内容渐隐*/
    .turn-opacity-right-enter-active, .turn-opacity-right-leave-active {
      transition: all .5s;
    }

    .turn-opacity-right-enter, .turn-opacity-right-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
    {
      /*transform: translateX(10px);*/
      width: 0;
      right: 0;
      opacity: 0;
    }
    .park-dynamics {
      position: absolute;
      left: 0;
      top: 88px;
      padding: 14px 17px;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      width: 53px;
      background: rgba(4, 44, 55, 0.35);
      cursor: pointer;
    }
    .park-right {
      left: auto;
      right: 0;
    }
    .el-button.is-circle {
      margin-top: 10px;
      padding: 0;
      min-height: auto;
      color: #042C37;
    }
    .text-default {
      color: #FEE982;
    }
    /*右侧content*/
    .business-ent-num{
      #numberOfEnterprises {
        height: 159px;
      }
    }
    .example-icons {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      bottom: 10px;
      right: calc(21% + 10px);
      font-size: 14px;
      color: #fff;
      height: 103px;
      width: 294px;
      background: rgba(4, 44, 55, 0.42);
      -webkit-transition: all .5s;
      -moz-transition: all .5s;
      -ms-transition: all .5s;
      -o-transition: all .5s;
      transition: all .5s;
      .icons-items {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .business-icon {
          height: 32px;
          width: 23px;
          margin-right: 20px;
        }
        .online-type-icon {
          height: 27px;
          width: 27px;
          margin-right: 20px;
        }
      }
    }
    .transition-move {
      right: 10px;
    }
    .info-window-bg {
      background: url("../../assets/img/map/info-window-bg.png");
      width: 859px;
      height: 689px;
    }
    .info-window {
      position: absolute;
      left: 59px;
      bottom: 12px;
      background: url("../../assets/img/map/info-window-bg.png") no-repeat center center;
      width: 859px;
      height: 689px;
      padding: 50px 45px 10px 50px;
      z-index: 2;
      &.bus-data{
        left: calc(50% - 429px);
        top: calc(50% - 344px);
        padding: 50px 16px 10px 16px;
        .info-title{
          padding-left: 29px;
        }
        .bus-form{
          .bus-form-inline{
            text-align: center;
            .el-input__inner{
              color: #fff;
              background-color: rgba(2,92,116,.41);
              width: 410px;
              border: 1px solid rgba(24,169,171,.41);
            }
            .el-button{
              background:rgba(1,124,142,.7);
              border:1px solid rgba(6,201,203,.7);
              &:hover{
                background:rgba(1,124,142,1);
                border:1px solid rgba(6,201,203,1);
              }
            }
          }
          .content-cards{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 28px;
            flex-grow: 1;
            .content-card-title{
              font-size:17px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(14,252,255,1);
            }
            .content-card-body{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              color: #fff;
              font-size: 14px;
              .iconfont{
                margin-right: 5px;
              }
            }
            .el-card{
              border: 1px solid #003F4F;
              background-color: #003F4F;
              color: #fff;
              -webkit-border-radius: 0;
              -moz-border-radius: 0;
              border-radius: 0;
              .el-card__body{
                height: 135px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                font-size: 13px;
                line-height: 22px;
              }
            }
            .el-row{
              margin-bottom: 13px;
            }
          }
          .enterprise-pagination{
            text-align: center;
            button{
              height: auto;
              color: #fff !important;
              background: transparent !important;
              .el-icon{
                font-size: 29px !important;
                line-height: 29px;
              }
            }
          }
        }
      }
      .info-title {
        position: absolute;
        top: -10px;
        color: #00E4FF;
        font-weight: 400;
        /*line-height:95px;*/
        font-size: 22px;
      }
      .info-close-btn{
        &:hover{
          .el-button{
            border-color: rgba(0,228,255,.7);
            color: rgba(0,228,255,.7);
          }
        }
        .el-button{
          position: absolute;
          top: -5px;
          right: -2px;
          font-size: 22px;
          color: #00E4FF;
          background: transparent;
          border-color: #00E4FF;
        }
      }
      .info-header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(103, 170, 153, .17);
        /*opacity:0.17;*/
        padding-bottom: 25px;
        .info-header-item {
          text-align: left;
          font-size: 14px;
          color: #CAEFEC;
          .item-text-blue {
            color: #46D7AD;
            margin-bottom: 15px;
            .item-num {
              font-size: 30px;
            }
          }
        }
      }
      .info-content{
        display: flex;
        .info-content-group{
          flex-grow: 1;
          margin-right: 40px;
          display: flex;
          flex-direction: column;
          &.clear-charts-right{
            margin-right: 0;
          }
          .info-content-title {
            font-size: 16px;
            font-weight: bold;
            padding: 19px 0;
            color: #fff;
          }
          .weight-record {
            background: linear-gradient(0deg, rgba(0, 255, 238, 0), rgba(0, 255, 238, .32));
            min-width: 292.59px;
            flex-grow: 1;
            justify-content: center;
            display: flex;
            flex-direction: column;
          }
          .info-content-body {
            width: 400px;
          }
          .warehouse-inventory-list{
            width: 292.59px;
          }
          .info-content-body{
            .waste-list-view {
              height: 180px;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          .weight-record-item {
            display: flex;
            justify-content: space-around;
            padding: 16px;
            color: #fff;
            .record-item-num {
              font-size: 16px;
              color: #53FFCC;
              .record-item-unit {
                font-size: 12px;
              }
            }
            .record-item-code {
              font-size: 14px;
            }
            .record-item-time {
              font-size: 12px;
            }
          }
        }
      }
    }
    .full-window{
      position: fixed;
      top: 0;
      left: 0;
      border: none;
      height: 100vh;
      width: 100vw;
      margin: 0px;
      padding: 0px;
      display: flex;
      flex-direction: column;
      background: url("../../assets/img/map/company-bg-img.jpg") no-repeat !important;
      -webkit-background-size: cover;
      background-size: cover;
      z-index: 1;
      .full-header {
        width: 100%;
        .full-charts-title{
          height: 84px;
          background: url("../../assets/img/map/company-title.png") no-repeat;
          -webkit-background-size: cover;
          background-size: cover;
          font-weight: bold;
          color: rgba(14, 252, 255, 1);
          font-size: 32px;
          line-height: 84px;
          padding-left: 109px;
        }
      }
      .company-body{
        display: flex;
        padding: 23px;
        .company-body-right{
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 38.89vh;
          .body-charts{
            display: flex;
            flex-grow: 1;
            margin-top: 25px;
            .waste-receive{
              display: flex;
              flex-direction: column;
              padding: 26px 31px 0;
              margin-right: 20px;
              width: 45.8%;
            }
            .waste-production{
              display: flex;
              flex-direction: column;
              padding: 26px 31px 0;
              flex-grow: 1;
            }
          }
        }
        .yes-survey{
          display: flex;
          flex-direction: column;
          position: relative;
          height: 38.89vh;
          width: 22.14%;
          border:1px solid rgba(92, 255, 214, 0.17);
          margin-right: 20px;
          padding: 34px 28px 0;
          .yes-survey-content{
            padding: 20px 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }
      .block-bg{
        position: relative;
        background:rgba(10,43,51,.63);
      }
      .waste-content{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 25px 20px;
        .el-progress{
          width: 50%;
        }
      }
      .list-content{
        .waste-content{
          padding-bottom: 0;
        }
      }
      .waste-production{
        .waste-content{
          flex-grow: 1;
          display: flex;
        }
      }
      #wasteProduction{
        flex-grow: 1;
      }
      .waste-content-item{
        display: flex;
        justify-content: space-between;
      }
      .border-style{
        position: absolute;
      }
      .border-top{
        border-right: 1px solid #40C3AB;
        border-left: 1px solid #40C3AB;
        height: 8px;
        width: 100%;
        top: 0;
        left: 0;
      }
      .border-right{
        border-top: 1px solid #40C3AB;
        border-bottom: 1px solid #40C3AB;
        width: 8px;
        height: 100%;
        top: 0;
        right: 0;
      }
      .border-bottom{
        border-left: 1px solid #40C3AB;
        border-right: 1px solid #40C3AB;
        height: 8px;
        width: 100%;
        bottom: 0;
        left: 0;
      }
      .border-left{
        border-top: 1px solid #40C3AB;
        border-bottom: 1px solid #40C3AB;
        width: 8px;
        height: 100%;
        top: 0;
        left: 0;
      }
      .company-body-right{
        .right-title{
          display: flex;
          justify-content: space-between;
          padding-right: 28px;
          .title-item{
            display: flex;
            img{
              height: 86px;
              width: 83px;
              margin-right: 27px;
            }
            .title-item-text{
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              color: #0EFCFF;
            }
          }
        }
      }
      .survey-content-item{
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
      }
      .survey-size{
        font-size: 30px;
      }
      .num-size{
        font-size: 36px;
      }
      .unit-size{
        font-size: 12px;
      }
      .bottom-text-size{
        font-size: 20px;
      }
      /*字体颜色*/
      .num-bule{
        color: #0EFCFF;
      }
      .text-bule{
        color: #E0FFF7;
      }
      .text-light-blue{
        color: #C7F5E9;
      }
      .waste-code-font{
        color: #F8F8F8;
        font-size: 20px;
        font-family:MicrosoftYaHei;
      }
      .waste-value-font{
        color: #0EFCFF;
        font-size: 20px;
        font-family:MicrosoftYaHei;
        width: 10%;
      }
      /*块标题*/
      .yes-survey-title{
        font-size:26px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        padding-left: 20px;
        border-left: 4px solid #58FBDD;
        color: #fff;
      }
      .yes-survey-title{
        .title-sub-text{
          color: #FEE982;
        }
        .title-blue{
          color: #44D7FD;
        }
      }
      .circle-index{
        text-align: center;
        height: 23px;
        width: 23px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        color: #FEFEFE;
      }
      .circle-bg-red{
        background: #EC2D27;
      }
      .circle-bg-light-red{
        background: #EB5A36;
      }
      .circle-bg-orange{
        background: #EA6E24;
      }
      .circle-visible{
        visibility: hidden;
      }
      /*底部content*/
      .company-footer{
        display: flex;
        padding: 0 23px 23px 23px;
        flex-grow: 1;
        .company-footer-content{
          display: flex;
          flex-grow: 1;
        }
      }
      /*仓库库存一览*/
      .warehouse-inventory-list{
        display: flex;
        flex-direction: column;
        padding: 40px 0 35px 0;
        width: 24.17%;
        border-right: 1px solid rgba(1,92,116,.23);
      }
      .waste-warehouse-num{
        width: 34.9%;
      }
      .list-icon-item{
        display: flex;
        padding: 0 0 24px 30px;
        border-bottom: 1px solid rgba(14,71,83,.46);;
      }
      .list-icon-item .title-item-text{
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .list-content{
        padding: 30px 30px 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      .list-content-chart{
        flex-grow: 1;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .waste-type{
        flex-grow: 1;
      }
      .cancel-btn{
        display: flex;
        align-items: center;
        float: right;
        margin-right: 26px;
        line-height: 50px;
        cursor: pointer;
      }
      .cancel-btn img{
        height: 20px;
        width: 20px;
      }
      .cancel-btn{
        .cancel-btn-text{
          margin-left: 20px;
          font-size:20px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(154,255,230,1);
        }
      }
    }
    .map-index{
      z-index: 1 !important;
    }
    .enterprise-bus-data{
      height: 591px;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
    }
  }
</style>
