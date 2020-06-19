<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="计划单号" :prop="checkObj.type==='query'||checkObj.type==='audit'?'':'planNo'">
            <el-input v-model="addForm.planNo" :disabled="checkObj.type==='query'||checkObj.type==='audit'" clearable placeholder="请输入计划单号">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="开始日期" :prop="checkObj.type==='query'||checkObj.type==='audit'?'':'startTime'">
            <el-date-picker v-model="addForm.startTime" type="date" :disabled="checkObj.type==='query'||checkObj.type==='audit'" :editable="false"
              placeholder="请选择开始日期" value-format="yyyy-MM-dd HH:mm:ss" @change="checkTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" :prop="checkObj.type==='query'||checkObj.type==='audit'?'':'endTime'">
            <el-date-picker v-model="addForm.endTime" type="date" :disabled="checkObj.type==='query'||checkObj.type==='audit'" :editable="false"
              placeholder="请选择结束日期" value-format="yyyy-MM-dd HH:mm:ss" @change="checkTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="生产线" :prop="checkObj.type==='query'||checkObj.type==='audit'?'':'productionLine'">
            <el-select v-model="addForm.productionLine" :disabled="checkObj.type==='query'||checkObj.type==='audit'" clearable placeholder="请选择生产线">
              <el-option v-for="item in productionLineList" :key="item.projectId" :label="item.productionLine" :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划用量" :prop="checkObj.type==='query'||checkObj.type==='audit'?'':'planQty'">
            <el-input v-model="addForm.planQty" :disabled="checkObj.type==='query'||checkObj.type==='audit'">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="创建人">
            <el-input v-model="addForm.creater" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input v-model="addForm.createTime" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'||checkObj.type==='audit'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'&&checkObj.type!=='audit'">
      <el-button :loading="saveLoading" type="primary" @click="submitDialog('addForm')">保 存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="isShowAudit">
      <el-button :loading="saveLoading" type="primary" @click="auditPlanProcess('yes')">同 意</el-button>
      <el-button @click="auditPlanProcess('')">驳 回</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="isShowReCommit">
      <el-button :loading="saveLoading" type="primary" @click="startCompatibilityProcess()">重新提交</el-button>
    </div>
    <v-list-process-info v-if="isShowProcess" ref="mychild" :procInsId='checkObj.procInsId'></v-list-process-info>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import ListProcessInfo from '@/views/contract/components/listProcessInfo.vue'
