<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="模板名称" prop="name">
                <el-input v-model="addForm.name" :disabled="checkObj.type==='query'" clearable filterable
                           placeholder="请输入模板名称" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模板编号" prop="code">
                <el-input v-model="addForm.code" :disabled="checkObj.type==='query'" clearable filterable
                          placeholder="请输入模板名称" >
                </el-input>
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
      <el-form :model="addParam" :rules="addFormRules" ref="addParam" :label-width="formLabelWidth">
          <div class="bus-info-item">
            <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
              <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
              <el-button @click="cancelForm">取 消</el-button>
            </div>
            <div class="item-header">
              <div class="item-header-text"><el-button type="text" @click="addParamItem">添加参数</el-button></div>
            </div>
            <div class="item-body" v-if="paramFlag">
              <el-table
                      v-if="tableVisible"
                      :data="records"
                      style="width: 100%"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      row-key="id"
                      lazy>
                <el-table-column
                        type="index">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="参数名称">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.editFlag" v-model="scope.row.id" clearable filterable @change="changelistParams(scope.row, scope.$index)">
                      <el-option
                              v-for="item in listParams"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                      </el-option>
                    </el-select>
                    <span v-if="!scope.row.editFlag">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                        prop="valueName"
                        label="值类型">
                </el-table-column>
                <el-table-column
                        prop="unitTypeName"
                        label="单位类型">
                </el-table-column>
                <el-table-column
                        prop="abbreviation"
                        label="单位">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        align="center">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.editFlag">
                      <el-button type="text" @click="optContact(scope.row, 'update', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">编辑</el-button>
                      <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
                      <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
                      <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
                    </div>
                    <div v-if="scope.row.editFlag">
                      <el-button type="text" @click="optContact(scope.row, 'add', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address"  >保存</el-button>
                      <el-button type="text" @click="optContact(scope.row, 'cancel', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">取消</el-button>
                      <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">保存</span>-->
                      <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">取消</span>-->
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
      </el-form>
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { pageAnalysisParam, saveAnalysisTemplate, saveTemplateMappingParam } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      // 表格初始化
      tableVisible: true,
      formLabelWidth: '150px',
      paramFlag: false,
      addForm: {
        code: '',
        name: '',
        valueType: '',
        unitType: '',
        defaultUnitCode: '',
        calculable: '',
        remark: '',
        id: ''
      },
      addParam: {
        code: '',
        name: '',
        valueType: '',
        unitType: '',
        defaultUnitCode: '',
        calculable: '',
        remark: '',
        id: ''
      },
      valueTypes: [],
      defaultUnitCodes: [],
      unitTypes: [],
      wasteFeatures: [],
      records: [],
      oldRecords: [],
      listParams: [],
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
  // 页面刚加载就会调用的方法
  mounted () {
    this.pageAnalysisParam()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      let form = this.checkObj.data
      form.calculable = (!!form.calculable)
      this.addForm = form
      this.getFlag()
    }
    var records = []
    if ((!records.length) && (this.checkObj.type !== 'query')) {
      let addObj = {
        name: '',
        dispositionType: '',
        quantity: '',
        unit: '',
        editFlag: true
      }
      records.push(addObj)
    } else {
      records.forEach(function (val, index) {
        val.editFlag = false
      })
    }
    if (this.addForm.id !== '') {
      this.paramFlag = true
    }
    this.records = JSON.parse(JSON.stringify(records))
    this.oldRecords = JSON.parse(JSON.stringify(records))
  },
  props: ['checkObj'],
  methods: {
    submitDialog (formName) {
      let _this = this
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      postData.calculable = (postData.calculable ? 1 : 0)
      saveAnalysisTemplate(postData)
        .then(res => {
          _this.addForm.id = res.data
          if (_this.addForm.id !== '') {
            _this.paramFlag = true
          }
        }).catch(() => {
        })
    },
    saveTemplateMappingParam () {
      let list = []
      list.push()
      let postData = {
        list: list,
        entId: localStorage.getItem('id')
      }
      saveTemplateMappingParam(postData).then(
        res => {

        }
      ).catch(() => {
      })
    },
    pageAnalysisParam () {
      let postData = {
        entId: localStorage.getItem('id'),
        current: 1,
        size: 66666
      }
      pageAnalysisParam(postData).then(
        res => {
          this.listParams = res.data.records
        }
      ).catch(() => {
      })
    },
    changelistParams (item, index) {
      for (var i = 0; i < this.listParams.length; i++) {
        if (item.id === this.listParams[i].id) {
          this.listParams[i].editFlag = true
          this.records.splice(index, 1, JSON.parse(JSON.stringify(this.listParams[i])))
          return false
        }
      }
    },
    addParamItem () {
      if (this.records[this.records.length - 1].editFlag) {
        COMMONJS.showToast('请先保存添加项', 'warning')
      } else {
        let addObj = {
          id: '',
          dispositionType: '',
          quantity: '',
          unit: '',
          editFlag: true
        }
        // this.records.splice(this.records.length, 0, addObj)
        this.records.push(addObj)
      }
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
    getFlag () {
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
    },
    optContact (data, type, index) {
      switch (type) {
        case 'add':
          if (data.id) {
            data.editFlag = false
            if (index === (this.records.length - 1)) {
              this.records.splice(index, 1, data)
              this.oldRecords.splice(index, 0, data)
            } else {
              this.oldRecords[index] = JSON.parse(JSON.stringify(data))
            }
          } else {
            COMMONJS.showToast('请先选择项目名称', 'warning')
          }
          break
        case 'update':
          this.records[index].editFlag = true
          break
        case 'delete':
          this.records.splice(index, 1)
          if (index < this.oldRecords.length) {
            if (!this.records.length) {
              let addObj = {
                id: '',
                dispositionType: '',
                quantity: '',
                unit: '',
                editFlag: true
              }
              this.records.push(addObj)
            } else {
              this.oldRecords.splice(index, 1)
            }
          }
          break
        case 'cancel':
          if (index < this.oldRecords.length) {
            this.oldRecords[index].editFlag = false
            this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
          }
          break
      }
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
