<template>
  <div class="map-container">
    <div class="map-form">
      <div id="r-result">
        <el-input placeholder="请输入内容" id="suggestId" size="20" v-model="searchValue" clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchFunc"></el-button>
        </el-input>
        <!--<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" v-model="searchValue"/>-->
      </div>
      <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
    </div>
    <div id="allmap" ref="allmap"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import COMMONJS from '@/assets/js/common.js'
import { BaiduMap } from '@/assets/js/map/map'

export default {
  name: 'mapTest',
  data () {
    return {
      map: '',
      searchValue: '',
      // searchKey: {
      //   value: '江苏神彩科技',
      //   range: '苏州',
      //   latitude: '',
      //   longitude: ''
      // },
      local: ''
    }
  },
  props: ['searchKey'],
  watch: {
    searchKey: function () {
      this.mapInit()
    }
  },
  mounted () {
    let _this = this
    this.$nextTick(function () {
      _this.mapInit()
    })
  },
  methods: {
    mapInit () {
      let _this = this
      BaiduMap.init().then(BMap => {
        let range
        if (_this.searchKey.range !== '市辖区' && _this.searchKey.range !== '县') {
          range = _this.searchKey.range
        } else {
          range = ''
        }
        _this.map = new BMap.Map(this.$refs.allmap, { enableMapClick: false }) // 创建Map实例
        _this.map.centerAndZoom((range || new BMap.Point(116.404, 39.915)), 11) // 初始化地图,设置中心点坐标和地图级别
        // map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
        _this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        _this.map.disableDoubleClickZoom() // 禁止双击切换缩放

        var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
          {
            'input': 'suggestId',
            'location': _this.map
          })
        var myValue = _this.searchKey.value || ''

        ac.addEventListener('onhighlight', function (e) { // 鼠标放在下拉列表上的事件
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
          _this.G('searchResultPanel').innerHTML = str
        })

        ac.addEventListener('onconfirm', function (e) { // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          _this.G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
          myValue && (_this.setPlace(myValue))
        })
        if (_this.searchKey.lat && _this.searchKey.lng) {
          let myIcon = new BMap.Icon(require('../../assets/img/map/map-position.png'), new BMap.Size(26, 36))
          let point = new BMap.Point(_this.searchKey.lng, _this.searchKey.lat)
          // 创建标注，为要查询的地方对应的经纬度
          let marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
          // alert("["+poi.point.lng+","+poi.point.lat+"]");
          // 在地图上添加标识
          _this.map.addOverlay(marker)
          _this.map.centerAndZoom(point, 18)
          marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
          // _this.drawOverlay(marker, poi)
        } else {
          myValue && (_this.setPlace(myValue))
        }
        // _this.initSearch(_this.searchKey)
      })
    },
    setPlace (myValue) {
      let _this = this
      function myFun () {
        var pp = _this.local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
        _this.map.centerAndZoom(pp, 18)
        _this.map.addOverlay(new BMap.Marker(pp)) // 添加标注
      }

      this.local = new BMap.LocalSearch(_this.map, { // 智能搜索
        onSearchComplete: myFun
      })
      // let address = {}
      let searchResult = ''

      this.local.setSearchCompleteCallback(function (searchResults) {
        _this.map.clearOverlays() // 清除地图上所有覆盖物
        if (typeof (searchResults) === 'undefined') {
          COMMONJS.showToast('百度API没有搜索到该地址', 'error')
          // alert('百度API没有搜索到该地址')
          return
        }
        if (searchResults.length > 0) {
          searchResult = searchResults[0]
        } else {
          searchResult = searchResults
        }

        // var contents = []
        let firstPoint = {}
        // console.log(searchResult.getCurrentNumPois())
        // if (!searchResult.getCurrentNumPois()) {
        //   COMMONJS.showToast('百度API没有搜索到该地址', 'warning')
        //   // _this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11) // 初始化地图,设置中心点坐标和地图级别
        // } else {
        for (var i = 0; i < searchResult.getCurrentNumPois(); i++) {
          // 获得需要得到的坐标
          var poi = searchResult.getPoi(i)
          if (!poi) {
            COMMONJS.showToast('百度API没有搜索到该地址', 'error')
          }
          if (!i) {
            // firstPoint = new BMap.Point(val.longitude, val.latitude);
            firstPoint = {
              longitude: poi.point.lng,
              latitude: poi.point.lat
            }
          }

          let myIcon = new BMap.Icon(require('../../assets/img/map/map-position.png'), new BMap.Size(26, 36))
          let point = new BMap.Point(poi.point.lng, poi.point.lat)
          _this.map.centerAndZoom(point, 16)
          // 创建标注，为要查询的地方对应的经纬度
          let marker = new BMap.Marker(point, { icon: myIcon }) // 自定义标记
          // alert("["+poi.point.lng+","+poi.point.lat+"]");
          // 在地图上添加标识
          _this.map.addOverlay(marker)
          marker.setAnimation(BMAP_ANIMATION_DROP)// 跳动的动画BMAP_ANIMATION_DROP BMAP_ANIMATION_BOUNCE
          if (i === (searchResult.getCurrentNumPois() - 1)) {
            _this.drawOverlay(marker, poi, firstPoint)
          } else {
            _this.drawOverlay(marker, poi)
          }
          // // 点击标识后显示的内容
          // contents[i] = '您选择的地点是:【' + poi.title + '】地址：' + poi.address// +"<br/>经度："+poi.point.lng+"<br/>纬度："+poi.point.lat;
          //
          // marker.setTitle(contents[i])
          // // 添加点击事件监听
          // marker.addEventListener('click', makerClick)
          // let infoWindow
          // if (i === 0) {
          //   // 设置中心点
          //   _this.map.centerAndZoom(poi.point, 13)
          //   infoWindow = new BMap.InfoWindow('<p style=\'font-size:14px;\'>' + contents[0] + '</p>')
          //   marker.openInfoWindow(infoWindow)
          //   address.lng = poi.point.lng
          //   address.lat = poi.point.lat
          //   infoWindow.addEventListener('close', function (type) {
          //     address = {}
          //   })
          // }
          // if ((_this.searchKey.latitude === poi.point.lat) && (_this.searchKey.longitude === poi.point.lng)) {
          //   // 设置中心点
          //   _this.map.centerAndZoom(poi.point, 13)
          //   infoWindow = new BMap.InfoWindow('<p style=\'font-size:14px;\'>' + contents[0] + '</p>')
          //   marker.openInfoWindow(infoWindow)
          //   address.lng = poi.point.lng
          //   address.lat = poi.point.lat
          //   infoWindow.addEventListener('close', function (type) {
          //     address = {}
          //   })
          // }
        }
        // }
      })
      this.local.search(myValue)
      // this.local.search(myValue)
      // var makerClick = function (e) {
      //   var infoWindow = new BMap.InfoWindow('<p style=\'font-size:14px;\'>' + this.getTitle() + '</p>')
      //   this.openInfoWindow(infoWindow)
      //   address.lng = e.target.point.lng
      //   address.lat = e.target.point.lat
      //   // infoWindow.close(function (type, target) {
      //   //     console.log(type)
      //   // })
      //   infoWindow.addEventListener('close', function (type) {
      //     address = {}
      //   })
      // }

      // $('#search-button').click(function () {
      //   var keys = document.getElementById('suggestId').value
      //   local.search(keys)
      // })
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
        div.id = val.uid
        // div.entName = val.entName
        // div.entType = val.entType
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
        // _this.$emit('reload', {
        //   commonWindowVisible: false
        // })
        // let id = mySquare._div.id
        // _this.entName = mySquare._div.entName
        // let entType = mySquare._div.entType
        // 详情级别
        // let zoomLevel = _this.map.getZoom()
        // function calProportion(level) {
        //     let zoomLevelMax = 18
        //     return Math.pow(2,zoomLevelMax-level)
        // }
        // let calScale = calProportion(zoomLevel)
        // // 根据地图级别手动计算经纬偏移量
        // let point = new BMap.Point(e.target.point.lng+0.004500593212499999*calScale, e.target.point.lat+0.0027405969499999998*calScale);
        // _this.map.centerAndZoom(point, zoomLevel);
        let mapAddress = document.querySelector('.map-address')
        mapAddress && mapAddress.parentNode.removeChild(mapAddress)
        // let infoWindow = document.querySelectorAll(".waste-business-window")
        // if(infoWindow.length > 0) {
        //     infoWindow.forEach(function (val) {
        //         val.parentNode.innerHTML = ''
        //     })
        // }
        mySquare.show()
        let MyComponent = Vue.extend({
          template: '<div class="map-address">' +
            '      <div class="map-form-item">' +
            '        地址：{{poi.address}}' +
            '      </div>' +
            '      <div class="map-form-item">' +
            '        经度: {{poi.point.lng}}' +
            '      </div>' +
            '      <div class="map-form-item">' +
            '        纬度: {{poi.point.lat}}' +
            '      </div>' +
            '      <div class="map-form-item">' +
            '        <el-button type="primary" @click="saveAddress()">保存</el-button>' +
            '        <el-button @click="closeInfo">取消</el-button>' +
            '      </div>' +
            '    </div>',
          data () {
            return {
              poi: val
            }
          },
          mounted () {
            // let _this = this
            // setTimeout(function () {
            //   _this.getTotalProdEntInfoStatistics()
            // }, 100)
          },
          methods: {
            closeInfo: function () {
              // document.querySelector(".waste-business-window").parentNode.innerHTML = ''
              var mapAddress = document.querySelector('.map-address')
              mapAddress && mapAddress.parentNode.removeChild(mapAddress)
            },
            saveAddress () {
              _this.saveAddress({ lng: this.poi.point.lng, lat: this.poi.point.lat })
            }
          }
        })
        let component = new MyComponent().$mount()
        mySquare._div.appendChild(component.$el)
        _this.map.addOverlay(mySquare)
      })
      if (firstPoint) {
        // _this.searchKey.latitude === poi.point.lat) && (_this.searchKey.longitude
        let point = new BMap.Point(firstPoint.longitude, firstPoint.latitude)
        _this.map.centerAndZoom(point, 16)
      }
      // firstPoint && _this.map.centerAndZoom(firstPoint, 16)
    },
    G (id) {
      return document.getElementById(id)
    },
    searchFunc () {
      let key = this.searchValue
      this.setPlace(key)
    },
    saveAddress (obj) {
      this.$emit('changePosition', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
  .map-container {
    height: 100%;

    .map-form {
      position: absolute;
      width: 100%;
      z-index: 1;
      top: 5%;
      #r-result{
        width: 60%;
        margin: 0 auto;
      }
    }
  }

  #allmap {
    height: 100%;
  }
</style>
