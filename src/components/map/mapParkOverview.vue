<template>
  <div>
    <div id="allmap" ref="allmap"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { BaiduMap } from '@/assets/js/map/map'
import { getListEntWeighbridgeInfo, getTotalProdEntInfoStatistics, getListNewestWeighRecord, getProdProduceWasteStatistics, getProdStorageStatisticsEchart, getProdInventoryWasteStatistics } from '@/assets/js/API/api'
import { formatDate } from '@/assets/js/date.js'
import mapStyle from '@/assets/js/map/custom_map_config.js'

export default {
  name: 'mapTest',
  data () {
    return {
      map: '',
      BMap: '',
      entName: ''
    }
  },
  mounted () {
    let _this = this
    this.$nextTick(function () {
      BaiduMap.init().then(BMap => {
        window.BMap = BMap
        _this.map = new BMap.Map(this.$refs.allmap, { enableMapClick: false }) // 创建Map实例
        _this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11) // 初始化地图,设置中心点坐标和地图级别
        _this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        _this.map.disableDoubleClickZoom()

        _this.map.setMapStyleV2({ styleJson: mapStyle })
        // all、offline、online、notHasWeigh
        _this.getCompanyPosition('all')
        // console.log(mapStyle)
      })
    })
  },
  methods: {
    getCompanyPosition (companyType, entName) {
      let _this = this

      getListEntWeighbridgeInfo({
        entName: entName
      })
        .then(res => {
          _this.map.clearOverlays()
          // let url = GLB_CONSTANT.serviceSiteRootUrl + '/' + res.data
          // window.location.href = url
          let entity = res.data
          let companyList = []
          switch (companyType) {
            case 'all':
              companyList = entity
              break
            case 'online':
              entity.forEach(function (val) {
                if (val.latitude && val.longitude && (val.online === 1)) {
                  companyList.push(val)
                }
              })
              break
            case 'offline':
              entity.forEach(function (val) {
                if (val.latitude && val.longitude && (val.online === 0)) {
                  companyList.push(val)
                }
              })
              break
            case 'notHasWeigh':
              entity.forEach(function (val) {
                if (val.latitude && val.longitude && (val.hasWeighbridge === 0)) {
                  companyList.push(val)
                }
              })
              break
          }
          _this.createMakers(companyList, companyType)
        }).catch(() => {
        })
    },
    // 创建marker点位
    createMakers: function (markers, companyType) {
      let _this = this
      let firstPoint
      // 定位到第一个点位
      // markerIndex = 0
      markers.forEach(function (val, index) {
        if (val.longitude && val.latitude) {
          if (!index) {
            // firstPoint = new BMap.Point(val.longitude, val.latitude);
            firstPoint = {
              longitude: val.longitude,
              latitude: val.latitude
            }
          }
          let marker = ''
          let myIcon = ''
          let point = ''
          if (val.entType === '01') {
            // markerIndex++
            myIcon = new BMap.Icon(require('../../assets/img/map/icon-waste-enterprises.png'), new BMap.Size(35, 48))
            point = new BMap.Point(val.longitude, val.latitude)
            // 定位到第一个点位
            // (markerIndex === 1) && _this.map.centerAndZoom(point, 16);
            _this.map.centerAndZoom(point, 16)
            marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
            // let marker = new BMap.Marker(point);
            _this.map.addOverlay(marker)
            marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
            // (index === markers.length) ? _this.drawOverlay(marker, val, firstPoint) : _this.drawOverlay(marker, val)
            if (index === (markers.length - 1)) {
              _this.drawOverlay(marker, val, firstPoint)
            } else {
              _this.drawOverlay(marker, val)
            }
          } else if (val.entType === '02') {
            // markerIndex++
            myIcon = new BMap.Icon(require('../../assets/img/map/icon-business-enterprises.png'), new BMap.Size(35, 48))
            point = new BMap.Point(val.longitude, val.latitude)
            // 定位到第一个点位
            // (markerIndex === 1) && _this.map.centerAndZoom(point, 16);
            _this.map.centerAndZoom(point, 16)
            marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
            // marker = new BMap.Marker(point);
            _this.map.addOverlay(marker)
            marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
            // (index === markers.length) ? _this.drawOverlay(marker, val, firstPoint) : _this.drawOverlay(marker, val)
            if (index === (markers.length - 1)) {
              _this.drawOverlay(marker, val, firstPoint)
            } else {
              _this.drawOverlay(marker, val)
            }
            // _this.drawOverlay(marker, val)
          }
          if (val.online === 1 && (companyType === 'all' || companyType === 'online')) {
            myIcon = new BMap.Icon(require('../../assets/img/map/icon-online.gif'), new BMap.Size(47, 47), { anchor: new BMap.Size(17, 55) })
            point = new BMap.Point(val.longitude, val.latitude)
            // _this.map.centerAndZoom(point, 13);
            marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
            marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
            // marker = new BMap.Marker(point);
            _this.map.addOverlay(marker)
          } else if (val.online === 0 && (companyType === 'all' || companyType === 'offline')) {
            myIcon = new BMap.Icon(require('../../assets/img/map/icon-offline.png'), new BMap.Size(39, 39), { anchor: new BMap.Size(17, 55) })
            point = new BMap.Point(val.longitude, val.latitude)
            // _this.map.centerAndZoom(point, 13);
            marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
            marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
            // marker = new BMap.Marker(point);
            _this.map.addOverlay(marker)
          }
        }
        // _this.createTag(marker, val);
      })
    },
    // 配置点位信息
    drawOverlay: function (marker, val, firstPoint) {
      let _this = this

      function SquareOverlay (center, length, color) {
        this._center = center
        this._length = length
        this._color = color
      }

      // 继承API的BMap.Overlay
      SquareOverlay.prototype = new BMap.Overlay()

      SquareOverlay.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map
        // 创建div元素，作为自定义覆盖物的容器
        let div = document.createElement('div')
        div.style.position = 'absolute'
        div.id = val.entId
        div.entName = val.entName
        div.entType = val.entType
        // 可以根据参数设置元素外观
        // div.style.width = this._length + "px";
        // div.style.height = this._length + "px";
        // div.style.background = this._color;
        // div.onclick=function(e){
        //     this.style.display = "none"
        // }
        // 将div添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(div)
        // 保存div实例
        this._div = div
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return div
      }
      SquareOverlay.prototype.draw = function () {
        // 根据地理坐标转换为像素坐标，并设置给容器
        let position = this._map.pointToOverlayPixel(this._center)
        this._div.style.left = position.x - this._length / 2 + 'px'
        this._div.style.top = position.y - this._length / 2 + 'px'
      }

      // 实现显示方法
      SquareOverlay.prototype.show = function () {
        if (this._div) {
          this._div.style.display = ''
        }
      }
      // 实现隐藏方法
      SquareOverlay.prototype.hide = function () {
        if (this._div) {
          this._div.style.display = 'none'
        }
      }
      // 添加自定义方法
      SquareOverlay.prototype.toggle = function () {
        if (this._div) {
          if (this._div.style.display === '') {
            this.hide()
          } else {
            this.show()
          }
        }
      }
      // 添加自定义覆盖物
      let mySquare = new SquareOverlay(_this.map.getCenter(), 100)
      _this.map.addOverlay(mySquare)
      mySquare.hide()
      marker.addEventListener('click', function (e) {
        // _this.busVisible = (_this.busVisible === true) && false
        _this.$emit('reload', {
          commonWindowVisible: false
        })
        let id = mySquare._div.id
        _this.entName = mySquare._div.entName
        let entType = mySquare._div.entType
        if (entType) {
          // 详情级别
          let zoomLevel = _this.map.getZoom()
          var calProportion = function (level) {
            let zoomLevelMax = 18
            return Math.pow(2, zoomLevelMax - level)
          }
          let calScale = calProportion(zoomLevel)
          // 根据地图级别手动计算经纬偏移量
          let point = new BMap.Point(e.target.point.lng + 0.004500593212499999 * calScale, e.target.point.lat + 0.0027405969499999998 * calScale)
          // _this.map.centerAndZoom(point, zoomLevel)
          _this.map.panTo(point)

          let wasteBusinessWindow = document.querySelector('.waste-business-window')
          wasteBusinessWindow && wasteBusinessWindow.parentNode.removeChild(wasteBusinessWindow)
          // let infoWindow = document.querySelectorAll(".waste-business-window")
          // if(infoWindow.length > 0) {
          //     infoWindow.forEach(function (val) {
          //         val.parentNode.innerHTML = ''
          //     })
          // }
          // @click="getCompany({functionType:'prod_storage', busTitle:'仓库数量', hideSearchForm:true})"
          // @click="getCompany({functionType:'prod_waste_type', busTitle:'危废种类', hideSearchForm:true})"
          mySquare.show()
          let MyComponent = Vue.extend({
            template: '<div class="info-window waste-business-window">' +
                '        <div class="info-title">{{entName}}</div>' +
                // '        <div class="info-title">********</div>' +
                '        <div class="info-close-btn"><el-button @click="closeInfo" icon="el-icon-close" circle></el-button></div>' +
                '        <div class="info-header">' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.storageNum}}</span>个</div>' +
                '                <div>仓库数量</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.inventoryQty | formatNum}}</span>吨</div>' +
                '                <div>库存量</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.wasteTypeNum}}</span>个</div>' +
                '                <div>危废种类</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.produceQty | formatNum}}</span>吨</div>' +
                '                <div>累积产废量</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.packageNum}}</span>个</div>' +
                '                <div>库存包装数</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.transferNum}}</span>个</div>' +
                '                <div>转移次数</div>' +
                '            </div>' +
                '            <div class="info-header-item">' +
                '                <div class="item-text-blue"><span class="item-num">{{totalProdEntInfoStatistics.transferQty | formatNum}}</span>吨</div>' +
                '                <div>转移量</div>' +
                '            </div>' +
                '            <div class="info-header-item link-point" @click="hrefVideo(\'videoTest\')">' +
                '                <div class="item-text-blue"><span class="item-num"><span class="el-icon-view"></span></span></div>' +
                '                <div>视频</div>' +
                '            </div>' +
                '        </div>' +
                '        <div>' +
                '            <div class="info-content">' +
                '                <div class="info-content-group">' +
                '                    <div class="info-content-title">称重记录</div>' +
                '                    <div class="weight-record link-point" @click="getCompany({functionType:\'prod_ent_weight_record\', busTitle:\'产废企业称重记录\', busPlaceholder:\'请输入八位码\'})">' +
                '                                <div v-if="!listNewestWeighRecord.length" class="no-data">暂无数据</div>' +
                '                        <div class="weight-record-item" v-for="item in listNewestWeighRecord" :key="item.batchNumber">' +
                '                            <div class="record-item-num">{{item.weight | formatNum}}<span class="record-item-unit">kg</span></div>' +
                '                            <div class="record-item-code">{{item.wasteCode}}</div>' +
                '                            <div class="record-item-time"><i class="el-icon-time"></i>&nbsp;&nbsp;{{item.weighingTime | formatDate}}</div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="info-content-group clear-charts-right">' +
                '                    <div class="info-content-title">危废产废量统计一览</div>' +
                '                    <div class="info-content-body">' +
                '                        <div class="waste-list-view" id="wasteListView">' +
                '                                <div class="no-data">暂无数据</div></div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '        <div>' +
                '            <div class="info-content">' +
                '                <div class="info-content-group">' +
                '                    <div class="info-content-title">仓库库存一览</div>' +
                '                    <div class="info-content-body warehouse-inventory-list">' +
                '                        <div class="waste-list-view" id="warehouseInventoryList">' +
                '                                <div class="no-data">暂无数据</div></div>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="info-content-group clear-charts-right">' +
                '                    <div class="info-content-title">危废库存量一览</div>' +
                '                    <div class="info-content-body">' +
                '                        <div class="waste-list-view" id="wasteListViewLast">' +
                '                                <div class="no-data">暂无数据</div></div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '    </div>',
            data () {
              return {
                entName: _this.entName,
                // title
                totalProdEntInfoStatistics: {},
                listNewestWeighRecord: [],
                // 称重记录
                weighingDynamics: {}
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
                _this.getTotalProdEntInfoStatistics()
                _this.getListNewestWeighRecord()
                _this.getWasteSurvey()
                _this.getWarehouseInventoryList()
                _this.getWasteListViewLast()
              }, 100)
            },
            methods: {
              getWasteSurvey: function () {
                getProdProduceWasteStatistics({ entId: id })
                  .then(res => {
                    let prodProduceWasteStatistics = res.data
                    if (prodProduceWasteStatistics.legendData && prodProduceWasteStatistics.series[0].data) {
                      prodProduceWasteStatistics.legendData.forEach(function (val, index) {
                        prodProduceWasteStatistics.legendData[index] = val.replace(/_/, '\n')
                      })
                      prodProduceWasteStatistics.series[0].data.forEach(function (val) {
                        val.name = val.name.replace(/_/, '\n')
                      })
                      let chartsData = {
                        title: {
                          text: '危废库存量',
                          x: 'center',
                          left: '18%',
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
                            center: ['25%', '40%'],
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            color: ['#53FFCC', '#00D2FF', '#F9F9F9', '#FFC67B', '#84EAEF', '#F5FF79'],
                            label: {
                              normal: {
                                show: false,
                                position: 'center'
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
                      let myChart = this.$echarts.init(document.getElementById('wasteListView'))
                      myChart.setOption(chartsData)
                    }
                  }).catch(() => {
                  })
              },
              getWarehouseInventoryList () {
                getProdStorageStatisticsEchart({ entId: id })
                  .then(res => {
                    let getStorageStatisticsEchart = res.data
                    // prodProduceWasteStatistics.legendData.forEach(function (val, index) {
                    //     prodProduceWasteStatistics.legendData[index] = val.replace(/_/, '\n')
                    // })
                    // prodProduceWasteStatistics.series[0].data.forEach(function (val) {
                    //     val.name = val.name.replace(/_/, '\n')
                    // })
                    if (getStorageStatisticsEchart.series) {
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
                          top: 0,
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
                        xAxis: [
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
                        yAxis: [
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
                      let myChart = this.$echarts.init(document.getElementById('warehouseInventoryList'))
                      myChart.setOption(chartsData)
                    }
                  }).catch(() => {
                  })
              },
              getWasteListViewLast () {
                getProdInventoryWasteStatistics({ entId: id })
                  .then(res => {
                    let prodProduceWasteStatistics = res.data
                    if (prodProduceWasteStatistics.legendData && prodProduceWasteStatistics.series[0].data) {
                      prodProduceWasteStatistics.legendData.forEach(function (val, index) {
                        prodProduceWasteStatistics.legendData[index] = val.replace(/_/, '\n')
                      })
                      prodProduceWasteStatistics.series[0].data.forEach(function (val, index) {
                        val.name = val.name.replace(/_/, '\n')
                      })
                      let chartsData = {
                        title: {
                          text: '危废库存量',
                          x: 'center',
                          left: '18%',
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
                            center: ['25%', '40%'],
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            color: ['#53FFCC', '#00D2FF', '#F9F9F9', '#FFC67B', '#84EAEF', '#F5FF79'],
                            label: {
                              normal: {
                                show: false,
                                position: 'center'
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
                      let myChart = this.$echarts.init(document.getElementById('wasteListViewLast'))
                      myChart.setOption(chartsData)
                    }
                  }).catch(() => {
                  })
              },
              closeInfo () {
                // document.querySelector(".waste-business-window").parentNode.innerHTML = ''
                let wasteBusinessWindow = document.querySelector('.waste-business-window')
                wasteBusinessWindow && wasteBusinessWindow.parentNode.removeChild(wasteBusinessWindow)
              },
              // title
              getTotalProdEntInfoStatistics () {
                let _this = this
                getTotalProdEntInfoStatistics({ entId: id })
                  .then(res => {
                    _this.totalProdEntInfoStatistics = res.data
                  }).catch(() => {
                  })
              },
              // 称重列表
              getListNewestWeighRecord () {
                let _this = this
                getListNewestWeighRecord({ entId: id })
                  .then(res => {
                    let listNewestWeighRecord = res.data
                    if (listNewestWeighRecord) {
                      listNewestWeighRecord.forEach(function (val, index) {
                        listNewestWeighRecord[index].weight = val.weight * 1000
                      })
                    }
                    _this.listNewestWeighRecord = listNewestWeighRecord
                  }).catch(() => {
                  })
              },
              getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey }) {
                _this.$emit('companyData', { functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, id })
                // _this.getCompany({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, id })
              },
              hrefVideo (val) {
                _this.$emit('hrefVideo', val, id)
              }
            }
          })
          let component = new MyComponent().$mount()
          mySquare._div.appendChild(component.$el)
          _this.map.addOverlay(mySquare)
        }/* else if (entType === '02') {
          let wasteBusinessWindow = document.querySelector('.waste-business-window')
          wasteBusinessWindow && wasteBusinessWindow.parentNode.removeChild(wasteBusinessWindow)
          mySquare.show()
          _this.mapIndex = 1
          _this.$emit('reload', {
            fullWindow: true,
            entName: _this.entName
          })
        } */
      })
      if (firstPoint) {
        let point = new BMap.Point(firstPoint.longitude, firstPoint.latitude)
        _this.map.centerAndZoom(point, 16)
      }
      // firstPoint && _this.map.centerAndZoom(firstPoint, 16)
    },
    getWeightPosition (obj) {
      var point = new BMap.Point(obj.longitude, obj.latitude)
      this.map.centerAndZoom(point, 18)
    }
  }
}
</script>

<style lang="scss" scoped>
  #allmap {
    height: 100%;
  }
</style>
