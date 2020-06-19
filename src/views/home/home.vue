<template>
  <div class="view-total home">
    <div class="bg-grey">
      <el-row :gutter="10" class="home-top-row">
        <!--<el-col :span="8">-->
        <!--<div class="item">-->
        <!--<div class="item-title">-->
        <!--<div class="item-title-text">用户信息管理</div>-->
        <!--</div>-->
        <!--<div class="item-content">-->
        <!--<table class="table-user-info">-->
        <!--<tbody>-->
        <!--<tr>-->
        <!--<td>登录名</td>-->
        <!--<td>zhangsan</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>显示名称</td>-->
        <!--<td>张三</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>用户类型</td>-->
        <!--<td>管理员用户</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td>用户角色</td>-->
        <!--<td>处置企业系统管理员</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--</table>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-col>-->
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">
                待办事项({{todoCount}})
                <el-button class="back-to-customer" type="text" @click="getMoreInfo" plain><span class="el-icon-top-right"></span>更多</el-button>
              </div>
            </div>
            <div class="item-content">
              <el-table
                      :data="records"
                      style="width: 100%"
                      :height="tableHeight"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      row-key="id">
              <el-table-column
                      prop="procDefname"
                      label="流程名称"
                      :show-overflow-tooltip="true"
                      align="center">
              </el-table-column>
              <el-table-column
                      prop="taskName"
                      label="当前环节"
                      :show-overflow-tooltip="true"
                      align="center">
              </el-table-column>
              <el-table-column
                      prop="createTime"
                      label="创建时间"
                      :show-overflow-tooltip="true"
                      align="center">
                <template slot-scope="scope">
                  {{scope.row.createTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column
              prop="operation"
              label="操作"
              align="center">
              <template slot-scope="scope">
              <div class="opt-group">
              <span class="opt-base"
              @click="operationP(scope.row, 'deal')" type="text" size="small">
              {{scope.row.assignee==null||scope.row.assignee==''?'签收任务':'处理任务'}}
              </span>
              </div>
              </template>
              </el-table-column>
            </el-table>
          </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">我的客户(业务员版)</div>
            </div>
            <div class="item-content">
              <div class="parking-list parking-list-direction">
                <div class="chart-item chart-item-left" id="myCustomer">
                  <div class="no-data">暂无数据</div>
                </div>
                <div class="chart-item-right">
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本年签约</div><div class="signing-list-item-num">{{signData.yearCount}}</div></div>
                    <div class="signing-list-item"><!--<div class="signing-list-item-text">年环比</div><div class="signing-list-item-num">25<span class="small-size">%</span><span class="direction-icon" :class="true ? 'icon iconfont iconup1 color-green': 'icon iconfont icondown1 color-yellow'"></span></div>--></div>
                  </div>
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本月签约</div><div class="signing-list-item-num">{{signData.monthCount}}</div></div>
                    <div class="signing-list-item"><!--<div class="signing-list-item-text">月环比</div><div class="signing-list-item-num">3<span class="small-size">%</span><span class="direction-icon" :class="true ? 'icon iconfont iconup1 color-green': 'icon iconfont icondown1 color-yellow'"></span></div>--></div>
                  </div>
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本日签约</div><div class="signing-list-item-num">{{signData.weekCount}}</div></div>
                    <div class="signing-list-item"><!--<div class="signing-list-item-text">日环比</div><div class="signing-list-item-num">25<span class="small-size">%</span><span class="direction-icon"  :class="true ? 'icon iconfont iconup1 color-green': 'icon iconfont icondown1 color-yellow'"></span></div>--></div>
                  </div>
                </div>
              </div>
              <div class="today-parking-list">
                <div class="today-parking-list-title">
                  已送样客户
                </div>
                <div class="today-parking-list-content">
                  <div class="customer-list">
                    <div class="customer-item" v-for="item in hasSendCustomers" :key="item.id">
                      <div class="customer-item-title">
                        <el-tooltip :content="'【'+item.cantonName+'】'" placement="top" :enterable="false">
                          <div class="title-position">【 {{item.cantonName}} 】</div>
                        </el-tooltip>
                        <el-tooltip :content="item.name" placement="top" :enterable="false">
                          <div class="title-name">{{item.name}}</div>
                        </el-tooltip>
                      </div>
                      <div class="customer-item-content">
                        <div class="customer-content-list" v-for="val in item.businessActivityWasteInfoVOList" :key="val.id">
                          <el-tooltip :content="val.wasteCode" placement="top" :enterable="false">
                            <div class="customer-content-list-item">{{val.wasteCode}}</div>
                          </el-tooltip>
                          <el-tooltip :content="val.entWasteName" placement="top" :enterable="false">
                            <div class="customer-content-list-item">{{val.entWasteName}}</div>
                          </el-tooltip>
                          <!--<el-tooltip :content="val.status ? '合格' : '不合格'" placement="top" :enterable="false">-->
                            <!--<div class="customer-content-list-item" :class="{'color-green': val.status,'color-yellow': !val.status}">{{val.status ? '合格' : '不合格'}}</div>-->
                          <!--</el-tooltip>-->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <v-pagination :current="pageCustomer.current" :size="pageCustomer.size" :total="pageCustomer.total" :layout="pageCustomer.layout" :prevText="pageCustomer.prevText" :nextText="pageCustomer.nextText" @reloadPage="jumpPageCustomer"></v-pagination>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="home-top-row">
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">我的合同(业务员版)</div>
            </div>
            <div class="item-content">
              <div class="parking-list parking-list-direction">
                <div class="chart-item chart-item-left" id="myContract">
                  <div class="no-data">暂无数据</div>
                </div>
                <div class="chart-item-right">
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本年签约</div><div class="signing-list-item-num">{{salesManContractInfo.newestInfo.currentYear || 0}}</div></div>
                    <!--<div class="signing-list-item">-->
                      <!--<div class="signing-list-item-text">年环比</div>-->
                      <!--<div class="signing-list-item-num">-->
                      <!--{{salesManContractInfo.newestInfo.lastYear>0?parseFloat(((salesManContractInfo.newestInfo.currentYear-salesManContractInfo.newestInfo.lastYear)/salesManContractInfo.newestInfo.lastYear)*100).toFixed(1):0}}-->
                      <!--<span class="small-size">%</span><span class="direction-icon" :class="salesManContractInfo.newestInfo.currentYear-salesManContractInfo.newestInfo.lastYear>0 ? 'icon iconfont iconup1 color-green': salesManContractInfo.newestInfo.currentYear-salesManContractInfo.newestInfo.lastYear==0 ? '' : 'icon iconfont icondown1 color-yellow'"></span>-->
                      <!--</div>-->
                    <!--</div>-->
                  </div>
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本月签约</div><div class="signing-list-item-num">{{salesManContractInfo.newestInfo.currentMonth || 0}}</div></div>
                    <!--<div class="signing-list-item"><div class="signing-list-item-text">月环比</div>-->
                      <!--<div class="signing-list-item-num">-->
                      <!--{{salesManContractInfo.newestInfo.lastMonth>0?parseFloat(((salesManContractInfo.newestInfo.currentMonth-salesManContractInfo.newestInfo.lastMonth)/salesManContractInfo.newestInfo.lastMonth)*100).toFixed(1):0}}-->
                      <!--<span class="small-size">%</span><span class="direction-icon" :class="salesManContractInfo.newestInfo.currentMonth-salesManContractInfo.newestInfo.lastMonth>0 ? 'icon iconfont iconup1 color-green': salesManContractInfo.newestInfo.currentMonth-salesManContractInfo.newestInfo.lastMonth==0 ? '' : 'icon iconfont icondown1 color-yellow'"></span>-->
                      <!--</div>-->
                    <!--</div>-->
                  </div>
                  <div class="signing-list">
                    <div class="signing-list-item"><div class="signing-list-item-text">本周签约</div><div class="signing-list-item-num">{{salesManContractInfo.newestInfo.currentWeek || 0}}</div></div>
                    <!--<div class="signing-list-item">-->
                      <!--<div class="signing-list-item-text">周环比</div><div class="signing-list-item-num">-->
                      <!--{{salesManContractInfo.newestInfo.lastWeek>0?parseFloat(((salesManContractInfo.newestInfo.currentWeek-salesManContractInfo.newestInfo.lastWeek)/salesManContractInfo.newestInfo.lastWeek)*100).toFixed(1):0}}-->
                      <!--<span class="small-size">%</span>-->
                      <!--<span class="direction-icon" :class="((salesManContractInfo.newestInfo.currentWeek-salesManContractInfo.newestInfo.lastWeek)>0) ? 'icon iconfont iconup1 color-green': (((salesManContractInfo.newestInfo.currentWeek-salesManContractInfo.newestInfo.lastWeek)===0) ? '' : 'icon iconfont icondown1 color-yellow')"></span>-->
                    <!--</div>-->
                    <!--</div>-->
                  </div>
                </div>
              </div>
              <div class="today-parking-list">
                <div class="today-parking-list-content border-grey interval-top-block full-content">
                  <div class="icon-list">
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconzongliang"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.qtyCount || 0}}</div>
                        <div class="item-content-text">合同总量(吨)</div>
                      </div>
                    </div>
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconqian"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.totalPrice || 0}}</div>
                        <div class="item-content-text">总金额(元)</div>
                      </div>
                    </div>
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconzongliang"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.recQtyCount || 0}}</div>
                        <div class="item-content-text">接收量(吨)</div>
                      </div>
                    </div>
                  </div>
                  <div class="icon-list">
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconqian"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.yingshouPrice || 0}}</div>
                        <div class="item-content-text">应收款(元)</div>
                      </div>
                    </div>
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconqian"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.kaipiaoPrice || 0}}</div>
                        <div class="item-content-text">开票金额(元)</div>
                      </div>
                    </div>
                    <div class="icon-list-item">
                      <div class="item-icon">
                        <span class="icon iconfont iconqian"></span>
                      </div>
                      <div class="item-content">
                        <div class="item-content-num">{{salesManContractInfo.contractDetailInfo.backPrice || 0}}</div>
                        <div class="item-content-text">回款金额(元)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item my-inventory">
            <div class="item-title">
              <div class="item-title-text">我的库存</div>
            </div>
            <div class="item-content">
              <div class="parking-list parking-list-direction">
                <div class="chart-item chart-item-left" id="myInventoryAcceptWaste">
                  <div class="no-data">暂无数据</div>
                </div>
                <div class="chart-item-right padding-left-no" id="myInventorySecondaryWaste">
                  <div class="no-data">暂无数据</div>
                </div>
              </div>
              <div class="today-parking-list">
                <div class="today-parking-list-title">
                  超期预警
                </div>
                <div class="today-parking-list-content">
                  <el-table
                          :data="listOvertimeWaste"
                          style="width: 100%"
                          :height="tableHeight"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          row-key="id">
                    <el-table-column
                            prop="manifestNo"
                            label="联单号"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="customer"
                            label="客户名称"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="wasteCode"
                            label="八位码"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="wasteName"
                            label="危废俗称"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="qty"
                            label="库存量"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="inStorageTime"
                            label="入库时间"
                            :show-overflow-tooltip="true"
                            align="center">
                      <template slot-scope="scope">
                        {{scope.row.inStorageTime | formatDate}}
                      </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="operation"-->
                    <!--label="操作"-->
                    <!--align="center">-->
                    <!--<template slot-scope="scope">-->
                    <!--<div class="opt-group">-->
                    <!--<span class="opt-base"-->
                    <!--@click="operationP(scope.row, 'deal')" type="text" size="small">-->
                    <!--去处理-->
                    <!--</span>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="home-top-row">
        <el-col :span="12" class="home-top-row">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">我的派车计划</div>
            </div>
            <div class="item-content">
              <div class="parking-list title-list">
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.planCount || 0}}</div>
                  <div class="title-list-item-text">计划数量</div>
                </div>
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.signedCount || 0}}</div>
                  <div class="title-list-item-text">已签收</div>
                </div>
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.transCount || 0}}</div>
                  <div class="title-list-item-text">已派车</div>
                </div>
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.waiteTransCount || 0}}</div>
                  <div class="title-list-item-text">待派车</div>
                </div>
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.cancelCount || 0}}</div>
                  <div class="title-list-item-text">已驳回</div>
                </div>
                <div class="title-list-item">
                  <div class="title-list-item-header">{{dispatchPlanStatistics.waitConfirmedCount || 0}}</div>
                  <div class="title-list-item-text">待审核</div>
                </div>
              </div>
              <div class="today-parking-list title-list-c">
                <div class="today-parking-list-content">
                  <el-table
                          :data="listDispatchPlan"
                          style="width: 100%"
                          :height="tableHeight"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          row-key="id">
                    <el-table-column
                            prop="planCode"
                            label="编号"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="entName"
                            label="客户名称"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="wasteCode"
                            label="八位码"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="entWasteName"
                            label="危废俗称"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="quantity"
                            label="计划量"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            label="计划时间"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                            :show-overflow-tooltip="true"
                            align="center">
                      <template slot-scope="scope">
                        {{scope.row.status==='waitConfirm' ? '待审核' : scope.row.status==='cancel' ? '已驳回' : scope.row.status==='waitTrans' ? '待派车' : scope.row.status==='trans' ? '已派车' : scope.row.status==='signed' ? '已签收' : ''}}
                      </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="operation"-->
                    <!--label="操作"-->
                    <!--align="center">-->
                    <!--<template slot-scope="scope">-->
                    <!--<div class="opt-group">-->
                    <!--<span class="opt-base"-->
                    <!--@click="operationP(scope.row, 'deal')" type="text" size="small">-->
                    <!--去处理-->
                    <!--</span>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">我的派车单</div>
            </div>
            <div class="item-content">
              <div class="parking-list">
                <div class="chart-item" id="parkingList">
                  <div class="no-data">暂无数据</div>
                </div>
              </div>
              <div class="today-parking-list">
                <div class="today-parking-list-title">
                  今日派车
                </div>
                <div class="today-parking-list-content">
                  <el-table
                          :data="listDispatchBillToday"
                          style="width: 100%"
                          :height="tableHeight"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          row-key="id">
                    <el-table-column
                            prop="billCode"
                            label="联单号"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="transEntName"
                            label="运输单位"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="areaName"
                            label="派车区域"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="vehicleNumber"
                            label="车牌号"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="driverName"
                            label="司机"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="transferQuantity"
                            label="转移量（吨）"
                            width="113"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                            :show-overflow-tooltip="true"
                            align="center">
                      <template slot-scope="scope">
                        {{scope.row.status === 'N' ? '未出发' : scope.row.status === 'B' ? '未出厂' : scope.row.status === 'E' ? '已签收' : ''}}
                      </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="operation"-->
                    <!--label="操作"-->
                    <!--align="center">-->
                    <!--<template slot-scope="scope">-->
                    <!--<div class="opt-group">-->
                    <!--<span class="opt-base"-->
                    <!--@click="operationP(scope.row, 'deal')" type="text" size="small">-->
                    <!--去处理-->
                    <!--</span>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="home-top-row">
        <el-col :span="12">
          <div class="item samplingStatistics">
            <div class="item-title">
              <div class="item-title-text">抽检统计</div>
            </div>
            <div class="item-content">
              <div class="parking-list">
                <div class="chart-item" id="samplingStatistics">
                  <div class="no-data">暂无数据</div>
                </div>
              </div>
              <div class="today-parking-list">
                <div class="today-parking-list-content full-content">
                  <el-table
                          :data="listSamplingStatistics"
                          style="width: 100%"
                          :height="tableHeight"
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                          row-key="id">
                    <el-table-column
                            prop="entName"
                            label="企业名称"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="hadCheckPassNum"
                            label="审核已通过"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="noCheckPassNum"
                            label="审核未通过"
                            :show-overflow-tooltip="true"
                            align="center">
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="operation"-->
                    <!--label="操作"-->
                    <!--align="center">-->
                    <!--<template slot-scope="scope">-->
                    <!--<div class="opt-group">-->
                    <!--<span class="opt-base"-->
                    <!--@click="operationP(scope.row, 'deal')" type="text" size="small">-->
                    <!--去处理-->
                    <!--</span>-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                  </el-table>
                </div>
              </div>
            </div>
            <v-pagination :current="pageListSamplingStatistics.current" :size="pageListSamplingStatistics.size" :total="pageListSamplingStatistics.total" :layout="pageListSamplingStatistics.layout" :prevText="pageListSamplingStatistics.prevText" :nextText="pageListSamplingStatistics.nextText" @reloadPage="jumpPageListSamplingStatistics"></v-pagination>
          </div>
          <!--<div class="item lastMonthStoring">-->
            <!--<div class="item-title">-->
              <!--<div class="item-title-text">上月收发存</div>-->
            <!--</div>-->
            <!--<div class="item-content">-->
              <!--<div class="parking-list parking-list-direction">-->
                <!--<div class="chart-item chart-item-left" id="lastMonthCircleEcharts">-->
                  <!--<div class="no-data">暂无数据</div>-->
                <!--</div>-->
                <!--<div class="chart-item-right interval-left-block padding-left-no table-scroll">-->
                  <!--&lt;!&ndash;<table class="table-user-info">&ndash;&gt;-->
                    <!--&lt;!&ndash;<tbody>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                          <!--&lt;!&ndash;<td>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">&ndash;&gt;-->
                              <!--&lt;!&ndash;收入数量：200吨&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                          <!--&lt;!&ndash;</td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<td>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">&ndash;&gt;-->
                              <!--&lt;!&ndash;单价：250元&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                          <!--&lt;!&ndash;</td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<td>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">&ndash;&gt;-->
                              <!--&lt;!&ndash;金额：222500元&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                          <!--&lt;!&ndash;</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>发出数量：200吨</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>单价：250元</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>金额：222500元</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>危废数量：200吨</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>单价：250元</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>金额：222500元</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>次生收入数量：200吨</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>单价：250元</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>金额：222500元</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>次生发出数量：200吨</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>单价：250元</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>金额：222500元</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>次生数量：200吨</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>单价：250元</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>金额：222500元</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                    <!--&lt;!&ndash;</tbody>&ndash;&gt;-->
                  <!--&lt;!&ndash;</table>&ndash;&gt;-->

                  <!--<div class="customer-item-content">-->
                    <!--&lt;!&ndash;<div class="customer-content-list" v-for="val in item.businessActivityWasteInfoVOList" :key="val.id">&ndash;&gt;-->
                      <!--&lt;!&ndash;<el-tooltip :content="val.wasteCode" placement="top" :enterable="false">&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="customer-content-list-item">{{val.wasteCode}}</div>&ndash;&gt;-->
                      <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                      <!--&lt;!&ndash;<el-tooltip :content="val.entWasteName" placement="top" :enterable="false">&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="customer-content-list-item">{{val.entWasteName}}</div>&ndash;&gt;-->
                      <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                      <!--&lt;!&ndash;<el-tooltip :content="val.status ? '合格' : '不合格'" placement="top" :enterable="false">&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="customer-content-list-item" :class="{'color-green': val.status,'color-yellow': !val.status}">{{val.status ? '合格' : '不合格'}}</div>&ndash;&gt;-->
                      <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                    <!--<div class="customer-content-list">-->
                      <!--<el-tooltip :content="'收入数量：200吨'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">收入数量：200吨</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'单价：250元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">单价：250元</div>-->
                      <!--</el-tooltip>-->
                      <!--<el-tooltip :content="'金额：222500元'" placement="top" :enterable="false">-->
                        <!--<div class="customer-content-list-item">金额：222500元</div>-->
                      <!--</el-tooltip>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="parking-list parking-list-direction chart-item-left interval-top-block">-->
                <!--<div class="chart-item chart-item-left" id="lastMonthTotalEcharts">-->
                  <!--<div class="no-data">暂无数据</div>-->
                <!--</div>-->
                <!--<div class="chart-item-right interval-left-block padding-left-no">-->
                  <!--<div class="icon-list">-->
                    <!--<div class="icon-list-item">-->
                      <!--<div class="item-icon">-->
                        <!--<span class="icon iconfont iconzongliang"></span>-->
                      <!--</div>-->
                      <!--<div class="item-content">-->
                        <!--<div class="item-content-num">459200</div>-->
                        <!--<div class="item-content-text">应收转账(元)</div>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="icon-list-item">-->
                      <!--<div class="item-icon">-->
                        <!--<span class="icon iconfont iconqian"></span>-->
                      <!--</div>-->
                      <!--<div class="item-content">-->
                        <!--<div class="item-content-num">470000</div>-->
                        <!--<div class="item-content-text">汇款金额(元)</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="icon-list">-->
                    <!--<div class="icon-list-item">-->
                      <!--<div class="item-icon">-->
                        <!--<span class="icon iconfont iconqian"></span>-->
                      <!--</div>-->
                      <!--<div class="item-content">-->
                        <!--<div class="item-content-num">895200</div>-->
                        <!--<div class="item-content-text">开票金额(元)</div>-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="icon-list-item">-->
                      <!--<div class="item-icon">-->
                        <!--<span class="icon iconfont iconqian"></span>-->
                      <!--</div>-->
                      <!--<div class="item-content">-->
                        <!--<div class="item-content-num">80</div>-->
                        <!--<div class="item-content-text">回款率(%)</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">本年财务统计</div>
            </div>
            <div class="item-content">
              <div class="chart-item" id="yearFinancialStatistics">
                <div class="no-data">暂无数据</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="home-top-row">
        <!--<el-col :span="12">-->
          <!--<div class="item">-->
            <!--<div class="item-title">-->
              <!--<div class="item-title-text">-->
                <!--销售排名-->
                <!--<el-button class="back-to-customer" type="text" @click="getMoreInfo" plain><span class="el-icon-top-right"></span>更多</el-button>-->
              <!--</div>-->
              <!--<div class="btn-group">-->
                <!--<el-button-group>-->
                  <!--<el-button size="mini" :autofocus="true">本周</el-button>-->
                  <!--<el-button size="mini">本季度</el-button>-->
                  <!--<el-button size="mini">上半年</el-button>-->
                  <!--<el-button size="mini">今年</el-button>-->
                <!--</el-button-group>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="item-content">-->
              <!--<el-table-->
                      <!--:data="salesRanking"-->
                      <!--style="width: 100%"-->
                      <!--:height="tableHeight"-->
                      <!--element-loading-background="rgba(0, 0, 0, 0.8)"-->
                      <!--row-key="id">-->
                <!--<el-table-column-->
                        <!--prop="salesman"-->
                        <!--label="业务员"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--align="center">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="revenueAmount"-->
                        <!--label="营收金额（万）"-->
                        <!--width="130"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--align="center">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="received"-->
                        <!--label="已收款（万）"-->
                        <!--width="130"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--align="center">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="latePayments"-->
                        <!--label="待回款（万）"-->
                        <!--width="130"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--align="center">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="rank"-->
                        <!--label="排名"-->
                        <!--:show-overflow-tooltip="true"-->
                        <!--align="center">-->
                <!--</el-table-column>-->
              <!--</el-table>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-col>-->
        <el-col :span="12">
          <div class="item">
            <div class="item-title">
              <div class="item-title-text">
                销售合同统计
              </div>
              <div class="btn-group">
                <div class="sel-group">
                  <el-date-picker
                          v-model="contractStatistics.contractStatisticsYear"
                          type="year"
                          placeholder="选择年"
                          :size="'small'"
                          @change="getContractStatistics()"
                          :value-format="'yyyy'">
                  </el-date-picker>
                  <el-select v-model="contractStatistics.quarter" clearable filterable
                             placeholder="请选择季度"
                             :size="'small'"
                             @change="getContractStatistics()">
                    <el-option
                            v-for="item in contractStatistics.quarters"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="item-content flex-row">
              <div class="chart-item" id="contractStatistics1">
                <div class="no-data">暂无数据</div>
              </div>
              <div class="chart-item" id="contractStatistics2">
                <div class="no-data">暂无数据</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" @close="closeNewDialogClick" :close-on-click-modal="false"
                 width="800px">
        <div slot="title" class="dialog-title" style="text-align:left;">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}
          </div>
        </div>
        <v-dialog-msg
                        :addCheckObj="addCheckObj"
                        @changeDialogForm="changeDialogFormP" @changeDialog="changeDialogP"></v-dialog-msg>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Pagination from '@/components/pagination'
