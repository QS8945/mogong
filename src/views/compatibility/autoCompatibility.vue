<template>
  <div class="divAuto">
    <el-row :gutter="24" class="autoRow" v-if="isShowBusinessInfo">
      <el-col class="autoCol" :span="secondCardCols">
        <el-card class="box-com-card">
          <div class="cardContent">
            <el-table v-loading="loading" size="mini" border :header-cell-style="headClass" stripe ref="multipleTable" :data="autoTopRecords"
              style="width: 100%" height="250" @selection-change="handleSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table v-loading="subLoading" size="mini" border :header-cell-style="headClass" stripe ref="multipleTable" :data="props.row.packageList"
                    style="width: 100%" height="150" @selection-change="handleSelectionChange">
                    <el-table-column label="顺序" type="index" width="50">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="150">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="storage" label="仓库" width="150">
                    </el-table-column>
                    <el-table-column align="center" prop="detail" label="化验结果" width="100">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="顺序" type="index" width="50">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="cusname" label="产废单位">
              </el-table-column>
              <el-table-column align="center" prop="matcode" label="八位码" width="120">
              </el-table-column>
              <el-table-column align="center" prop="matname" label="危废俗称" width="100">
              </el-table-column>
              <el-table-column align="center" prop="qty" label="数量" width="80">
                <template slot-scope="scope">
                  <span>{{scope.row.qty|amtFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" v-if="false">
              <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col class="autoCol" :span="thirdCardCols">
        <el-card class="box-com-card">
          <div slot="header" class="clearfix">
            <span class="cardTitle" v-if="isRightExpand">配伍明细</span>
            <i @click="thirdCardClick" v-if="isRightExpand" class="shousuo el-icon-d-arrow-right"></i>
            <i @click="thirdCardClick" v-else class="shousuo el-icon-d-arrow-left"></i>
            <i @click="hideClick" v-if="isShowBusinessInfo" class="shousuo el-icon-bottom-left"></i>
          </div>
          <div class="cardContent" v-if="isRightExpand" v-loading="resultLoading">
            <el-form size="small" :model="resultForm" :rules="resultFormRules" ref="resultForm" :label-width="resultFormLabelWidth">
              <el-row v-loading="pointLoading" v-for="item in pointList" :key="item.id">
                <el-col :span="24">
                  <el-form-item :label="item.value+'：'">
                    <span>{{item.resultValue}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <el-form-item label="配伍量：">
                    <span v-html="resultForm.compQuantity"></span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <div class="business-license" v-if="checkObj.type!='audit'">
                    <el-button size="small" :disabled="!(autoTopRecords&&autoTopRecords.length>0)" type="primary" @click="saveData('resultForm')">选&nbsp;&nbsp;&nbsp;择</el-button>
                    <el-button v-if="false" size="small" type="primary" @click="cancelData('resultForm')">重新配伍</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="autoRow" v-if="checkObj.type=='audit'&&isShowAuditCard&&!isAfterAudit">
      <el-col class="autoCol" :span="24">
        <el-card class="box-card-audit">
          <div slot="header" class="clearfix">
            <span class="cardTitle">配伍审批</span>
            <i @click="hideAuditCardClick" v-if="isShowAuditCard" class="shousuo el-icon-top-left"></i>
            <i @click="hideClick" v-if="!isShowBusinessInfo" class="shousuo el-icon-top-right"></i>
          </div>
          <div class="cardContent">
            <el-form size="small" :model="resultForm" :rules="resultFormRules" ref="resultForm" :label-width="resultFormLabelWidth">
              <el-row :gutter="100">
                <el-col :span="24">
                  <el-form-item label="审核意见：">
                    <el-input :rows="3" placeholder="请输入审核意见" type="textarea" v-model="resultForm.comment"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <div class="business-license">
                    <el-button size="small" type="primary" @click="auditCompatibilityProcess('yes')">同&nbsp;&nbsp;&nbsp;意</el-button>
                    <el-button size="small" @click="auditCompatibilityProcess('')">驳&nbsp;&nbsp;&nbsp;回</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="autoRow" v-if="checkObj.type=='audit'">
      <el-col class="autoCol" :span="24">
        <el-card class="box-card-audit">
          <div slot="header" class="clearfix">
            <span class="cardTitle">流转信息</span>
            <i @click="hideAuditCardClick" v-if="!isShowAuditCard" class="shousuo el-icon-top"></i>
          </div>
          <div class="cardContent">
            <el-form size="small" :model="resultForm" :rules="resultFormRules" ref="resultForm" :label-width="resultFormLabelWidth">
              <el-row :gutter="100">
                <el-col :span="24">
                  <v-list-process-info ref="mychild" :procInsId='checkObj.procInsId'></v-list-process-info>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CustomTable from '@/components/customTable'
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import ListProcessInfo from '@/views/contract/components/listProcessInfo.vue'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    listInvcurOfAutoCompatibility,
    listParam,
    listInvcurOftransferPackage,
    listCompatibilityTransferInfo,
    auditCompatibilityProcess
  } from '@/assets/js/API/api'

  export default {
    name: 'autoCompatibility',
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
        isAfterAudit:false,
        isShowAuditCard: true,
        isShowBusinessInfo: true,
        resultFormLabelWidth: '85px',
        resultLoading: false,
        expandKeys: [],
        autoTopRecords: [],
        autoSubRecords: [],
        secondCardCols: 18,
        thirdCardCols: 6,
        pointList: [],
        isLeftExpand: true,
        isRightExpand: true,
        state: '',
        cusList: [],
        resultForm: {

        },
        resultFormRules: {

        },
        formLabelWidth: '85px',
        queryForm: {
          valid: false
        },
        dialogFormTitle: '添加',
        queryFormRules: {},
        multipleSelection: [],
        openDelay: 500,
        topRecords: [{
          number: 1
        }],
        page: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 20]
        },
        dialogFormVisible: false,
        addForm: {},
        addFormRules: {

        },
        subLoading: false,
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
      'v-table': CustomTable,
      'v-pagination': Pagination,
      'v-list-process-info': ListProcessInfo
    },
    created() {
      var _this = this;
      if (_this.checkObj.type == "audit") {
        _this.loading = true;
        _this.resultLoading = true;
        listCompatibilityTransferInfo({
            ticket: localStorage.getItem('token'),
            id: _this.checkObj.compatibilityPlanId,
            templateId: _this.checkObj.templateId
          })
          .then(res => {
            if (res.data == null) {
              COMMONJS.showToast(res.infoList[0], "error")
              _this.loading = false;
              _this.resultLoading = false;
              return;
            }
            _this.autoTopRecords = res.data
            _this.autoTopRecords.forEach(element => {
              element.isShowTopExpand = true;
              element.qty = element.actqty
            });
            _this.loading = false;
            //根据模板标识获取计参数
            listParam({
                ticket: localStorage.getItem('token'),
                id: _this.checkObj.templateId
              })
              .then(res => {
                _this.pointList = res.data;
                _this.doValue();
                _this.resultLoading = false;
              }).catch(() => {})
          }).catch(() => {})
      } else {
        this.getData()
      }
      this.getPointList();
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      amtFormat: function (data) {
        if (isNaN(parseFloat(data))) {
          return data;
        }
        return parseFloat(data).toFixed(4)
      }
    },
    props: ['checkObj'],
    methods: {
      hideAuditCardClick() {
        this.isShowAuditCard = !this.isShowAuditCard;
      },
      hideClick() {
        this.isShowBusinessInfo = !this.isShowBusinessInfo;
      },
      auditCompatibilityProcess(flag) {
        let vm = this;
        let operation = flag == 'yes' ? "同意" : "驳回";
        let postData = {};
        vm.$confirm('您确认' + operation + '当前配伍计划吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postData.id = vm.checkObj.productionPlanId;
          postData.flowInfo = JSON.stringify({
            taskDefKey: vm.checkObj.step=='security'?'security':"deptLeaderAudit",
            flag: flag,
            procInsId: vm.checkObj.procInsId,
            comment: vm.resultForm.comment,
          })
          auditCompatibilityProcess(postData)
            .then(res => {
              if (res.status == "Success") {
                vm.$alert("审批完成，已" + operation + "！", {
                  type: 'success'
                }).then(function () {
                  //刷新子组件
                  vm.$refs.mychild.getData();
                  vm.isAfterAudit = true;
                });
              }
            }).catch(() => {})
        }).catch(() => {

        });
      },
      doValue() {
        var vm = this;
        var resultList = undefined;
        var paramMap = new Map();
        var paramValueMap = new Map();
        var temp5 = 0;
        var temp6 = 0;
        for (var i = 0; i < vm.pointList.length; i++) {
          //动态定义变量
          eval("var " + "Result" + vm.pointList[i].param + "=" + 0);
          //变量名放入map集合
          paramMap.set(vm.pointList[i].param, "Result" + vm.pointList[i].param);
        }
        resultList = vm.autoTopRecords;
        var count = 0;
        //存放每个元素次数
        var elementCountMap = new Map();
        //初始化elementCountMap集合
        for (var i = 0; i < vm.pointList.length; i++) {
          elementCountMap.set(vm.pointList[i].param, 0);
          paramValueMap.set(paramMap.get(vm.pointList[i].param), 0);
        }
        var sumQty = 0;
        if (Comjs.fw.core.util.ObjectUtils.hasValue(resultList)) {
          for (var i = 0; i < resultList.length; i++) {
            resultList[i].packageList.forEach(element => {
              var qty = element.actqty;
              if ("未抽检分析" != element.detail) {
                sumQty += qty;
              }
              temp5 = temp5 + parseFloat(element.actqty == null ? 0 : element.actqty);
              for (var jj = 0; jj < vm.pointList.length; jj++) {
                var current = vm.pointList[jj].param;
                //选择列表的值
                var resultListCurrentValue = element[current] == null ? 0 : element[current];
                //初始化的值
                //  var currentValue = eval(paramMap.get(current));
                var currentValue = paramValueMap.get(paramMap.get(current));
                var resultValue = parseFloat(resultListCurrentValue) * qty + parseFloat(currentValue);
                //初始化的值=初始化的值+后来赋的值
                //eval(paramMap.get(current) + "=" + resultValue.toFixed(3) * qty);                //设置每个参数对应的次数，如果没有次数就为0，否则次数+1
                var elementSumValue = elementCountMap.get(current);
                if (Comjs.fw.core.util.ObjectUtils.hasValue(element[current])) {
                  elementCountMap.set(current, elementSumValue + 1);
                  paramValueMap.set(paramMap.get(current), resultValue.toFixed(8));
                } else {
                  elementCountMap.set(current, elementSumValue);
                }
              }
              count++;
            });
          }
        }
        if (count == 0) {
          count = 1;
        }
        //平均值
        var map1 = {};
        //存放结果集拼接
        var arr = new Array();
        for (var i = 0; i < vm.pointList.length; i++) {
          var current = vm.pointList[i].param;
          var currentValue1 = paramMap.get(current).toString();
          //当前参数需要求平均数的次数
          var elementCount = elementCountMap.get(current);
          // var reslutValue = eval(paramMap.get(current)) == null ? 0 : eval(paramMap.get(current)) / (elementCount == 0 ? 1 : elementCount);
          if (sumQty > 0) {
            // var reslutValue = eval(paramMap.get(current)) == null ? 0 : eval(paramMap.get(current)) / sumQty;
            var reslutValue = paramValueMap.get(paramMap.get(current)) == null ? 0 : paramValueMap.get(paramMap.get(
              current)) / sumQty;
          } else {
            var reslutValue = 0;
          }
          //动态添加值
          map1[currentValue1] = reslutValue.toFixed(3);
          arr.push(vm.pointList[i].value + ":" + reslutValue);
          vm.pointList[i]["resultValue"] = reslutValue;
        }
        arr.push("配伍量:" + temp5);
        var resultDetail = arr.join(",");
        map1.temp5 = temp5;
        map1.resultDetail = resultDetail;
        vm.resultForm.compQuantity = temp5;
      },
      saveData() {
        let vm = this
        let callBackData = {};
        if (!vm.checkObj.isExistManualResult) { //不存在手动配伍结果，直接覆盖到父组件
          COMMONJS.showToast('自动配伍结果成功转移至已选择区')
          callBackData.autoTopRecords = vm.autoTopRecords;
          callBackData.resultForm = vm.resultForm;
          callBackData.resultForm.pointList = vm.pointList;
          this.$emit('reload', callBackData)
        } else {
          vm.$confirm('确认覆盖已有配伍结果吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            COMMONJS.showToast('自动配伍结果成功转移至已选择区')
            callBackData.autoTopRecords = vm.autoTopRecords;
            callBackData.resultForm = vm.resultForm;
            callBackData.resultForm.pointList = vm.pointList;
            this.$emit('reload', callBackData)
          })
        }
      },
      expandChange(row, expandedRows) {
        if (this.expandKeys.indexOf(row.reltkcode) >= 0) {
          //收起当前行
          this.expandKeys.shift()
          return;
        }
        this.getAutoSubRecords(row, expandedRows);
      },
      getAutoSubRecords(row, expandedRows) {
        var vm = this;
        vm.subLoading = true;
        listInvcurOftransferPackage({
            ticket: localStorage.getItem('token'),
            reltkcode: row.reltkcode,
            size: 10000,
            current: 1,
            planNo: vm.queryForm.planNo,
            templateId: vm.checkObj.templateId
          })
          .then(res => {
            row.subRecords = res.data.records;
            vm.subLoading = false;
            vm.expandKeys.shift() /** 新增 **/
            vm.expandKeys.push(row.reltkcode)
          }).catch(() => {})
        if (expandedRows.length > 1) {
          //只展开当前选项
          expandedRows.shift()
        }
      },
      getPointList() {
        var _this = this;
        _this.pointLoading = true;
        listParam({
            ticket: localStorage.getItem('token'),
            id: _this.checkObj.templateId
          })
          .then(res => {
            _this.pointList = res.data;
            _this.pointLoading = false;
          }).catch(() => {})
      },
      thirdCardClick() {
        var vm = this;
        if (vm.isRightExpand) {
          vm.thirdCardCols = 1;
          vm.isRightExpand = false;
        } else {
          vm.thirdCardCols = 6;
          vm.isRightExpand = true;
        }
        vm.secondCardCols = 24 - vm.thirdCardCols;
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      getPointLevelList() {
        var vm = this;
        vm.pointList.forEach((element, index) => {
          vm.pointLevelList.push({
            code: index + 1,
            name: (index + 1) + '级'
          });
        });
      },
      listWasteInfo() {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id'),
          current: 1,
          size: 100000,
          valid: 1,
          typeCode: '000010'
        }
        selectEnterpriseList(postData)
          .then(res => {
            res.data.records.forEach(element => {
              _this.cusList.push({
                "id": element.id,
                "value": element.name
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
        vm.addForm.baseCustomerCusCode = item.id;
        vm.addForm.cusId = item.id;
        vm.addForm.baseCustomerCusName = item.value;
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      autoData() {

      },
      getData() {
        let _this = this
        _this.loading = true;
        _this.resultLoading = true;
        let postData = {
          ticket: localStorage.getItem('token'),
          templateId: _this.checkObj.templateId,
          compQuantity: _this.checkObj.compQuantity
        }
        _this.checkObj.pointList.forEach(element => {
          if (element.start && element.start != '') {
            postData[element.param + 'Start'] = element.start;
            postData[element.param + 'Id'] = element.param;
          }
          if (element.end && element.end != '') {
            postData[element.param + 'End'] = element.end;
            postData[element.param + 'Id'] = element.param;
          }
        });
        listInvcurOfAutoCompatibility(postData)
          .then(res => {
            if (res.data == null) {
              COMMONJS.showToast(res.infoList[0], "error")
              _this.loading = false;
              _this.resultLoading = false;
              return;
            }
            _this.autoTopRecords = res.data.records
            _this.autoTopRecords.forEach(element => {
              element.isShowTopExpand = true;
            });
            _this.loading = false;
            //计算配伍结果
            _this.doValue()
            _this.resultLoading = false;
          }).catch(() => {})
      },
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      jumpBottomPage(index) {
        this.bottomPage.current = index
        this.getData()
      },
      jumpBottomSize(val) {
        this.bottomPage.size = val
        this.bottomPage.current = 1
        this.getData()
      },
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }

</script>

<style lang="scss">
  .cardTitle {
    border-left: 2px solid #40C3AB;
    padding-left: 20px;
    float: left;

  }

  .cardContent {
    width: 100%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-com-card {
    width: 100%;
    height: 360px;
    overflow-y: auto !important;
  }

  .box-card-audit {
    width: 100%;
    height: calc(100% - 360px);
    overflow-y: auto !important;
  }


  .topBottomCls {
    margin-bottom: 20px;

  }

  .topBottomCls i {
    font-weight: bold;
  }

  .business-license {
    .el-form-item__content {
      text-align: center;
    }
  }


  .divAuto {
    height: 100%;
    background-color: #DDE1E7;
  }

  .divAuto .autoRow {
    height: 100%;
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .shousuo {
    cursor: pointer;
    float: right;
    color: #40C3AB;
  }

  .divAuto .autoRow .autoCol {
    height: 100%;
    padding-left: 3px !important;
    padding-right: 3px !important;
  }

  .business-license {
    text-align: center
  }

</style>
