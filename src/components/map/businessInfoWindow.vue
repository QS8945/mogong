<template>
  <div>
    <div class="info-window full-window">
      <div class="full-header">
        <div class="full-charts-title">
          <span>{{busName}}</span>
          <div class="cancel-btn" @click="cancelFullWindow">
            <img src="../../assets/img/map/icon-cancel.png"><span class="cancel-btn-text">退出</span>
          </div>
        </div>
      </div>
      <div class="company-body">
        <div class="yes-survey block-bg">
          <div class="border-style border-top"></div>
          <div class="border-style border-right"></div>
          <div class="border-style border-bottom"></div>
          <div class="border-style border-left"></div>
          <div class="yes-survey-title">昨日概况</div>
          <div class="yes-survey-content text-light-blue">
            <div class="survey-content-item">
              <el-tooltip content="昨日派车次数" placement="top" :enterable="false">
                <div class="bottom-text-size">昨日派车次数<span class="unit-size">（次）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule" v-cloak>{{totalDispEntInfoStatistics.lastDayDispatchNum | formatNum}}
              </div>
            </div>
            <div class="survey-content-item">
              <el-tooltip content="昨日接收量" placement="top" :enterable="false">
                <div class="bottom-text-size">昨日接收量<span class="unit-size">（吨）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule link-point" v-cloak
                   @click="getCompany({functionType:'last_day_receive_waste', busTitle:'经营单位接收量', busPlaceholder:'请输入企业名称或八位码'})">
                {{totalDispEntInfoStatistics.lastDayReceiveQty | formatNum}}
              </div>
            </div>
            <div class="survey-content-item">
              <el-tooltip content="昨日处置量" placement="top" :enterable="false">
                <div class="bottom-text-size">昨日处置量<span class="unit-size">（吨）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule link-point" v-cloak
                   @click="getCompany({functionType:'last_day_dispose_waste', busTitle:'经营单位处置量', hideSearchForm:true})">
                {{totalDispEntInfoStatistics.lastDayDisposeQty | formatNum}}
              </div>
            </div>
            <div class="survey-content-item">
              <el-tooltip content="昨日次生量" placement="top" :enterable="false">
                <div class="bottom-text-size">昨日次生量<span class="unit-size">（吨）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule" v-cloak>{{totalDispEntInfoStatistics.lastDaySecWasteQty | formatNum}}
              </div>
            </div>
            <div class="survey-content-item">
              <el-tooltip content="昨日次生率" placement="top" :enterable="false">
                <div class="bottom-text-size">昨日次生率<span class="unit-size">（%）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule" v-cloak>{{totalDispEntInfoStatistics.lastDaySecWasteRate | formatNum}}
              </div>
            </div>
            <div class="survey-content-item">
              <el-tooltip content="超一年贮存" placement="top" :enterable="false">
                <div class="bottom-text-size">超一年贮存<span class="unit-size">（吨）</span></div>
              </el-tooltip>
              <div class="survey-size num-bule link-point" v-cloak
                   @click="getCompany({functionType:'disp_over_one_year_inv_waste', busTitle:'经营单位贮存量', busPlaceholder:'请输入企业名称或八位码'})">
                {{totalDispEntInfoStatistics.overOneYearInventoryQty | formatNum}}
              </div>
            </div>
          </div>
        </div>
        <div class="company-body-right">
          <div class="right-title">
            <div class="title-item">
              <img src="../../assets/img/map/dispatching-frequency.png">
              <div class="title-item-text">
                <div class="num-size" v-cloak>{{totalDispEntInfoStatistics.dispatchNum | formatNum}}<span
                        class="unit-size">次</span></div>
                <div class="bottom-text-size text-bule">派车次数</div>
              </div>
            </div>
            <div class="title-item">
              <img src="../../assets/img/map/receive-num.png">
              <div class="title-item-text">
                <div class="num-size link-point" v-cloak
                     @click="getCompany({functionType:'receive_waste', busTitle:'接收量', busPlaceholder:'请输入企业名称或八位码'})">
                  {{totalDispEntInfoStatistics.receiveQty | formatNum}}<span class="unit-size">吨</span></div>
                <div class="bottom-text-size text-bule">接收量</div>
              </div>
            </div>
            <div class="title-item">
              <img src="../../assets/img/map/waste-num.png">
              <div class="title-item-text" v-cloak>
                <div class="num-size link-point" v-cloak
                     @click="getCompany({functionType:'dispose_waste', busTitle:'危废累积处置量', busPlaceholder:'请输入企业名称或八位码', hideSearchForm:true})">
                  {{totalDispEntInfoStatistics.disposeQty | formatNum}}<span class="unit-size">吨</span></div>
                <div class="bottom-text-size text-bule">危废累积处置量</div>
              </div>
            </div>
            <div class="title-item">
              <img src="../../assets/img/map/waste-total.png">
              <div class="title-item-text">
                <div class="num-size link-point" v-cloak
                     @click="getCompany({functionType:'sec_waste_produce', busTitle:'累积次生危废量', busPlaceholder:'请输入企业名称或八位码', hideSearchForm:true})">
                  {{totalDispEntInfoStatistics.secWasteQty | formatNum}}<span class="unit-size">吨</span></div>
                <div class="bottom-text-size text-bule">累积次生危废量</div>
              </div>
            </div>
          </div>
          <div class="body-charts">
            <div class="waste-receive block-bg">
              <div class="border-style border-top"></div>
              <div class="border-style border-right"></div>
              <div class="border-style border-bottom"></div>
              <div class="border-style border-left"></div>
              <div class="yes-survey-title">危废接收量<span class="title-sub-text link-point"
                                                       @click="getCompany({functionType:'receive_by_waste_code', busTitle:'危废接收量TOP5', busPlaceholder:'请输入八位码'})">&nbsp;TOP5</span>
              </div>
              <div class="waste-content">
                <div v-if="!listDispReceiveWasteStatistics.length" class="no-data">暂无数据</div>
                <div class="waste-content-item" v-for="(item,index) in listDispReceiveWasteStatistics" v-cloak>
                  <div class="circle-index"
                       :class="{'circle-bg-red': index===0,'circle-bg-light-red': index===1,'circle-bg-orange': index===2,'circle-visible': index>2}"
                       v-cloak>{{index+1}}
                  </div>
                  <el-tooltip :content="item.wasteCode" placement="top" :enterable="false">'
                    <div class="waste-code-font" v-cloak>{{item.wasteCode}}</div>
                  </el-tooltip>
                  <el-progress :percentage="item.percent" :stroke-width="19" :text-inside="true" :color="progressYellow" :show-text="false"></el-progress>
                  <div class="waste-value-font" v-cloak>{{item.weight}}</div>
                </div>
              </div>
            </div>
            <div class="waste-production block-bg">
              <div class="border-style border-top"></div>
              <div class="border-style border-right"></div>
              <div class="border-style border-bottom"></div>
              <div class="border-style border-left"></div>
              <div class="yes-survey-title">次生危废产生量</div>
              <div class="waste-content">
                <div class="list-content-chart" id="wasteProduction">
                  <div class="no-data">暂无数据</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="company-footer">
        <div class="company-footer-content block-bg">
          <div class="border-style border-top"></div>
          <div class="border-style border-right"></div>
          <div class="border-style border-bottom"></div>
          <div class="border-style border-left"></div>
          <div class="warehouse-inventory-list">
            <div class="list-icon-item">
              <img src="../../assets/img/map/warehouse-num.png">
              <div class="title-item-text">
                <div class="num-size num-bule link-point" v-cloak
                     @click="getCompany({functionType:'disp_storage', busTitle:'仓库数量', busPlaceholder:'请输入企业名称或八位码', hideSearchForm:true})">
                  {{totalDispEntInfoStatistics.storageNum | formatNum}}<span class="unit-size text-light-blue">吨</span>
                </div>
                <div class="bottom-text-size text-light-blue">仓库数量</div>
              </div>
            </div>
            <div class="list-content">
              <div class="yes-survey-title">仓库库存一览</div>
              <div class="list-content-chart" id="warehouseInventoryList">
                <div class="no-data">暂无数据</div>
              </div>
            </div>
          </div>
          <div class="warehouse-inventory-list waste-warehouse-num">
            <div class="list-icon-item">
              <img src="../../assets/img/map/waste-warehouse-num.png">
              <div class="title-item-text">
                <div class="num-size num-bule link-point" v-cloak
                     @click="getCompany({functionType:'disp_inventory_waste', busTitle:'危废库存量', busPlaceholder:'请输入企业名称或八位码'})">
                  {{totalDispEntInfoStatistics.inventoryQty | formatNum}}<span
                        class="unit-size text-light-blue">吨</span></div>
                <el-tooltip content="危废库存量" placement="top" :enterable="false">
                  <div class="bottom-text-size text-light-blue">危废库存量</div>
                </el-tooltip>
              </div>
              <div id="wasteRatio"></div>
            </div>
            <div class="list-content">
              <div class="yes-survey-title">接受危废贮存量<span class="title-sub-text title-blue link-point"
                                                         @click="getCompany({functionType:'disp_inventory_by_waste_code', busTitle:'接受危废贮存量TOP5', busPlaceholder:'请输入八位码'})">&nbsp;TOP5</span>
              </div>
              <div class="waste-content">
                <div v-if="!listDispInvWasteStatistics.length" class="no-data">暂无数据</div>
                <div class="waste-content-item" v-for="(item,index) in listDispInvWasteStatistics" v-cloak>
                  <div class="circle-index"
                       :class="{'circle-bg-red': index===0,'circle-bg-light-red': index===1,'circle-bg-orange': index===2,'circle-visible': index>2}"
                       v-cloak>{{index+1}}
                  </div>
                  <el-tooltip :content="item.wasteCode" placement="top" :enterable="false">
                    <div class="waste-code-font" v-cloak>{{item.wasteCode}}</div>
                  </el-tooltip>
                  <el-progress :percentage="item.percent" :stroke-width="19" :text-inside="true" :color="progressBlue" :show-text="false"></el-progress>
                  <div class="waste-value-font" v-cloak>{{item.weight}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="warehouse-inventory-list waste-type">
            <div class="list-icon-item">
              <img src="../../assets/img/map/waste-type.png">
              <div class="title-item-text">
                <div class="num-size num-bule link-point" v-cloak
                     @click="getCompany({functionType:'sec_waste_type', busTitle:'次生危废类型', busPlaceholder:'请输入八位码'})">
                  {{totalDispEntInfoStatistics.secWasteTypeNum | formatNum}}<span
                        class="unit-size text-light-blue">个</span></div>
                <div class="bottom-text-size text-light-blue">次生危废种类</div>
              </div>
            </div>
            <div class="list-content">
              <div class="yes-survey-title">仓库库存一览</div>
              <div class="list-content-chart" id="wasteType">
                <div class="no-data">暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/assets/js/date.js'
import {
  totalDispEntInfoStatistics,
  listDispReceiveWasteStatistics,
  listDispInvWasteStatistics,
  getDispProduceSecWasteEchart,
  getDispStorageStatisticsEchart,
  getDispInvSecWasteEchart
} from '@/assets/js/API/api'

export default {
  name: 'wasteInfoWindow',
  data () {
    return {
      progressBlue: '#44D7FD',
      progressYellow: '#FFEA7B',
      wasteReceive: [{
        wasteCode: '261-143-50',
        percent: 80,
        value: '410.6'
      }, {
        wasteCode: '261-143-50',
        percent: 60,
        value: '310.3'
      }, {
        wasteCode: '261-143-50',
        percent: 50,
        value: '261.0'
      }, {
        wasteCode: '261-143-50',
        percent: 40,
        value: '236.6'
      }, {
        wasteCode: '261-143-50',
        percent: 20,
        value: '123.0'
      }],
      // 概况
      totalDispEntInfoStatistics: '',
      // 危废接收量
      listDispReceiveWasteStatistics: [],
      // 接受危废贮存量
      listDispInvWasteStatistics: []
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  props: ['busName'],
  mounted: function () {
    // 概况
    this.getTotalDispEntInfoStatistics()
    // 危废接收量
    this.getListDispReceiveWasteStatistics()
    // 接受危废贮存量
    this.getListDispInvWasteStatistics()
    // 次生危废产生
    this.getWasteProduction()
    // 仓库库存一览
    this.getWarehouseInventoryList()
    this.getWasteType()
  },
  methods: {
    getTotalDispEntInfoStatistics: function () {
      let _this = this
      totalDispEntInfoStatistics()
        .then(res => {
          _this.totalDispEntInfoStatistics = res.data
          _this.getWasteRatio(res.data.invReceiveQty, res.data.invSecWasteQty)
        }).catch(() => {
        })
    },
    getListDispReceiveWasteStatistics: function () {
      let _this = this
      listDispReceiveWasteStatistics()
        .then(res => {
          let listDispReceiveWasteStatistics = res.data
          let totalWeight
          if (listDispReceiveWasteStatistics) {
            listDispReceiveWasteStatistics.forEach(function (val, index) {
              val.weight = val.weight.toFixed(2)
              if (index === 0) {
                // totalWeight = val.weight/0.8
                totalWeight = val.weight
              }
              let percent = (val.weight / totalWeight).toFixed(2) * 100
              val.percent = percent
            })
          }
          _this.listDispReceiveWasteStatistics = listDispReceiveWasteStatistics
        }).catch(() => {
        })
    },
    getListDispInvWasteStatistics: function () {
      let _this = this
      listDispInvWasteStatistics()
        .then(res => {
          let listDispInvWasteStatistics = res.data
          let totalWeight
          if (listDispInvWasteStatistics) {
            listDispInvWasteStatistics.forEach(function (val, index) {
              val.weight = val.weight.toFixed(2)
              if (index === 0) {
                // totalWeight = val.weight/0.8
                totalWeight = val.weight
              }
              let percent = (val.weight / totalWeight).toFixed(2) * 100
              val.percent = percent
            })
          }
          _this.listDispInvWasteStatistics = listDispInvWasteStatistics
        }).catch(() => {
        })
    },
    getWasteProduction: function () {
      let _this = this
      getDispProduceSecWasteEchart()
        .then(res => {
          let prodProduceWasteStatistics = res.data
          let totalWeight = 0
          if (prodProduceWasteStatistics.legendData && prodProduceWasteStatistics.series[0].data) {
            prodProduceWasteStatistics.legendData.forEach(function (val, index) {
              prodProduceWasteStatistics.legendData[index] = val.replace(/_/, '\n')
            })
            prodProduceWasteStatistics.series[0].data.forEach(function (val, index) {
              val.name = val.name.replace(/_/, '\n')
              totalWeight += val.value
            })
            totalWeight = parseFloat(parseFloat(totalWeight).toFixed(2))
            let chartsData = {
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: '{c}吨<br>{b}'
              },
              legend: {
                show: true,
                right: 'right',
                // top: 'center',
                itemWidth: 13,
                itemHeight: 13,
                itemGap: 20,
                orient: 'vertical',
                // x: 'right',
                data: prodProduceWasteStatistics.legendData,
                formatter: function (name) {
                  let obj = name.split('\n')
                  if (obj[1]) {
                    obj[1] = (obj[1].length > 5 ? obj[1].substr(0, 4) + '...' : obj[1])
                    return obj.join('\n')
                  }
                  return name
                },
                tooltip: {
                  show: true
                },
                textStyle: {
                  color: '#fff'
                }
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  center: ['25%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  color: ['#53FFCC', '#00D2FF', '#F9F9F9', '#FFC67B', '#84EAEF', '#F5FF79'],
                  label: {
                    normal: {
                      show: true,
                      position: 'center',
                      formatter: function (argument) {
                        let html
                        html = totalWeight + '\r\n单位:  吨'
                        return html
                      },
                      textStyle: {
                        fontSize: 15,
                        color: '#53FFCC'
                      }
                    },
                    emphasis: {
                      show: true,
                      textStyle: {}
                    }
                    // normal: {
                    //     show: false,
                    //     position: 'center'
                    // },
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {}
                    // }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: prodProduceWasteStatistics.series[0].data
                }
              ]
            }
            let myChart = _this.$echarts.init(document.getElementById('wasteProduction'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    getWarehouseInventoryList: function () {
      let _this = this
      getDispStorageStatisticsEchart()
        .then(res => {
          let getStorageStatisticsEchart = res.data
          if (getStorageStatisticsEchart.series && (getStorageStatisticsEchart.series.length)) {
            let chartsData = {
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: ['已存量（%）', '可存量（%）'],
                itemWidth: 13,
                itemHeight: 13,
                top: 10,
                right: 10,
                padding: 0,
                textStyle: {
                  color: '#BEE9DE'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '0',
                top: 25,
                containLabel: true
              },
              yAxis: [
                {
                  type: 'category',
                  data: getStorageStatisticsEchart.legendData,
                  axisLine: {
                    lineStyle: {
                      color: '#BEE9DE'
                    }
                  }
                }
              ],
              xAxis: [
                {
                  type: 'value',
                  axisLine: {
                    lineStyle: {
                      color: '#BEE9DE'
                    }
                  }
                }
              ],
              series: [
                {
                  name: '已存量（%）',
                  type: 'bar',
                  barWidth: '20',
                  color: ['#FFEA7B'],
                  stack: '库',
                  data: getStorageStatisticsEchart.series[0].data
                },
                {
                  name: '可存量（%）',
                  type: 'bar',
                  color: ['#00D2FF'],
                  stack: '库',
                  data: getStorageStatisticsEchart.series[1].data
                }
              ]
            }
            let myChart = _this.$echarts.init(document.getElementById('warehouseInventoryList'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    getWasteType: function () {
      let _this = this
      getDispInvSecWasteEchart()
        .then(res => {
          let prodProduceWasteStatistics = res.data
          let totalWeight = 0
          if (prodProduceWasteStatistics.legendData && prodProduceWasteStatistics.series[0].data) {
            prodProduceWasteStatistics.legendData.forEach(function (val, index) {
              prodProduceWasteStatistics.legendData[index] = val.replace(/_/, '\n')
            })
            prodProduceWasteStatistics.series[0].data.forEach(function (val, index) {
              val.name = val.name.replace(/_/, '\n')
              totalWeight += val.value
            })
            totalWeight = parseFloat(parseFloat(totalWeight).toFixed(2))
            let chartsData = {
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: '{c}吨<br>{b}'
              },
              legend: {
                show: true,
                right: 'right',
                // top: 'center',
                itemWidth: 13,
                itemHeight: 13,
                itemGap: 20,
                orient: 'vertical',
                // x: 'right',
                data: prodProduceWasteStatistics.legendData,
                formatter: function (name) {
                  let obj = name.split('\n')
                  if (obj[1]) {
                    obj[1] = (obj[1].length > 5 ? obj[1].substr(0, 4) + '...' : obj[1])
                    return obj.join('\n')
                  }
                  return name
                },
                tooltip: {
                  show: true
                },
                textStyle: {
                  color: '#fff'
                }
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  center: ['25%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  color: ['#53FFCC', '#00D2FF', '#F9F9F9', '#FFC67B', '#84EAEF', '#F5FF79'],
                  label: {
                    normal: {
                      show: true,
                      position: 'center',
                      formatter: function (argument) {
                        let html
                        html = totalWeight + '\r\n单位:  吨'
                        return html
                      },
                      textStyle: {
                        fontSize: 15,
                        color: '#53FFCC'
                      }
                    },
                    emphasis: {
                      show: true,
                      textStyle: {}
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: prodProduceWasteStatistics.series[0].data
                }
              ]
            }
            let myChart = _this.$echarts.init(document.getElementById('wasteType'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    cancelFullWindow: function () {
      this.$emit('reload', {
        fullWindow: false,
        entName: ''
      })
    },
    getWasteRatio: function (invReceiveQty, invSecWasteQty) {
      let totalQty = invReceiveQty + invSecWasteQty
      let invReceiveQtyRatio = parseFloat(parseFloat(invReceiveQty / totalQty).toFixed(4)) * 100
      let invSecWasteQtyRatio = parseFloat(parseFloat(invSecWasteQty / totalQty).toFixed(4)) * 100
      let chartsData = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['接受危废', '次生危废'],
          orient: 'vertical',
          itemWidth: 13,
          itemHeight: 13,
          right: 10,
          top: 'middle',
          padding: 0,
          textStyle: {
            color: '#BEE9DE'
          }
        },
        grid: {
          left: '3%',
          right: '100',
          bottom: '0',
          top: 25,
          containLabel: true
        },
        yAxis: [
          {
            type: 'category',
            data: ' ',
            axisLine: {
              lineStyle: {
                color: '#BEE9DE'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#BEE9DE'
              }
            }
          }
        ],
        series: [
          {
            name: '接受危废',
            type: 'bar',
            barWidth: '20',
            color: ['#FFEA7B'],
            stack: '库',
            data: [invReceiveQtyRatio]
          },
          {
            name: '次生危废',
            type: 'bar',
            color: ['#00D2FF'],
            stack: '库',
            data: [invSecWasteQtyRatio]
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('wasteRatio'))
      myChart.setOption(chartsData)
    },
    getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey }) {
      this.$emit('companyData', { functionType, busTitle, busPlaceholder, hideSearchForm, queryKey })
    }
  }
}
</script>

<style scoped>

</style>
