<template>
  <div class="charts-common content-right">
    <div class="full-content">
      <div class="weighing-dynamics list-style">
        <div class="weight-title">企业数量</div>
        <div class="ysd-body business-ent-num">
          <div class="total-num">
            <span class="link-point" @click="getCompany({functionType:'enterprise', busTitle:'企业信息', busPlaceholder:'请输入企业名称', hideSearchForm:true})">企业总数：{{businessEntNum | formatNum}}个</span>
          </div>
          <div class="total-transfer number-enterprises" id="numberOfEnterprises">
            <div class="no-data">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="weighing-dynamics theme-orange list-style">
        <div class="weight-title">危废类型贮存量&nbsp;<span class="text-default link-point" @click="getCompany({functionType:'prod_inventory_by_waste_code', busTitle:'危废类型贮存量', busPlaceholder:'请输入八位码'})">TOP5</span></div>
        <div class="storage-progress">
          <div class="storage-progress-item" v-for="item in listInventoryWasteStatisticsByWasteCode" :key="item.wasteCode">
            <div class="progress-data">
              <div v-cloak>{{item.wasteCode}}</div>
              <div class="storage-num link-point" v-cloak @click="getCompany({functionType:'prod_inventory_by_waste_code_detail', busTitle:item.wasteCode, hideSearchForm: true, queryKey: item.wasteCode})"><span class="num" v-cloak>{{item.weight | formatNum}}</span><span class="num-unit">吨</span></div>
            </div>
            <el-progress :percentage="item.percent" :stroke-width="8" :show-text="false"
                         :color="progressYellow"></el-progress>
          </div>
        </div>
      </div>
      <div class="weighing-dynamics theme-blue list-style">
        <div class="weight-title">企业危废类型贮存量&nbsp;<span class="text-default link-point" @click="getCompany({functionType:'prod_inventory_by_ent', busTitle:'企业危废类型贮存量', busPlaceholder:'请输入企业名称'})">TOP5</span></div>
        <div class="storage-progress">
          <div class="storage-progress-item" v-for="item in listInventoryWasteStatisticsByEnt" :key="item.entName">
            <div class="progress-data">
              <el-tooltip :content="item.entName" placement="top" :enterable="false">
                <div class="progress-data-name" v-cloak>{{item.entName}}</div>
              </el-tooltip>
              <el-tooltip :content="item.weight+'吨'" placement="top" :enterable="false">
                <div class="storage-num link-point" v-cloak @click="getCompany({functionType:'prod_inventory_by_ent_detail', busTitle:item.entName, hideSearchForm: true, queryKey: item.entName})"><span class="num" v-cloak>{{item.weight | formatNum}}</span><span class="num-unit">吨</span></div>
              </el-tooltip>
            </div>
            <el-progress :percentage="item.percent*100" :stroke-width="8" :show-text="false"
                         :color="progressBlue"></el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { entWeighbridgeStatistics, listInventoryWasteStatisticsByWasteCode, listInventoryWasteStatisticsByEnt } from '@/assets/js/API/api'