import {
  formatDate
} from '@/assets/js/date.js'
import {
  saveProductionPlan,
  queryProjectName,
  getProductionPlan,
  auditCompatibilityProcess,
  startCompatibilityProcess
} from '@/assets/js/API/api'
export default {
  name: 'addProductionPlan',
  data () {
    return {
      isShowReCommit: false,
      isShowProcess: false,
      isShowAudit: false,
      saveLoading: false,
      formLabelWidth: '110px',
      productionLineList: '',
      dialogVisible: false,
      addForm: {
        id: '',
        planNo: '',
        startTime: '',
        endTime: '',
        productionLine: '',
        planQty: '',
        createUserName: '',
        createTime: '',
        remark: ''
      },
      addFormRules: {
        planNo: [{
          required: true,
          message: '请输入计划单号',
          trigger: 'change'
        }],
        productionLine: [{
          required: true,
          message: '请输入生产线',
          trigger: 'change'
        }],
        planQty: [{
          required: true,
          message: '请输入计划用量',
          trigger: 'change'
        }],
        startTime: [{
          required: true,
          message: '请选择开始日期',
          trigger: 'change'
        }],
        endTime: [{
          required: true,
          message: '请选择结束日期',
          trigger: 'change'
        }]
      }
    }
  },
  components: {
    'v-list-process-info': ListProcessInfo
  },
  mounted () {
    var vm = this
    vm.isShowAudit = (vm.checkObj.type && vm.checkObj.type == 'audit' && vm.checkObj.status == 'commit')
    vm.isShowProcess = (vm.checkObj.status && vm.checkObj.status != 'save')
    vm.isShowReCommit = (vm.checkObj.status && vm.checkObj.status == 'refuse')
    this.getProductionLineList()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update' || this.checkObj.type === 'audit') {
      let postData = {
        ticket: localStorage.getItem('token'),
        planId: vm.checkObj.data
      }
      getProductionPlan(postData)
        .then(res => {
          vm.addForm = res.data
          vm.addForm.productionLine = vm.addForm.projectId
        }).catch(() => {})
    } else {
      this.addForm.createTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.addForm.creater = localStorage.getItem('userName')
    }
  },
  props: ['checkObj'],
  methods: {
    startCompatibilityProcess () {
      let _this = this
      let postData = _this.addForm
      this.$confirm('确认重新提交所生产计划【' + _this.addForm.planNo + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postData.flowInfo = JSON.stringify({
          procInsId: _this.checkObj.procInsId
        })
        startCompatibilityProcess(postData).then(res => {
          COMMONJS.showToast('重新提交成功！')
          _this.$refs.mychild.getData()
          _this.$emit('reload', true)
        }).catch(() => {})
      })
    },
    checkTime (val) {
      var vm = this
      if (vm.addForm.startTime && vm.addForm.endTime) {
        var start = new Date(Date.parse(vm.addForm.startTime))
        var end = new Date(Date.parse(vm.addForm.endTime))
        if (start > end) {
          COMMONJS.showToast('开始日期不能晚于结束日期，请重新选择！', 'warning')
          return false
        }
      }
      return true
    },
    afterAudit (state) {
      var vm = this
      if (state && state == 'commit') {
        vm.isShowAudit = true
      } else {
        vm.isShowAudit = false
      }
      if (state && state != 'refuse') {
        vm.isShowReCommit = false
      } else {
        vm.isShowReCommit = true
      }
    },
    auditPlanProcess (flag) {
      let vm = this
      let operation = flag == 'yes' ? '同意' : '驳回'
      let postData = vm.addForm
      vm.$confirm('您确认' + operation + '当前生产计划吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postData.flowInfo = JSON.stringify({
          taskDefKey: 'productManage',
          flag: flag,
          procInsId: vm.checkObj.procInsId,
          comment: operation
        })
        auditCompatibilityProcess(postData)
          .then(res => {
            if (res.status == 'Success') {
              vm.$alert('审批完成，已' + operation + '！', {
                type: 'success',
                showClose: 'false'
              }).then(function () {
                vm.$refs.mychild.getData()
                vm.$emit('reload', true)
              })
            }
          }).catch(() => {})
      }).catch(() => {

      })
    },
    getProductionLineList () {
      let _this = this
      let postData = {
        ticket: localStorage.getItem('token')
      }
      queryProjectName(postData)
        .then(res => {
          _this.productionLineList = res.data
        }).catch(() => {})
    },
    changeDialogFormVisibleP (data) {
      var vm = this
      vm.dialogVisible = false
      if (vm.selCode == 8) {
        vm.addForm.wasteClassCode = data[0].classCode
        vm.addForm.wasteCode = data[0].wasteCode
        vm.addForm.wasteId = data[0].id
        vm.addForm.wasteName = data[0].entWasteName
      } else if (vm.selCode == 2) {
        if (vm.addForm.wasteClassCode != data[0].code) {
          vm.addForm.wasteClassCode = data[0].code
          vm.addForm.wasteCode = ''
          vm.addForm.wasteId = ''
          vm.addForm.wasteName = ''
        }
      }
    },
    submitDialog (formName) {
      let _this = this
      let postData = _this.addForm
      postData.ticket = localStorage.getItem('token')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!_this.checkTime()) {
            return
          }
          _this.saveLoading = true
          saveProductionPlan(postData)
            .then(res => {
              if (res.data == null && res.infoList.length > 0) {
                COMMONJS.showToast(res.infoList[0], 'error')
                _this.saveLoading = false
                return
              }
              COMMONJS.showToast('保存成功')
              _this.saveLoading = false
              this.$emit('reload', true)
            }).catch(() => {})
        }
      })
    },
    cancelForm () {
      this.$emit('changeDialogFormVisible', false)
    }
  }
}

</script>

<style scoped>
  .dialog-footer {
    text-align: center;
    padding: 10px 20px 20px 10px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

</style>
