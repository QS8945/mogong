<template>
  <div class="charts-common content-left">
    <div class="full-content">
      <div class="weighing-dynamics list-style">
        <div class="weight-title">称重动态</div>
        <div class="weight-date">
          <div class="text-center">
            <div class="date-num link-point"  v-cloak>{{getDayAndMonthAndYearWeighRecordNum.dayRecordNum}}条</div>
            <div class="date-type">日</div>
          </div>
          <div class="text-center">
            <div class="date-num link-point" @click="getCompany({functionType:'month_weight_record', busTitle:'称重动态', busPlaceholder:'请输入企业名称或八位码'})" v-cloak>{{getDayAndMonthAndYearWeighRecordNum.monthRecordNum}}条</div>
            <div class="date-type">月</div>
          </div>
          <div class="text-center">
            <div class="date-num link-point" @click="getCompany({functionType:'year_weight_record', busTitle:'称重动态', busPlaceholder:'请输入企业名称或八位码'})" v-cloak>{{getDayAndMonthAndYearWeighRecordNum.yearRecordNum}}条</div>
            <div class="date-type">年</div>
          </div>
        </div>
        <div class="weight-content-bg">
          <div class="weight-content" v-for="item in listNewestWeighRecord" :key="item.batchNumber">
            <div class="item-title"><span class="item-title-num" v-cloak>{{item.weight | formatNum}}</span>kg</div>
            <div class="item-body">
              <el-tooltip :content="item.entName" placement="top" :enterable="false">
                <div class="item-body-text" v-cloak @click="getWeightPosition(item.longitude,item.latitude)">{{item.entName}}</div>
              </el-tooltip>
              <div class="item-body-foot">
                <el-tooltip :content="item.wasteCode" placement="top" :enterable="false">
                  <div class="foot-code" v-cloak>{{item.wasteCode}}</div>
                </el-tooltip>
                <el-tooltip :content="item.weighingTime" placement="top" :enterable="false">
                  <div class="foot-time" v-cloak><i class="el-icon-time"></i>&nbsp;&nbsp;{{item.weighingTime | formatDate}}</div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weighing-dynamics">
        <div class="weight-title">产废单位</div>
        <div class="ysd-body">
          <div class="ysd-num">
            <div class="num-item">
              <div class="link-point" @click="getCompany({functionType:'last_day_produce_waste', busTitle:'产废单位产废量', busPlaceholder:'请输入企业名称或八位码'})"><span class="num" v-cloak>{{wasteUnit.lastDayProduceQty | formatNum}}</span>&nbsp;吨</div>
              <div>昨日产废量</div>
            </div>
            <div class="num-item">
              <div class="link-point"><span class="num" v-cloak>{{wasteUnit.lastDayTransferQty | formatNum}}</span>&nbsp;吨</div> <!--@click="getCompany({functionType:'last_day_transfer_waste', busTitle:'产废单位转移量', busPlaceholder:'请输入企业名称或八位码'})"-->
              <div>昨日转移量</div>
            </div>
          </div>
          <div class="total-transfer" id="total-transfer">
            <div class="no-data">暂无数据</div>
          </div>
        </div>
        <div class="data-bottom">
          <div class="num-item">
            <div class="blue-num link-point" @click="getCompany({functionType:'prod_ent_inventory_waste', busTitle:'产废单位库存量', busPlaceholder:'请输入企业名称'})"><span class="num" v-cloak>{{wasteUnit.inventoryQty | formatNum}}</span>&nbsp;吨</div>
            <div>当前库存量</div>
          </div>
          <div class="num-item btm-margin">
            <div class="orange-num link-point" @click="getCompany({functionType:'prod_over_one_year_inv_waste', busTitle:'产废单位贮存量', busPlaceholder:'请输入企业名称'})"><span class="num" v-cloak>{{wasteUnit.overOneYearInventoryQty | formatNum}}</span><span class="num-unit">&nbsp;吨</span>
            </div>
            <div>超一年贮存量</div>
          </div>
        </div>
      </div>
      <div class="weighing-dynamics">
        <div class="weight-title">经营单位</div>
        <div class="ysd-body">
          <div class="ysd-num">
            <div class="num-item">
              <div class="link-point" @click="getCompany({functionType:'last_day_receive_waste', busTitle:'经营单位接收量', busPlaceholder:'请输入企业名称或八位码'})"><span class="num" v-cloak>{{businessUnit.lastDayReceiveQty | formatNum}}</span>&nbsp;吨</div>
              <div>昨日接受量</div>
            </div>
            <div class="num-item">
              <div class="link-point" @click="getCompany({functionType:'last_day_dispose_waste', busTitle:'经营单位处置量', hideSearchForm:true})"><span class="num" v-cloak>{{businessUnit.lastDayDisposeQty | formatNum}}</span>&nbsp;吨</div>
              <div>昨日处置量</div>
            </div>
          </div>
          <div class="total-transfer" id="business-unit">
            <div class="no-data">暂无数据</div>
          </div>
        </div>
        <div class="data-bottom">
          <div class="num-item">
            <div class="blue-num link-point" @click="getCompany({functionType:'disp_inventory_waste', busTitle:'经营单位库存量', busPlaceholder:'请输入企业名称或八位码'})"><span class="num" v-cloak>{{businessUnit.inventoryQty | formatNum}}</span>&nbsp;吨</div>
            <div>当前库存量</div>
          </div>
          <div class="num-item btm-margin">
            <div class="orange-num link-point" @click="getCompany({functionType:'disp_over_one_year_inv_waste', busTitle:'经营单位贮存量', busPlaceholder:'请输入企业名称或八位码'})"><span class="num" v-cloak>{{businessUnit.overOneYearInventoryQty | formatNum}}</span><span class="num-unit">&nbsp;吨</span>
            </div>
            <div>超一年贮存量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDayAndMonthAndYearWeighRecordNum, getListNewestWeighRecord, totalProdEntInfoStatistics, totalDispEntInfoStatistics } from '@/assets/js/API/api'