import { formatDate } from '@/assets/js/date.js'
export default {
  name: 'mapLeftContent',
  data () {
    return {
      // 园区总数
      numberOfEnterprisesChart: '',
      businessEntNum: '',
      // 危废贮存量
      // listInventoryWasteStatisticsByWasteCode: [],
      listInventoryWasteStatisticsByWasteCode: [],

      progressYellow: '#FEE982',
      progressBlue: '#44D7FD',
      // 企业危废贮存量
      listInventoryWasteStatisticsByEnt: []
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'MM-dd hh:mm')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  mounted () {
    let _this = this
    setTimeout(function () {
      // 企业数量
      _this.getNumberOfEnterprises()
      // 危废贮存量
      _this.getListInventoryWasteStatisticsByWasteCode()
      // 企业危废贮存量
      _this.getListInventoryWasteStatisticsByEnt()
    }, 300)
  },
  methods: {
    getNumberOfEnterprises: function () {
      let _this = this
      entWeighbridgeStatistics()
        .then(res => {
          if (_this.numberOfEnterprisesChart != null && _this.numberOfEnterprisesChart !== '' && _this.numberOfEnterprisesChart !== undefined) {
            _this.numberOfEnterprisesChart.dispose()
          }
          var chartData = res.data
          _this.businessEntNum = chartData.entNum
          // 园区企业数量图表
          var numberOfEnterprises = {
            chartsData: {
              option: {
                title: {
                  text: '企业总数',
                  x: 'center',
                  left: '30',
                  bottom: '0',
                  textStyle: {
                    color: '#fff',
                    fontSize: '14px'
                  }
                  // textAlign: 'center'
                },
                tooltip: {
                  show: true,
                  trigger: 'item',
                  formatter: '{b}个'
                },
                legend: {
                  show: true,
                  // selectedMode:false,
                  right: 'right',
                  top: 'middle',
                  padding: [0, 0, 0, 0],
                  itemWidth: 13,
                  itemHeight: 13,
                  itemGap: 25,
                  orient: 'vertical',
                  // x: 'right',
                  data: ['称重在线     ' + chartData.onlineNum, '称重离线     ' + chartData.offlineNum, '未使用称重     ' + chartData.unusedWeighbridgeNum],
                  textStyle: {
                    color: '#fff'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '30%',
                  containLabel: true
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '40%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    color: ['#FED800', '#F56C6C', '#909399'],
                    label: {
                      /* normal: {
                          show: true,
                          position: 'center',
                          formatter: function () {
                              return chartData.entNum+'个'
                          }
                          // formatter: "{c}个"
                      } */
                      normal: {
                        show: false,
                        position: 'center',
                        formatter: function (argument) {
                          var arguItems = argument.name.split('     ')
                          arguItems[1] += '个'
                          var html = arguItems.join('\n')
                          return html
                        },
                        textStyle: {
                          fontSize: 15,
                          color: '#fff'
                        }
                      },
                      emphasis: {
                        show: true,
                        textStyle: {}
                      }
                      // emphasis: {
                      //     show: true,
                      //     textStyle: {
                      //         fontSize: '20',
                      //         fontWeight: 'bold'
                      //     }
                      // }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: [
                      { value: chartData.onlineNum, name: '称重在线     ' + chartData.onlineNum },
                      { value: chartData.offlineNum, name: '称重离线     ' + chartData.offlineNum },
                      { value: chartData.unusedWeighbridgeNum, name: '未使用称重     ' + chartData.unusedWeighbridgeNum }
                    ]
                  }
                ]
              }
            }
          }
          _this.numberOfEnterprisesChart = this.$echarts.init(document.getElementById('numberOfEnterprises'))
          _this.numberOfEnterprisesChart.setOption(numberOfEnterprises.chartsData.option)
          _this.numberOfEnterprisesChart.on('legendselectchanged', function (params) {
            // params.selected[params.name] = falsevar
            var triggerAction = function (action, selected) {
              let legend = []
              for (let name in selected) {
                if (selected.hasOwnProperty(name)) {
                  legend.push({ name: name })
                }
              }
              _this.numberOfEnterprisesChart.dispatchAction({
                type: action,
                batch: legend
              })
            }
            if (params.selected[params.name] === false) {
              triggerAction('legendSelect', params.selected)
            }
            // _this.$emit
            // _this.map.clearOverlays()
            if (params.name.split('     ')[0] === '未使用称重') {
              // all、offline、online、notHasWeigh
              // _this.getCompanyPosition('notHasWeigh')
              _this.$emit('getCompanyPosition', 'notHasWeigh')
            } else if (params.name.split('     ')[0] === '称重在线') {
              // all、offline、online、notHasWeigh
              _this.$emit('getCompanyPosition', 'online')
            } else if (params.name.split('     ')[0] === '称重离线') {
              // all、offline、online、notHasWeigh
              _this.$emit('getCompanyPosition', 'offline')
            }
          })
        }).catch(() => {
        })
      // $.ajax({
      //   url: $.pageCustomer.serviceSiteRootUrl + 'EntWasteMapInfo/entWeighbridgeStatistics.do?ticket=' + $.page.ticket,
      //   dataType: 'json',
      //   type: 'get',
      //   // data: {id: id},
      //   success: function (resultData) {
      //     // mini.hideMessageBox(messageid);
      //     if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
      //       if (_this.numberOfEnterprisesChart != null && _this.numberOfEnterprisesChart != '' && _this.numberOfEnterprisesChart != undefined) {
      //         _this.numberOfEnterprisesChart.dispose()
      //       }
      //       var chartData = resultData.data
      //       _this.businessEntNum = chartData.entNum
      //       // 园区企业数量图表
      //       var numberOfEnterprises = {
      //         chartsData: {
      //           option: {
      //             title: {
      //               text: '园区企业总数',
      //               x: 'center',
      //               left: '30',
      //               bottom: '0',
      //               textStyle: {
      //                 color: '#fff',
      //                 fontSize: '14px'
      //               }
      //               // textAlign: 'center'
      //             },
      //             tooltip: {
      //               show: true,
      //               trigger: 'item',
      //               formatter: '{b}个'
      //             },
      //             legend: {
      //               show: true,
      //               // selectedMode:false,
      //               right: 'right',
      //               top: 'middle',
      //               padding: [0, 0, 0, 0],
      //               itemWidth: 13,
      //               itemHeight: 13,
      //               itemGap: 25,
      //               orient: 'vertical',
      //               // x: 'right',
      //               data: ['称重在线     ' + chartData.onlineNum, '称重离线     ' + chartData.offlineNum, '未使用称重     ' + chartData.unusedWeighbridgeNum],
      //               textStyle: {
      //                 color: '#fff'
      //               }
      //             },
      //             grid: {
      //               left: '3%',
      //               right: '4%',
      //               bottom: '30%',
      //               containLabel: true
      //             },
      //             series: [
      //               {
      //                 name: '访问来源',
      //                 type: 'pie',
      //                 center: ['30%', '40%'],
      //                 radius: ['50%', '70%'],
      //                 avoidLabelOverlap: false,
      //                 color: ['#FED800', '#F56C6C', '#909399'],
      //                 label: {
      //                   /* normal: {
      //                       show: true,
      //                       position: 'center',
      //                       formatter: function () {
      //                           return chartData.entNum+'个'
      //                       }
      //                       // formatter: "{c}个"
      //                   } */
      //                   normal: {
      //                     show: false,
      //                     position: 'center',
      //                     formatter: function (argument) {
      //                       var arguItems = argument.name.split('     ')
      //                       arguItems[1] += '个'
      //                       var html = arguItems.join('\n')
      //                       return html
      //                     },
      //                     textStyle: {
      //                       fontSize: 15,
      //                       color: '#fff'
      //                     }
      //                   },
      //                   emphasis: {
      //                     show: true,
      //                     textStyle: {}
      //                   }
      //                   // emphasis: {
      //                   //     show: true,
      //                   //     textStyle: {
      //                   //         fontSize: '20',
      //                   //         fontWeight: 'bold'
      //                   //     }
      //                   // }
      //                 },
      //                 labelLine: {
      //                   normal: {
      //                     show: false
      //                   }
      //                 },
      //                 data: [
      //                   { value: chartData.onlineNum, name: '称重在线     ' + chartData.onlineNum },
      //                   { value: chartData.offlineNum, name: '称重离线     ' + chartData.offlineNum },
      //                   { value: chartData.unusedWeighbridgeNum, name: '未使用称重     ' + chartData.unusedWeighbridgeNum }
      //                 ]
      //               }
      //             ]
      //           }
      //         }
      //       }
      //       _this.numberOfEnterprisesChart = echarts.init(document.getElementById('numberOfEnterprises'))
      //       _this.numberOfEnterprisesChart.setOption(numberOfEnterprises.chartsData.option)
      //       _this.numberOfEnterprisesChart.on('legendselectchanged', function (params) {
      //         // params.selected[params.name] = falsevar
      //         var triggerAction = function (action, selected) {
      //           legend = []
      //           for (name in selected) {
      //             if (selected.hasOwnProperty(name)) {
      //               legend.push({ name: name })
      //             }
      //           }
      //           _this.numberOfEnterprisesChart.dispatchAction({
      //             type: action,
      //             batch: legend
      //           })
      //         }
      //         if (params.selected[params.name] === false) {
      //           triggerAction('legendSelect', params.selected)
      //         }
      //         _this.map.clearOverlays()
      //         if (params.name.split('     ')[0] === '未使用称重') {
      //           // all、offline、online、notHasWeigh
      //           _this.getCompanyPosition('notHasWeigh')
      //         } else if (params.name.split('     ')[0] === '称重在线') {
      //           // all、offline、online、notHasWeigh
      //           _this.getCompanyPosition('online')
      //         } else if (params.name.split('     ')[0] === '称重离线') {
      //           // all、offline、online、notHasWeigh
      //           _this.getCompanyPosition('offline')
      //         }
      //       })
      //     } else {
      //       if (resultData.status == -4) {
      //         _this.$message({
      //           // showClose: true,
      //           message: resultData.infoList[0],
      //           type: 'error'
      //         })
      //       } else {
      //         _this.$message({
      //           // showClose: true,
      //           message: '系统异常, 请联系管理员',
      //           type: 'error'
      //         })
      //       }
      //     }
      //   }
      // })
    },
    getListInventoryWasteStatisticsByWasteCode: function () {
      let _this = this
      listInventoryWasteStatisticsByWasteCode()
        .then(res => {
          _this.listInventoryWasteStatisticsByWasteCode = res.data
          var totalWeight
          if (_this.listInventoryWasteStatisticsByWasteCode) {
            _this.listInventoryWasteStatisticsByWasteCode.forEach(function (val, index) {
              val.weight = val.weight.toFixed(2)
              if (index === 0) {
                totalWeight = val.weight / 0.8
              }
              val.percent = (val.weight / totalWeight).toFixed(2) * 100
            })
          }
        }).catch(() => {
        })
      // $.ajax({
      //   url: $.pageCustomer.serviceSiteRootUrl + 'EntWasteMapInfo/listInventoryWasteStatisticsByWasteCode.do?ticket=' + $.page.ticket,
      //   dataType: 'json',
      //   type: 'get',
      //   // data: {id: id},
      //   success: function (resultData) {
      //     if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
      //       _this.listInventoryWasteStatisticsByWasteCode = resultData.data
      //       var totalWeight
      //       if (_this.listInventoryWasteStatisticsByWasteCode) {
      //         _this.listInventoryWasteStatisticsByWasteCode.forEach(function (val, index) {
      //           val.weight = val.weight.toFixed(2)
      //           if (index === 0) {
      //             totalWeight = val.weight / 0.8
      //           }
      //           val.percent = (val.weight / totalWeight).toFixed(2) * 100
      //         })
      //       }
      //     } else {
      //       if (resultData.status == -4) {
      //         _this.$message({
      //           // showClose: true,
      //           message: resultData.infoList[0],
      //           type: 'error'
      //         })
      //       } else {
      //         _this.$message({
      //           // showClose: true,
      //           message: '系统异常, 请联系管理员',
      //           type: 'error'
      //         })
      //       }
      //     }
      //   }
      // })
    },
    getListInventoryWasteStatisticsByEnt: function () {
      let _this = this
      listInventoryWasteStatisticsByEnt()
        .then(res => {
          var listInventoryWasteStatisticsByEnt = res.data
          var totalWeight
          if (listInventoryWasteStatisticsByEnt) {
            listInventoryWasteStatisticsByEnt.forEach(function (val, index) {
              val.weight = val.weight.toFixed(2)
              if (index === 0) {
                totalWeight = val.weight / 0.8
              }
              var percent = (val.weight / totalWeight).toFixed(2)
              val.percent = percent
              // 屏蔽name
              // val.entName = '*************************************'
            })
          }
          _this.listInventoryWasteStatisticsByEnt = listInventoryWasteStatisticsByEnt
        }).catch(() => {
        })
      // $.ajax({
      //   url: $.pageCustomer.serviceSiteRootUrl + 'EntWasteMapInfo/listInventoryWasteStatisticsByEnt.do?ticket=' + $.page.ticket,
      //   dataType: 'json',
      //   type: 'get',
      //   // data: {id: id},
      //   success: function (resultData) {
      //     if (resultData.status == fw.fwData.FWResultStatus.Success && resultData.data != null) {
      //       var listInventoryWasteStatisticsByEnt = resultData.data
      //       var totalWeight
      //       if (listInventoryWasteStatisticsByEnt) {
      //         listInventoryWasteStatisticsByEnt.forEach(function (val, index) {
      //           val.weight = val.weight.toFixed(2)
      //           if (index === 0) {
      //             totalWeight = val.weight / 0.8
      //           }
      //           var percent = (val.weight / totalWeight).toFixed(2)
      //           val.percent = percent
      //         })
      //       }
      //       _this.listInventoryWasteStatisticsByEnt = listInventoryWasteStatisticsByEnt
      //     } else {
      //       if (resultData.status == -4) {
      //         _this.$message({
      //           // showClose: true,
      //           message: resultData.infoList[0],
      //           type: 'error'
      //         })
      //       } else {
      //         _this.$message({
      //           // showClose: true,
      //           message: '系统异常, 请联系管理员',
      //           type: 'error'
      //         })
      //       }
      //     }
      //   }
      // })
    },
    getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey }) {
      this.$emit('companyData', { functionType, busTitle, busPlaceholder, hideSearchForm, queryKey })
      // _this.getCompany({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, id })
    }
  }
}
</script>

<style lang="scss">
  .park-overview {
    /*.el-progress-bar {*/
      /*.el-progress-bar__outer {*/
        /*background: transparent;*/
        /*border-radius: 4px;*/
      /*}*/

      /*.el-progress-bar__inner {*/
        /*border-radius: 4px;*/
      /*}*/
    /*}*/

    .el-progress-bar .el-progress-bar__outer{
      background: rgba(56,214,255,0.14);
    }
    .storage-progress {
      padding: 0 0 0 40px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(184, 214, 212, 1);
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: space-around;
      .storage-num {
        cursor: pointer;
        font-size: 18px;
        color: #fff;
        .num-unit {
          font-size: 12px;
        }
      }
      .storage-progress-item {
        padding: 0 50px 0 10px;
        .progress-data {
          display: flex;
          justify-content: space-between;
          .progress-data-name{
            cursor: pointer;
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