import msgDialog from '@/views/home/dialog/msgDialog'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getCustomerCount, listSampledCustomers, getSignatureCount, getToDoList, getContractInfoOfSalesMan, listOvertimeWaste, listReceiveWaste, listSecondWaste, listSamplingStatistics, listDispatchBillExecutionStatistics, listDispatchBillToday, listFinancialByQuarter, getDispatchPlanStatistics, listDispatchPlan, getContractStatistics, signProcess } from '@/assets/js/API/api'

export default {
  name: 'home',
  data () {
    return {
      addCheckObj: {
        type: 'activityAdd'
      },
      dialogFormTitle:'查看系统更新记录',
      dialogSwitch1:'',//组件传过来的不再提示的值
      dialogSwitch2:'',//用来存放dialogSwitch1值
      dialogFormVisible:false,
      salesManContractInfo: {
        newestInfo: {},
        contractDetailInfo: {}
      },
      records: [],
      todoCount: 0,
      tableHeight: '100%',
      hasSendCustomers: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        layout: 'prev, next',
        nextText: '下一页 >',
        prevText: '< 上一页'
      },
      pageCustomer: {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        layout: 'prev, next',
        nextText: '下一页 >',
        prevText: '< 上一页'
      },
      pageListSamplingStatistics: {
        current: GLB_CONSTANT.page.current,
        size: 5,
        total: 0,
        layout: 'prev, next',
        nextText: '下一页 >',
        prevText: '< 上一页'
      },
      signData: {},
      // 合同统计
      contractStatistics: {
        contractStatisticsYear: this.getNowYear(),
        quarter: '',
        quarters: [{
          code: '1',
          name: '第一季度'
        }, {
          code: '2',
          name: '第二季度'
        }, {
          code: '3',
          name: '第三季度'
        }, {
          code: '4',
          name: '第四季度'
        }]
      },
      // 超期预警
      listOvertimeWaste: [],
      salesRanking: [{
        salesman: '张三',
        revenueAmount: 200,
        received: 100,
        latePayments: 100,
        rank: 1
      }, {
        salesman: '张三',
        revenueAmount: 200,
        received: 100,
        latePayments: 100,
        rank: 2
      }, {
        salesman: '张三',
        revenueAmount: 200,
        received: 100,
        latePayments: 100,
        rank: 3
      }, {
        salesman: '张三',
        revenueAmount: 200,
        received: 100,
        latePayments: 100,
        rank: 4
      }, {
        salesman: '张三',
        revenueAmount: 200,
        received: 100,
        latePayments: 100,
        rank: 5
      }],
      // 今日派车
      listDispatchBillToday: [],
      parkingListRecords: [],
      // 我的派车计划列表
      listDispatchPlan: [],
      // 我的派车计划title
      dispatchPlanStatistics: '',
      // 抽样统计
      listSamplingStatistics: []
    }
  },
  created () {
    let _this = this
    this.getData()
    this.getParkingListRecords()
    this.getSignatureCount()
    this.getListSampledCustomers()
    this.getSalesManContract()
    this.getListOvertimeWaste()
    // 我的派车计划列表
    this.getListDispatchPlan()
    // 我的派车计划title
    this.getDispatchPlanStatistics()
    // 今日派车
    this.getListDispatchBillToday()
    this.testFunc()
    setTimeout(() => {
      _this.getYearFinancialStatisticsCharts()
      _this.getMyCustomerCharts()
      _this.getSamplingStatistics()
      _this.getContractStatistics()
      _this.getParkingListCharts()
      // _this.getLastMonthCircleEcharts()
      // _this.getLastMonthTotalEcharts()
      // _this.getMyInventoryAcceptWaste()
      // _this.getMyInventorySecondaryWaste()
      _this.getListReceiveWaste()
      _this.getListSecondWaste()
    }, 500)
      if(sessionStorage[this.dialogSwitch2]=='true'){
        this.dialogFormVisible=false;
      }else{
        this.dialogFormVisible=true;
      }

  },
  // 组件
  components: {
    'v-pagination': Pagination,
    'v-dialog-msg': msgDialog
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    changeDialogFormP(val){
      this.dialogFormVisible=val
    },
    changeDialogP (val) {
      this.dialogSwitch1 = val
      if(this.dialogSwitch1 ==true){
        sessionStorage[this.dialogSwitch2]='true';
      }else{
        sessionStorage[this.dialogSwitch2]='false';
      }
    },
    closeNewDialogClick(){
      this.dialogFormVisible=false;
    },
    testFunc () {
      var arr = [{
        name: '张三',
        id: 1
      }, {
        name: '李四',
        id: 2
      }, {
        name: '王五',
        id: 3
      }, {
        name: '周六',
        id: 4
      }]
      var arrTest = []
      for (var i = 0; i < arr.length; i++) {
        arrTest.push({
          name: arr[i].name,
          id: arr[i].id
        })
      }
    },
    getNowYear (time) {
      let date = new Date()
      let year = date.getFullYear().toString()
      return year
    },
    getSalesManContract () {
      let vm = this
      let postData = {
        entId: localStorage.getItem('id')
      }
      getContractInfoOfSalesMan(postData)
        .then(res => {
          vm.salesManContractInfo = res.data
          // 新签，补签，续签图表
          setTimeout(() => {
            vm.getMyContractCharts(res.data.validContractList)
          }, 500)
        }).catch(() => {})
    },
    getListDispatchBillToday () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listDispatchBillToday(postData, params)
        .then(res => {
          _this.listDispatchBillToday = res.data
        }).catch(() => {})
    },
    // 我的派车计划列表
    getListDispatchPlan () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listDispatchPlan(postData, params)
        .then(res => {
          _this.listDispatchPlan = res.data
        }).catch(() => {})
    },
    // 我的派车计划title
    getDispatchPlanStatistics () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      getDispatchPlanStatistics(postData, params)
        .then(res => {
          _this.dispatchPlanStatistics = res.data
        }).catch(() => {})
    },
    operationP (row, type) {
      let vm = this
      if (row.assignee == null || row.assignee === '') { // 无处理人，得先签收
        signProcess(row.procInsId)
              .then(res => {
                COMMONJS.showToast('签收成功')
                 vm.getData()
      }).catch(() => {})
      } else { // 跳转到处理页面auditUrl
        // TODO 改成路由打开一个新的标签页
        var preaddr = window.location.protocol + '//' + window.location.host
        window.open(GLB_CONSTANT.devUrl.workflowUrl + row.auditUrl + '&preaddr=' + preaddr)
      }
    },
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
      let vm = this
      let postData = {
        id: localStorage.getItem('loginName')
      }
      getToDoList(postData)
        .then(res => {
          vm.records = res.data
          vm.todoCount = vm.records ? vm.records.length : 0
        }).catch(() => {})
    },
    getListOvertimeWaste () {
      let vm = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listOvertimeWaste(postData, params)
        .then(res => {
          vm.listOvertimeWaste = res.data.secondWasteVOList
        }).catch(() => {})
    },
    getParkingListRecords () {
      let res = { 'pageNo': 1, 'pageSize': -1, 'count': 2, 'list': [{ 'isNewRecord': true, 'taskId': '58e0177c-a56d-11e9-aa34-00ffaabbccdd', 'taskName': 'XX产废单位', 'taskDefKey': 'deptLeaderAudit', 'carNo': '苏E88888', 'driver': '张三', 'transform': '85', 'status': '已出厂', 'assignee': 'fanhj', 'createTime': '2019-07-13 20:54:27', 'executionId': '58dfc959-a56d-11e9-aa34-00ffaabbccdd', 'procInsId': '58df7b35-a56d-11e9-aa34-00ffaabbccdd', 'procDefId': 'hetong_process:4:489cfb5c-a568-11e9-9d76-408d5c84f74e', 'procDefKey': 'hetong_process', 'procDefname': 'TPP20190608', 'procDefversion': '苏州工业园区', 'vars': { 'map': { 'pkName': 'guid', 'applyUser': 'fanhj' } }, 'pass': false, 'finishTask': false, 'todoTask': true }, { 'isNewRecord': true, 'taskId': '58e0177c-a56d-11e9-aa34-00ffaabbccdd', 'taskName': 'XX产废单位', 'taskDefKey': 'deptLeaderAudit', 'carNo': '苏E88888', 'driver': '张三', 'transform': '85', 'status': '已出厂', 'assignee': 'fanhj', 'createTime': '2019-07-13 20:54:27', 'executionId': '58dfc959-a56d-11e9-aa34-00ffaabbccdd', 'procInsId': '58df7b35-a56d-11e9-aa34-00ffaabbccdd', 'procDefId': 'hetong_process:4:489cfb5c-a568-11e9-9d76-408d5c84f74e', 'procDefKey': 'hetong_process', 'procDefname': 'TPP20190608', 'procDefversion': '苏州工业园区', 'vars': { 'map': { 'pkName': 'guid', 'applyUser': 'fanhj' } }, 'pass': false, 'finishTask': false, 'todoTask': true }, { 'isNewRecord': true, 'taskId': '58e0177c-a56d-11e9-aa34-00ffaabbccdd', 'taskName': 'XX产废单位', 'taskDefKey': 'deptLeaderAudit', 'carNo': '苏E88888', 'driver': '张三', 'transform': '85', 'status': '已出厂', 'assignee': 'fanhj', 'createTime': '2019-07-13 20:54:27', 'executionId': '58dfc959-a56d-11e9-aa34-00ffaabbccdd', 'procInsId': '58df7b35-a56d-11e9-aa34-00ffaabbccdd', 'procDefId': 'hetong_process:4:489cfb5c-a568-11e9-9d76-408d5c84f74e', 'procDefKey': 'hetong_process', 'procDefname': 'TPP20190608', 'procDefversion': '苏州工业园区', 'vars': { 'map': { 'pkName': 'guid', 'applyUser': 'fanhj' } }, 'pass': false, 'finishTask': false, 'todoTask': true }, { 'isNewRecord': true, 'taskId': '58e0177c-a56d-11e9-aa34-00ffaabbccdd', 'taskName': 'XX产废单位', 'taskDefKey': 'deptLeaderAudit', 'carNo': '苏E88888', 'driver': '张三', 'transform': '85', 'status': '已出厂', 'assignee': 'fanhj', 'createTime': '2019-07-13 20:54:27', 'executionId': '58dfc959-a56d-11e9-aa34-00ffaabbccdd', 'procInsId': '58df7b35-a56d-11e9-aa34-00ffaabbccdd', 'procDefId': 'hetong_process:4:489cfb5c-a568-11e9-9d76-408d5c84f74e', 'procDefKey': 'hetong_process', 'procDefname': 'TPP20190608', 'procDefversion': '苏州工业园区', 'vars': { 'map': { 'pkName': 'guid', 'applyUser': 'fanhj' } }, 'pass': false, 'finishTask': false, 'todoTask': true }], 'maxResults': -1, 'firstResult': 0 }
      this.parkingListRecords = res.list
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
      // this.$emit('reload', 3)
    },
    jumpPageCustomer (index) {
      this.pageCustomer.current = index
      this.getListSampledCustomers()
      // this.$emit('reload', 3)
    },
    jumpPageListSamplingStatistics (index) {
      this.pageListSamplingStatistics.current = index
      this.getSamplingStatistics()
      // this.$emit('reload', 3)
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
      // this.$emit('reload', 3)
    },
    getMoreInfo () {
      this.$router.push({
        path: '/todo'
      })
    },
    getListSampledCustomers () {
      let vm = this
      let postData = {
        current: this.pageCustomer.current,
        size: this.pageCustomer.size
      }
      listSampledCustomers(postData).then(res => {
        vm.hasSendCustomers = res.data.records
        vm.pageCustomer.total = res.data.total
      })
    },
    getYearFinancialStatisticsCharts () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listFinancialByQuarter(postData, params).then(res => {
        if (res.data && res.data.length) {
          let chartsData = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            dataset: {
              source: [
                ['product', '应收金额（万）', '开票金额（万）', '回款金额（万）'],
                ['第一季度', res.data[0].accountAmount, res.data[0].invoiceAmount, res.data[0].paymentAmount],
                ['第二季度', res.data[1].accountAmount, res.data[1].invoiceAmount, res.data[1].paymentAmount],
                ['第三季度', res.data[2].accountAmount, res.data[2].invoiceAmount, res.data[2].paymentAmount],
                ['第四季度', res.data[3].accountAmount, res.data[3].invoiceAmount, res.data[3].paymentAmount]
              ]
            },
            legend: {
              data: ['应收金额（万）', '开票金额（万）', '回款金额（万）'],
              itemWidth: 13,
              itemHeight: 13,
              top: 5,
              right: 0,
              padding: 0,
              textStyle: {
                color: '#51585E'
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
                // data: getStorageStatisticsEchart.legendData,
                axisLine: {
                  lineStyle: {
                    color: '#51585E'
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: '#51585E'
                  }
                }
              }
            ],
            series: [
              {
                type: 'bar',
                color: ['#FF7A69'],
                barWidth: 20,
                barGap: 0
              },
              {
                type: 'bar',
                color: ['#86D4FD'],
                barWidth: 20,
                barGap: 0
              },
              {
                type: 'bar',
                color: ['#FCD357'],
                barWidth: 20,
                barGap: 0
              }
            ]
          }
          let myChart = this.$echarts.init(document.getElementById('yearFinancialStatistics'))
          myChart.setOption(chartsData)
        }
      })
    },
    getParkingListCharts () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listDispatchBillExecutionStatistics(postData, params).then(res => {
        let chartsData = {
          title: {
            text: '近7日派车执行情况',
            textStyle: {
              color: '#616161',
              fontSize: 14,
              fontWeight: 'normal'
            },
            top: 3,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['派单数量', '签收数量'],
            top: 5,
            right: 25
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '0',
            top: 25,
            containLabel: true
          },
          dataset: {
            source: [
              ['product', ...res.data.xAxisList],
              ['派单数量', ...res.data.billCountList],
              ['签收数量', ...res.data.signCountList]
            ]
          },
          xAxis: [
            {
              type: 'category',
              // data: getStorageStatisticsEchart.legendData,
              axisLine: {
                lineStyle: {
                  color: '#51585E'
                }
              },
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#51585E'
                }
              }
            }
          ],
          series: [
            { type: 'line', seriesLayoutBy: 'row', color: ['#03C4DB'], symbol: 'circle' },
            { type: 'line', seriesLayoutBy: 'row', color: ['#FCD357'], symbol: 'circle' }
          ]
        }
        let myChart = this.$echarts.init(document.getElementById('parkingList'))
        myChart.setOption(chartsData)
      })
    },
    getSignatureCount () {
      var vm = this
      getSignatureCount()
        .then(res => {
          vm.signData = res.data
        })
    },
    getMyCustomerCharts () {
      let _this = this
      let postData = {
        type: '2'
      }
      getCustomerCount(postData)
        .then(res => {
          let legend = []
          let seriesData = []
          if (res.data.myCustomerConutVOList && res.data.myCustomerConutVOList.length) {
            res.data.myCustomerConutVOList.forEach(function (val) {
              let name = val.name + '     ' + parseFloat((parseFloat(val.percent || 0) * 100).toFixed(2))
              let legendItem = name + '%'
              let seriesDataItem = {}
              seriesDataItem.value = val.count
              seriesDataItem.name = legendItem
              legend.push(legendItem)
              seriesData.push(seriesDataItem)
            })
            // 园区企业数量图表
            let chartsData = {
              title: {
                zlevel: 0,
                // text: [
                //   '{value|' + res.data.total + '人}',
                //   '{name|客户总数}'
                // ].join('\n'),
                text: res.data.total + '人' + '\n客户总数',
                rich: {
                  value: {
                    color: '#646464',
                    fontSize: 24,
                    fontWeight: 'bold',
                    lineHeight: 40
                  },
                  name: {
                    color: '#909399',
                    lineHeight: 20
                  }
                },
                // textStyle: {
                //   rich: {
                //     value: {
                //       color: '#303133',
                //       fontSize: 40,
                //       fontWeight: 'bold',
                //       lineHeight: 40,
                //     },
                //     name: {
                //       color: '#909399',
                //       lineHeight: 20
                //     }
                //   }
                // },
                // res.data.total + '人' + '\n客户总数',
                x: 'center',
                left: '22%',
                top: '37%',
                textStyle: {
                  color: '#646464',
                  fontSize: '14px'
                }
                // textAlign: 'center'
              },
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (argument) {
                  var arguItems = argument.name.split('     ')[0]
                  var html = arguItems + ': ' + argument.value
                  return html
                }
              },
              legend: {
                show: true,
                // selectedMode:false,
                right: 'right',
                top: 'middle',
                padding: [0, 0, 0, 0],
                itemWidth: 13,
                itemHeight: 13,
                itemGap: 15,
                orient: 'vertical',
                // x: 'right',
                data: legend,
                textStyle: {
                  color: '#647585'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              series: [
                {
                  zlevel: 1,
                  name: '访问来源',
                  type: 'pie',
                  center: ['30%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                  label: {
                    normal: {
                      show: false,
                      position: 'center',
                      formatter: function (argument) {
                        var arguItems = argument.name.split('     ')
                        var html = arguItems.join('\n')
                        return html
                        // let html = '<div><div style="font-size:24px">' + res.data.total + '人</div><div>客户总数</div></div>'
                        // return res.data.total + '人' + '\n客户总数'
                        // return html
                      },
                      textStyle: {
                        fontSize: 15,
                        color: '#647585'
                      }
                    },
                    emphasis: {
                      show: false,
                      textStyle: {}
                    }
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '20',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: seriesData
                }
              ]
            }
            let myChart = this.$echarts.init(document.getElementById('myCustomer'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    getListReceiveWaste () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listReceiveWaste(postData, params)
        .then(res => {
          let legend = []
          let seriesData = []
          if (res.data.storageVOList && res.data.storageVOList.length) {
            res.data.storageVOList.forEach(function (val) {
              let name = val.storageName + '     ' + parseFloat((parseFloat(val.percent || 0) * 100).toFixed(2))
              let legendItem = name + '%'
              let seriesDataItem = {}
              seriesDataItem.value = parseFloat((parseFloat(val.qty || 0)).toFixed(2))
              seriesDataItem.name = legendItem
              legend.push(legendItem)
              seriesData.push(seriesDataItem)
            })
            // 园区企业数量图表
            let chartsData = {
              title: {
                zlevel: 0,
                // text: [
                //   '{value|' + res.data.total + '人}',
                //   '{name|客户总数}'
                // ].join('\n'),
                text: parseFloat((parseFloat(res.data.total || 0)).toFixed(2)) + '吨' + '\n接受危废',
                rich: {
                  value: {
                    color: '#646464',
                    fontSize: 24,
                    fontWeight: 'bold',
                    lineHeight: 40
                  },
                  name: {
                    color: '#909399',
                    lineHeight: 20
                  }
                },
                // textStyle: {
                //   rich: {
                //     value: {
                //       color: '#303133',
                //       fontSize: 40,
                //       fontWeight: 'bold',
                //       lineHeight: 40,
                //     },
                //     name: {
                //       color: '#909399',
                //       lineHeight: 20
                //     }
                //   }
                // },
                // res.data.total + '人' + '\n客户总数',
                x: 'center',
                left: '22%',
                top: '37%',
                textStyle: {
                  color: '#646464',
                  fontSize: '14px'
                }
                // textAlign: 'center'
              },
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (argument) {
                  var arguItems = argument.name.split('     ')[0]
                  var html = arguItems + ': ' + argument.value
                  return html
                }
              },
              legend: {
                show: true,
                // selectedMode:false,
                right: '10',
                top: 'middle',
                padding: [0, 0, 0, 0],
                itemWidth: 13,
                itemHeight: 13,
                itemGap: 15,
                orient: 'vertical',
                // x: 'right',
                data: legend,
                formatter: function (legend) {    return (legend.length > 5 ? (legend.slice(0,5)+"...") : legend );
                },
                tooltip: {
                  show: true
                },
                textStyle: {
                  color: '#647585'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              series: [
                {
                  zlevel: 1,
                  name: '访问来源',
                  type: 'pie',
                  center: ['30%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                  label: {
                    normal: {
                      show: false,
                      position: 'center',
                      formatter: function (argument) {
                        var arguItems = argument.name.split('     ')
                        var html = arguItems.join('\n')
                        return html
                        // let html = '<div><div style="font-size:24px">' + res.data.total + '人</div><div>客户总数</div></div>'
                        // return res.data.total + '人' + '\n客户总数'
                        // return html
                      },
                      textStyle: {
                        fontSize: 15,
                        color: '#647585'
                      }
                    },
                    emphasis: {
                      show: false,
                      textStyle: {}
                    }
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '20',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: seriesData
                }
              ]
            }
            let myChart = this.$echarts.init(document.getElementById('myInventoryAcceptWaste'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    getListSecondWaste () {
      let _this = this
      let postData = []
      let params = {
        ticket: localStorage.getItem('token')
      }
      listSecondWaste(postData, params)
        .then(res => {
          let legend = []
          let seriesData = []
          if (res.data.secondWasteVOList && res.data.secondWasteVOList.length) {
            res.data.secondWasteVOList.forEach(function (val) {
              let name = val.wasteName + '     ' + parseFloat((parseFloat(val.percent || 0) * 100).toFixed(2))
              let legendItem = name + '%'
              let seriesDataItem = {}
              seriesDataItem.value = val.qty
              seriesDataItem.name = legendItem
              legend.push(legendItem)
              seriesData.push(seriesDataItem)
            })
            // 园区企业数量图表
            let chartsData = {
              title: {
                zlevel: 0,
                // text: [
                //   '{value|' + res.data.total + '人}',
                //   '{name|客户总数}'
                // ].join('\n'),
                text: parseFloat((parseFloat(res.data.total || 0)).toFixed(2)) + '吨' + '\n次生危废',
                rich: {
                  value: {
                    color: '#646464',
                    fontSize: 24,
                    fontWeight: 'bold',
                    lineHeight: 40
                  },
                  name: {
                    color: '#909399',
                    lineHeight: 20
                  }
                },
                // textStyle: {
                //   rich: {
                //     value: {
                //       color: '#303133',
                //       fontSize: 40,
                //       fontWeight: 'bold',
                //       lineHeight: 40,
                //     },
                //     name: {
                //       color: '#909399',
                //       lineHeight: 20
                //     }
                //   }
                // },
                // res.data.total + '人' + '\n客户总数',
                x: 'center',
                left: '22%',
                top: '37%',
                textStyle: {
                  color: '#646464',
                  fontSize: '14px'
                }
                // textAlign: 'center'
              },
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: function (argument) {
                  var arguItems = argument.name.split('     ')[0]
                  var html = arguItems + ': ' + argument.value
                  return html
                }
              },
              legend: {
                show: true,
                // selectedMode:false,
                right: '10',
                top: 'middle',
                padding: [0, 0, 0, 0],
                itemWidth: 13,
                itemHeight: 13,
                itemGap: 15,
                orient: 'vertical',
                // x: 'right',
                data: legend,
                formatter: function (legend) {    return (legend.length > 5 ? (legend.slice(0,5)+"...") : legend );
                },
                tooltip: {
                  show: true
                },
                textStyle: {
                  color: '#647585'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              series: [
                {
                  zlevel: 1,
                  name: '访问来源',
                  type: 'pie',
                  center: ['30%', '50%'],
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                  label: {
                    normal: {
                      show: false,
                      position: 'center',
                      formatter: function (argument) {
                        var arguItems = argument.name.split('     ')
                        var html = arguItems.join('\n')
                        return html
                        // let html = '<div><div style="font-size:24px">' + res.data.total + '人</div><div>客户总数</div></div>'
                        // return res.data.total + '人' + '\n客户总数'
                        // return html
                      },
                      textStyle: {
                        fontSize: 15,
                        color: '#647585'
                      }
                    },
                    emphasis: {
                      show: false,
                      textStyle: {}
                    }
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '20',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: seriesData
                }
              ]
            }
            let myChart = this.$echarts.init(document.getElementById('myInventorySecondaryWaste'))
            myChart.setOption(chartsData)
          }
        }).catch(() => {
        })
    },
    getSamplingStatistics () {
      let _this = this
      let postData = {
        // entId: localStorage.getItem('id')
        entId: '362a197963264f67a7123ddf70f6b477',
        current: this.pageListSamplingStatistics.current,
        size: this.pageListSamplingStatistics.size
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listSamplingStatistics(postData, params)
        .then(res => {
          _this.listSamplingStatistics = res.data.sampleStatiscsVOs.records
          _this.pageListSamplingStatistics.total = res.data.sampleStatiscsVOs.total
          // let legend = []
          // let seriesData = []
          // if (res.data.myCustomerConutVOList && res.data.myCustomerConutVOList.length) {
          //   res.data.myCustomerConutVOList.forEach(function (val) {
          //     let name = val.name + '     ' + parseFloat((parseFloat(val.percent || 0) * 100).toFixed(2))
          //     let legendItem = name + '%'
          //     let seriesDataItem = {}
          //     seriesDataItem.value = val.count
          //     seriesDataItem.name = legendItem
          //     legend.push(legendItem)
          //     seriesData.push(seriesDataItem)
          //   })
          //   // 园区企业数量图表
          //   let chartsData = {
          //     tooltip: {
          //       show: true,
          //       trigger: 'item',
          //       formatter: function (argument) {
          //         var arguItems = argument.name.split('     ')[0]
          //         var html = arguItems + ': ' + argument.value
          //         return html
          //       }
          //     },
          //     legend: {
          //       show: true,
          //       // selectedMode:false,
          //       right: 'right',
          //       top: 'middle',
          //       padding: [0, 10, 0, 0],
          //       itemWidth: 13,
          //       itemHeight: 13,
          //       itemGap: 15,
          //       orient: 'vertical',
          //       // x: 'right',
          //       data: legend,
          //       textStyle: {
          //         color: '#647585'
          //       }
          //     },
          //     grid: {
          //       left: '3%',
          //       right: '4%',
          //       bottom: '3%',
          //       containLabel: true
          //     },
          //     series: [
          //       {
          //         name: '访问来源',
          //         type: 'pie',
          //         center: ['30%', '50%'],
          //         radius: ['50%', '70%'],
          //         avoidLabelOverlap: false,
          //         color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
          //         label: {
          //           normal: {
          //             show: false,
          //             position: 'center',
          //             formatter: function (argument) {
          //               var arguItems = argument.name.split('     ')
          //               var html = arguItems.join('\n')
          //               return html
          //             },
          //             textStyle: {
          //               fontSize: 15,
          //               color: '#647585'
          //             }
          //           },
          //           emphasis: {
          //             show: true,
          //             textStyle: {}
          //           }
          //           // emphasis: {
          //           //     show: true,
          //           //     textStyle: {
          //           //         fontSize: '20',
          //           //         fontWeight: 'bold'
          //           //     }
          //           // }
          //         },
          //         labelLine: {
          //           normal: {
          //             show: false
          //           }
          //         },
          //         data: seriesData
          //       }
          //     ]
          //   }
          let chartsData = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['审核已通过', '审核未通过'],
              orient: 'vertical',
              itemWidth: 13,
              itemHeight: 13,
              right: 10,
              top: 'middle',
              padding: 0,
              textStyle: {
                // color: '#BEE9DE'
                color: '#647585'
              },
              formatter: function (name) {
                if (name === '审核已通过') {
                  name += ' ' + res.data.hadChecked + '%'
                }
                if (name === '审核未通过') {
                  name += ' ' + res.data.noChecked + '%'
                }
                return name
              }
            },
            grid: {
              left: '0',
              right: '120',
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
                    color: 'rgba(92, 255, 214, 0.11)'
                  }
                },
                axisLabel: {
                  show: true, // 这行代码控制着坐标轴x轴的文字是否显示
                  textStyle: {
                    color: '#8cbeb1' // x轴上的字体颜色
                  }
                }, // 网格样式
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['rgba(92, 255, 214, 0.11)'],
                    width: 1,
                    type: 'solid'
                  }
                },
                show: false
              }
            ],
            xAxis: [
              {
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: 'rgba(92, 255, 214, 0.11)'
                  }
                },
                axisLabel: {
                  show: true, // 这行代码控制着坐标轴x轴的文字是否显示
                  textStyle: {
                    color: '#8cbeb1' // x轴上的字体颜色
                  }
                }, // 网格样式
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['rgba(92, 255, 214, 0.11)'],
                    width: 1,
                    type: 'solid'
                  }
                },
                show: false
              }
            ],
            series: [
              {
                name: '审核已通过',
                type: 'bar',
                barWidth: '20',
                color: ['#FFEA7B'],
                stack: '库',
                data: [res.data.hadCheckedNum]
              },
              {
                name: '审核未通过',
                type: 'bar',
                color: ['#00D2FF'],
                stack: '库',
                data: [res.data.noCheckedNum]
              }
            ]
          }
          let myChart = this.$echarts.init(document.getElementById('samplingStatistics'))
          myChart.setOption(chartsData)
          // }
        }).catch(() => {
        })
    },
    // 销售合同统计
    getContractStatistics () {
      let _this = this
      let params = {
        ticket: localStorage.getItem('token')
      }
      let postData = {
        year: this.contractStatistics.contractStatisticsYear,
        quarter: this.contractStatistics.quarter
      }
      getContractStatistics(postData, params)
        .then(res => {
          let legend = []
          let seriesData = []
          // if (res.data.myCustomerConutVOList && res.data.myCustomerConutVOList.length) {
          //   res.data.myCustomerConutVOList.forEach(function (val) {
          //     let name = val.name + '     ' + parseFloat((parseFloat(val.percent || 0) * 100).toFixed(2))
          //     let legendItem = name + '%'
          //     let seriesDataItem = {}
          //     seriesDataItem.value = val.count
          //     seriesDataItem.name = legendItem
          //     legend.push(legendItem)
          //     seriesData.push(seriesDataItem)
          //   })
          //   // 园区企业数量图表
          let chartsData1 = {
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: function (argument) {
                var arguItems = argument.name.split('     ')[0]
                var html = arguItems + ': ' + argument.value
                return html
              }
            },
            legend: {
              show: true,
              // selectedMode:false,
              bottom: '0',
              top: 'bottom',
              padding: [0, 0, 0, 0],
              itemWidth: 13,
              itemHeight: 13,
              itemGap: 15,
              orient: 'horizontal',
              // x: 'right',
              data: ['意向合同' + '     ' + res.data.intendedCount, '正式合同' + '     ' + res.data.checkCount],
              textStyle: {
                color: '#647585'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    formatter: function (argument) {
                      var arguItems = argument.name.split('     ')
                      var html = arguItems.join('\n')
                      return html
                    },
                    textStyle: {
                      fontSize: 15,
                      color: '#647585'
                    }
                  },
                  emphasis: {
                    show: true,
                    textStyle: {}
                  }
                  // emphasis: {
                  //     show: true,
                  //     textStyle: {
                  //         fontSize: '20',
                  //         fontWeight: 'bold'
                  //     }
                  // }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: seriesData
              },
              {
                name: '访问来源',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    formatter: function (argument) {
                      var arguItems = argument.name.split('     ')
                      var html = arguItems.join('\n')
                      return html
                    },
                    textStyle: {
                      fontSize: 15,
                      color: '#647585'
                    }
                  },
                  emphasis: {
                    show: true,
                    textStyle: {}
                  }
                  // emphasis: {
                  //     show: true,
                  //     textStyle: {
                  //         fontSize: '20',
                  //         fontWeight: 'bold'
                  //     }
                  // }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{
                  name: '意向合同' + '     ' + res.data.intendedCount,
                  value: res.data.intendedCount
                }, {
                  name: '正式合同' + '     ' + res.data.checkCount,
                  value: res.data.checkCount
                }]
              }
            ]
          }
          let myChart1 = this.$echarts.init(document.getElementById('contractStatistics1'))
          myChart1.setOption(chartsData1)
          let chartsData2 = {
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: function (argument) {
                var arguItems = argument.name.split('     ')[0]
                var html = arguItems + ': ' + argument.value
                return html
              }
            },
            legend: {
              show: true,
              // selectedMode:false,
              bottom: '0',
              top: 'bottom',
              padding: [0, 0, 0, 0],
              itemWidth: 13,
              itemHeight: 13,
              itemGap: 15,
              orient: 'horizontal',
              // x: 'right',
              data: ['新签合同' + '     ' + res.data.newCount, '续签合同' + '     ' + res.data.continuousCount, '补签合同' + '     ' + res.data.supplementCount],
              textStyle: {
                color: '#647585'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                center: [0, '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    formatter: function (argument) {
                      var arguItems = argument.name.split('     ')
                      var html = arguItems.join('\n')
                      return html
                    },
                    textStyle: {
                      fontSize: 15,
                      color: '#647585'
                    }
                  },
                  emphasis: {
                    show: true,
                    textStyle: {}
                  }
                  // emphasis: {
                  //     show: true,
                  //     textStyle: {
                  //         fontSize: '20',
                  //         fontWeight: 'bold'
                  //     }
                  // }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: seriesData
              },
              {
                name: '访问来源',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    formatter: function (argument) {
                      var arguItems = argument.name.split('     ')
                      var html = arguItems.join('\n')
                      return html
                    },
                    textStyle: {
                      fontSize: 15,
                      color: '#647585'
                    }
                  },
                  emphasis: {
                    show: true,
                    textStyle: {}
                  }
                  // emphasis: {
                  //     show: true,
                  //     textStyle: {
                  //         fontSize: '20',
                  //         fontWeight: 'bold'
                  //     }
                  // }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{
                  name: '新签合同' + '     ' + res.data.newCount,
                  value: res.data.newCount
                }, {
                  name: '续签合同' + '     ' + res.data.continuousCount,
                  value: res.data.continuousCount
                }, {
                  name: '补签合同' + '     ' + res.data.supplementCount,
                  value: res.data.supplementCount
                }]
              }
            ]
          }
          let myChart2 = this.$echarts.init(document.getElementById('contractStatistics2'))
          myChart2.setOption(chartsData2)
          // }
        }).catch(() => {
        })
    },
    getMyContractCharts: function (validContractList) {
      let _this = this
      let legendData = []; let seriesData = []; let totalNum = 0
      validContractList.forEach((element, index) => {
        totalNum += element.num
        if (index === validContractList.length - 1) {
          validContractList.forEach(element => {
            let name = element.signTypeName + '     ' + (totalNum > 0 ? parseFloat(element.num * 100 / totalNum).toFixed(1) : 0) + '%'
            legendData.push(name)
            seriesData.push({
              value: element.num,
              name: name
            })
          })
        }
      })
      // 园区企业数量图表
      let chartsData = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (argument) {
            var arguItems = argument.name.split('     ')[0]
            var html = arguItems + ': ' + argument.value
            return html
          }
        },
        legend: {
          show: true,
          // selectedMode:false,
          right: 'right',
          top: 'middle',
          padding: [0, 10, 0, 0],
          itemWidth: 13,
          itemHeight: 13,
          itemGap: 15,
          orient: 'vertical',
          // x: 'right',
          data: legendData,
          textStyle: {
            color: '#647585'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: function (argument) {
                  var arguItems = argument.name.split('     ')
                  var html = arguItems.join('\n')
                  return html
                },
                textStyle: {
                  fontSize: 15,
                  color: '#647585'
                }
              },
              emphasis: {
                show: true,
                textStyle: {}
              }
              // emphasis: {
              //     show: true,
              //     textStyle: {
              //         fontSize: '20',
              //         fontWeight: 'bold'
              //     }
              // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('myContract'))
      myChart.setOption(chartsData)
    },
    getLastMonthCircleEcharts () {
      let _this = this
      // if (validContractList && validContractList.length) {
      //   let legendData = []; let seriesData = []; let totalNum = 0
      //   validContractList.forEach((element, index) => {
      //     totalNum += element.num
      //     if (index === validContractList.length - 1) {
      //       validContractList.forEach(element => {
      //         let name = element.signTypeName + '     ' + (totalNum > 0 ? parseFloat(element.num * 100 / totalNum).toFixed(1) : 0) + '%'
      //         legendData.push(name)
      //         seriesData.push({
      //           value: element.num,
      //           name: name
      //         })
      //       })
      //     }
      //   })
      // 园区企业数量图表
      let chartsData = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}'
        },
        legend: {
          show: true,
          // selectedMode:false,
          right: 'right',
          top: 'middle',
          padding: [0, 10, 0, 0],
          itemWidth: 13,
          itemHeight: 13,
          itemGap: 15,
          orient: 'vertical',
          // x: 'right',
          data: ['危废     58%', '次生     42%'],
          textStyle: {
            color: '#647585'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: function (argument) {
                  var arguItems = argument.name.split('     ')
                  var html = arguItems.join('\n')
                  return html
                },
                textStyle: {
                  fontSize: 15,
                  color: '#647585'
                }
              },
              emphasis: {
                show: true,
                textStyle: {}
              }
            // emphasis: {
            //     show: true,
            //     textStyle: {
            //         fontSize: '20',
            //         fontWeight: 'bold'
            //     }
            // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 52,
              name: '危废     58%'
            }, {
              value: 48,
              name: '次生     42%'
            }]
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('lastMonthCircleEcharts'))
      myChart.setOption(chartsData)
    },
    // getMyInventoryAcceptWaste: function (validContractList) {
    //   let _this = this
    //   // if (validContractList && validContractList.length) {
    //   //   let legendData = []; let seriesData = []; let totalNum = 0
    //   //   validContractList.forEach((element, index) => {
    //   //     totalNum += element.num
    //   //     if (index === validContractList.length - 1) {
    //   //       validContractList.forEach(element => {
    //   //         let name = element.signTypeName + '     ' + (totalNum > 0 ? parseFloat(element.num * 100 / totalNum).toFixed(1) : 0) + '%'
    //   //         legendData.push(name)
    //   //         seriesData.push({
    //   //           value: element.num,
    //   //           name: name
    //   //         })
    //   //       })
    //   //     }
    //   //   })
    //   // 园区企业数量图表
    //   let chartsData = {
    //     tooltip: {
    //       show: true,
    //       trigger: 'item',
    //       formatter: function (argument) {
    //         var arguItems = argument.name.split('     ')[0]
    //         var html = arguItems + ': ' + argument.value
    //         return html
    //       }
    //     },
    //     legend: {
    //       show: true,
    //       // selectedMode:false,
    //       right: 'right',
    //       top: 'middle',
    //       padding: [0, 10, 0, 0],
    //       itemWidth: 13,
    //       itemHeight: 13,
    //       itemGap: 15,
    //       orient: 'vertical',
    //       // x: 'right',
    //       data: ['1#仓库     38%', '2#仓库     30%', '3#仓库     20%', '4#仓库     12%'],
    //       textStyle: {
    //         color: '#647585'
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     series: [
    //       {
    //         name: '访问来源',
    //         type: 'pie',
    //         center: ['30%', '50%'],
    //         radius: ['50%', '70%'],
    //         avoidLabelOverlap: false,
    //         color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
    //         label: {
    //           normal: {
    //             show: false,
    //             position: 'center',
    //             formatter: function (argument) {
    //               var arguItems = argument.name.split('     ')
    //               var html = arguItems.join('\n')
    //               return html
    //             },
    //             textStyle: {
    //               fontSize: 15,
    //               color: '#647585'
    //             }
    //           },
    //           emphasis: {
    //             show: true,
    //             textStyle: {}
    //           }
    //           // emphasis: {
    //           //     show: true,
    //           //     textStyle: {
    //           //         fontSize: '20',
    //           //         fontWeight: 'bold'
    //           //     }
    //           // }
    //         },
    //         labelLine: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [{
    //           value: 38,
    //           name: '1#仓库     38%'
    //         }, {
    //           value: 30,
    //           name: '2#仓库     30%'
    //         }, {
    //           value: 20,
    //           name: '3#仓库     20%'
    //         }, {
    //           value: 12,
    //           name: '4#仓库     12%'
    //         }]
    //       }
    //     ]
    //   }
    //   let myChart = this.$echarts.init(document.getElementById('myInventoryAcceptWaste'))
    //   myChart.setOption(chartsData)
    // },
    // getMyInventorySecondaryWaste: function (validContractList) {
    //   let _this = this
    //   // if (validContractList && validContractList.length) {
    //   //   let legendData = []; let seriesData = []; let totalNum = 0
    //   //   validContractList.forEach((element, index) => {
    //   //     totalNum += element.num
    //   //     if (index === validContractList.length - 1) {
    //   //       validContractList.forEach(element => {
    //   //         let name = element.signTypeName + '     ' + (totalNum > 0 ? parseFloat(element.num * 100 / totalNum).toFixed(1) : 0) + '%'
    //   //         legendData.push(name)
    //   //         seriesData.push({
    //   //           value: element.num,
    //   //           name: name
    //   //         })
    //   //       })
    //   //     }
    //   //   })
    //   // 园区企业数量图表
    //   let chartsData = {
    //     tooltip: {
    //       show: true,
    //       trigger: 'item',
    //       formatter: function (argument) {
    //         var arguItems = argument.name.split('     ')[0]
    //         var html = arguItems + ': ' + argument.value
    //         return html
    //       }
    //     },
    //     legend: {
    //       show: true,
    //       // selectedMode:false,
    //       right: 'right',
    //       top: 'middle',
    //       padding: [0, 10, 0, 0],
    //       itemWidth: 13,
    //       itemHeight: 13,
    //       itemGap: 15,
    //       orient: 'vertical',
    //       // x: 'right',
    //       data: ['飞灰     38%', '焚烧残渣     30%', '废耐火材料     20%', '其他     12%'],
    //       textStyle: {
    //         color: '#647585'
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     series: [
    //       {
    //         name: '访问来源',
    //         type: 'pie',
    //         center: ['30%', '50%'],
    //         radius: ['50%', '70%'],
    //         avoidLabelOverlap: false,
    //         color: ['#58D3FF', '#FF7A69', '#FBD456', '#E9EEF4'],
    //         label: {
    //           normal: {
    //             show: false,
    //             position: 'center',
    //             formatter: function (argument) {
    //               var arguItems = argument.name.split('     ')
    //               var html = arguItems.join('\n')
    //               return html
    //             },
    //             textStyle: {
    //               fontSize: 15,
    //               color: '#647585'
    //             }
    //           },
    //           emphasis: {
    //             show: true,
    //             textStyle: {}
    //           }
    //           // emphasis: {
    //           //     show: true,
    //           //     textStyle: {
    //           //         fontSize: '20',
    //           //         fontWeight: 'bold'
    //           //     }
    //           // }
    //         },
    //         labelLine: {
    //           normal: {
    //             show: false
    //           }
    //         },
    //         data: [{
    //           value: 38,
    //           name: '飞灰     38%'
    //         }, {
    //           value: 30,
    //           name: '焚烧残渣     30%'
    //         }, {
    //           value: 20,
    //           name: '废耐火材料     20%'
    //         }, {
    //           value: 12,
    //           name: '其他     12%'
    //         }]
    //       }
    //     ]
    //   }
    //   let myChart = this.$echarts.init(document.getElementById('myInventorySecondaryWaste'))
    //   myChart.setOption(chartsData)
    // },
    getLastMonthTotalEcharts: function (validContractList) {
      let _this = this
      // if (validContractList && validContractList.length) {
      //   let legendData = []; let seriesData = []; let totalNum = 0
      //   validContractList.forEach((element, index) => {
      //     totalNum += element.num
      //     if (index === validContractList.length - 1) {
      //       validContractList.forEach(element => {
      //         let name = element.signTypeName + '     ' + (totalNum > 0 ? parseFloat(element.num * 100 / totalNum).toFixed(1) : 0) + '%'
      //         legendData.push(name)
      //         seriesData.push({
      //           value: element.num,
      //           name: name
      //         })
      //       })
      //     }
      //   })
      // 园区企业数量图表
      let chartsData = {
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
          top: '10%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['应收金额', '开票金额', '回款金额'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '30%',
            data: [4.5, 2.8, 4.0]
          }
        ]
      }
      let myChart = this.$echarts.init(document.getElementById('lastMonthTotalEcharts'))
      myChart.setOption(chartsData)
    }
    // }
  }
}
</script>

