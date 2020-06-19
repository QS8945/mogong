<template>
  <div class="view-total baseForm video-page">
    <el-tabs v-if="tabVisible" v-model="activeName" :tab-position="'left'" style="height: 200px;" @tab-click="tabClick">
      <el-tab-pane v-for="item in videoList" :key="item.key" :label="item.name" :name="item.key" :lazy="true">
        <video :id="item.key" controls playsinline webkit-playsinline autoplay>
          <source type="application/x-mpegURL" :src="http_url"/>
          <source :src="rtmp_url"/>
        </video>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EZUIPlayer from 'ezuikit'
import COMMONJS from '@/assets/js/common.js'
import { getVideoToken, getVideoList } from '@/assets/js/API/api'

export default {
  name: 'videoTest',
  data () {
    return {
      // videoVisible: false,
      player: '',
      rtmp_url: '',
      http_url: '',
      message: '加载中...',
      appKey: '',
      appSecret: '',
      activeName: '',
      videoList: [],
      accessToken: '',
      tabVisible: false,
      page: {
        size: 50
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      switch (this.$route.query.id) {
        // 创冠
        case '2065711304378368':
          this.appKey = 'a91a91ddf3fc4178b0dd01c8fd067440'
          this.appSecret = '6630a0cf9dffeda1bf81e1a825f0cfeb'
          break
        // 绿益新
        case '2760498352392192':
          this.appKey = '1f55cf7d156d44529d6c85f5bd74b4ea'
          this.appSecret = 'de3da5c1ce99ef5c01a56394372b6fff'
          break
        default:
          COMMONJS.showToast('暂无视频', 'warning')
      }
      this.getVideoToken()
    } else {
      COMMONJS.showToast('暂无视频', 'warning')
    }
  },
  methods: {
    getVideoToken () {
      getVideoToken('', {
        appKey: this.appKey,
        appSecret: this.appSecret
      }).then(res => {
        this.accessToken = res.data.accessToken
        this.getVideoUrlList()
      }).catch(() => {
      })
    },
    tabClick () {
      for (var i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].key === this.activeName) {
          this.http_url = this.videoList[i].url
        }
      }
    },
    getVideoUrlList () {
      let _this = this
      getVideoList('', {
        accessToken: this.accessToken,
        pageSize: this.page.size
      }).then(res => {
        var videoList = []
        res.data.forEach(function (val, index) {
          var item = {}
          if (_this.$route.query.id === '2065711304378368') {
            switch (val.channelNo) {
              case 3:
                item.key = 'logisticsChannel'
                item.name = '物流通道'
                item.url = val.rtmpHd
                break
              case 4:
                item.key = 'wasteWarehouse'
                item.name = '危废仓库'
                item.url = val.rtmpHd
                break
              case 2:
                item.key = 'wastePosition'
                item.name = '产废点'
                item.url = val.rtmpHd
                break
              case 1:
                item.key = 'wasteWeight'
                item.name = '危废称重点'
                item.url = val.rtmpHd
                break
            }
          } else if (_this.$route.query.id === '2760498352392192') {
            switch (val.channelNo) {
              case 1:
                item.key = 'theGateGreen'
                item.name = '大门口'
                item.url = val.rtmpHd
                break
              case 2:
                item.key = 'temporaryRepository12Green'
                item.name = '1号暂存库-2库'
                item.url = val.rtmpHd
                break
              case 4:
                item.key = 'temporaryRepository11Green'
                item.name = '1号暂存库-1库'
                item.url = val.rtmpHd
                break
              case 5:
                item.key = 'temporaryRepository22Green'
                item.name = '2号暂存库-2库'
                item.url = val.rtmpHd
                break
              case 6:
                item.key = 'temporaryRepository21Green'
                item.name = '2号暂存库-1库'
                item.url = val.rtmpHd
                break
              case 7:
                item.key = 'temporaryRepositoryGroundGreen'
                item.name = '2号暂存库地磅'
                item.url = val.rtmpHd
                break
            }
          }
          if (JSON.stringify(item) !== '{}') {
            videoList.push(item)
          }
        })
        _this.activeName = videoList[0].key
        _this.videoList = videoList
        _this.tabVisible = true
        console.log(_this.videoList)
        _this.$nextTick(() => {
          _this.http_url = videoList[0].url
        })
      }).catch(() => {
      })
    }
  },
  updated () {
    if (this.http_url !== '') {
      // 如果在mounted中声明，直播地址还未取到，导致视频不显示。所以放在了这里
      this.player = new EZUIPlayer(this.activeName)
      this.player.load()
      this.player.play()
    }
  }
}
</script>

<style lang="scss">
  .video-page{
    .el-tabs{
      flex-grow: 1;
      .el-tabs__content{
        height: 100%;
        .el-tab-pane{
          height: 100%;
          display: flex;
          video,div{
            flex-grow: 1;
          }
        }
      }
    }
  }
  .mainClass{
    flex-grow: 1;
    display: flex;
    video{
      flex-grow: 1;
    }
  }
</style>
