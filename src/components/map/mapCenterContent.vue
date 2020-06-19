<template>
  <div class="content-center">
    <!--<div class="weight-title">企业数量</div>-->
    <div @click="movetoLeft(0)" class="icon-arrow icon-arrow-left"><i class="el-icon-arrow-left"></i></div>
    <div @click="movetoRight(0)" class="icon-arrow icon-arrow-right"><i class="el-icon-arrow-right"></i></div>
    <div class="content-center-list" ref="maxContentLength">
      <div class="content-center-truth-length" :style="[moveDistance]" ref="contentCenterTruth" @mousedown="moveStart">
        <div class="content-center-item" v-for="item in businessNum" :key="item.name">
          <div class="content-center-item-border" @mousedown="mousedown" @mouseup="mouseup(item)">
            <div class="center-item-value">{{item.entNum}}<span class="center-item-unit">个</span></div>
            <div class="center-item-name link-point">{{item.cantonName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cantonEntNumStatistics } from '@/assets/js/API/api'
export default {
  name: 'mapCenterContent',
  data () {
    return {
      // 称重动态
      businessNum: [],
      dragDistance: 0,
      moveDistance: {
        left: 0
      },
      mousedownX: '',
      mousedownY: ''
    }
  },
  mounted () {
    this.getBusinessNum()
  },
  methods: {
    getBusinessNum () {
      let _this = this
      cantonEntNumStatistics()
        .then(res => {
          // let res = []
          // let res = {}
          // res.data = [{
          //   entNum: 1000,
          //   cantonName: '全市'
          // }, {
          //   entNum: 40,
          //   cantonName: '浦城县'
          // }, {
          //   entNum: 22,
          //   cantonName: '光泽县'
          // }, {
          //   entNum: 88,
          //   cantonName: '松溪县'
          // }, {
          //   entNum: 42,
          //   cantonName: '政和县'
          // }, {
          //   entNum: 70,
          //   cantonName: '邵武县'
          // }, {
          //   entNum: 80,
          //   cantonName: '武夷山市'
          // }, {
          //   entNum: 88,
          //   cantonName: '松溪县1'
          // }, {
          //   entNum: 42,
          //   cantonName: '政和县2'
          // }, {
          //   entNum: 70,
          //   cantonName: '邵武县3'
          // }, {
          //   entNum: 80,
          //   cantonName: '武夷山市4'
          // }]
          // 屏蔽name
          // res.data.forEach(function (val) {
          //   val.cantonName = '*******'
          // })
          _this.businessNum = res.data
        }).catch(() => {
        })
    },
    movetoRight (val) {
      let _this = this
      let num = parseInt(this.moveDistance.left)
      let maxContentLength = this.$refs['maxContentLength'].offsetWidth
      let distance = val || maxContentLength
      let contentCenterTruth = this.$refs['contentCenterTruth'].offsetWidth
      if ((num - 0.5 * distance) < (-contentCenterTruth + maxContentLength)) {
        num = -contentCenterTruth + maxContentLength - 0.5 * distance
        setTimeout(function () {
          num = -contentCenterTruth + maxContentLength
          _this.moveDistance.left = num + 'px'
        }, 500)
      } else {
        num -= 0.5 * distance
      }
      this.moveDistance.left = num + 'px'
    },
    movetoLeft (val) {
      let _this = this
      let num = parseInt(this.moveDistance.left)
      let maxContentLength = this.$refs['maxContentLength'].offsetWidth
      let distance = val || maxContentLength
      if ((num + 0.5 * distance) > 0) {
        num = 0.5 * distance
        setTimeout(function () {
          num = 0
          _this.moveDistance.left = num + 'px'
        }, 500)
      } else {
        num += 0.5 * distance
      }
      this.moveDistance.left = num + 'px'
    },
    moveStart (e) {
      let dragable = true
      let _this = this
      let startX = e.clientX
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        if (dragable) {
          _this.dragDistance = e.clientX - startX
          if (_this.dragDistance > 5) {
            this.movetoLeft(Math.abs(_this.dragDistance))
          } else if (_this.dragDistance < -5) {
            this.movetoRight(Math.abs(_this.dragDistance))
          }
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        dragable = false
      }
    },
    getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, cantonCode }) {
      this.$emit('companyData', { functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, cantonCode })
      // _this.getCompany({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, id })
    },
    getCompanyType: function (item) {
      if (item.cantonCode) {
        this.getCompany({ functionType: 'enterprise', busTitle: item.cantonName, busPlaceholder: '请输入企业名称', hideSearchForm: true, cantonCode: item.cantonCode })
      } else {
        this.getCompany({ functionType: 'enterprise', busTitle: item.cantonName, busPlaceholder: '请输入企业名称', hideSearchForm: true })
      }
    },
    mousedown: function (e) {
      this.mousedownX = e.clientX
      this.mousedownY = e.clientY
    },
    mouseup: function (item) {
      var distanceX = Math.abs(event.clientX - this.mousedownX)
      var distanceY = Math.abs(event.clientY - this.mousedownY)
      if (distanceX || distanceY) {
      } else {
        this.getCompanyType(item)
      }
    }
  }
}
</script>

<style>

</style>
