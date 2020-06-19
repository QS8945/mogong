<template>
  <div class="view-total">
    <div class="tmp-title">
      <div class="tmp-title-text">
        &nbsp;&nbsp;{{title[1]}}
      </div>
    </div>
    <div class="table-form">
      <el-row>
        <el-col :span="6" style="text-align: left">
          <el-button type="primary" icon="el-icon-plus" @click="enterpriseEntry">新增</el-button>
        </el-col>
        <el-col :span="6" :offset="12" style="text-align: right">
          <el-input placeholder="请输入内容" v-model="queryForm.keyword" @keyup.enter.native="queryData" @change="queryData"
                    class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="queryData"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div>
        <el-table
          :data="records"
          v-loading="loadingTable"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :height="tableHeight"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="socialCreditCode"
            align="center"
            label="统一社会信用代码"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="linkPhone"
            align="center"
            label="手机号码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="hasRiskReport"
            align="center"
            label="有无风险评估报告"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.hasRiskReport ? '有' : '无'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="factoryQty"
            align="right"
            label="厂区数量"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="depthEvaluationTime"
            align="center"
            label="最终报告生成时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.depthEvaluationTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="statusName"
            align="center"
            label="状态">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" :open-delay="openDelay" placement="top-start">
                <span class="starnd_color" v-if="scope.row.status === '1000' || scope.row.status === '1020'"
                      @click="handleClick(scope.row)" type="text" size="small">
                  <i class="el-icon-edit-outline"></i>
                </span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" :open-delay="openDelay" placement="top-start">
              <span class="series_color" v-if="scope.row.status === '1000' || scope.row.status === '1020'"
                    @click="handleClick(scope.row)" type="text" size="small">
                <i class="el-icon-delete"></i>
              </span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看" :open-delay="openDelay" placement="top-start">
              <span class="starnd_color" v-if="scope.row.status !== '1000' && scope.row.status !== '1020'"
                    @click="handleClick(scope.row)" type="text" size="small">
                <i class="el-icon-view"></i>
              </span>
              </el-tooltip>
              <!--<el-button type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <!--<span class="demonstration">完整功能</span>-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.size"
            :layout="page.layout"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getPageEnterpriseInfo } from '@/assets/js/API/api'

export default {
  name: 'enterpriseList',
  data () {
    return {
      title: ['投保企业档案', '测试'],
      tableHeight: 'calc(100vh - 277px)',
      queryForm: {
        keyword: ''
      },
      openDelay: 500,
      records: [],
      loadingTable: false,
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        sizes: GLB_CONSTANT.page.sizes,
        prevText: GLB_CONSTANT.page.prevText,
        nextText: GLB_CONSTANT.page.nextText,
        layout: GLB_CONSTANT.page.layout,
        total: 0
      }
    }
  },
  created () {
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    enterpriseEntry () {
      this.$router.push(
        { path: '/enterpriseEntry' }
      )
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      // let url = 'enterpriseInfo/pageEnterpriseInfo'
      this.queryForm.current = this.page.current
      this.queryForm.size = this.page.size
      this.loadingTable = true
      getPageEnterpriseInfo(this.queryForm)
        .then(res => {
          _this.loadingTable = false
          this.page.total = res.data.data.total
          this.records = res.data.data.records
        }).catch(err => {
          _this.loadingTable = false
        })
    },
    handleCurrentChange (index) {
      this.page.current = index
      this.getData()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    handleClick (row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
  .view-total{
    display: flex;
    flex-direction: column;
    background: #fff;
    .tmp-title{
      font-weight: 550;
      font-size: 16px;
      padding: 16px 14px;
      .tmp-title-text{
        border-left: 3px solid #0f4dbc;
        text-align: left;
      }
    }
    .table-form {
      border-top: 1px solid #ebf0f5;
      padding: 14px;
      /*height: calc(100vh - 128px);*/
      .el-row{
        margin-bottom: 14px;
      }
    }
  }
</style>