<style lang="scss">
  @import '../../element-variables.scss';
  .home{
    .no-data{
      color: #909399;
      align-self: center;
      font-size: 12px;
    }
    .el-tooltip{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-pagination{
      padding: 0;
      display: flex;
      justify-content: space-between;
      button{
        span{
          background: #fff;
        }
      }
      &:before,&:after{
        display: none;
      }
    }
    .interval-top-block{
      margin-top: 10px;
      /*height: calc(100% - 10px) !important;*/
    }
    .interval-left-block{
      margin-left: 10px;
    }
    .small-size{
      font-size: 12px;
    }
    .border-grey{
      border: 1px solid #DAE1E8;
    }
    .color-green{
      color: #4AB734;
    }
    .color-yellow{
      color: #D09300;
    }
    .direction-icon{
      font-size: 12px;
    }
    .btn-group{
      position: absolute;
      top: -5px;
      right: 0;
    }
    .back-to-customer{
      padding: 2px 5px;
      z-index: 1;
    }
    .bg-grey{
      background: #ebf0f5;
    }
    .item{
      height: 100%;
      padding: 20px;
      background: #fff;
      .icon-list{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        .icon-list-item{
          width: 110px;
          display: flex;
          flex-direction: row;
          justify-content: start;
          align-items: center;
          .item-icon{
            color: $--color-primary;
            span{
              font-size: 29px;
            }
          }
          .item-content{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .item-content-num{
              font-size:16px;
              line-height:24px;
              color: $--color-primary;
            }
            .item-content-text{
              color:rgba(75,75,75,1);
              line-height:24px;
              font-size:12px;
            }
          }
        }
      }
      .item-title{
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #EEEEEE;
        .item-title-text{
          text-align: left;
          padding-left: 20px;
          border-left: 2px solid #40C3AB;
          color: #555D66;
          font-size: 16px;
        }
      }
      .item-content{
        padding-top: 10px;
        height: calc(100% - 45px);
        display: flex;
        flex-direction: column;
        .chart-item{
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          height: 100%;
        }
        .parking-list{
          height: 50%;
          display: flex;
          flex-grow: 1;
          border:1px solid rgba(218,225,232,1);
          justify-content: space-around;
          align-items: center;
        }
        .title-list{
          border: none;
          height: 56px;
          border-bottom: 1px solid #dae1e8;
          .title-list-item{
            display: flex;
            flex-direction: column;
            .title-list-item-header{
              color: $--color-primary;
              font-size:16px;
              line-height:24px;
            }
            .title-list-item-text{
              font-size:12px;
              line-height:24px;
              color: #4B4B4B;
            }
          }
        }
        .parking-list-direction{
          width: 100%;
          .chart-item-right, .chart-item-left{
            width: 50%;
          }
          .padding-left-no{
            padding-left: 0 !important;
          }
          .table-scroll{
            overflow-y: scroll;
            justify-content: start !important;
            .table-user-info{
              height: auto;
              text-align: left;
            }
          }
          .chart-item-right{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            padding-left: 10%;
            height: 100%;
            .signing-list{
              width: 100%;
              display: flex;
              flex-direction: row;
              .signing-list-item{
                width: 50%;
                display: flex;
                .signing-list-item-text{
                  color: #647585;
                  padding-right: 4px;
                  font-size:14px;
                  line-height:24px;
                }
                .signing-list-item-num{
                  color: #119E84;
                  font-size:24px;
                  line-height:24px;
                }
              }
            }
          }
        }
        .today-parking-list{
          height: 50%;
          flex-grow: 1;
          .today-parking-list-title{
            color: #647585;
            font-size:12px;
            line-height:24px;
            text-align: left;
            padding-left: 10px;
          }
          .today-parking-list-content{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: calc(100% - 24px);
            .el-table th, .el-table td{
              padding: 3px 0;
              font-size: 12px;
            }
            .customer-list{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
              height: 100%;
              font-size:14px;
              color: #555D66;
              .customer-item{
                border: 1px solid #DAE1E8;
                padding: 10px 10px;
                width: 33%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .customer-item-title{
                  display: flex;
                  .title-position{
                    color: #40C3AB;
                    width: 30%;
                  }
                  .title-name{
                    color: #555D66;
                    margin-left: 10px;
                  }
                }
              }
            }
          }
          .full-content{
            height: 100%;
          }
        }
        .title-list-c{
          height: 100%;
        }
        .customer-item-content{
          flex-grow: 1;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          overflow-y: scroll;
          /*justify-content: space-around;*/
          .customer-content-list{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .customer-content-list-item{
              width: 40%;
              text-align: left;
              padding: 2px 0;
              &:nth-last-child(1){
                width: 20%;
              }
            }
          }
        }
      }
      .flex-row{
        flex-direction: row;
        .chart-item{
          width: 50%;
        }
      }
      .sel-group{
        display: flex;
        /*width: 50%;*/
        margin: 0 auto;
        .el-date-editor,.el-select{
          width: 110px;
        }
        .el-select{
          margin-left: 10px;
        }
      }
      img{
        height: 100%;
        width: 100%;
      }
    }
    .lastMonthStoring{
      .item-content{
        .parking-list{
          border: none;
          .chart-item, .chart-item-right{
            border: 1px solid #DAE1E8;
            padding: 5px;
            .customer-item-content{
              width: 100%;
              padding: 5px;
              .customer-content-list{
                .customer-content-list-item{
                  width: 33%;
                }
              }
            }
          }
        }
      }
    }
    .samplingStatistics{
      .item-content{
        .parking-list{
          height: 30%;
        }
        .today-parking-list{
          height: 70%;
        }
      }
    }
    .home-top-row{
      height: 400px;
      margin-bottom: 10px;
      .el-col{
        height: 100%;
      }
    }
  }
  .table-user-info{
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    /*border: 1px solid #EBEEF5;*/
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    tr{
      /*&:hover{*/
        /*td{*/
          /*background-color: #f5f7fa;*/
        /*}*/
      /*}*/
      td{
        transition: background-color .25s ease;
        /*border: 1px solid #ebeef5;*/
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;

        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        /*&:nth-child(1){*/
          /*background:rgba(250,250,250,1);*/
        /*}*/
        /*&:nth-child(2){*/
          /*text-align: left;*/
        /*}*/
      }
    }
  }
  .el-form-item.is-success .el-input__inner{
    border: 1px solid #DCDFE6;
  }

  .opt-base {
    cursor: pointer;
    color: #40C3AB;
  }
</style>
