<template>
  <div id="footer">
    <div class="footer-row">
      <ul>
        <li v-for="item in friendLinks" :key="item.name">
          <!-- <a :href="item.url">{{item.name}}</a> -->
          <router-link :to="item.url">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
    <div class="footer-row">Copyright&nbsp;&nbsp;©️&nbsp;2020&nbsp;{{companyName}}&nbsp;&nbsp;</div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      companyName: '苏州望涯信息科技有限公司出品',
      friendLinks: [{
        name: '帮助',
        url: ''
      }, {
        name: '隐私',
        url: ''
      }, {
        name: '条款',
        url: ''
      },]
      // friendLinks: [{
      //   name: '友情链接',
      //   url: ''
      // }, {
      //   name: '神彩科技',
      //   url: '/404'
      // }, {
      //   name: '小地磅',
      //   url: '/404'
      // }, {
      //   name: '安全用电管理系统',
      //   url: '/404'
      // }, {
      //   name: 'mes生产管理软件',
      //   url: '/404'
      // }, {
      //   name: '活性炭厂家',
      //   url: '/404'
      // }, {
      //   name: '氮气检测仪',
      //   url: '/404'
      // }]
    }
  },
  // watch: {
  //   langValue (newValue, oldValue) {
  //     this.toggleLang(newValue)
  //   }
  // },
  methods: {
  },
  mounted () {
    // this.openFullScreen()
  }
}
</script>

<style lang="scss" scoped>
  #footer{
    font-size: 12px;
    color: rgb(163,163,163);
    padding: 19px 0;
    .footer-row{
      text-align: center;
      padding: 5px 0;
      ul{
        li{
          display: inline-block;
          padding: 0 20px;
          // border-right: 1px solid rgb(163,163,163);
          font-size: 14px;
          // &:nth-last-child(1){
          //   border-right: none;
          // }
          a{
            color: #A9A9A9;
            text-decoration: none;
            &:hover{
              color: #39B29A;
            }
          }
        }
      }
    }
  }
</style>
