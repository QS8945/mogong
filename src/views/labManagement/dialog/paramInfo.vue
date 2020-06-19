<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="参数编号" prop="code">
                <el-input v-model="addForm.code" :disabled="checkObj.type==='query'" clearable filterable
                           placeholder="请输入参数编号" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="参数名称" prop="name">
                <el-input v-model="addForm.name" :disabled="checkObj.type==='query'" clearable filterable
                          placeholder="请输入参数名称" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="值类型" prop="valueType">
                <el-select v-model="addForm.valueType" :disabled="checkObj.type==='query'" clearable
                           @change="getFlag"
                           placeholder="请选择值类型">
                  <el-option
                          v-for="item in valueTypes"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="单位类型" prop="unitType" v-show="flag" >
                <el-select v-model="addForm.unitType" :disabled="checkObj.type==='query'" clearable
                           @change="getListUnit"
                           placeholder="请选择单位类型" >
                  <el-option
                          v-for="item in unitTypes"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="默认单位" prop="defaultUnitCode"  v-show="flag">
                <el-select v-model="addForm.defaultUnitCode" :disabled="checkObj.type==='query'" clearable
                           placeholder="请选择单位">
                  <el-option
                          v-for="item in defaultUnitCodes"
                          :key="item.code"
                          :label="item.abbreviation"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="是否可计算平均值" prop="calculable"  v-show="flag">
                <el-checkbox v-model="addForm.calculable" :disabled="checkObj.type==='query'">
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="200">
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
import { listUnitType,getCodeAndNameDic,listUnit,saveAnalysisParam } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      formLabelWidth: '150px',
      flag:true,
      addForm: {
        code: '',
        name: '',
        valueType: '',
        unitType: '',
        defaultUnitCode: '',
        calculable: '',
        remark: ''
      },
      valueTypes: [],
      defaultUnitCodes: [],
      unitTypes: [],
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
  //页面刚加载就会调用的方法
  mounted () {
    this.getCodeAndNameDicValueType()
    this.listUnitType()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      let form = this.checkObj.data
      form.calculable = (form.calculable ? true : false)
      this.addForm = form
      this.getFlag()
    }
  },
  props: ['checkObj'],
  methods: {
    submitDialog (formName) {
      let _this = this
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      postData.calculable = (postData.calculable ? 1 : 0)
      if (postData.valueType !== 'num') {
        postData.unitType = ''
        postData.defaultUnitCode = ''
        postData.calculable= ''

      }
      saveAnalysisParam(postData)
        .then(res => {
          _this.$emit('reload', true)
        }).catch(() => {
      })
    },
    cancelForm () {
      this.$emit('changeDialogFormVisible', false)
    },
    getCodeAndNameDicValueType () {
      let _this = this
      let postData = {
        typeCode: 'valueType'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.valueType || (_this.addForm.valueType = res.data[0].code)
          _this.valueTypes = res.data

        }).catch(() => {
        })
    },
    listUnitType () {
      let _this = this
      listUnitType()
        .then(res => {
          _this.addForm.unitType || (_this.addForm.unitType = res.data[0].code)
          _this.unitTypes = res.data
          if (_this.addForm.unitType) {
            _this.getListUnit('init')
          }
        }).catch(() => {
      })
    },
    getFlag(){
      if (this.addForm.valueType != 'num') {
        this.flag = false
      } else {
        this.flag = true
      }
    },
    getListUnit (flag) {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        unitType: this.addForm.unitType
      }
      listUnit(postData)
        .then(res => {
          if (flag === 'init') {
            _this.addForm.defaultUnitCode || (_this.addForm.defaultUnitCode = res.data[0].code)
          } else {
            _this.addForm.defaultUnitCode = res.data[0].code
          }
          _this.defaultUnitCodes = res.data
        }).catch(() => {
      })
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
