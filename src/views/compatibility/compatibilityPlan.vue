<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="计划单号：">
          <el-input v-model="queryForm.planNo" clearable @keyup.enter.native="queryData" placeholder="请输入计划单号"></el-input>
        </el-form-item>
        <el-form-item label="联单号：">
          <el-input v-model="queryForm.reltkcode" clearable @keyup.enter.native="queryData" placeholder="请输入联单号" ></el-input>
        </el-form-item>
         <el-form-item label="产废单位：">
          <el-autocomplete @keyup.enter.native="queryData" style="width:100%" clearable v-model="state" :fetch-suggestions="queryEntNameAsync"
                  placeholder="请输入产废单位" @select="handleSelect"></el-autocomplete>
         </el-form-item>
         <el-form-item label="八位码：" prop="matCode">
           <el-input v-model="queryForm.matCode" clearable @keyup.enter.native="queryData" placeholder="请输入八位码" >
           <el-button   slot="append" icon="el-icon-search"
                               @click.prevent="openMatcodeDialog"></el-button>
           </el-input>

         </el-form-item>
         <el-form-item label="危废俗称：">
           <el-input v-model="queryForm.matName" clearable @keyup.enter.native="queryData" placeholder="请输入危废名称" ></el-input>
         </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker v-model="queryForm.startTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker v-model="queryForm.endTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd 23:59:59"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button icon="el-icon-search" @click="queryData">查询</el-button>
          <el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-dialog title="选择八位码" :visible.sync="dialogMatcodeVisible" :close-on-click-modal="false" width="800px">
      <div>
        <el-form :inline="true" :model="queryMatCodeForm" :label-position="'right'" label-width="100px">
          <el-form-item>
            <el-input v-model="queryMatCodeForm.batchNumber" style="width:150px;margin-right:10px;" @keyup.enter.native="queryData" placeholder="请输入批次号" clearable></el-input>
            <el-input v-model="queryMatCodeForm.entWasteName" style="width:150px;margin-right:10px;" @keyup.enter.native="queryData" placeholder="请输入危废俗称" clearable></el-input>
            <el-input v-model="queryMatCodeForm.wasteCode" style="width:150px;margin-right:10px;" @keyup.enter.native="queryData" placeholder="请输入八位码" clearable></el-input>
            <el-input v-model="queryMatCodeForm.manifestNo" style="width:150px;" @keyup.enter.native="queryData" placeholder="请输入联单号" clearable></el-input>
          </el-form-item>
            <el-button @click="queryMatCode">查询</el-button>

        </el-form>
      </div>
        <el-table
                v-loading="dataTableVisible"
                ref="multipleTable"
                :data="matCoderecords"
                @selection-change="handleSelectionChange"
                style="width: 100%"
                row-key="id"
                lazy>
          <!--多项选择-->

          <el-table-column
                  prop="manifestNo"
                  label="联单号"
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
                  prop="fillWeight"
                  label="填埋量(吨)"
                  :show-overflow-tooltip="true"
                  align="center">
          </el-table-column>
          <el-table-column
                  prop="batchNumber"
                  label="批次号"
                  :show-overflow-tooltip="true"
                  align="center">
          </el-table-column>
          <el-table-column
                  prop="storage"
                  label="库位"
                  :show-overflow-tooltip="true"
                  align="center">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.prevent="chooseMatcode(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      <v-pagination :current="matCodepage.current" :size="matCodepage.size" :total="matCodepage.total" @reloadPage="jumpMatCodePage"
                    @reloadSize="jumpMatCodeSize"></v-pagination>
    </el-dialog>
    <el-tabs type="border-card" @tab-click="tabClick" v-model="defaultTabName">
      <el-tab-pane label="配伍清单列表" name="list">
        <div class="table-content">
          <el-table size="mini" border row-key="compatibilityPlanId" :expand-row-keys="expandKeys" @expand-change="expandChange" v-loading="listLoading"
            :row-style="rowStyle" :header-cell-style="headClass" stripe ref="multipleTable" :data="tableData" style="width: 100%"
            height="100%" @selection-change="handleSelectionChange">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table size="mini" v-loading="subLoading" border :header-cell-style="headClass" stripe ref="multipleTable" :data="subRecords"
                  style="width: 100%" height="150">
                  <el-table-column type="index" width="50" label="顺序"></el-table-column>
                  <el-table-column align="center" prop="entName" label="产废单位">
                  </el-table-column>
                  <el-table-column align="center" prop="matCode" label="八位码" width="150">
                  </el-table-column>
                  <el-table-column align="center" prop="matName" label="危废俗称" width="150">
                  </el-table-column>
                  <el-table-column align="center" prop="qty" label="配伍总量" width="150">
                  </el-table-column>
                  <el-table-column align="center" prop="reltkcode" label="联单号" width="150">
                  </el-table-column>
                  <el-table-column align="center" prop="storageName" label="所在库位" width="150">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="planNo" label="计划单号" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="viewProductionPlan(scope.row)">{{scope.row.planNo}}</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="compatibilityNo" label="配伍单号" width="155">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="analysisResult" label="配伍结果">
            </el-table-column>
            <el-table-column align="center" prop="entName"  label="产废单位">
            </el-table-column>
            <el-table-column align="center" prop="matCode"  label="八位码" >
            </el-table-column>
            <el-table-column align="center" prop="matName"  label="危废俗称" >
            </el-table-column>
            <el-table-column align="center" prop="reltkcode"   label="联单号" >
            </el-table-column>
            <el-table-column align="center" prop="qty" label="配伍总量" width="120">
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="配伍日期" width="120">
              <template slot-scope="scope">
                {{formatDate(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="planStatus" label="状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.planStatus==='save'">已保存</span>
                <span v-else-if="scope.row.planStatus==='commit'">已提交</span>
                <span v-else-if="scope.row.planStatus==='precheck'">已初审</span>
                <span v-else-if="scope.row.planStatus==='compatibility'">已配伍</span>
                <span v-else-if="scope.row.planStatus==='finalcheck'">已终审</span>
                <span v-else-if="scope.row.planStatus==='check'">已审核</span>
                <span v-else-if="scope.row.planStatus==='refuse'">已驳回</span>
                <span v-else-if="scope.row.planStatus==='stop'">已终止</span>
                <span v-else>状态异常</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="188">
              <template slot-scope="scope">
                <!-- 已保存或者已驳回的时候显示编辑-->
                <span v-if="scope.row.planStatus=='save'||scope.row.planStatus=='precheck'||scope.row.planStatus=='refuse'" class="operateBtnCls"
                  @click="editListInfo(scope.row, 'update')" type="text" size="small">
                  编辑
                </span>
                <span v-if="scope.row.planStatus!='compatibility'||scope.row.planStatus!='finalcheck'||scope.row.planStatus!='check'" class="operateBtnCls"
                  @click="editListInfo(scope.row, 'query')" type="text" size="small">
                  查看
                </span>
                <!-- 已保存或者已驳回的时候显示删除-->
                <span v-if="scope.row.planStatus=='save'||scope.row.planStatus=='precheck'||scope.row.planStatus=='refuse'" class="operateBtnCls"
                  @click="deleteList(scope.row,'delete')" type="text" size="small">
                  删除
                </span>
                <!-- 已保存或者已驳回的的时候显示提交按钮 -->
                <span v-if="scope.row.planStatus=='save'||scope.row.planStatus=='precheck'||scope.row.planStatus=='refuse'" class="operateBtnCls"
                  @click="commitList(scope.row,'commit')" type="text" size="small">
                  提交
                </span>
                <!-- 已配伍或者已终审的时候显示审核 -->
                <!-- <span v-if="scope.row.planStatus=='finalcheck'||scope.row.planStatus=='compatibility'" class="operateBtnCls"
                  @click="commitList(scope.row,'audit')" type="text" size="small">
                  删除
                </span> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待配伍生产计划列表" name="plan">
        <div class="table-content">
          <el-table size="mini" border v-loading="planLoading" :header-cell-style="headClass" stripe ref="multipleTable" :data="actTableData"
            style="width: 100%" height="100%" @selection-change="handleSelectionChange">
            <el-table-column align="center" prop="planNo" label="计划单号">
              <template slot-scope="scope">
                <el-button type="text" @click="viewProductionPlan(scope.row)">{{scope.row.planNo}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="startTime" label="开始日期" width="120">
              <template slot-scope="scope">
                {{formatDate(scope.row.startTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="endTime" label="结束日期" width="120">
              <template slot-scope="scope">
                {{formatDate(scope.row.endTime)}}
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="productionLine" label="生产线" width="150">
            </el-table-column>
            <el-table-column align="center" prop="planQty" label="计划用量（吨）" width="150">
            </el-table-column>
            <el-table-column align="center" prop="creater" label="创建人" width="80">
            </el-table-column>
            <el-table-column align="center" label="操作" width="188">
              <template slot-scope="scope">
                <span class="operateBtnCls" @click="createList(scope.row, 'add')" type="text" size="small">
                  创建配伍单
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <v-pagination :current="actPage.current" :sizes="actPage.sizes" :size="actPage.size" :total="actPage.total" @reloadPage="jumpActPage"
              @reloadSize="jumpActSize"></v-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 查看生产计划 -->
    <div v-if="dialogFormVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}生产计划</div>
        </div>
        <v-add-production-plan @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
          @reload="reloadP"></v-add-production-plan>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import AuditCompatibility from './auditCompatibility.vue'
  import AddProductionPlan from './components/addProductionPlan.vue'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageProductionPlan,
    pageCompatibilityList,
    pageCompatibilityPlanNo,
    getCodeAndNameDic,
    listEnt,
    getFillbusinessWasteList,
    removeCompativilityPlan,
    startCompatibilityProcess,
    auditCompatibilityProcess,
    removeCompatibilityRecord,
    cancelCompatibilityProcess,
    queryProductionPlan,
    exportCompatibilityList,
    exportCompatibilityProducitonPlanList
  } from '@/assets/js/API/api'

  export default {
    data() {
      let validateContactWay = (rule, value, callback) => {
        if (!value) callback()
        let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
        let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPhone.test(value) && !regTel.test(value)) {
          callback(
            new Error(this.$t('enterprise_info.link_phone') + this.$t('validate.format'))
          )
        } else {
          callback()
        }
      }
      let checkPwd = (rule, value, callback) => {
        if (!value) callback()
        let regPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,64}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPwd.test(value)) {
          callback(
            new Error('由字母、数字、符号组成，长度不能少于8位')
          )
        } else {
          callback()
        }
      }
      return {
        expandKeys: [],
        subLoading: false,
        cantonVisible: false,
        cantonOptions: [],
        subRecords: [],
        statusList: [],
        planLoading: true,
        listLoading: true,
        defaultTabName: 'list',
        tableData: [],
        actTableData: [],
        state:'',
        cusList: [],
        dataTableVisible:false,
        matCoderecords:[],
        queryMatCodeForm:{
          batchNumber:'',
          entWasteName:'',
          wasteCode:'',
          manifestNo:''
        },
        queryForm: {
          planNo:'',
          matCode:'',
          matName:'',
          reltkcode:'',
          startTime:'',
          endTime:''
        },
        checkObjP: {},
        matCodepage: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0
        },
        dialogFormTitle: '查看',
        dialogFormVisible: false,
        dialogMatcodeVisible:false,

        openDelay: 500,
        page: {
          current: GLB_CONSTANT.page.current,
          size: 10,
          total: 0,
          sizes: [5, 10, 50]
        },
        actPage: {
          current: GLB_CONSTANT.page.current,
          size: 10,
          total: 0,
          sizes: [5, 10, 50]
        },
        multipleSelection: [],
        resetPwdFormVisible: false,
        resetPwdForm: {
          newPassword: ''
        },
        resetPwdFormRules: {
          newPassword: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              validator: checkPwd,
              trigger: 'change'
            }
          ]
        }
      }
    },
    // 组件
    components: {
      'v-pagination': Pagination,
      'v-add-production-plan': AddProductionPlan,
      'v-audit-compatibility': AuditCompatibility
    },
    created() {
      if (this.$route.query && this.$route.query.defaultTabName && this.$route.query.defaultTabName != "") {
        this.defaultTabName = this.$route.query.defaultTabName;
      }
      if (this.checkObj && this.checkObj.defaultTabName && this.checkObj.defaultTabName != '') {
        this.defaultTabName = this.checkObj.defaultTabName;
      }
      this.getData()
      this.listCusList();
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    props: ['checkObj'],
    methods: {
      checkTime(val) {
        var vm = this
        if (vm.queryForm.startTime && vm.queryForm.endTime) {
          var start = new Date(Date.parse(vm.queryForm.startTime));
          var end = new Date(Date.parse(vm.queryForm.endTime));
          if (start > end) {
            COMMONJS.showToast('开始日期不能晚于结束日期，请重新选择！', 'warning')
            return
          }
        }
      },
      listCusList() {
              var vm = this;
              listEnt({
                  ticket: localStorage.getItem('token'),
                  cusclassid: '01'
                })
                .then(res => {
                  res.data.forEach(element => {
                    vm.cusList.push({
                      "id": element.guid,
                      "value": element.cusname
                    });
                  });
                }).catch(() => {})
            },
      queryEntNameAsync(queryString, cb) {
        var vm = this;
        var cusList = vm.cusList;
        var results = queryString ? cusList.filter(this.createStateFilter(queryString)) : cusList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 100 * Math.random());
      },
      createStateFilter(queryString) {

              return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
              };
            },
      handleSelect(item) {
             var vm = this;
             vm.queryForm.prodEntName = item.value;
           },
      commitList(row, type) {
        let vm = this;
        if (type == "commit") {
          vm.$confirm('确认提交配伍单【' + row.compatibilityNo + '】吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //先获取流程标识
            queryProductionPlan(row.id)
              .then(res => {
                if (res.data != null && res.data.procInsId) {
                  let postData = row;
                  postData.flowInfo = JSON.stringify({
                    taskDefKey: "compatibility",
                    flag: "yes",
                    procInsId: res.data.procInsId,
                    comment: '同意'
                  })
                  auditCompatibilityProcess(postData)
                    .then(res => {
                      if (res.status == "Success") {
                        COMMONJS.showToast("配伍单提交成功！")
                        vm.listLoading = true;
                        setTimeout(() => {
                          vm.getData();
                        }, 2000);
                      }
                    }).catch(() => {

                    })
                } else {
                  COMMONJS.showToast('数据异常，流程标识不存在！', 'warning')
                  return;
                }
              }).catch(() => {})

          })
        }
        if (type == "audit") {
          vm.$router.push({
            path: '/signCompatibility',
            type: type,
            query: {
              procInsId: '1111'
            }
          })
        }
      },
      exportExcel () {
        let _this = this
        var productionPlanId = _this.checkObj && _this.checkObj.productionPlanId ? _this.checkObj.productionPlanId :
        '';
        if (_this.$route.query.productionPlanId && _this.$route.query.productionPlanId != '') {
          productionPlanId = _this.$route.query.productionPlanId
        }
        if (this.defaultTabName == "plan") {
          let postData = {
            ticket: localStorage.getItem('token'),
            planNo: _this.queryForm.planNo,
            startTime: _this.queryForm.startTime,
            endTime: _this.queryForm.endTime,
            current: _this.actPage.current,
            size: _this.actPage.size,
            hasCompatibility: '0',
            productionPlanId: productionPlanId,
            reltkcode:_this.queryForm.reltkcode,
            prodEntName:_this.state,
            matCode:_this.queryForm.matCode,
            matName:_this.queryForm.matName
          }

          exportCompatibilityProducitonPlanList(postData)
          .then(res => {
            let url
            url = GLB_CONSTANT.devUrl.serviceErpRootUrl + '/' + res.data
            window.location.href = url
          }).catch(() => {})
        } else {
          let _this = this
          let postData = {
            ticket: localStorage.getItem('token'),
            planNo: _this.queryForm.planNo,
            startTime: _this.queryForm.startTime,
            endTime: _this.queryForm.endTime,
            current: _this.actPage.current,
            size: _this.actPage.size,
            hasCompatibility: '0',
            productionPlanId: productionPlanId,
            reltkcode:_this.queryForm.reltkcode,
            prodEntName:_this.state,
            matCode:_this.queryForm.matCode,
            matName:_this.queryForm.matName
          }
          exportCompatibilityList(postData)
          .then(res => {
            let url
            url = GLB_CONSTANT.devUrl.serviceErpRootUrl + '/' + res.data
            window.location.href = url
          }).catch(() => {})
        }

      },
      openMatcodeDialog(){
        this.dialogMatcodeVisible=true;
        this.getMatCodeData();
      },
      chooseMatcode(row){
        let _this=this;
        _this.dialogMatcodeVisible=false;
        _this.queryForm.matCode=row.wasteCode;
        _this.queryForm.matName=row.entWasteName;
        _this.matCodepage.current=1;
        _this.getData();
      },
      viewProductionPlan(row) {
        var vm = this;
        vm.checkObjP = {
          type: 'query',
          data: row.id
        }
        vm.dialogFormVisible = true
      },
      expandChange(row, expandedRows) {
        if (this.expandKeys.indexOf(row.compatibilityPlanId) >= 0) {
          //收起当前行
          this.expandKeys.shift()
          return;
        }
        this.getSubRecords(row, expandedRows);
      },
      getSubRecords(row, expandedRows) {
        var vm = this;
        vm.subLoading = true;
        vm.subRecords = []
        pageCompatibilityPlanNo({
            ticket: localStorage.getItem('token'),
            compatibilityPlanId: row.compatibilityPlanId,
          })
          .then(res => {
            vm.subRecords = res.data.records;
            vm.subLoading = false;
            vm.expandKeys.shift() /** 新增 **/
            vm.expandKeys.push(row.compatibilityPlanId)
          }).catch(() => {})
        if (expandedRows.length > 1) {
          //只展开当前选项
          expandedRows.shift()
        }
      },
      createList(row, type) {
        var vm = this;
        if (vm.checkObj && vm.checkObj.productionPlanId && vm.checkObj.productionPlanId != '') {
          vm.$router.push({
            path: '/auditAddCompatibility',
            type: type,
            query: {
              productionId: row.id,
              type: type,
              openType: 'isOpenFromToDo',
              procInsId: vm.$route.query.procInsId
            }
          })
        } else {
          vm.$router.push({
            path: '/addCompatibility',
            type: type,
            query: {
              type: type,
              productionId: row.id
            }
          })
        }
      },
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      rowStyle({
        row,
        rowIndex
      }) {
        if (rowIndex === 0) {
          return 'height:80px'
        } else {
          return ''
        }
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      sureCancelProcess(row) {
        var vm = this;
        queryProductionPlan(row.id)
          .then(res => {
            if (res.data != null) {
              cancelCompatibilityProcess({
                  guid: row.id,
                  procInsId: res.data.procInsId,
                  reason: '删除配伍，取消流程'
                })
                .then(res => {}).catch(() => {

                })
            }
          }).catch(() => {})
      },
      deleteList(row) {
        let _this = this
        this.$confirm('确认删除配伍清单【' + row.compatibilityNo + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          let params = {
            ticket: localStorage.getItem('token')
          }
          postData.push(row.compatibilityPlanId);
          removeCompatibilityRecord(postData, params).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
            // _this.sureCancelProcess(row);
          }).catch(() => {})
        })
      },
      editListInfo(row, type) {
        var vm = this;
        vm.checkObjP.compatibilityPlanId = row.compatibilityPlanId;
        vm.checkObjP.templateId = row.templateId;
        vm.checkObjP.type = type
        if ((vm.checkObj && vm.checkObj.productionPlanId && vm.checkObj.productionPlanId != '') || (vm.$route.query.openType ==
            "isOpenFromToDo")) {
          vm.checkObjP.openType = 'isOpenFromToDo'
          vm.checkObjP.productionId = row.id
          vm.$router.push({
            path: '/auditAddCompatibility',
            type: type,
            query: vm.checkObjP
          })
        } else {
          vm.$router.push({
            path: '/addCompatibility',
            query: vm.checkObjP
          })
        }

      },
      tabClick(data) {
        let _this = this;
        _this.defaultTabName = data.name;
        _this.getData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()

      },
      getData() {
        let _this = this
        var productionPlanId = _this.checkObj && _this.checkObj.productionPlanId ? _this.checkObj.productionPlanId :
          '';
        if (_this.$route.query.productionPlanId && _this.$route.query.productionPlanId != '') {
          productionPlanId = _this.$route.query.productionPlanId
        }
        if (this.defaultTabName == "plan") {
          _this.planLoading = true;
          let postData = {
            ticket: localStorage.getItem('token'),
            planNo: _this.queryForm.planNo,
            startTime: _this.queryForm.startTime,
            endTime: _this.queryForm.endTime,
            current: _this.actPage.current,
            size: _this.actPage.size,
            hasCompatibility: '0',
            productionPlanId: productionPlanId,
             reltkcode:_this.queryForm.reltkcode,
             prodEntName:_this.state,
             matCode:_this.queryForm.matCode,
             matName:_this.queryForm.matName
          }
          pageProductionPlan(postData)
            .then(res => {
              _this.actTableData = res.data.records
              _this.actPage.total = res.data.total
              _this.planLoading = false;
            }).catch(() => {})
        } else {
          _this.listLoading = true;
          let postData = {
            ticket: localStorage.getItem('token'),
            planNo: _this.queryForm.planNo,
            startTime: _this.queryForm.startTime,
            endTime: _this.queryForm.endTime,
            current: _this.page.current,
            size: _this.page.size,
            productionPlanId: productionPlanId,
            reltkcode:_this.queryForm.reltkcode,
            prodEntName:_this.state,
            matCode:_this.queryForm.matCode,
            matName:_this.queryForm.matName
          }
          pageCompatibilityList(postData)
            .then(res => {
              _this.tableData = res.data.page.records;
              _this.page.total = res.data.page.total
              _this.listLoading = false;
            }).catch(() => {})
        }
      },
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpMatCodePage(index){
        this.matCodepage.current=index
        this.getMatCodeData()
      },
      jumpMatCodeSize(val){
        this.matCodepage.size=val
        this.matCodepage.current=1
        this.getMatCodeData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      jumpActPage(index) {
        this.actPage.current = index
        this.getData()
      },
      jumpActSize(val) {
        this.actPage.size = val
        this.actPage.current = 1
        this.getData()
      },
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      },
      handleCurrentChange(index) {
        this.page.current = index
        this.getData()
      },
      handleSizeChange(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      delSection(obj) {
        let _this = this
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            enterpriseWasteId: obj.id
          }
          deleteEnterpriseWaste(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },



      queryMatCode(){
        let _this=this;
        _this.matCodepage.current=1
         _this.getMatCodeData();
      },
       getMatCodeData () {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id'),
          current: this.matCodepage.current,
          size: this.matCodepage.size,
          manifestNo: this.queryMatCodeForm.manifestNo,
          wasteCode: this.queryMatCodeForm.wasteCode,
          entWasteName: this.queryMatCodeForm.entWasteName,
          batchNumber: this.queryMatCodeForm.batchNumber
        }
        _this.dataTableVisible = true
        let params = {
          ticket: localStorage.getItem('token')
        }
        getFillbusinessWasteList(postData, params)
        .then(res => {
          _this.matCoderecords = res.data.records
          _this.matCodepage.total = res.data.total

          _this.dataTableVisible = false
        }).catch(() => {
          _this.dataTableVisible = false
        })
      },
    }
  }

</script>

<style lang="scss">
  .el-tabs {
    height: 100%;
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      height: calc(100% - 41px);
      overflow: auto;
      /*border-right: 1px solid #E4E7ED;*/
      /*border-left: 1px solid #E4E7ED;*/
      /*border-bottom: 1px solid #E4E7ED;*/
      .el-tab-pane {
        height: 100%;
      }
    }
  }

  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
