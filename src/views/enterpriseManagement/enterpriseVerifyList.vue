<template>
  <div>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen" @close="handleClose"
      :collapse="isCollapse">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>

    enterpriseVerifyList
    <div class="block">
      <span class="demonstration">默认 click 触发子菜单</span>
      <el-cascader
        :options="options"
        v-model="selectedOptions"
        @change="handleChange">
      </el-cascader>
    </div>
    <div class="box">
      <!--<div class="column">-->
      <!--<div class="ball"></div>-->
      <!--<div class="ball"></div>-->
      <!--</div>-->
      <!--<div class="column">-->
      <!--<div class="ball"></div>-->
      <!--<div class="ball"></div>-->
      <!--</div>-->
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
    <div class="flex-row">
      <div class="flex-row-column"></div>
      <div class="flex-row-column"></div>
      <div class="flex-row-column"></div>
    </div>
    <el-select v-model="value1" placeholder="请选择">
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-switch
      v-model="switchValue"
      active-color="#13ce66"
      inactive-color="#ff4949">
    </el-switch>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div id="main" style="width: 600px;height:400px;"></div>
    <el-tabs @tab-click="tabClick" type="border-card">
      <el-tab-pane label="图形化报表">
        <div class="circle-content">
          <div class="circle-charts" v-for="(item, index) in dataCircle" :key="index">
            <div class="circle-item" :id="getId(index)"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用户管理1">
        <div class="userManage">
          <div class="aside">
            <div class="cardUserManage" id="cardUserManage1" style="width: 600px;height:800px;">用户管理</div>
          </div>
          <div class="content">
            <div class="totalRank" id="totalRank1" style="width: 600px;height:400px;"></div>
            <div class="lastMonthRank" id="lastMonthRank1" style="width: 600px;height:400px;"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="表格化报表">
        <div id="cardGrid" style="width: 600px;height:400px;">表格化报表</div>
      </el-tab-pane>
      <el-tab-pane label="用户管理2">
        <div class="userManage">
          <div class="aside">
            <div class="cardUserManage" id="cardUserManage2" style="width: 600px;height:800px;">用户管理</div>
          </div>
          <div class="content">
            <div class="totalRank" id="totalRank2" style="width: 600px;height:400px;"></div>
            <div class="lastMonthRank" id="lastMonthRank2" style="width: 600px;height:400px;"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产废单位地磅使用情况一览">
        <div class="eil-waste">
          <div class="eil-use-num">
            <div class="eil-charts" id="eil-use-num"></div>
          </div>
          <div class="eil-per">
            <div class="bar-chart" id="bar-chart"></div>
            <div class="line-chart" id="line-chart"></div>
          </div>
          <div class="eil-use-num">
            <div class="eil-charts" id="eil-unuse"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div>
      <v-map-test></v-map-test>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <el-dialog :visible.sync="dialogVisible">
      <v-map-test></v-map-test>
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
    </el-dialog>
  </div>
</template>

<script>
import MapTest from '@/components/map/mapTest'

