<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'"   :label-width="formLabelWidth">
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="培训日期" prop="trainDate">
                        <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="addForm.trainDate" type="date" placeholder="请选择培训日期"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="开始时间" prop="startTime">
                        <el-time-picker style="width:100%" value-format="HH:mm:ss" v-model="addForm.startTime" placeholder="请选择开始时间">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结束时间" prop="endTime">
                        <el-time-picker style="width:100%" value-format="HH:mm:ss" v-model="addForm.endTime" placeholder="请选择结束时间">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="培训地点" prop="address">
                        <el-input v-model="addForm.address"   placeholder="请输入培训地点" ></el-input>
                    </el-form-item>
                </el-col>
             </el-row>
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="培训类型" prop="type" >
                        <el-select v-model="addForm.type"  clearable placeholder="请选择培训类型">
                            <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训师" prop="trainer">
                        <el-input v-model="addForm.trainer"   placeholder="请输入培训师" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="培训主题" prop="theme">
                        <el-input v-model="addForm.theme"  placeholder="请输入培训主题" ></el-input>
                    </el-form-item>
                </el-col>
             </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="培训内容" prop="content">
                        <el-input v-model="addForm.content" type="textarea" :rows="2" placeholder="请输入培训内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="参与人员" prop="emps">
                        <el-row >
                            <el-col :span="12" >
                                <el-select v-model="addForm.emps" multiple clearable placeholder="请选择参与人员">
                                    <el-option v-for="item in empIdsOptions" :key="item.id"  :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                <!-- <el-input v-model="addForm.empsLine"  ></el-input> -->
                            </el-col>
                            <!-- <el-col :span="4">
                                <el-button type="text" @click="selectEmps" class="el-btn-address">请选择人员</el-button>
                            </el-col> -->
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="上传附件" prop="fileList">
                        <v-upload style="text-align: left;" :uploadList="addForm.fileList" @changeFiles="changeFilesP"></v-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label=" " >
                        <div style=" text-align: left;">
                            <el-button type="primary" @click="saveTrainRecords('addForm')">保存</el-button>
                            <el-button @click="reload" >退出</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Upload from '@/components/upload'
import { getDispCodeAndNameDic, getSecurityTrainInfoDetail, addOrEditSecurityTrainInfo, getSysRoleEmployee } from '@/assets/js/API/api'
export default {
  name: 'addTrainRecords',
  data () {
    let validateDate = (rule, value, callback) => {
      if (!this.addForm.startTime || !this.addForm.endTime) { callback() }

      if (this.addForm.startTime > this.addForm.endTime) { callback('开始时间不能大于结束时间') } else {
        callback()
      }
    }
    return {
      dataId: '',
      formLabelWidth: '110px',
      tableHeight: '30vh',
      addForm: {
        id: '',
        type: '',
        trainDate: '',
        startTime: '',
        endTime: '',
        address: '',
        emps: [],
        fileList: []
      },
      empIdsOptions: [],
      typeOptions: [],
      addFormRules: {
        trainDate: [
          { required: true, message: '请选择培训日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' },
          { validator: validateDate, required: true }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
          { validator: validateDate, required: true }
        ],
        address: [
          { required: true, message: '请输入培训地点', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择制度类型', trigger: 'change' }
        ],
        trainer: [
          { required: true, message: '请输入培训师', trigger: 'change' }
        ],
        theme: [
          { required: true, message: '请输入培训主题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入培训内容', trigger: 'change' }
        ],
        emps: [
          { required: true, message: '请选择参与人员', trigger: 'change' }
        ]

      }
    }
  },
  props: {
    checkObj: {
      type: Object,
      default: { type: 'add' }
    }
  },
  components: {
    'v-upload': Upload
  },
  methods: {
    show: function (id) {
      this.dataId = id
      this.picklistData()
      if (this.dataId) {
        this.getSecurityTrainInfoDetail()
      }
    },
    picklistData () {
      getDispCodeAndNameDic({ typeCode: 'trainType' })
        .then(res => {
          this.typeOptions = res.data
        }).catch(() => { })
      getSysRoleEmployee()
        .then(res => {
          this.empIdsOptions = res.data
        }).catch(() => { })
    },
    getSecurityTrainInfoDetail: function () {
      getSecurityTrainInfoDetail({ id: this.dataId })
        .then(res => {
          if (res.data.securityRuleDetailInfos && res.data.securityRuleDetailInfos.length > 0) {
            for (let s of res.data.securityRuleDetailInfos) {
              s.editFlag = false
            }
          }
          this.addForm = res.data
        }).catch(() => { })
    },
    selectEmps: function () {

    },
    addWasteFlag () {
      if (this.addForm.securityRuleDetailInfos.length > 0 && this.addForm.securityRuleDetailInfos[this.addForm.securityRuleDetailInfos.length - 1].editFlag) {
        COMMONJS.showToast('请先保存添加项', 'warning')
      } else {
        let addObj = {
          sortNum: '',
          content: '',
          editFlag: true
        }
        this.addForm.securityRuleDetailInfos.push(addObj)
      }
    },
    optContact (data, type, index) {
      let _this = this
      switch (type) {
        case 'add':
          if (!data.content) {
            COMMONJS.showToast('请先输入内容', 'error')
            return false
          }
          this.addForm.securityRuleDetailInfos[index].editFlag = false
          break
        case 'update':
          this.addForm.securityRuleDetailInfos[index].editFlag = true
          break
        case 'delete':
          this.addForm.securityRuleDetailInfos.splice(index, 1)
          break
        case 'cancel':
          this.addForm.securityRuleDetailInfos.splice(index, 1)
          break
      }
    },
    changeFilesP (obj) {
      this.addForm.fileList = JSON.parse(JSON.stringify(obj))
      // console.log(obj)
    },
    saveTrainRecords (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addForm.startTime = this.addForm.trainDate + ' ' + this.addForm.startTime
          this.addForm.endTime = this.addForm.trainDate + ' ' + this.addForm.endTime
          this.addForm.trainDate = this.addForm.trainDate + ' 00:00:00'
          addOrEditSecurityTrainInfo(this.addForm)
            .then(res => {
              COMMONJS.showToast('保存成功', 'success')
              this.reload()
            }).catch(() => { })
        }
      })
    },
    reload: function () {
      this.$emit('reload')
    }

  }

}
</script>

<style>
</style>
