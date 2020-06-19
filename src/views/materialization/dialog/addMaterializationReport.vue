<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>基本信息</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="生产日期:" :prop="(checkObj.type==='query') ? '' : 'productdate'">
            <el-date-picker
                    :disabled="checkObj.type==='query'"
                    v-model="addForm.productdate"
                    type="date"
                    :editable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择生产日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产负责人:" prop="rainFall">
            <el-select :disabled="checkObj.type==='query'" v-model="addForm.productheaderid" clearable filterable placeholder="请选择生产负责人">
              <el-option
                      v-for="item in productheaders"
                      :key="item.guid"
                      :label="item.name"
                      :value="item.guid">
              </el-option>
            </el-select>
            <!--<el-input v-model.number="addForm.rainFall" :disabled="checkObj.type==='query'" placeholder="请输入生产负责人">-->
            <!--</el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" placeholder="请输入备注" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>处置信息</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="废酸:" prop="wasteacid">
            <el-input v-model.number="addForm.wasteacid" :disabled="checkObj.type==='query'" placeholder="请输入废酸">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="废碱:" prop="wastealkali">
            <el-input v-model.number="addForm.wastealkali" :disabled="checkObj.type==='query'" placeholder="请输入废碱">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电镀废液:" prop="electroplatingeffluent">
            <el-input v-model.number="addForm.electroplatingeffluent" :disabled="checkObj.type==='query'" placeholder="请输入电镀废液">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="废乳化液:" prop="wasteemulsion">
            <el-input v-model.number="addForm.wasteemulsion" :disabled="checkObj.type==='query'" placeholder="请输入废乳化液">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>药剂消耗</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="75%硫酸:" prop="sulfuricacid">
            <el-input v-model.number="addForm.sulfuricacid" :disabled="checkObj.type==='query'" placeholder="请输入75%硫酸">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="30%碱液:" prop="liquidalkali">
            <el-input v-model.number="addForm.liquidalkali" :disabled="checkObj.type==='query'" placeholder="请输入30%碱液">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PAm:" prop="pam">
            <el-input v-model.number="addForm.pam" :disabled="checkObj.type==='query'" placeholder="请输入PAm">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PFS:" prop="pfs">
            <el-input v-model.number="addForm.pfs" :disabled="checkObj.type==='query'" placeholder="请输入PFS">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="PAC:" prop="pac">
            <el-input v-model.number="addForm.pac" :disabled="checkObj.type==='query'" placeholder="请输入PAC">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="硫酸亚铁:" prop="ferroussulfate">
            <el-input v-model.number="addForm.ferroussulfate" :disabled="checkObj.type==='query'" placeholder="请输入硫酸亚铁">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="氢氧化钙:" prop="calciumhydroxide">
            <el-input v-model.number="addForm.calciumhydroxide" :disabled="checkObj.type==='query'" placeholder="请输入氢氧化钙">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="硫化钠:" prop="sodiumsulfide">
            <el-input v-model.number="addForm.sodiumsulfide" :disabled="checkObj.type==='query'" placeholder="请输入硫化钠">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="次氯酸钠:" prop="sodiumhypochlorite">
            <el-input v-model.number="addForm.sodiumhypochlorite" :disabled="checkObj.type==='query'" placeholder="请输入次氯酸钠">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还原剂:" prop="reducingagent">
            <el-input v-model.number="addForm.reducingagent" :disabled="checkObj.type==='query'" placeholder="请输入还原剂">
              <template slot="append">公斤</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>次生信息</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="污泥:" prop="sludge">
            <el-input v-model.number="addForm.sludge" :disabled="checkObj.type==='query'" placeholder="请输入污泥">
              <template slot="append">吨</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="高盐水:" prop="highsaltwater">
            <el-input v-model.number="addForm.highsaltwater" :disabled="checkObj.type==='query'" placeholder="请输入高盐水">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="item-header">
        <div class="item-header-text"><span class="green-line"></span>能量消耗</div>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="自来水:" prop="tapwater">
            <el-input v-model.number="addForm.tapwater" :disabled="checkObj.type==='query'" placeholder="请输入自来水">
              <template slot="append">m³</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="checkObj.type==='query'" type="primary" @click="submitDialog('addForm')">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import CommonCascader from '@/components/commonCascader'
import { getFillBusinessDetail, getFillLocationList, getSysDictionaryByTypeCode, addFillBusiness, editFillBusinessParameter, listBaseInfo, savePhchAccount, listPhchEmp, getPhchAccountById } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    let vRefNo = (rule, value, callback) => {
      if (!value) callback()
      let regNum = /^[0-9]+$/
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
        productheaderid: '',
        userName: '',
        productdate: '',
        // weather: '',
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
      productheaders: [],
      parameterDetailVOS: [],
      oldRecords: [],
      tableVisible: false,
      cantonVisible: false,
      cantonOptions: [],
      fillBaseIds: [],
      preDealTypes: [],
      wasteForm: [],
      wasteFeatures: [],
      // weathers: [],
      addFormRules: {
        rainFall: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        productdate: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        // weather: [
        //   { required: true, message: '请输入', trigger: 'change' }
        // ],
        leachate: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        groundWater: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        finishFillWeight: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        fillArea: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        cement: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        lime: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        chelatingAgent: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        tapWater: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
        ],
        other: [
          { type: 'number', validator: vRefNo, message: '必须为数字值' }
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
  props: ['checkObj'],
  mounted () {
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      this.getData(this.checkObj.data.id)
    } else {
      this.addForm.productdate = this.getNowDate(new Date())
    }
    this.listPhchEmp()
  },
  methods: {
    getData (id) {
      let _this = this
      let postData = {
        id: id
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      getPhchAccountById(postData, params)
        .then(res => {
          _this.addForm = res.data
        }).catch(() => {
        })
    },
    getNowDate (time) {
      time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' 00:00:00'
      return time
    },
    submitDialog (formName) {
      let _this = this
      // this.$emit('reloadPage', index)
      let postData = this.addForm
      let params = {
        ticket: localStorage.getItem('token')
      }
      // 过滤未保存数据项
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            savePhchAccount(postData, params)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add') {
            savePhchAccount(postData, params)
              .then(res => {
                COMMONJS.showToast('新增成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          }
        } else {
          return false
        }
      })
    },
    cancelForm () {
      this.$emit('changeDialogFormVisible', false)
    },
    listPhchEmp () {
      let _this = this
      let postData = {
      }
      let params = {
        ticket: localStorage.getItem('token')
      }
      listPhchEmp(postData, params).then(res => {
        _this.productheaders = res.data
        // console.log(res)
      }).catch(() => {
      })
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