import { formatDate } from '@/assets/js/date.js'
export default {
  name: 'mapLeftContent',
  data () {
    return {
      // 称重动态
      getDayAndMonthAndYearWeighRecordNum: {},
      // 称重记录
      listNewestWeighRecord: [],
      // 产废单位
      wasteUnit: {},
      // 经营单位
      businessUnit: {
        lastDayReceiveQty: ''
      }
    }
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
  mounted () {
    let _this = this
    setTimeout(function () {
      // 称重动态
      _this.getWeighingDynamics()
      // 称重列表
      _this.getListNewestWeighRecord()
      // 产废单位
      _this.getWasteUnit()
      // 经营单位
      _this.getBusinessUnit()
    }, 300)
  },
  methods: {
    getWeighingDynamics () {
      let _this = this
      getDayAndMonthAndYearWeighRecordNum()
        .then(res => {
          _this.getDayAndMonthAndYearWeighRecordNum = res.data
        }).catch(() => {
        })
    },
    getListNewestWeighRecord () {
      let _this = this
      getListNewestWeighRecord()
        .then(res => {
          let listNewestWeighRecord = res.data
          if (listNewestWeighRecord) {
            listNewestWeighRecord.forEach(function (val, index) {
              listNewestWeighRecord[index].weight = val.weight * 1000
              // 屏蔽name
              // val.entName = '*************************************'
            })
          }
          _this.listNewestWeighRecord = listNewestWeighRecord
        }).catch(() => {
        })
    },
    getWasteUnit () {
      let _this = this
      totalProdEntInfoStatistics()
        .then(res => {
          if (_this.wasteUnitChart != null && _this.wasteUnitChart !== '' && _this.wasteUnitChart !== undefined) {
            _this.wasteUnitChart.dispose()
          }
          _this.wasteUnit = res.data
          _this.wasteUnit.inventoryQty = _this.wasteUnit.inventoryQty.toFixed(2)
          let wasteUnit = {
            chartsData: {
              option: {
                backgroundColor: '',
                tooltip: {
                  show: true,
                  trigger: 'item',
                  formatter: '{c}吨 <br/>{b}'
                },
                legend: {
                  show: false,
                  orient: 'vertical',
                  x: 'right',
                  data: ['外部转移', '内部转移'],
                  textStyle: {
                    color: '#fff'
                  }
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    color: ['#FED800', '#0EFCFF'],
                    label: {
                      // show:false,
                      // align: 'center',
                      normal: {
                        show: true,
                        position: 'outside',
                        formatter: '{c}吨 \n {b}'
                      }
                    },
                    labelLine: {
                      normal: {
                        show: true, // 是否显示视觉引导线。
                        length: 10, // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                        length2: 15, // 视觉引导项第二段的长度。
                        lineStyle: { // 视觉引导线的样式
                          // color: '#000',
                          width: 1
                        }
                      }
                    },
                    data: [
                      { value: _this.wasteUnit.lastDayOutTransferQty || 0, name: '外部转移' },
                      { value: _this.wasteUnit.lastDayInTransferQty || 0, name: '内部转移' }
                    ]
                  }
                ]
              }
            }
          }
          _this.wasteUnitChart = _this.$echarts.init(document.getElementById('total-transfer'))
          _this.wasteUnitChart.setOption(wasteUnit.chartsData.option)
        }).catch(() => {
        })
    },
    getBusinessUnit () {
      let _this = this
      totalDispEntInfoStatistics()
        .then(res => {
          if (_this.businessUnitChart != null && _this.businessUnitChart != '' && _this.businessUnitChart != undefined) {
            _this.businessUnitChart.dispose()
          }
          _this.businessUnit = res.data
          _this.businessUnit.inventoryQty = _this.businessUnit.inventoryQty.toFixed(2)
          let businessUnit = {
            chartsData: {
              option: {
                backgroundColor: '',
                tooltip: {
                  show: true,
                  trigger: 'item',
                  formatter: '{c}吨 <br/>{b}'
                },
                legend: {
                  show: false,
                  orient: 'vertical',
                  x: 'right',
                  data: ['外部转移', '内部转移'],
                  textStyle: {
                    color: '#fff'
                  }
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    color: ['#FED800', '#0EFCFF'],
                    label: {
                    // show:false,
                    // align: 'center',
                      normal: {
                        show: true,
                        position: 'outside',
                        formatter: '{c}吨 \n {b}'
                      }
                    },
                    labelLine: {
                      normal: {
                        show: true, // 是否显示视觉引导线。
                        length: 10, // 在 label 位置 设置为'outside'的时候会显示视觉引导线。
                        length2: 15, // 视觉引导项第二段的长度。
                        lineStyle: { // 视觉引导线的样式
                        // color: '#000',
                        // width: 1
                        }
                      }
                    },
                    data: [
                      { value: _this.businessUnit.lastDayInReceiveQty || 0, name: '昨日接收量-内部' },
                      { value: _this.businessUnit.lastDayOutReceiveQty || 0, name: '昨日接收量-外部' }
                    ]
                  }
                ]
              }
            }
          }
          _this.businessUnitChart = _this.$echarts.init(document.getElementById('business-unit'))
          _this.businessUnitChart.setOption(businessUnit.chartsData.option)
        }).catch(() => {
        })
    },
    getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey }) {
      this.$emit('companyData', { functionType, busTitle, busPlaceholder, hideSearchForm, queryKey })
    },
    getWeightPosition: function (longitude, latitude) {
      this.$emit('changePositionCenter', {
        longitude: longitude,
        latitude: latitude
      })
    }
  }
}
</script>

<style scoped>

</style>
