<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>基本信息</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="填埋日期:" :prop="(checkObj.type==='query') ? '' : 'fillDate'">
            <el-date-picker
                    :disabled="checkObj.type==='query'"
                    v-model="addForm.fillDate"
                    type="date"
                    :editable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择填埋日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="天气:" :prop="(checkObj.type==='query') ? '' : 'weather'">
            <el-select v-model="addForm.weather" :disabled="checkObj.type==='query'" clearable filterable
                       placeholder="请选择天气">
              <el-option
                      v-for="item in weathers"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
              </el-option>
            </el-select>
            <!--<el-input v-model="addForm.weather" :disabled="checkObj.type==='query'" placeholder="请输入天气"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="降雨量:" prop="rainFall">
            <el-input v-number-input.float v-model="addForm.rainFall" :disabled="checkObj.type==='query'" placeholder="请输入降雨量">
              <template slot="append">mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="记录人:">
            {{addForm.userName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="渗滤液:" prop="leachate">
            <el-input v-number-input.float v-model="addForm.leachate" :disabled="checkObj.type==='query'" placeholder="请输入渗滤液">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="地下水:" prop="groundWater">
            <el-input v-number-input.float v-model="addForm.groundWater" :disabled="checkObj.type==='query'" placeholder="请输入地下水">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="柴油耗量:" prop="finishFillWeight">
            <el-input v-number-input.float v-model="addForm.finishFillWeight" :disabled="checkObj.type==='query'" placeholder="请输入柴油耗量">
              <template slot="append">L</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="填埋体积:" prop="fillArea">
            <el-input v-number-input.float v-model="addForm.fillArea" :disabled="checkObj.type==='query'" placeholder="请输入填埋体积">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="水泥:" prop="cement">
            <el-input v-number-input.float v-model="addForm.cement" :disabled="checkObj.type==='query'" placeholder="请输入水泥">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="石灰:" prop="lime">
            <el-input v-number-input.float v-model="addForm.lime" :disabled="checkObj.type==='query'" placeholder="请输入石灰">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="螯合剂:" prop="chelatingAgent">
            <el-input v-number-input.float v-model="addForm.chelatingAgent" :disabled="checkObj.type==='query'" placeholder="请输入螯合剂">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自来水:" prop="tapWater">
            <el-input v-number-input.float v-model="addForm.tapWater" :disabled="checkObj.type==='query'" placeholder="请输入自来水">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="其他:" prop="other">
            <el-input v-number-input.float v-model="addForm.other" :disabled="checkObj.type==='query'">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>填埋信息<el-button class="opt-btn" type="text" @click="optContact('', 'addLandfillData')">添加填埋危废</el-button></div>
      </div>
      <el-table
              v-loading="tableVisible"
              :data="parameterDetailVOS"
              style="width: 100%"
              row-key="id"
              lazy>
        <el-table-column
                label="序号"
                type="index">
        </el-table-column>
        <el-table-column
                prop="wasteCode"
                label="八位码"
                align="center"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
                prop="entWasteName"
                label="危废俗称"
                align="center"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
                prop="entName"
                label="产废单位"
                align="center"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
                prop="fillWeight"
                label="填埋量(吨)"
                align="right"
                :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
                prop="labTestNo"
                label="化验单号"
                align="center">
        </el-table-column>
        <el-table-column
                prop="fillBaseIds"
                label="填埋场名称"
                align="center">
          <template slot-scope="scope">
            <!--<el-select v-if="scope.row.editFlag" v-model="scope.row.fillBaseId" @change="changefillBaseId(scope.row, scope.$index)" clearable filterable>-->
              <!--<el-option-->
                      <!--v-for="item in fillBaseIds"-->
                      <!--:key="item.fillBaseId"-->
                      <!--:label="item.fillLocation"-->
                      <!--:value="item.fillBaseId">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <v-common-cascader :disabled="!scope.row.editFlag" :index="scope.$index" :cantonName="scope.row.fillBaseIds" :cantonOptions="cantonOptions" :showAllLevels="true" :clearable="true" :filterable="true" :changeOnSelect="true" :props="props" @changeCantonName="changeCantonNameP"></v-common-cascader>
            <!--<span v-if="!scope.row.editFlag">{{scope.row.fillBaseName}}</span>-->
          </template>
        </el-table-column>
        <el-table-column
                prop="preDealType"
                label="是否固化"
                align="center">
          <template slot-scope="scope">
            <el-select :disabled="!scope.row.editFlag" v-model="scope.row.preDealType" @change="changepreDealType(scope.row, scope.$index)" clearable filterable>
              <el-option
                      v-for="item in preDealTypes"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
              </el-option>
            </el-select>
            <!--<span v-if="!scope.row.editFlag">{{scope.row.preDealTypeName}}</span>-->
          </template>
        </el-table-column>
        <el-table-column
                prop="remark"
                label="备注"
                align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" v-model="scope.row.remark"></el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="operation"
                label="操作"
                align="center"
                width="170">
          <template slot-scope="scope">
            <div v-if="!scope.row.editFlag">
              <el-button type="text" @click="optContact(scope.row, 'update', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">编辑</el-button>
              <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
              <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
              <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
            </div>
            <div v-if="scope.row.editFlag">
              <el-button type="text" @click="optContact(scope.row, 'add', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">保存</el-button>
              <el-button type="text" @click="optContact(scope.row, 'cancel', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">取消</el-button>
              <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">保存</span>-->
              <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">取消</span>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-row :gutter="100">-->
        <!--<el-col :span="24">-->
          <!--<el-form-item label="" v-if="checkObj.type!=='query'">-->
            <!--<el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>-->
            <!--<el-button @click="cancelForm">取 消</el-button>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
      <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import CommonCascader from '@/components/commonCascader'
import { getFillbusinessDetail, getFillLocationList, getSysDicByTypeCode, addFillbusiness, editFillbusinessParameter, listBaseinfo } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    let vRefNo = (rule, value, callback) => {
      if (!value) callback()
      // let regNum = /^[0-9]+$/
      let regNum = /^(-?d )(.d )?$/
      if (!regNum.test(value)) {
        callback(
          new Error('必须为数字值')
        )
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '90px',
      tableHeight: '100%',
      addForm: {
        userName: '',
        fillDate: '',
        weather: '',
        rainFall: '',
        leachate: '',
        groundWater: '',
        finishFillWeight: '',
        fillArea: '',
        cement: '',
        lime: '',
        chelatingAgent: '',
        tapWater: '',
        other: '',
        remark: ''
      },
      parameterDetailVOS: [],
      oldRecords: [],
      tableVisible: false,
      cantonVisible: false,
      cantonOptions: [],
      fillBaseIds: [],
      preDealTypes: [],
      wasteForm: [],
      wasteFeatures: [],
      weathers: [],
      addFormRules: {
        fillDate: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        weather: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      props: {
        label: 'fillLocation',
        value: 'id',
        children: 'children',
        leaf: 'isLeaf',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  // 组件
  components: {
    'v-common-cascader': CommonCascader
  },
  props: ['checkObj', 'chooseRecords'],
  watch: {
    chooseRecords: function (newValue, oldValue) {
      let _this = this
      for (var i = 0; i < _this.parameterDetailVOS.length; i++) {
        for (var j = 0; j < newValue.length; j++) {
          if (_this.parameterDetailVOS[i].id === newValue[j].id) {
            newValue.splice(j, 1)
            j--
          }
        }
      }
      newValue.forEach(function (val) {
        val.editFlag = true
        _this.parameterDetailVOS.push(JSON.parse(JSON.stringify(val)))
        _this.oldRecords.push(JSON.parse(JSON.stringify(val)))
      })
    }
  },
  mounted () {
    this.getSysDictionaryByTypeCodePreDeal()
    this.getSysDictionaryByTypeCodeWeather()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      // this.addForm = this.checkObj.data
      this.getListBaseInfo(this.checkObj.data.id)
    } else {
      this.getListBaseInfo()
    }
    this.getData()
    // this.getFillLocationList()
  },
  methods: {
    getData () {
      // if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      let postData = {
        id: this.checkObj.data.id
      }
      this.tableVisible = true
      let params = {
        ticket: localStorage.getItem('token')
      }
      getFillbusinessDetail(postData, params)
        .then(res => {
          if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
            this.addForm = res.data.fillBusinessParameterVO
            res.data.parameterDetailVOS || (res.data.parameterDetailVOS = [])
            res.data.parameterDetailVOS.forEach(function (val) {
              val.editFlag = false
            })
            this.parameterDetailVOS = JSON.parse(JSON.stringify(res.data.parameterDetailVOS))
            this.oldRecords = JSON.parse(JSON.stringify(res.data.parameterDetailVOS))
          } else {
            this.addForm.userName = res.data.fillBusinessParameterVO.userName
          }
          this.addForm.fillDate = (this.addForm.fillDate || this.getNowDate(new Date()))
          this.tableVisible = false
        }).catch(() => {
        })
      // } else {
      //   this.addForm.fillDate = (this.addForm.fillDate || this.getNowDate(new Date()))
      //   this.tableVisible = false
      // }
    },
    getNowDate (time) {
      time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' 00:00:00'
      return time
    },
    submitDialog (formName) {
      let _this = this
      // this.$emit('reloadPage', index)
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      // 过滤未保存数据项
      let records = this.parameterDetailVOS
      if (records.length) {
        for (var i = 0; i < records.length; i++) {
          if (records[i].editFlag === true) {
            records.splice(i, 1)
            i--
          }
        }
      }
      if (records.length !== 0) {
        postData.parameterDetailVOS = records
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            editFillbusinessParameter(postData, params)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add') {
            addFillbusiness(postData, params)
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
    changeProjects (item, index) {
      for (var i = 0; i < this.listProjects.length; i++) {
        if (item.id === this.listProjects[i].id) {
          this.listProjects[i].editFlag = true
          this.records.splice(index, 1, JSON.parse(JSON.stringify(this.listProjects[i])))
          return false
        }
      }
    },
    changefillBaseId (item, index) {
      for (var i = 0; i < this.fillBaseIds.length; i++) {
        if (item.fillBaseId === this.fillBaseIds[i].fillBaseId) {
          item.fillBaseName = this.fillBaseIds[i].fillLocation
          this.parameterDetailVOS.splice(index, 1, JSON.parse(JSON.stringify(item)))
          return false
        }
      }
    },
    changepreDealType (item, index) {
      for (var i = 0; i < this.preDealTypes.length; i++) {
        if (item.preDealType === this.preDealTypes[i].code) {
          item.preDealTypeName = this.preDealTypes[i].name
          this.parameterDetailVOS.splice(index, 1, JSON.parse(JSON.stringify(item)))
          return false
        }
      }
    },
    optContact (data, type, index) {
      switch (type) {
        case 'add':
          data.editFlag = false
          this.parameterDetailVOS.splice(index, 1, data)
          this.oldRecords.splice(index, 0, JSON.parse(JSON.stringify(data)))
          break
        case 'update':
          this.parameterDetailVOS[index].editFlag = true
          break
        case 'delete':
          let _this = this
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.parameterDetailVOS.splice(index, 1)
            _this.oldRecords.splice(index, 1)
          })
          break
        case 'cancel':
          if (index < this.oldRecords.length) {
            this.oldRecords[index].editFlag = false
            this.parameterDetailVOS.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
          }
          break
        case 'addLandfillData':
          let obj = {
            addLandfillWasteVisible: true,
            type: this.checkObj.type,
            dataList: this.parameterDetailVOS
          }
          this.$emit('addLandfillData', obj)
          break
      }
    },
    getFillLocationList () {
      getFillLocationList().then(res => {
        this.fillBaseIds = res.data
        // console.log(res)
      }).catch(() => {
      })
    },
    getSysDictionaryByTypeCodePreDeal () {
      let postData = {
        typeCode: 'preDealType'
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      getSysDicByTypeCode(postData, params).then(res => {
        this.preDealTypes = res.data
        // console.log(res)
      }).catch(() => {
      })
    },
    getSysDictionaryByTypeCodeWeather () {
      let postData = {
        typeCode: 'weather'
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      getSysDicByTypeCode(postData, params).then(res => {
        this.weathers = res.data
        this.addForm.weather || (this.addForm.weather = res.data[0].code)
        // console.log(res)
      }).catch(() => {
      })
    },
    getListBaseInfo (id) {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        selfId: id
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listBaseinfo(postData, params)
        .then(res => {
        // _this.addForm.capacityUnit || (_this.addForm.capacityUnit = res.data[0].name)
          _this.cantonOptions = _this.getTreeData(res.data)
        }).catch(() => {
        })
    },
    changeCantonNameP (val, index) {
      this.parameterDetailVOS[index].fillBaseIds = val
    },
    getTreeData (data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    }
  }
}
</script>

<style scoped lang="scss">
  .dialog-footer{
    padding: 20px 20px 20px 20px;
  }
  .form-format{
    padding-right: 30px;
    text-align: left;
    .el-date-editor.el-input{
      width: 100%;
    }
  }
  .form-format .item-header{
    font-size: 16px;
    font-weight:400;
    color:rgba(69,90,112,1);
    padding-bottom: 10px;
    .item-header-text{
      padding-left: 10px;
    }
  }
  .form-format .el-radio-group{
    padding-left: 10px;
  }
</style>
