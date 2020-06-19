<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="二位码" prop="classCode">
                <el-select v-model="addForm.classCode" :disabled="checkObj.type==='query'" clearable filterable
                           placeholder="请输入二位码" @change="getWasteCodes">
                  <el-option
                          v-for="item in classCodes"
                          :key="item.code"
                          :label="item.code"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="八位码" prop="wasteCode">
                <el-select v-model="addForm.wasteCode" :disabled="checkObj.type==='query'" clearable filterable
                           placeholder="请输入八位码" @change="getClassCodes">
                  <el-option
                          v-for="item in wasteCodes"
                          :key="item.code"
                          :label="item.code"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="危废俗称" prop="entWasteName">
                <el-input v-model="addForm.entWasteName" :disabled="checkObj.type==='query'" placeholder="请输入危废俗称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="危废形态" prop="form">
                <el-select v-model="addForm.formCode" :disabled="checkObj.type==='query'" clearable
                           placeholder="请选择贮存点层级">
                  <el-option
                          v-for="item in wasteForm"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
                <!--<el-input v-model="addForm.form" :disabled="checkObj.type==='query'" placeholder="请输入危废形态"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="危废特性" prop="features">
                <el-select v-model="addForm.featureCodes" :disabled="checkObj.type==='query'" clearable
                           placeholder="请选择贮存点层级">
                  <el-option
                          v-for="item in wasteFeatures"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="主要成分" prop="basis">
                <el-input v-model="addForm.basis" :disabled="checkObj.type==='query'" placeholder="请输入主要成分"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="安全措施" prop="accidentPrevention">
                <el-input v-model="addForm.accidentPrevention" :disabled="checkObj.type==='query'" placeholder="请输入安全措施"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="应急措施" prop="emergencyMeasure">
                <el-input v-model="addForm.emergencyMeasure" :disabled="checkObj.type==='query'" placeholder="请输入应急措施"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="计量单位" prop="unit">
                <el-select v-model="addForm.unit" :disabled="checkObj.type==='query'" clearable
                           placeholder="请选择计量单位">
                  <el-option
                          v-for="item in units"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
                <!--<el-input v-model="addForm.unit" :disabled="checkObj.type==='query'" placeholder="请输入计量单位"></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转换率" prop="conversion">
                <el-input v-model="addForm.conversion" :disabled="checkObj.type==='query'" placeholder="请输入转换率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row :gutter="100">-->
            <!--<el-col :span="12">-->
              <!--<el-form-item label="是否送样" prop="sampleSending">-->
                <!--<el-radio-group v-model="addForm.sampleSending" :disabled="checkObj.type==='query'">-->
                  <!--<el-radio :label="true">是</el-radio>-->
                  <!--<el-radio :label="false">否</el-radio>-->
                <!--</el-radio-group>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="12">-->
              <!--<el-form-item label="是否抽检" prop="spotCheck">-->
                <!--<el-radio-group v-model="addForm.spotCheck" :disabled="checkObj.type==='query'">-->
                  <!--<el-radio :label="true">是</el-radio>-->
                  <!--<el-radio :label="false">否</el-radio>-->
                <!--</el-radio-group>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="100">-->
            <!--<el-col :span="24">-->
              <!--<el-form-item label="包装管理" prop="packagingManagement">-->
                <!--<el-radio-group v-model="addForm.packagingManagement" :disabled="checkObj.type==='query'">-->
                  <!--<el-radio :label="true">是</el-radio>-->
                  <!--<el-radio :label="false">否</el-radio>-->
                <!--</el-radio-group>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
            <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
            <el-button @click="cancelForm">取 消</el-button>
        </div>
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { saveEnterpriseWaste, modifyEnterpriseWaste, getCodeAndNameDic, getClassCode, getWasteCode } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      formLabelWidth: '110px',
      addForm: {
        classCode: '',
        wasteCode: '',
        entWasteName: '',
        featureCodes: '',
        basis: '',
        accidentPrevention: '',
        emergencyMeasure: '',
        remark: '',
        formCode: '',
        unit: '',
        conversion: '',
        sampleSending: true,
        spotCheck: true,
        packagingManagement: true
      },
      units: [],
      classCodes: [],
      wasteCodes: [],
      wasteForm: [],
      wasteFeatures: [],
      addFormRules: {
        wasteCode: [
          { required: true, message: '请输入八位码', trigger: 'change' }
        ],
        classCode: [
          { required: true, message: '请输入二位码', trigger: 'change' }
        ],
        entWasteName: [
          { required: true, message: '请输入八位码', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getCodeAndNameDicWasteForm()
    this.getCodeAndNameDicWasteFeatures()
    this.getCodeAndNameDicUnit()
    this.getClassCode()
    this.getWasteCode()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      this.addForm = this.checkObj.data
    }
  },
  props: ['checkObj'],
  methods: {
    submitDialog (formName) {
      let _this = this
      // this.$emit('reloadPage', index)
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            modifyEnterpriseWaste(postData)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add') {
            saveEnterpriseWaste(postData)
              .then(res => {
                COMMONJS.showToast('新增成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm () {
      this.$emit('changeDialogFormVisible', false)
    },
    getCodeAndNameDicWasteForm () {
      let _this = this
      let postData = {
        typeCode: 'wasteForm'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.formCode || (_this.addForm.formCode = res.data[0].code)
          _this.wasteForm = res.data
        }).catch(() => {
        })
    },
    getCodeAndNameDicWasteFeatures () {
      let _this = this
      let postData = {
        typeCode: 'wasteFeatures'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.featureCodes || (_this.addForm.featureCodes = res.data[0].code)
          _this.wasteFeatures = res.data
        }).catch(() => {
        })
    },
    getCodeAndNameDicUnit () {
      let _this = this
      let postData = {
        typeCode: 'capacityUnit'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.unit || (_this.addForm.unit = res.data[0].code)
          _this.units = res.data
        }).catch(() => {
        })
    },
    getClassCode () {
      let _this = this
      getClassCode()
        .then(res => {
          _this.classCodes = res.data
        }).catch(() => {
        })
    },
    getWasteCode () {
      let _this = this
      getWasteCode()
        .then(res => {
          _this.wasteCodes = res.data
        }).catch(() => {
        })
    },
    getWasteCodes () {
      let _this = this
      this.addForm.wasteCode = ''
      // if (!_this.addForm.wasteCode) {
      getWasteCode({
        code: _this.addForm.classCode
      }).then(res => {
        _this.addForm.wasteCode = res.data.length ? res.data[0].code : ''
        _this.wasteCodes = res.data
        // console.log(res)
      }).catch(() => {
      })
      // }
    },
    getClassCodes () {
      let _this = this
      // if (!_this.addForm.classCode) {
      getClassCode({
        code: _this.addForm.wasteCode
      }).then(res => {
        _this.addForm.classCode = res.data[0].code
        // _this.classCodes = res.data
        // console.log(res)
      }).catch(() => {
      })
      // }
    }
  }
}
</script>

<style scoped>
  .dialog-footer{
    padding: 10px 20px 20px 20px;
  }
  .form-format{
    padding-right: 30px;
    text-align: left;
  }
  .form-format .el-radio-group{
    padding-left: 10px;
  }
</style>
