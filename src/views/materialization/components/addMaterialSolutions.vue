<template>
  <div class="divCard">
    <el-row class="cardRow" :gutter="24">
      <el-col class="cardRol" :span="firstCardCols">
        <el-card class="box-card">
          <div class="cardContent" v-if="isLeftExpand">
            <el-form size="small" :model="addForm" :label-width="formLabelWidth">
              <el-tabs v-model="defaultTabName" @tab-click="handleClick" type="card">
                <el-tab-pane name="first">
                  <span slot="label">库存查询
                  </span>
                  <el-row style="margin-top:20px;" :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="产废单位">
                        <el-autocomplete @keyup.enter.native="queryData" style="width:100%" clearable v-model="state" :fetch-suggestions="queryEntNameAsync"
                                         placeholder="输入关键字搜索产废单位" @select="handleSelect"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="仓库">
                        <el-select v-model="addForm.storageId" clearable placeholder="请选择仓库">
                          <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="联单号">
                        <el-input clearable @keyup.enter.native="queryData" v-model="addForm.reltkcode" placeholder="请输入联单号"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="模板">
                        <el-select :disabled="$route.query.type=='update'||$route.query.type=='query'" @change="templateChange" v-model="addForm.templateId"
                                   placeholder="请选择自动配伍模板">
                          <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-loading="pointLoading" v-for="item in pointList" :key="item.id">
                    <el-col :span="24">
                      <el-form-item :label="item.value">
                        <el-input @keyup.enter.native="queryData" style="width:35%" size="mini" v-model="item.start"></el-input>
                        <span>~</span>
                        <el-input @keyup.enter.native="queryData" style="width:35%" size="mini" v-model="item.end"></el-input>
                        <el-select size="mini" style="width:75%" v-model="item.pointLevel" clearable placeholder="优先级">
                          <el-option v-for="item in pointLevelList" :key="item.code" :label="item.name" :value="item.code">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <div class="business-license">
                        <el-button size="small" type="primary" @click="queryData('addForm')">查&nbsp;&nbsp;&nbsp;询</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="自动配伍" name="second">
                  <el-row style="margin-top:20px;" :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="模板">
                        <el-select :disabled="$route.query.type=='update'||$route.query.type=='query'" v-model="addForm.templateId" placeholder="请选择自动配伍模板">
                          <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-loading="pointLoading" v-for="item in pointList" :key="item.id">
                    <el-col :span="24">
                      <el-form-item :label="item.value">
                        <el-input style="width:35%" size="mini" v-model="item.start"></el-input>
                        <span>~</span>
                        <el-input style="width:35%" size="mini" v-model="item.end"></el-input>
                        <el-select size="mini" style="width:75%" v-model="item.pointLevel" clearable placeholder="优先级">
                          <el-option v-for="item in pointLevelList" :key="item.code" :label="item.name" :value="item.code">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="配伍量">
                        <el-input v-model="addForm.compQuantity" placeholder="请输入配伍量">
                          <template slot="append">吨</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-show="false">
                    <el-col :span="24">
                      <el-form-item label="配伍单数量">
                        <el-input-number style="width:100%" :min="0" v-model="addForm.amount" placeholder="请输入配伍单数量">
                        </el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <el-form-item label="配伍原则">
                        <el-select v-model="addForm.rule" clearable placeholder="请选择配伍原则">
                          <el-option v-for="item in ruleList" :key="item.code" :label="item.name" :value="item.code">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="100">
                    <el-col :span="24">
                      <div class="business-license" v-if="$route.query.type=='add'||$route.query.type=='update'">
                        <el-button size="small" type="primary" @click="autoData('addForm')">自动配伍</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col class="cardRol" :span="secondCardCols">
        <el-card class="box-card">
          <div class="cardContent">
            <el-table :row-class-name="getTopRowClassName" size="mini" row-key="pk" :expand-row-keys="expandKeys" @expand-change="expandChange"
                      height="350" v-loading="loading" border :header-cell-style="headClass" stripe ref="multipleTopTable" :data="topRecords"
                      style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" v-loading="subLoading" border :header-cell-style="headClass" stripe ref="multipleTopSubTable" :data="subRecords"
                            style="width: 100%" height="150" @selection-change="handleSubSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="storage" label="仓库" width="150">
                    </el-table-column>
                    <el-table-column align="center" prop="detail" label="化验结果" width="100">
                    </el-table-column>
                  </el-table>
                  <div class="block" v-if="subRecords&&subRecords.length>0">
                    <v-pagination :current="topSubPage.current" :sizes="topSubPage.sizes" :size="topSubPage.size" :total="topSubPage.total" @reloadPage="jumpTopSubPage"
                                  @reloadSize="jumpTopSubSize"></v-pagination>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="cusname" label="产废单位">
              </el-table-column>
              <el-table-column align="center" prop="matcode" label="八位码" width="120">
              </el-table-column>
              <el-table-column align="center" prop="matname" label="危废俗称" width="100">
              </el-table-column>
              <el-table-column align="center" prop="actqty" label="数量" width="80">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
            </div>
            <!-- 分割线 -->
            <div class="topBottomCls">
              <el-button @click="toBottomClick" :disabled="toBottomBtnFlag" size="samll" type="primary" icon="el-icon-bottom" circle></el-button>
              <el-button @click="toTopClick" :disabled="!(multipleBottomSubSelection&&multipleBottomSubSelection.length>0)" size="samll"
                         type="primary" icon="el-icon-top" circle></el-button>
            </div>
            <!-- 分割线 -->
            <el-table height="350" size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomTable" :data="bottomRecords"
                      style="width: 100%" @selection-change="handleBottomSelectionChange">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table size="mini" border :header-cell-style="headClass" stripe ref="multipleBottomSubTable" :data="props.row.subRecords"
                            style="width: 100%" height="150" @selection-change="handleBottomSubSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="batchno" label="包装编码">
                    </el-table-column>
                    <el-table-column align="center" prop="actqty" label="数量" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="storage" label="仓库" width="100">
                    </el-table-column>
                    <el-table-column align="center" prop="detail" label="化验结果" width="100">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="cusname" label="产废单位">
              </el-table-column>
              <el-table-column align="center" prop="matcode" label="八位码" width="120">
              </el-table-column>
              <el-table-column align="center" prop="matname" label="危废俗称" width="100">
              </el-table-column>
              <el-table-column align="center" prop="actqty" label="数量" width="80">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="reltkcode" label="联单号" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewLabDetail(scope.row)">{{scope.row.reltkcode}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" v-if="false">
              <v-pagination :current="bottomPage.current" :sizes="bottomPage.sizes" :size="bottomPage.size" :total="bottomPage.total" @reloadPage="jumpBottomPage"
                            @reloadSize="jumpBottomSize"></v-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col class="cardRol" :span="thirdCardCols">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardTitle" v-if="isRightExpand">配伍结果</span>
            <i @click="thirdCardClick" v-if="isRightExpand" class="shousuo el-icon-d-arrow-right"></i>
            <i @click="thirdCardClick" v-else class="shousuo el-icon-d-arrow-left"></i>
          </div>
          <div class="cardContent" v-if="isRightExpand">
            <el-form size="small" :model="resultForm" :label-width="resultFormLabelWidth">
              <el-row v-for="item in pointList" :key="item.id">
                <el-col :span="24">
                  <el-form-item :label="item.value+'：'">
                    <span>{{item.resultValue}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <el-form-item label="配伍量：">
                    <span>{{resultForm.compQuantity}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="12">
                  <el-form-item label="生产日期：">
                    <el-date-picker v-model="resultForm.productDate" type="date" placeholder="选择生产日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <el-form-item label="备注：">
                    <el-input :rows="5" type="textarea" v-model="resultForm.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="100">
                <el-col :span="24">
                  <div class="business-license">
                    <el-button :loading="saveLoading" size="small" type="primary" @click="saveData('resultForm')">保&nbsp;&nbsp;&nbsp;存</el-button>
                    <el-button size="small" type="primary" @click="cancelData('plan')">取&nbsp;&nbsp;&nbsp;消</el-button>
                    <el-button v-if="bottomRecords&&bottomRecords.length>0" size="small" type="primary" @click="reset('resultForm')">重&nbsp;&nbsp;&nbsp;置</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--自动配伍模态框-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="80%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}</div>
        </div>
        <v-auto-compatibility @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-auto-compatibility>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import AutoCompatibility from './autoCompatibility.vue'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  listCompatibilityTemplate,
  listParam,
  listInvcurOfCompatibility,
  listStorage,
  listEnt,
  listInvcurOftransferPackage,
  listInvcurOfAutoCompatibility,
  saveCompatibility,
  listCompatibilityTransferInfo,
  getCompatibilityById
} from '@/assets/js/API/api'

export default {
  name: 'addCompatibility',
  data () {
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
      saveLoading: false,
      toBottomBtnFlag: true,
      toTopBtnFlag: true,
      subLoading: false,
      expandKeys: [],
      expandBottomKeys: [],
      loading: false,
      pointLoading: false,
      firstCardCols: 6,
      secondCardCols: 17,
      thirdCardCols: 1,
      isLeftExpand: true,
      isRightExpand: false,
      state: '',
      defaultTabName: 'first',
      cusList: [],
      ruleList: [{
        code: '1',
        name: '先进先出'
      }, {
        code: '2',
        name: '后进先出'
      },
      {
        code: '3',
        name: '量大先出'
      }
      ],
      resultForm: {
        compQuantity: ''
      },
      resultFormRules: {

      },
      pointLevelList: [],
      pointList: [{
        id: '1',
        name: '热值',
        start: '',
        end: '',
        pointLevel: ''
      }],
      warehouseList: [],
      formLabelWidth: '85px',
      resultFormLabelWidth: '85px',
      templateList: [],
      queryForm: {
        valid: false
      },
      checkObjP: {},
      dialogFormTitle: '自动配伍',
      queryFormRules: {},
      statusOptions: [{
        label: '启动',
        value: '1'
      }, {
        label: '停用',
        value: '2'
      }],
      multipleSelection: [],
      multipleSubSelection: [],
      multipleBottomSelection: [],
      multipleBottomSubSelection: [],
      openDelay: 500,
      topRecords: [],
      bottomRecords: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: 5,
        total: 0,
        sizes: [5, 10, 20]
      },
      topSubPage: {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
      },
      bottomPage: {
        current: GLB_CONSTANT.page.current,
        size: 5,
        total: 0,
        sizes: [5, 10, 20]
      },
      dialogFormVisible: false,
      addForm: {},
      addFormRules: {},
      resetPwdFormVisible: false,
      resetPwdForm: {
        newPassword: ''
      },
      curOptReltkObj: {},
      curNotInBatchNoList: [],
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
    'v-auto-compatibility': AutoCompatibility
  },
  created () {
    var vm = this
    // 加载模板
    vm.listCompatibilityTemplate()
    // 加载仓库
    vm.listStorage()
    // 加载产废单位
    vm.listCusList()
    vm.resultForm.productDate = vm.addDate(new Date(), 1)
    if (vm.$route.query.type == 'update' || vm.$route.query.type == 'query') { // 编辑
      vm.addForm.templateId = vm.$route.query.templateId
      listCompatibilityTransferInfo({
        ticket: localStorage.getItem('token'),
        id: vm.$route.query.compatibilityPlanId,
        templateId: vm.$route.query.templateId
      })
        .then(res => {
          vm.bottomRecords = res.data
          vm.bottomRecords.forEach(element => {
            element.subRecords = element.packageList
          })
          if (vm.bottomRecords && vm.bottomRecords.length > 0) {
            vm.doValue()
            // 展开第三个卡片
            vm.thirdCardCols = 6
            vm.isRightExpand = true
            vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
          }
        }).catch(() => {})

      getCompatibilityById({
        ticket: localStorage.getItem('token'),
        id: vm.$route.query.compatibilityPlanId
      })
        .then(res => {
          vm.resultForm.remark = res.data.remark
        }).catch(() => {})
    }
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
    templateChange (val) {
      var _this = this
      // 加载参数列表
      _this.pointLoading = true
      listParam({
        ticket: localStorage.getItem('token'),
        id: _this.addForm.templateId
      })
        .then(res => {
          _this.pointList = res.data
          _this.getPointLevelList()
          _this.pointLoading = false
        }).catch(() => {})
    },
    reset () {
      var vm = this
      vm.$confirm('确认重置当前配伍结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.bottomRecords = []
        vm.curNotInBatchNoList = []
        vm.doValue()
        vm.getData()
        vm.autoResultFlag = undefined
        COMMONJS.showToast('重置成功！')
      })
    },
    cancelData (defaultTabName) {
      var vm = this
      if (vm.$route.query.openType && vm.$route.query.openType == 'isOpenFromToDo') {
        vm.$router.push({
          path: '/auditCompatibilityPlan',
          query: {
            defaultTabName: defaultTabName,
            productionPlanId: vm.$route.query.productionId,
            openType: 'isOpenFromToDo',
            procInsId: vm.$route.query.procInsId
          }
        })
      } else {
        vm.$router.push({
          path: '/compatibilityPlan',
          query: {
            defaultTabName: defaultTabName
          }
        })
      }
    },
    saveData () {
      var vm = this
      if (!vm.bottomRecords || vm.bottomRecords.length == 0) {
        COMMONJS.showToast('配伍结果不存在！', 'warning')
        return
      }
      var lineParams = []
      vm.bottomRecords.forEach(element => {
        element.subRecords.forEach(sub => {
          lineParams.push(sub)
        })
      })
      let postData = {
        temp5: vm.resultForm.compQuantity,
        productionId: vm.$route.query.productionId,
        remark: vm.resultForm.remark,
        resultDetail: vm.resultForm.resultDetail,
        lineParams: lineParams,
        productDate: vm.resultForm.productDate,
        templateId: vm.addForm.templateId
      }
      if (vm.$route.query.compatibilityPlanId && vm.$route.query.compatibilityPlanId != '') {
        postData.id = vm.$route.query.compatibilityPlanId
      }
      vm.pointList.forEach(element => {
        postData['Result' + element.param] = element.resultValue
      })
      let params = {
        ticket: localStorage.getItem('token')
      }
      vm.saveLoading = true
      saveCompatibility(postData, params)
        .then(res => {
          setTimeout(function () {
            COMMONJS.showToast('保存成功')
            vm.saveLoading = false
            vm.cancelData('list')
          }, 500)
        }).catch(() => {})
    },
    doValue () {
      var vm = this
      var resultList = undefined
      var paramMap = new Map()
      var paramValueMap = new Map()
      var temp5 = 0
      var temp6 = 0
      for (var i = 0; i < vm.pointList.length; i++) {
        // 动态定义变量
        eval('var ' + 'Result' + vm.pointList[i].param + '=' + 0)
        // 变量名放入map集合
        paramMap.set(vm.pointList[i].param, 'Result' + vm.pointList[i].param)
      }
      resultList = vm.bottomRecords
      var count = 0
      // 存放每个元素次数
      var elementCountMap = new Map()
      // 初始化elementCountMap集合
      for (var i = 0; i < vm.pointList.length; i++) {
        elementCountMap.set(vm.pointList[i].param, 0)
        paramValueMap.set(paramMap.get(vm.pointList[i].param), 0)
      }
      var sumQty = 0
      if (Comjs.fw.core.util.ObjectUtils.hasValue(resultList)) {
        for (var i = 0; i < resultList.length; i++) {
          resultList[i].subRecords.forEach(element => {
            var qty = element.actqty
            if (element.detail != '未抽检分析') {
              sumQty += qty
            }
            temp5 = temp5 + parseFloat(element.actqty == null ? 0 : element.actqty)
            for (var jj = 0; jj < vm.pointList.length; jj++) {
              var current = vm.pointList[jj].param
              // 选择列表的值
              var resultListCurrentValue = element[current] == null ? 0 : element[current]
              // 初始化的值
              //  var currentValue = eval(paramMap.get(current));
              var currentValue = paramValueMap.get(paramMap.get(current))
              var resultValue = parseFloat(resultListCurrentValue) * qty + parseFloat(currentValue)
              // 初始化的值=初始化的值+后来赋的值
              // eval(paramMap.get(current) + "=" + resultValue.toFixed(3) * qty);                //设置每个参数对应的次数，如果没有次数就为0，否则次数+1
              var elementSumValue = elementCountMap.get(current)
              if (Comjs.fw.core.util.ObjectUtils.hasValue(element[current])) {
                elementCountMap.set(current, elementSumValue + 1)
                paramValueMap.set(paramMap.get(current), resultValue.toFixed(8))
              } else {
                elementCountMap.set(current, elementSumValue)
              }
            }
            count++
          })
        }
      }
      if (count == 0) {
        count = 1
      }
      // 平均值
      var map1 = {}
      // 存放结果集拼接
      var arr = new Array()
      for (var i = 0; i < vm.pointList.length; i++) {
        var current = vm.pointList[i].param
        var currentValue1 = paramMap.get(current).toString()
        // 当前参数需要求平均数的次数
        var elementCount = elementCountMap.get(current)
        // var reslutValue = eval(paramMap.get(current)) == null ? 0 : eval(paramMap.get(current)) / (elementCount == 0 ? 1 : elementCount);
        if (sumQty > 0) {
          // var reslutValue = eval(paramMap.get(current)) == null ? 0 : eval(paramMap.get(current)) / sumQty;
          var reslutValue = paramValueMap.get(paramMap.get(current)) == null ? 0 : paramValueMap.get(paramMap.get(
            current)) / sumQty
        } else {
          var reslutValue = 0
        }
        // 动态添加值
        map1[currentValue1] = reslutValue.toFixed(3)
        arr.push(vm.pointList[i].value + ':' + reslutValue)
        vm.pointList[i]['resultValue'] = reslutValue
      }
      arr.push('配伍量:' + temp5)
      var resultDetail = arr.join(',')
      map1.temp5 = temp5
      map1.resultDetail = resultDetail
      vm.resultForm.resultDetail = resultDetail
      vm.resultForm.compQuantity = temp5
    },
    getTopRowClassName ({
      row,
      rowIndex
    }) {
      if (!row.isShowTopExpand) {
        return 'row-expand-cover'
      }
    },
    expandBottomChange (row, expandedRows) {
      if (this.expandBottomKeys.indexOf(row.batchno) >= 0) {
        this.expandBottomKeys.shift()
      }
    },
    expandChange (row, expandedRows) {
      if (this.expandKeys.indexOf(row.pk) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getSubRecords(row, expandedRows)
    },
    getSubRecords (row, expandedRows) {
      var vm = this
      vm.subLoading = true
      vm.subRecords = []
      vm.topSubPage = {
        current: GLB_CONSTANT.page.current,
        size: 3,
        total: 0,
        sizes: [3, 5, 10, 20, 50, 100, 200, 300, 500]
      },
      listInvcurOftransferPackage({
        ticket: localStorage.getItem('token'),
        reltkcode: row.reltkcode,
        matId: row.matId,
        entId: row.entId,
        size: vm.topSubPage.size,
        current: vm.topSubPage.current,
        planNo: vm.queryForm.planNo,
        templateId: vm.addForm.templateId,
        prodEntName: vm.state,
        exceptBatchNoStr: vm.curNotInBatchNoList && vm.curNotInBatchNoList.length > 0 ? vm.curNotInBatchNoList.join(
          '\'\',\'\'') : ''
      })
        .then(res => {
          vm.subRecords = res.data.records
          vm.topSubPage.total = res.data.total
          vm.subLoading = false
          vm.expandKeys.shift() /** 新增 **/
          vm.expandKeys.push(row.pk)
        }).catch(() => {})
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    handleClick (data) {

    },
    listCusList () {
      var vm = this
      listEnt({
        ticket: localStorage.getItem('token'),
        cusclassid: '01'
      })
        .then(res => {
          res.data.forEach(element => {
            vm.cusList.push({
              'id': element.guid,
              'value': element.cusname
            })
          })
        }).catch(() => {})
    },
    getNowDate (time) {
      time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' 00:00:00'
      return time
    },
    addDate (date, days) {
      var vm = this
      if (days == undefined || days == '') {
        days = 1
      }
      var date = new Date(date)
      date.setDate(date.getDate() + days)
      var month = date.getMonth() + 1
      var day = date.getDate()
      return date.getFullYear() + '-' + vm.getFormatDate(month) + '-' + vm.getFormatDate(day)
    },
    getFormatDate (arg) {
      if (arg == undefined || arg == '') {
        return ''
      }

      var re = arg + ''
      if (re.length < 2) {
        re = '0' + re
      }

      return re
    },
    toBottomClick () {
      var vm = this
      // if (vm.autoResultFlag) {
      //   COMMONJS.showToast('当前存在自动配伍结果，请先点击右侧的重置按钮！', 'warning')
      //   return;
      // }
      // 获取当前选中的包装所在的联单
      var choosTopItem = vm.topRecords.filter(
        item => item.reltkcode === vm.multipleSubSelection[0].reltkcode
      )
      if (choosTopItem && choosTopItem.length > 0) {
        // 当前在操作的联单
        vm.curOptReltkObj = choosTopItem[0]
        // 判断上一步获取到的联单是否在下方的table中，不在就直接push进去，在就进行包装的合并
        var tempBottomItem = vm.bottomRecords.filter(
          item => item.reltkcode === choosTopItem[0].reltkcode
        )
        if (tempBottomItem && tempBottomItem.length > 0) { // 已存在下方的table中
          vm.bottomRecords.forEach((element, index) => {
            if (element.reltkcode === tempBottomItem[0].reltkcode) {
              vm.multipleSubSelection.forEach(item => {
                element.subRecords.push(item)
              })
            }
          })
        } else {
          choosTopItem[0].subRecords = vm.multipleSubSelection
          vm.bottomRecords.push(choosTopItem[0])
        }
        // 计算配伍结果
        vm.doValue()
        COMMONJS.showToast('成功从待选择区移动了联单【' + choosTopItem[0].reltkcode + '】下的' + vm.multipleSubSelection.length +
          '个包装到已选择区！')
      }
      // 展开第三个卡片
      vm.thirdCardCols = 6
      vm.isRightExpand = true
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
      // 过滤已经选择到下方的包装
      vm.curNotInBatchNoList = []
      vm.bottomRecords.forEach(element => {
        element.subRecords.forEach(item => {
          vm.curNotInBatchNoList.push(item.batchno)
        })
      })
      vm.refreshSubTable()
    },
    toTopClick () {
      var vm = this
      vm.multipleBottomSubSelection.forEach(element => {
        // 从全局的批次号数组中移除
        var index = vm.curNotInBatchNoList.findIndex(item => item === element.batchno)
        if (index > -1) {
          vm.curNotInBatchNoList.splice(index, 1)
        }
        // 从下方的table数组中移除
        vm.bottomRecords.forEach(item => {
          var i = item.subRecords.findIndex(n => n.batchno === element.batchno)
          if (i > -1) {
            item.subRecords.splice(i, 1)
          }
        })
      })
      vm.bottomRecords = vm.bottomRecords.filter(element => (element.subRecords && element.subRecords.length > 0))
      // 重新计算配伍结果
      vm.doValue()
      vm.getData()
      vm.multipleBottomSubSelection = []
    },
    thirdCardClick () {
      var vm = this
      if (vm.isRightExpand) {
        vm.thirdCardCols = 1
        vm.isRightExpand = false
      } else {
        vm.thirdCardCols = 6
        vm.isRightExpand = true
      }
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
    },
    firstCardClick () {
      var vm = this
      if (vm.isLeftExpand) {
        vm.firstCardCols = 1
        vm.isLeftExpand = false
      } else {
        vm.firstCardCols = 6
        vm.isLeftExpand = true
      }
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
    },
    headClass ({
      row,
      rowIndex
    }) {
      return 'background:#F8F8F9;color:#8F99A2'
    },
    getPointLevelList () {
      var vm = this
      vm.pointList.forEach((element, index) => {
        vm.pointLevelList.push({
          code: index + 1,
          name: (index + 1) + '级'
        })
      })
    },
    listStorage () {
      let _this = this
      let postData = {
        ticket: localStorage.getItem('token'),
        valid: 1
      }
      listStorage(postData)
        .then(res => {
          _this.warehouseList = res.data
        }).catch(() => {})
    },
    listCompatibilityTemplate () {
      let _this = this
      let postData = {
        ticket: localStorage.getItem('token'),
        valid: 1
      }
      listCompatibilityTemplate(postData)
        .then(res => {
          _this.templateList = res.data
          if (_this.templateList && _this.templateList.length > 0) {
            _this.addForm.templateId = _this.templateList[_this.templateList.length - 1].id
            // 加载参数列表
            _this.pointLoading = true
            listParam({
              ticket: localStorage.getItem('token'),
              id: _this.addForm.templateId
            })
              .then(res => {
                _this.pointList = res.data
                _this.getPointLevelList()
                _this.pointLoading = false
              }).catch(() => {})
            _this.getData()
          } else {
            COMMONJS.showToast('请设置配伍模板！', 'error')
          }
        }).catch(() => {})
    },
    queryEntNameAsync (queryString, cb) {
      var vm = this
      var cusList = vm.cusList
      var results = queryString ? cusList.filter(this.createStateFilter(queryString)) : cusList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      var vm = this
      vm.addForm.baseCustomerCusCode = item.id
      vm.addForm.cusId = item.id
      vm.addForm.prodEntName = item.value
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    autoData () {
      var vm = this
      if (vm.addForm.compQuantity && vm.addForm.compQuantity != '') {
        if (isNaN(parseFloat(vm.addForm.compQuantity))) {
          COMMONJS.showToast('请正确填写配伍量！', 'warning')
          return
        }
        vm.checkObjP = {
          templateId: vm.addForm.templateId,
          compQuantity: vm.addForm.compQuantity,
          pointList: vm.pointList,
          isExistManualResult: !!(vm.bottomRecords && vm.bottomRecords.length > 0)
        }
        vm.dialogFormVisible = true
      } else {
        COMMONJS.showToast('请填写配伍量！', 'warning')
      }
    },
    getData () {
      let _this = this
      _this.loading = true
      let postData = {
        ticket: localStorage.getItem('token'),
        planNo: _this.queryForm.planNo,
        current: _this.page.current,
        size: _this.page.size,
        templateId: _this.addForm.templateId,
        reltkcode: _this.addForm.reltkcode,
        prodEntName: _this.state,
        storageId: _this.addForm.storageId,
        exceptBatchNoStr: _this.curNotInBatchNoList && _this.curNotInBatchNoList.length > 0 ? _this.curNotInBatchNoList
          .join('\'\',\'\'') : ''
      }
      _this.pointList.forEach(element => {
        if (element.start && element.start != '') {
          postData[element.param + 'Start'] = element.start
          postData[element.param + 'Id'] = element.param
        }
        if (element.end && element.end != '') {
          postData[element.param + 'End'] = element.end
          postData[element.param + 'Id'] = element.param
        }
      })
      listInvcurOfCompatibility(postData)
        .then(res => {
          _this.topRecords = res.data.records
          _this.topRecords.forEach(element => {
            element.isShowTopExpand = true
            var pkArr = [element.reltkcode, element.matId, element.entId]
            element.pk = pkArr.join(',')
          })
          // 存在展开的就刷新下子table
          if (_this.expandKeys && _this.expandKeys.length > 0) {
            _this.refreshSubTable()
          }
          _this.page.total = res.data.total
          _this.loading = false
        }).catch(() => {})
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
    },
    refreshSubTable () {
      var vm = this
      vm.subLoading = true
      vm.subRecords = []
      listInvcurOftransferPackage({
        ticket: localStorage.getItem('token'),
        reltkcode: vm.expandKeys[0].split(',')[0],
        matId: vm.expandKeys[0].split(',')[1],
        entId: vm.expandKeys[0].split(',')[2],
        size: vm.topSubPage.size,
        current: vm.topSubPage.current,
        planNo: vm.queryForm.planNo,
        templateId: vm.addForm.templateId,
        prodEntName: vm.state,
        exceptBatchNoStr: vm.curNotInBatchNoList && vm.curNotInBatchNoList.length > 0 ? vm.curNotInBatchNoList.join(
          '\'\',\'\'') : ''
      })
        .then(res => {
          vm.subRecords = res.data.records
          vm.topSubPage.total = res.data.total
          vm.subLoading = false
          if (vm.topSubPage.total == 0) {
            // 隐藏上方table 的expand
            vm.topRecords.forEach(element => {
              if (vm.curOptReltkObj.reltkcode && vm.curOptReltkObj.reltkcode == element.reltkcode) {
                // 收起上传table的expand
                if (vm.expandKeys.indexOf(element.pk) >= 0) {
                  // 收起当前行
                  vm.expandKeys.shift()
                  element.isShowTopExpand = false
                  // 刷新父级table过滤掉没有包装的联单
                  vm.getData()
                }
              }
            })
          }
        }).catch(() => {})
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    jumpTopSubPage (index) {
      this.topSubPage.current = index
      this.refreshSubTable()
    },
    jumpTopSubSize (val) {
      this.topSubPage.size = val
      this.topSubPage.current = 1
      this.refreshSubTable()
    },
    jumpBottomPage (index) {
      this.bottomPage.current = index
      this.getData()
    },
    jumpBottomSize (val) {
      this.bottomPage.size = val
      this.bottomPage.current = 1
      this.getData()
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    reloadP (callBackData) {
      // 覆盖自动配伍结果到下方的已选择区
      var vm = this
      vm.bottomRecords = []
      // 将手动选择的批次号先清空，再加入自动配伍的批次
      vm.curNotInBatchNoList = []
      callBackData.autoTopRecords.forEach(element => {
        element.subRecords = element.packageList
        element.subRecords.forEach(subItem => {
          vm.curNotInBatchNoList.push(subItem.batchno)
        })
        element.actqty = element.qty
        vm.bottomRecords.push(element)
      })
      // 设置自动配伍结果
      if (callBackData.resultForm) {
        if (callBackData.resultForm.pointList) {
          vm.pointList.forEach(element => {
            var index = callBackData.resultForm.pointList.findIndex(item => item.param === element.param)
            if (index > -1) {
              element.resultValue = callBackData.resultForm.pointList[index]['resultValue']
            }
          })
          vm.resultForm.compQuantity = callBackData.resultForm.compQuantity
        }
        vm.autoResultFlag = true
        vm.getData()
      }
      // 展开第三个卡片
      vm.thirdCardCols = 6
      vm.isRightExpand = true
      vm.secondCardCols = 24 - vm.firstCardCols - vm.thirdCardCols
      vm.dialogFormVisible = false
    },
    handleBottomSelectionChange (val) {
      var vm = this
      vm.multipleBottomSelection = val
      // vm.multipleBottomSelection.forEach(element => {
      //   vm.toggletBottomSubSelection(element.subRecords);
      // });
    },
    handleBottomSubSelectionChange (val) {
      var vm = this
      val.forEach(element => {
        var index = vm.multipleBottomSubSelection.findIndex(item => item.batchno === element.batchno)
        if (index == -1) {
          vm.multipleBottomSubSelection.push(element)
        }
      })
    },
    handleSubSelectionChange (val) {
      var vm = this
      vm.multipleSubSelection = val
      if (vm.multipleSubSelection && vm.multipleSubSelection.length > 0) {
        vm.toBottomBtnFlag = false
      } else {
        vm.toBottomBtnFlag = true
      }
    },
    handleSelectionChange (val) {
      var vm = this
      vm.multipleSelection = val
      if (vm.multipleSelection && vm.multipleSelection.length > 0) {
        vm.toBottomBtnFlag = false
      } else {
        vm.toBottomBtnFlag = true
      }
      // 选择联单将下面的包装当前页的所有数据默认都勾上
      // vm.toggletTopSubSelection(vm.subRecords);
    },
    toggletTopSubSelection (rows) {
      if (rows) {
        rows.forEach(element => {
          this.$refs.multipleTopSubTable.toggleRowSelection(element)
        })
      } else {
        this.$refs.multipleTopSubTable.clearSelection()
      }
    },
    toggletBottomSubSelection (rows) {
      if (rows) {
        rows.forEach(element => {
          this.$refs.multipleBottomSubTable.toggleRowSelection(element)
        })
      } else {
        this.$refs.multipleBottomSubTable.clearSelection()
      }
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

  .box-card {
    width: 100%;
    height: calc(100% - 0px);
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

  .dialog-title {
    float: left;
  }

  .shousuo {
    cursor: pointer;
    float: right;
    color: #40C3AB;
  }

  .divCard {
    height: 100%;
    background-color: #DDE1E7;
  }

  .divCard .cardRow {
    height: 100%
  }

  .divCard .cardRow .cardRol {
    height: 100%;
    padding-left: 3px !important;
    padding-right: 3px !important;
  }

  .row-expand-cover .el-table__expand-icon {
    visibility: hidden;
  }

  .el-form-item__content {
    text-align: left;
  }

</style>
