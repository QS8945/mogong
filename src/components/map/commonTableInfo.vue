<template>
  <div>
    <div class="info-window bus-data" :class="{'enterprise-bus-data':functionType==='enterprise'||functionType==='prod_storage'||functionType==='prod_waste_type'}" v-if="comVisible" v-cloak>
      <div class="info-title" v-cloak>&nbsp;&nbsp;{{busTitle}}</div>
      <div class="info-close-btn"><el-button icon="el-icon-close" circle @click="cancelBusiness"></el-button></div>
      <div class="bus-form">
        <el-form :inline="true" class="bus-form-inline">
          <el-form-item v-if="!hideSearchForm">
            <el-input v-model="queryKey" :placeholder="busPlaceholder" clearable @keyup.enter.native="queryData"></el-input>
          </el-form-item>
          <el-form-item v-if="!hideSearchForm">
            <el-button type="primary" @click="queryData">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="bus-enterprise-content">
          <el-table v-if="functionType!=='enterprise'&&functionType!=='prod_storage'&&functionType!=='prod_waste_type'&&functionType!=='prod_inventory_by_ent_detail'&&functionType!=='prod_inventory_by_waste_code_detail'"
                    height="517"
                    :data="companyDataList.pageResult.records" :stripe="true" :pager-count="5" :highlight-current-row="false"
                    style="width: 100%">
            <template v-if="companyDataList.isExpand">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item v-for="item in companyDataList.expandTableHead" :label="item.name" :key="item.entId">
                      <span>{{ props.row[item.value] }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
            </template>
            <template v-for="bodyItem in companyDataList.tableHead">
              <el-table-column v-if="bodyItem.name !== 'inventoryQty' && bodyItem.name !== 'weight' && bodyItem.name !== 'changeQty' && bodyItem.name !== 'changeRank'"
                               :prop="bodyItem.name"
                               :label="bodyItem.value"
                               :show-overflow-tooltip="true"
                               :key="bodyItem.value"
                               align="center">
                <!--<template slot-scope="scope" v-if="bodyItem.name === 'inventoryQty'">-->
                <!--{{scope.row[bodyItem.name] | formatNum}}-->
                <!--</template>-->
                <!--<template slot-scope="scope">-->
                <!--{{scope.row[bodyItem.name]}}-->
                <!--</template>-->
              </el-table-column>
              <el-table-column :sortable="(bodyItem.name === 'weight')?true:false" v-if="bodyItem.name === 'inventoryQty' || bodyItem.name === 'weight'"
                               :prop="bodyItem.name"
                               :label="bodyItem.value"
                               :show-overflow-tooltip="true"
                               :key="bodyItem.value"
                               align="right">
                <template slot-scope="scope">
                  {{scope.row[bodyItem.name] | formatNum}}
                </template>
              </el-table-column>
              <el-table-column :sortable="(bodyItem.name === 'changeQty')?true:false" v-if="bodyItem.name === 'changeQty'"
                               :prop="bodyItem.name"
                               :label="bodyItem.value"
                               :show-overflow-tooltip="true"
                               :key="bodyItem.value"
                               align="center">
                <template slot-scope="scope">
                  <div :class="{'text-red':(scope.row[bodyItem.name]>0),'text-green':(scope.row[bodyItem.name]<0)}">
                    {{scope.row[bodyItem.name]===0 ? '-':(scope.row[bodyItem.name] > 0 ? '+'+scope.row[bodyItem.name] : scope.row[bodyItem.name])}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :sortable="(bodyItem.name === 'changeRank')?true:false" v-if="bodyItem.name === 'changeRank'"
                               :prop="bodyItem.name"
                               :label="bodyItem.value"
                               :show-overflow-tooltip="true"
                               :key="bodyItem.value"
                               align="center">
                <template slot-scope="scope">
                  <div :class="{'text-red':(scope.row[bodyItem.name]>0),'text-green':(scope.row[bodyItem.name]<0)}">
                    <span v-if="scope.row[bodyItem.name]<0" class="icon iconfont icondown"></span>
                    <span v-if="scope.row[bodyItem.name]>0" class="icon iconfont iconup"></span>
                    {{scope.row[bodyItem.name]===0 ? '-':(scope.row[bodyItem.name] > 0 ? scope.row[bodyItem.name] : Math.abs(scope.row[bodyItem.name]))}}
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <div v-if="functionType==='enterprise' || functionType==='prod_storage' || functionType==='prod_waste_type' || functionType==='prod_inventory_by_ent_detail' || functionType==='prod_inventory_by_waste_code_detail'" class="content-cards">
            <el-row v-for="(enterprise, index) in enterpriseList" :gutter="12" :key="index">
              <el-col v-for="enterpriseItem in enterprise" :span="8" :key="enterpriseItem.entName">
                <el-card v-if="functionType==='enterprise'" shadow="hover">
                  <el-tooltip :content="enterpriseItem.entName" placement="top" :enterable="false">
                    <div class="content-card-title link-point" v-cloak @click="getWeightPosition(enterpriseItem.longitude,enterpriseItem.latitude,functionType)">{{enterpriseItem.entName}}</div>
                  </el-tooltip>
                  <div class="content-card-body">
                    <div class="content-body-name" v-cloak><span class="icon iconfont iconname"></span>{{enterpriseItem.contact || '-'}}</div>
                    <div class="content-body-tel" v-cloak><span class="icon iconfont icontel"></span>{{enterpriseItem.contactNumber || '-'}}</div>
                  </div>
                </el-card>
                <el-card v-if="functionType==='prod_storage'||functionType==='prod_waste_type'||functionType==='prod_inventory_by_ent_detail'||functionType==='prod_inventory_by_waste_code_detail'" shadow="hover">
                  <div class="content-storage">
                    <div v-for="keyItem in enterpriseItem" :key="keyItem.value">
                      {{keyItem.name}}:  {{keyItem.value}}
                    </div>
                  </div>
                </el-card>
                <!--<el-card v-if="functionType==='prod_waste_type'" shadow="hover">-->
                <!--<el-tooltip :content="enterpriseItem.entName" placement="top" :enterable="false">-->
                <!--<div class="content-card-title link-point" v-cloak>{{enterpriseItem.entName}}</div>-->
                <!--</el-tooltip>-->
                <!--<div class="content-card-body">-->
                <!--<div class="content-body-name" v-cloak><span class="icon iconfont iconname"></span>{{enterpriseItem.contact || '-'}}</div>-->
                <!--<div class="content-body-tel" v-cloak><span class="icon iconfont icontel"></span>{{enterpriseItem.contactNumber || '-'}}</div>-->
                <!--</div>-->
                <!--</el-card>-->
              </el-col>
            </el-row>
          </div>
          <el-pagination id="mapCommonPage" v-if="functionType!=='prod_storage'"
                         :class="{'enterprise-pagination':functionType==='enterprise'||functionType==='prod_storage'||functionType==='prod_waste_type'}"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         background
                         :current-page="page.current"
                         :page-sizes="page.sizes"
                         :page-size="page.size"
                         :layout="page.layout"
                         :total="page.total"
                         :pager-count="page.pagerCount"
                         :hide-on-single-page="true">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatisticsTableResut } from '@/assets/js/API/api'
export default {
  name: 'commonTableInfo',
  data () {
    return {
      comVisible: false,
      page: {
        current: 1,
        size: 10,
        sizes: [10, 50, 100],
        layout: 'prev, pager, next, sizes',
        pagerCount: 5,
        total: 0
      },
      // 企业列表数据
      companyDataList: [],
      hideSearchForm: false,
      busPlaceholder: '',
      busTitle: '',
      queryKey: '',
      functionType: ''
    }
  },
  filters: {
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  methods: {
    getCompany: function ({ functionType, busTitle, busPlaceholder, hideSearchForm, queryKey, id, cantonCode }) {
      let wasteBusinessWindow = document.querySelector('.waste-business-window')
      wasteBusinessWindow && wasteBusinessWindow.parentNode.removeChild(wasteBusinessWindow)
      this.hideSearchForm = hideSearchForm || false
      // this.busVisible = true
      this.page.current = 1
      this.page.size = 10
      this.queryKey = queryKey || ''
      this.busPlaceholder = busPlaceholder
      this.busTitle = busTitle
      this.functionType = functionType
      if (functionType === 'enterprise' || functionType === 'prod_storage' || functionType === 'prod_waste_type') {
        this.page.layout = 'prev, next'
        this.page.size = 9
      } else {
        this.page.layout = 'prev, pager, next, sizes'
        this.page.size = 10
      }
      this.entId = id
      this.getCompanyList(id, cantonCode)
    },
    getCompanyList: function (id, cantonCode) {
      this.comVisible = false
      let _this = this
      let postData = {
        queryKey: this.queryKey,
        functionType: this.functionType,
        current: this.page.current,
        size: this.page.size,
        entId: id,
        cantonCode: cantonCode
      }
      getStatisticsTableResut(postData)
        .then(res => {
          _this.enterpriseList = []
          let enterpriseRowList = []
          if (_this.functionType === 'enterprise') {
            res.data.pageResult.records.forEach(function (val, index) {
              let remainderNum = index % 3
              if (remainderNum === 0) {
                enterpriseRowList = []
              }
              let item = {
                entName: val.entName,
                // entName: '*************************************',
                contact: val.contact,
                contactNumber: val.contactNumber,
                latitude: val.latitude,
                longitude: val.longitude
              }
              enterpriseRowList.push(item)
              if (enterpriseRowList.length === 3) {
                _this.enterpriseList.push(enterpriseRowList)
              } else if (index === (res.data.pageResult.records.length - 1)) {
                _this.enterpriseList.push(enterpriseRowList)
              }
            })
            _this.$forceUpdate()
          } else if (_this.functionType === 'prod_storage') {
            res.data.pageResult.records.forEach(function (val, index) {
              let remainderNum = index % 3
              if (remainderNum === 0) {
                enterpriseRowList = []
              }
              let item = []
              let objItem = {}
              for (let key in val) {
                switch (key) {
                  case 'storageName':
                    objItem = {
                      name: '仓库',
                      value: val[key]
                    }
                    item.push(objItem)
                    break
                  case 'restCapacity':
                    objItem = {
                      name: '可存量',
                      value: parseFloat(parseFloat(val[key] || 0).toFixed(2))
                    }
                    item.push(objItem)
                    break
                  case 'inventoryQty':
                    objItem = {
                      name: '已存量',
                      value: parseFloat(parseFloat(val[key] || 0).toFixed(2))
                    }
                    item.push(objItem)
                    break
                  case 'inventoryRate':
                    objItem = {
                      name: '已存百分比',
                      value: val[key] + '%'
                    }
                    item.push(objItem)
                    break
                }
              }
              enterpriseRowList.push(item)
              if (enterpriseRowList.length === 3) {
                _this.enterpriseList.push(enterpriseRowList)
                enterpriseRowList = []
              }
            })
            if (enterpriseRowList.length) {
              _this.enterpriseList.push(enterpriseRowList)
            }
            _this.$forceUpdate()
          } else if (_this.functionType === 'prod_waste_type') {
            res.data.pageResult.records.forEach(function (val, index) {
              let remainderNum = index % 3
              if (remainderNum === 0) {
                enterpriseRowList = []
              }
              let item = []
              let objItem = {}
              for (let key in val) {
                switch (key) {
                  case 'wasteCode':
                    objItem = {
                      name: '八位码',
                      value: val[key]
                    }
                    item.push(objItem)
                    break
                  case 'wasteName':
                    objItem = {
                      name: '危废俗称',
                      value: val[key]
                    }
                    item.push(objItem)
                    break
                  case 'inventoryQty':
                    objItem = {
                      name: '库存量',
                      value: parseFloat(parseFloat(val[key] || 0).toFixed(2))
                    }
                    item.push(objItem)
                    break
                }
              }
              enterpriseRowList.push(item)
              if (enterpriseRowList.length === 3) {
                _this.enterpriseList.push(enterpriseRowList)
                enterpriseRowList = []
              }
            })
            if (enterpriseRowList.length) {
              _this.enterpriseList.push(enterpriseRowList)
            }
            _this.$forceUpdate()
          } else if (_this.functionType === 'prod_inventory_by_waste_code_detail') {
            res.data.pageResult.records.forEach(function (val, index) {
              let remainderNum = index % 3
              if (remainderNum === 0) {
                enterpriseRowList = []
              }
              let item = []
              let objItem = {}
              for (let key in val) {
                switch (key) {
                  case 'entName':
                    objItem = {
                      name: '企业名称',
                      value: val[key]
                      // value: '**************'
                    }
                    item.push(objItem)
                    break
                  case 'inventoryQty':
                    objItem = {
                      name: '库存量',
                      value: parseFloat(parseFloat(val[key] || 0).toFixed(2)) + '吨'
                    }
                    item.push(objItem)
                    break
                }
              }
              enterpriseRowList.push(item)
              if (enterpriseRowList.length === 3) {
                _this.enterpriseList.push(enterpriseRowList)
                enterpriseRowList = []
              }
            })
            if (enterpriseRowList.length) {
              _this.enterpriseList.push(enterpriseRowList)
            }
            _this.$forceUpdate()
          } else if (_this.functionType === 'prod_inventory_by_ent_detail') {
            res.data.pageResult.records.forEach(function (val, index) {
              let remainderNum = index % 3
              if (remainderNum === 0) {
                enterpriseRowList = []
              }
              let item = []
              let objItem = {}
              for (let key in val) {
                switch (key) {
                  case 'wasteName':
                    objItem = {
                      name: '危废俗称',
                      value: val[key]
                    }
                    item.push(objItem)
                    break
                  case 'wasteCode':
                    objItem = {
                      name: '八位码',
                      value: val[key]
                    }
                    item.push(objItem)
                    break
                  case 'inventoryQty':
                    objItem = {
                      name: '库存量',
                      value: parseFloat(parseFloat(val[key] || 0).toFixed(2)) + '吨'
                    }
                    item.push(objItem)
                    break
                }
              }
              enterpriseRowList.push(item)
              if (enterpriseRowList.length === 3) {
                _this.enterpriseList.push(enterpriseRowList)
                enterpriseRowList = []
              }
            })
            if (enterpriseRowList.length) {
              _this.enterpriseList.push(enterpriseRowList)
            }
            _this.$forceUpdate()
          }
          // 屏蔽name
          // res.data.pageResult.records.forEach(function (val) {
          //   val.entName = '************************'
          // })
          _this.companyDataList = res.data
          _this.page.total = res.data.pageResult.total
          _this.$forceUpdate()
          _this.comVisible = true
        }).catch(() => {
        })
    },
    queryData: function () {
      this.page.current = 1
      let id = this.entId
      this.getCompanyList(id)
    },
    handleSizeChange: function (val) {
      this.page.size = val
      this.page.current = 1
      let id = this.entId
      this.getCompanyList(id)
    },
    handleCurrentChange: function (index) {
      this.page.current = index
      let id = this.entId
      this.getCompanyList(id)
    },
    cancelBusiness: function () {
      this.$emit('reload', {
        commonWindowVisible: false
      })
      // this.busVisible = false
    },
    getWeightPosition: function (longitude, latitude, functionType) {
      this.$emit('reload', {
        commonWindowVisible: false
      })
      if (functionType === 'enterprise') {
        this.$emit('changePositionCenter', {
          longitude: longitude,
          latitude: latitude
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .park-overview{
    .el-progress-bar .el-progress-bar__outer{
      background: rgba(56,214,255,0.14);
    }
    .el-table{
      background-color: transparent;
      &::before{
        height: 0;
      }
      th, tr{
        background-color: transparent;
      }
      td{
        color: #BAEAEC;
        border: none;
      }
      th.is-leaf{
        border: none;
      }
      thead th{
        background-color: rgba(15,81,100,.77);
        border-color: rgba(15,81,100,.77);
        color: #fff;
        border-right: none;
        border-left: none;
      }
    }
    .el-table__row--striped td{
      background-color: rgba(15,81,100,.77) !important;
      border-color: rgba(15,81,100,.77);
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td{
      background-color: transparent;
    }
    .el-pagination{
      padding: 10px 5px 28px 5px;
      text-align: right;
    }
    .el-pager .number,.el-pager .btn-quickprev,.el-pager .btn-quicknext,.btn-next,.btn-prev,.el-pagination__sizes .el-select .el-input__inner,.el-select-dropdown{
      background:rgba(7,144,146,.22) !important;
      color: #77C2C5 !important;
      border:1px solid rgba(0,154,172,.22);
    }
    .el-popper[x-placement^=bottom] .popper__arrow::after,.el-popper[x-placement^=bottom] .popper__arrow{
      border-bottom-color: rgba(7,144,146,.22) !important;
    }
    .el-popper[x-placement^=top] .popper__arrow::after,.el-popper[x-placement^=top] .popper__arrow{
      border-top-color: rgba(7,144,146,.22);
    }
    .el-select-dropdown__item{
      color: #0EFCFF;
    }
    .el-select-dropdown__item.selected{
      color: rgba(255,255,255,.9);
    }
    .el-select-dropdown .el-select-dropdown__item.hover{
      background: rgba(7,144,146,.8) !important;
      color: #BAEAEC;
    }
    .el-pager .number.active{
      background:rgba(7,144,146,.8) !important;
      border:1px solid rgba(14,252,255,1);
    }
  }
</style>