export default {
  name: 'enterpriseList',
  data () {
    return {
      isCollapse: true,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      switchValue: false,
      selectedOptions: [],
      optionCharts: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      },
      options1: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: '',
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      dataCircle: []
    }
  },
  mounted () {
    // var myChart = this.$echarts.init(document.getElementById('main'))
    // myChart.setOption(this.optionCharts)
    this.getUserManageCharts()
    this.getTotalRank()
    this.getLastMonthRank()
    this.resizeCharts()
    this.getCircleCharts()
    this.cardGrid()
  },
  methods: {
    handleChange (value) {
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getUserManageCharts () {
      let option = {
        title: {
          text: '累计产废类型及产废量排名',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2011年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['类别1', '类别2', '类别3', '类别4', '类别5', '类别6', '类别7', '类别8', '类别9', '类别10', '产废量（吨）']
        },
        series: [
          {
            name: '2012年',
            type: 'bar',
            data: [3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
            color: ['rgb(81,155,213)']
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('cardUserManage1'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 600,
      //   height: 800
      // })
    },
    getTotalRank () {
      let option = {
        title: {
          text: '产废单位总产废量排名',
          x: 'center'
          // textAlign: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['单位1', '单位2', '单位3', '单位4', '单位5', '单位6', '单位7', '单位8', '单位9', '单位10', '单位11', '单位12', '单位13', '单位14', '单位15', '单位16', '单位17', '单位18', '单位19', '单位20'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '产废量（吨）'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('totalRank1'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 300,
      //   height: 400
      // })
    },
    getLastMonthRank () {
      let option = {
        title: {
          text: '产废单位上月产废量排名',
          x: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['单位1', '单位2', '单位3', '单位4', '单位5', '单位6', '单位7', '单位8', '单位9', '单位10', '单位11', '单位12', '单位13', '单位14', '单位15', '单位16', '单位17', '单位18', '单位19', '单位20'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '产废量（吨）'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('lastMonthRank1'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 300,
      //   height: 400
      // })
    },
    getUserManageCharts2 () {
      let option = {
        title: {
          text: '累计产废类型及产废量排名',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['产废量（吨）'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '30',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['类别1', '类别2', '类别3', '类别4', '类别5', '类别6', '类别7', '类别8', '类别9', '类别10']
        },
        series: [
          {
            name: '产废量（吨）',
            type: 'bar',
            data: [3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
            color: ['rgb(81,155,213)'],
            barWidth: '30%'
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('cardUserManage2'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 600,
      //   height: 800
      // })
    },
    getTotalRank2 () {
      let option = {
        title: {
          text: '产废单位总产废量排名',
          x: 'center'
          // textAlign: 'center'
        },
        legend: {
          data: ['产废量（吨）'],
          top: '30'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['单位1', '单位2', '单位3', '单位4', '单位5', '单位6', '单位7', '单位8', '单位9', '单位10', '单位11', '单位12', '单位13', '单位14', '单位15', '单位16', '单位17', '单位18', '单位19', '单位20'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '产废量（吨）'
          }
        ],
        series: [
          {
            name: '产废量（吨）',
            type: 'bar',
            barWidth: '60%',
            data: [100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257, 100.972, 87.972, 134.312, 133.257]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('totalRank2'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 300,
      //   height: 400
      // })
    },
    getLastMonthRank2 () {
      let option = {
        title: {
          text: '产废单位总产废量排名',
          x: 'center'
          // textAlign: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [{
            name: '已存量（%）'
          }, {
            name: '可存量（%）'
          }],
          bottom: '0'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '30',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: ['单位1', '单位2', '单位3', '单位4', '单位5', '单位6', '单位7', '单位8', '单位9', '单位10', '单位11', '单位12', '单位13', '单位14', '单位15', '单位16', '单位17', '单位18', '单位19', '单位20']
        },
        series: [
          {
            name: '已存量（%）',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            barWidth: '60%',
            itemStyle: {
              color: 'rgb(91,155,213)'
            },
            data: [69, 68, 36, 51, 92, 51, 92, 69, 68, 36, 51, 92, 51, 92, 69, 68, 36, 51, 92, 51]
          },
          {
            name: '可存量（%）',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            itemStyle: {
              color: 'rgb(237,125,49)'
            },
            data: [31, 32, 64, 49, 8, 49, 8, 31, 32, 64, 49, 8, 49, 8, 31, 32, 64, 49, 8, 49]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('lastMonthRank2'))
      myChart.setOption(option)
      // myChart.resize({
      //   width: 300,
      //   height: 400
      // })
    },
    cardGrid () {
      // let option = {
      //   title: {
      //     text: '世界人口总量',
      //     subtext: '数据来自网络'
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'shadow'
      //     }
      //   },
      //   legend: {
      //     data: ['2011年', '2012年']
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'value',
      //     boundaryGap: [0, 0.01]
      //   },
      //   yAxis: {
      //     type: 'category',
      //     data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
      //   },
      //   series: [
      //     {
      //       name: '2011年',
      //       type: 'bar',
      //       data: [18203, 23489, 29034, 104970, 131744, 630230]
      //     },
      //     {
      //       name: '2012年',
      //       type: 'bar',
      //       data: [19325, 23438, 31000, 121594, 134141, 681807]
      //     }
      //   ]
      // }
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('main'))
      myChart.setOption(option)
      myChart.resize({
        width: 1200,
        height: 400
      })
    },
    tabClick (tab) {
      if (tab.label === '表格化报表') {
        // this.cardGrid()
      } else if (tab.label === '用户管理') {
        this.getUserManageCharts()
      } else if (tab.label === '用户管理2') {
        this.getUserManageCharts2()
        this.getTotalRank2()
        this.getLastMonthRank2()
        this.resizeCharts2()
      } else if (tab.label === '产废单位地磅使用情况一览') {
        this.getEilUseNum()
        this.getBarChart()
        this.getLineChart()
        this.getEilUnuse()
        this.getResize()
      }
    },
    resizeCharts () {
      var userManageChart = this.$echarts.getInstanceByDom(document.getElementById('cardUserManage1'))
      var totalRankChart = this.$echarts.getInstanceByDom(document.getElementById('totalRank1'))
      var lastMonthRankChart = this.$echarts.getInstanceByDom(document.getElementById('lastMonthRank1'))
      window.onresize = function () {
        userManageChart.resize()
        totalRankChart.resize()
        lastMonthRankChart.resize()
      }
      setTimeout(function () {
        userManageChart.resize()
        totalRankChart.resize()
        lastMonthRankChart.resize()
      }, 0)
    },
    resizeCharts2 () {
      var userManageChart = this.$echarts.getInstanceByDom(document.getElementById('cardUserManage2'))
      var totalRankChart = this.$echarts.getInstanceByDom(document.getElementById('totalRank2'))
      var lastMonthRankChart = this.$echarts.getInstanceByDom(document.getElementById('lastMonthRank2'))
      window.onresize = function () {
        userManageChart.resize()
        totalRankChart.resize()
        lastMonthRankChart.resize()
      }
      setTimeout(function () {
        userManageChart.resize()
        totalRankChart.resize()
        lastMonthRankChart.resize()
      }, 0)
    },
    getCircleCharts () {
      this.dataCircle = [{
        option: {
          title: {
            text: '某站点用户访问来源1',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }, {
        option: {
          title: {
            text: '某站点用户访问来源2',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }, {
        option: {
          title: {
            text: '某站点用户访问来源3',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }, {
        option: {
          title: {
            text: '某站点用户访问来源4',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }, {
        option: {
          title: {
            text: '某站点用户访问来源5',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }, {
        option: {
          title: {
            text: '某站点用户访问来源6',
            subtext: '纯属虚构',
            x: 'center',
            top: '30'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          backgroundColor: 'rgb(255,192,0)',
          legend: {
            orient: 'vertical',
            right: 'right',
            top: 'center',
            data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '危费种类1' },
                { value: 310, name: '危费种类2' },
                { value: 234, name: '危费种类3' },
                { value: 135, name: '危费种类4' },
                { value: 1548, name: '其他' }
              ],
              label: { // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16 // 文字的字体大小
                  },
                  formatter: '{d}%'

                }
              },
              avoidLabelOverlap: false,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }]
      let _this = this

      // setTimeout(function () {
      //   var myChart = _this.$echarts.init(document.getElementById('circle0'))
      //   myChart.setOption(_this.dataCircle[0].option)
      //   setTimeout(function () {
      //     myChart.resize()
      //   })
      // })
      setTimeout(function () {
        _this.dataCircle.forEach(function (val, index) {
          var myChart = _this.$echarts.init(document.getElementById('circle' + index))
          myChart.setOption(val.option)
          // setTimeout(function () {
          //   myChart.resize()
          // }, 0)
        })
        window.onresize = function () {
          _this.dataCircle.forEach(function (val, index) {
            var myChart = _this.$echarts.init(document.getElementById('circle' + index))
            myChart.resize()
          })
        }
      })
    },
    getId (index) {
      return 'circle' + index
    },
    getEilUseNum () {
      let option = {
        title: {
          text: '某站点用户访问来源1',
          subtext: '纯属虚构',
          x: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          right: 'center',
          bottom: 50,
          data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '危费种类1' },
              { value: 310, name: '危费种类2' },
              { value: 234, name: '危费种类3' },
              { value: 135, name: '危费种类4' },
              { value: 1548, name: '其他' }
            ],
            label: { // 饼图图形上的文本标签
              normal: {
                show: true,
                position: 'inner', // 标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: '{d}%'

              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('eil-use-num'))
      myChart.setOption(option)
    },
    getBarChart () {
      let option = {
        title: {
          text: '某站点用户访问占比',
          subtext: '纯属虚构',
          x: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['地磅称重', '手工录入'],
          right: 'center',
          bottom: 'bottom'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '30',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['占比']
        },
        series: [
          {
            name: '地磅称重',
            type: 'bar',
            stack: '总量',
            label: { // 饼图图形上的文本标签
              normal: {
                show: true,
                position: 'inside', // 标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: '{c}%'

              }
            },
            itemStyle: {
              color: 'rgb(91,155,213)'
            },
            barHeight: 20,
            barWidth: 20,
            data: [82]
          },
          {
            name: '手工录入',
            type: 'bar',
            stack: '总量',
            label: { // 饼图图形上的文本标签
              normal: {
                show: true,
                position: 'inside', // 标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: '{c}%'

              }
            },
            itemStyle: {
              color: 'rgb(237,125,49)'
            },
            barHeight: 20,
            barWidth: 20,
            data: [18]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('bar-chart'))
      myChart.setOption(option)
    },
    getLineChart () {
      let option = {
        title: {
          text: '某站点用户访问来源1',
          subtext: '纯属虚构',
          x: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} (次)'
        },
        legend: {
          right: 'center',
          top: 'bottom',
          data: ['使用次数']
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '使用次数',
            type: 'line',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('line-chart'))
      myChart.setOption(option)
      window.onresize = function () {
        myChart.resize()
      }
    },
    getEilUnuse () {
      let option = {
        title: {
          text: '某站点用户访问来源1',
          subtext: '纯属虚构',
          x: 'center',
          top: '30'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          right: 'center',
          bottom: 50,
          data: ['危费种类1', '危费种类2', '危费种类3', '危费种类4', '其他']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '危费种类1' },
              { value: 310, name: '危费种类2' },
              { value: 234, name: '危费种类3' },
              { value: 135, name: '危费种类4' },
              { value: 1548, name: '其他' }
            ],
            label: { // 饼图图形上的文本标签
              normal: {
                show: true,
                position: 'inner', // 标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: '{d}%'

              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      var myChart = this.$echarts.init(document.getElementById('eil-unuse'))
      myChart.setOption(option)
    },
    getResize () {
      var eilUseNum = this.$echarts.init(document.getElementById('eil-use-num'))
      var barChart = this.$echarts.init(document.getElementById('bar-chart'))
      var lineChart = this.$echarts.init(document.getElementById('line-chart'))
      var eilUnuse = this.$echarts.init(document.getElementById('eil-unuse'))
      window.onresize = function () {
        eilUseNum.resize()
        barChart.resize()
        lineChart.resize()
        eilUnuse.resize()
      }
      setTimeout(function () {
        eilUseNum.resize()
        barChart.resize()
        lineChart.resize()
        eilUnuse.resize()
      }, 0)
    }
  },
  components: {
    'v-map-test': MapTest
  }
}
</script>

<style scoped lang="scss">
  .eil-waste {
    display: flex;

    .eil-use-num {
      width: 25%;
      padding: 0 10px;
    }

    .eil-per {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      width: 50%;

      .bar-chart {
        border: 1px solid rgb(91, 155, 213);
        width: 100%;
        flex: 1;
        margin-bottom: 10px;
      }

      .line-chart {
        border: 1px solid rgb(91, 155, 213);
        width: 100%;
        flex: 1;
      }
    }

    .eil-charts {
      border: 1px solid rgb(91, 155, 213);
    }

    #eil-use-num, #eil-unuse {
      height: 700px;
    }
  }

  .circle-content {
    display: flex;
    flex-wrap: wrap;

    .circle-charts {
      width: calc(33% - 20px);
      padding: 10px;
      height: 324px;

      .circle-item {
        width: 100%;
        height: 100%;
        border: 1px solid rgb(91, 155, 213);
      }
    }
  }

  .userManage {
    display: flex;
    padding: 10px;

    .totalRank, .lastMonthRank, .aside {
      border: 1px solid rgb(91, 155, 213);
    }

    .aside {
      width: 40%;
      margin-right: 10px;
    }

    .totalRank {
      margin-bottom: 10px;
      width: 100%;
    }

    .content > .totalRank, .aside > .cardUserManage, .aside > .cardUserManage > div, .aside > .cardUserManage > div > canvas, .content > .totalRank > div, .content > .totalRank > div > canvas, .content > .lastMonthRank, .content > .lastMonthRank > div, .content > .lastMonthRank > div > canvas {
      width: 100% !important;
    }

    .content {
      width: 60%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .box {
    height: 200px;
    width: 200px;
    border: 1px solid #666;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: space-between;
    /*justify-content: flex-end;*/
    .ball {
      height: 66px;
      width: 66px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      background: #000;
    }

    /*.column{*/
    /*flex-basis: 100%;*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*}*/
    /*.ball:nth-child(2){
      align-self: center;
    }
    .ball:nth-child(3){
      align-self: flex-end;
    }*/
  }

  .flex-row {
    padding: 0 10px;
    display: flex;
    background: pink;

    .flex-row-column {
      background: lightskyblue;
      height: 50px;
      /*flex: 1;*/
      flex: 0 0 25%;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
    }

    .flex-row-column:nth-child(1) {
      flex: 0 0 50%;
    }
  }
</style>
