<template>
  <div class="form-format">
    <el-steps :active="stepValue" finish-status="success" simple style="margin-bottom:10px;">
      <el-step title="基本信息" icon="el-icon-s-home"></el-step>
      <el-step title="详细信息" icon="el-icon-s-data"></el-step>
      <el-step title="费用信息" icon="el-icon-money"></el-step>
      <el-step title="上传附件" icon="el-icon-document"></el-step>
      <el-step title="查看信息" icon="el-icon-share"></el-step>
    </el-steps>
    <el-form v-if="stepValue===1" :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="经营合同编号" prop="hetongCode">
            <el-input v-model="addForm.hetongCode" :disabled="checkObj.type==='query'||checkObj.type==='change'" placeholder="请输入经营合同编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同类型">
            <el-input disabled v-model="addForm.signTypeName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="开始日期" prop="dateF">
            <el-date-picker v-model="addForm.dateF" type="date" :disabled="checkObj.type==='query'||checkObj.type==='change'" :editable="false"
              placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="dateT">
            <el-date-picker v-model="addForm.dateT" type="date" :disabled="checkObj.type==='query'" :editable="false" placeholder="选择截止日期"
              value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="产废单位" prop="baseCustomerCusName">
            <el-autocomplete :disabled="checkObj.type==='query'||checkObj.type==='change'||checkObj.type==='update'" clearable v-model="state"
              :fetch-suggestions="queryEntNameAsync" placeholder="输入关键字搜索产废单位" @select="handleSelect">
              <el-button v-if="checkObj.type=='query'||checkObj.type=='update'||checkObj.type==='change'" @click="viewProductEntInfo" slot="append"
                icon="el-icon-search">企业详情</el-button>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员" prop="salesId">
            <el-select v-model="addForm.salesId" :disabled="checkObj.type==='query'||checkObj.type==='change'" clearable placeholder="请选择业务员">
              <el-option v-for="item in wasteForm" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="">
            <el-checkbox @change="isAgencyChange" v-model="chkisOrNotAgent" :disabled="checkObj.type==='query'||checkObj.type==='change'">是否居间公司签订合同</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="chkisOrNotAgent" label="居间单位" prop="agencyEntName">
            <el-autocomplete :disabled="checkObj.type==='query'||checkObj.type==='change'" clearable v-model="stateA" :fetch-suggestions="queryAgencyNameAsync"
              placeholder="输入关键字搜索居间单位" @select="handleSelectZ"></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="">
            <el-checkbox :disabled="checkObj.type==='query'||checkObj.type==='change'" v-model="chkOneOff">是否一次性合同</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <v-sign-detail-list v-if="stepValue===2" :hetongCode="addForm.hetongCode" :headId="addForm.guid"></v-sign-detail-list>
    <v-sign-price-list v-if="stepValue===3" :headId="addForm.guid"></v-sign-price-list>
    <v-sign-attach-list v-if="stepValue===4" :headId="addForm.guid"></v-sign-attach-list>
    <v-sign-all-info v-if="stepValue===5" :headId="addForm.guid" activeName="1" isAccordion></v-sign-all-info>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'&&addForm.state!=='check'&&addForm.state!='commit'">
      <el-button type="primary" style=" height:40px;" v-show="preStepFlag" icon="el-icon-arrow-left" @click="preStepClick">上一步</el-button>
      <el-button type="primary" style=" height:40px;" v-show="nextStepFlag" @click="nextStepClick">下一步
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
      <el-button type="primary" style=" height:40px;" v-show="submitFlag" @click="submitDialog('addForm')">完 成
        <i class="el-icon-finished"></i>
      </el-button>
    </div>
    <div v-if="viewEntInfoVisible">
      <el-dialog title="" append-to-body :visible.sync="viewEntInfoVisible" :close-on-click-modal="false" width="70%">
        <div style="height:500px;width:100%">
          <iframe style="height:100%;width:100%;" scrolling="yes" frameborder="no" border="0" :src="entUrl"></iframe>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import SignDetailList from './signDetailList'
  import SignPriceList from './signPriceList'
  import SignAttachList from './signAttachList'
  import SignAllInfo from './signAllInfo'
  import {
    selectEnterpriseList,
    listSysRoleEmployee,
    queryMSWMSAOrderHeadByID,
    saveManageContractEntity,
    insertSupplementSAOrderHead,
    insertContinuousSAOrderHead,
    startContractProcess,
    getCustomerEnterpriseDetail
  } from '@/assets/js/API/api'
  export default {
    name: 'addNewSign',
    data() {
      return {
        entUrl: '',
        viewEntInfoVisible: false,
        waseteInfo: [],
        agentInfo: [],
        state: '',
        stateA: '',
        timeout: null,
        stepValue: 1,
        preStepFlag: false,
        submitFlag: false,
        nextStepFlag: true,
        formLabelWidth: '110px',
        chkisOrNotAgent: false,
        chkOneOff: false,
        addForm: {
          cusId: '',
          hetongCode: '',
          signType: '',
          signTypeName: '',
          isOrNotAgent: '0',
          baseCustomerCusName: '',
          baseCustomerCusCode: '',
          dateF: '',
          dateT: '',
          salesId: '',
          agencyEntName: '',
          agencyEntId: '',
          oneOff: 0,
          remark: '',
          sourceId: '',
          businessActivityId: ''
        },
        classCodes: [],
        wasteCodes: [],
        wasteForm: [],
        wasteFeatures: [],
        addFormRules: {
          hetongCode: [{
            required: true,
            message: '请输入经营合同编号',
            trigger: 'change'
          }],
          salesId: [{
            required: true,
            message: '请选择业务员',
            trigger: 'change'
          }],
          dateF: [{
            required: true,
            message: '请输入开始日期',
            trigger: 'change'
          }],
          dateT: [{
            required: true,
            message: '请输入截止日期',
            trigger: 'change'
          }],
          baseCustomerCusName: [{
            required: true,
            message: '请输入产废单位',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      'v-sign-detail-list': SignDetailList,
      'v-sign-price-list': SignPriceList,
      'v-sign-attach-list': SignAttachList,
      'v-sign-all-info': SignAllInfo
    },
    mounted() {
      var vm = this;
      this.listSysRoleEmployee();
      //获取居间单位列表
      this.listAgencyInfo();
      // vm.addForm.dateF = new Date((new Date().getFullYear()+1) + '-01-01 00:00:00');
      // vm.addForm.dateT = new Date((new Date().getFullYear()+1) + '-12-31 23:59:59');
      if (this.$route.query && JSON.stringify(this.$route.query) != "{}" && this.$route.query.path ==
        '/reModifyContract') {
        this.checkObj = this.$route.query;
      }
      //获取产废单位列表
      this.listWasteInfo();
      if (this.checkObj.type === 'new') {
        vm.addForm.signType = "new"
        vm.addForm.signTypeName = "新签合同"
        if (this.$route.query.businessActivityId && this.$route.query.businessActivityId != '') {
          this.addForm.businessActivityId = this.$route.query.businessActivityId;
        }
      } else if (this.checkObj.type === 'supplement') {
        vm.addForm.signType = "supplement"
        vm.addForm.signTypeName = "补签合同"
        if (this.$route.query.businessActivityId && this.$route.query.businessActivityId != '') {
          this.addForm.businessActivityId = this.$route.query.businessActivityId;
        }
      } else if (this.checkObj.type === 'continuous') {
        vm.addForm.signType = "continuous"
        vm.addForm.signTypeName = "续签合同"
        if (this.$route.query.businessActivityId && this.$route.query.businessActivityId != '') {
          this.addForm.businessActivityId = this.$route.query.businessActivityId;
        }
      }
      if (this.checkObj.type === 'query' || this.checkObj.type === 'update' || this.checkObj.type === 'change') {
        queryMSWMSAOrderHeadByID(this.checkObj.data.guid)
          .then(res => {
            vm.addForm = res.data;
            vm.chkOneOff = vm.addForm.oneOff == 1 ? true : false;
            vm.chkisOrNotAgent = vm.addForm.agencyEntId != '' ? true : false;
            vm.state = vm.addForm.baseCustomerCusName;
            vm.stateA = vm.addForm.agencyEntName;
          }).catch(() => {})
      } else if (this.checkObj.type == "supplement" || this.checkObj.type == "continuous") {
        queryMSWMSAOrderHeadByID(this.checkObj.data.sourceId)
          .then(res => {
            vm.addForm = res.data;
            vm.chkOneOff = vm.addForm.oneOff == 1 ? true : false;
            vm.chkisOrNotAgent = vm.addForm.agencyEntId != '' ? true : false;
            vm.state = vm.addForm.baseCustomerCusName;
            vm.stateA = vm.addForm.agencyEntName;
            vm.addForm.guid = '';
            vm.addForm.sourceId = vm.checkObj.data.sourceId;
            if (vm.checkObj.type === 'supplement') {
              vm.addForm.signType = "supplement"
              vm.addForm.signTypeName = "补签合同"
            } else if (vm.checkObj.type === 'continuous') {
              vm.addForm.signType = "continuous"
              vm.addForm.signTypeName = "续签合同"
            }
          }).catch(() => {})
      }
    },
    props: ['checkObj'],
    methods: {
      viewProductEntInfo() {
        var vm = this;
        vm.viewEntInfoVisible = true;
        var param = {
          type: 'query',
          data: "b644591c68e946afb574fe7e3bfb908f", //vm.addForm.cusId,
          activeName: 'companyInfo'
        }
        vm.entUrl = Comjs.fw.core.util.UrlUtils.addParams(window.location.href.replace('/saorderhead',
            '/viewCusDetailInfo'),
          param)
      },
      isAgencyChange(val) {
        this.addForm.chkisOrNotAgent = val;
        if (!val) {
          this.stateA = '';
          this.addForm.agencyEntName = '';
          this.addForm.agencyEntId = '';
        }
      },
      listSysRoleEmployee() {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id')
        }
        listSysRoleEmployee(postData)
          .then(res => {
            res.data.forEach(element => {
              _this.wasteForm.push({
                "id": element.id,
                "name": element.name
              });
            });
          }).catch(() => {})
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
              _this.waseteInfo.push({
                "id": element.id,
                "value": element.name
              });
            });
            //从销售漏斗过来初始化产废单位
            if (_this.$route.query && _this.$route.query.cusId && _this.$route.query.cusId != '') {
              let postData = {
                id: _this.$route.query.cusId,
                ownerEntId: localStorage.getItem('id')
              }
              getCustomerEnterpriseDetail(postData)
                .then(res => {
                  _this.addForm.baseCustomerCusCode = _this.$route.query.cusId;
                  _this.addForm.cusId = _this.$route.query.cusId;
                  _this.addForm.baseCustomerCusName = res.data.name;
                  _this.state = res.data.name;
                }).catch(() => {})
            }
          }).catch(() => {})
      },
      listAgencyInfo() {
        let _this = this
        let postData = {
          entId: localStorage.getItem('id'),
          current: 1,
          size: 100000,
          valid: 1,
          typeCode: '001000'
        }
        selectEnterpriseList(postData)
          .then(res => {
            res.data.records.forEach(element => {
              _this.agentInfo.push({
                "id": element.id,
                "value": element.name
              });
            });
          }).catch(() => {})
      },
      queryEntNameAsync(queryString, cb) {
        var vm = this;
        var wasteInfo = vm.waseteInfo;
        var results = queryString ? wasteInfo.filter(this.createStateFilter(queryString)) : wasteInfo;
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
      queryAgencyNameAsync(queryString, cb) {
        var vm = this;
        var agentInfo = vm.agentInfo;
        var results = queryString ? agentInfo.filter(this.createStateAFilter(queryString)) : agentInfo;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 100 * Math.random());
      },
      createStateAFilter(queryString) {
        return (stateA) => {
          return (stateA.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        var vm = this;
        vm.addForm.baseCustomerCusCode = item.id;
        vm.addForm.cusId = item.id;
        vm.addForm.baseCustomerCusName = item.value;
      },
      handleSelectZ(item) {
        var vm = this;
        vm.addForm.agencyEntName = item.value;
        vm.addForm.agencyEntId = item.id;
      },
      addSignDetail() {
        var vm = this;
      },
      stepClick(val) {
        alert(val);
      },
      preStepClick() {
        var vm = this;
        if (vm.stepValue > 1 && vm.stepValue > 1 <= 5) {
          vm.stepValue -= 1;
          vm.submitFlag = false;
          vm.nextStepFlag = true;
          if (vm.stepValue == 1) {
            vm.preStepFlag = false
          }
        }
      },
      nextStepClick() {
        var vm = this;
        if (vm.stepValue >= 1 && vm.stepValue < 5) {
          if (vm.stepValue == 1) {
            vm.$refs['addForm'].validate((valid) => {
              if (valid) {
                vm.onInsertOrUpdate().then(data => {
                  vm.stepValue += 1;
                  vm.preStepFlag = true;
                });
              } else {
                console.log('error submit!!')
                return false
              }
            })
          } else {
            vm.stepValue += 1;
            vm.preStepFlag = true;
          }
          if (vm.stepValue == 5) {
            vm.submitFlag = true;
            vm.nextStepFlag = false;
          }
        }
      },
      onInsertOrUpdate() {
        var vm = this;
        return new Promise(function (resolve, reject) {
          //保存基本信息
          if (vm.stepValue == 1) {
            vm.addForm.oneOff = (vm.chkOneOff ? 1 : 0);
            vm.addForm.isOrNotAgent = (vm.chkisOrNotAgent ? '1' : '0');
            let postData = vm.addForm;
            if (!vm.checkObj.isNewSC) { //不是新增补签或者续签合同的情况
              saveManageContractEntity(postData).then(res => {
                if (res.status == "Success") {
                  vm.addForm = res.data;
                  resolve(res);
                } else {
                  vm.$message({
                    type: 'info',
                    message: res.msg
                  });
                }
              }).catch((err) => {
                if (err.status == "ValidateError") {
                  vm.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              });
            } else if (vm.checkObj.type == "supplement") {
              insertSupplementSAOrderHead(postData).then(res => {
                if (res.status == "Success") {
                  vm.addForm = res.data;
                  resolve(res);
                } else {
                  vm.$message({
                    type: 'info',
                    message: res.msg
                  });
                }
              }).catch(() => {})

            } else if (vm.checkObj.type == "continuous") {
              insertContinuousSAOrderHead(postData).then(res => {
                if (res.status == "Success") {
                  vm.addForm = res.data;
                  resolve(res);
                } else {
                  vm.$message({
                    type: 'info',
                    message: res.msg
                  });
                }
              }).catch(() => {})
            }

          }
        });
      },
      submitDialog(formName) {
        var vm = this;
        // 完成事件
        vm.$confirm('信息已完整, 是否直接提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = vm.addForm;
          startContractProcess(postData)
            .then(res => {
              if (res.status == "Success") {
                vm.addForm.state = 'commit'
                COMMONJS.showToast("合同提交成功！")
                // var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                // if (index != undefined) { //layer打开的子页面用此方式关闭
                //   parent.layer.close(index);
                // }
                vm.$emit('refreshTable');
                vm.cancelForm();
              }
            }).catch(() => {})
        }).catch(() => {
          vm.cancelForm();
          COMMONJS.showToast("合同保存成功！")
          vm.$emit('refreshTable');
        });
      },
      cancelForm() {
        this.$emit('changeDialogFormVisible', false)
      },
    }
  }

</script>

<style scoped>
  .dialog-footer {
    padding-top: 10px;
    padding-bottom: 20px;
    text-align: center;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

  .el-step.is-simple .el-step__icon {
    font-size: 20px;
  }

</style>
