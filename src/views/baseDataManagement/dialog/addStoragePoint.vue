<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="贮存点编号：" :prop="(checkObj.type==='query') ? '' : 'code'">
            <el-input v-model="addForm.code" :disabled="checkObj.type==='query'" placeholder="请输入贮存点编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贮存点名称：" :prop="(checkObj.type==='query') ? '' : 'name'">
            <el-input v-model="addForm.name" :disabled="checkObj.type==='query'" placeholder="请输入贮存点名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12" v-if="checkObj.type !== 'add'">
          <el-form-item label="贮存点层级：" :prop="(checkObj.type==='query') ? '' : 'codeLink'" clearable>
            <el-input v-model="addForm.codeLink" :disabled="checkObj.type==='query' || checkObj.type==='addChild' || checkObj.type==='update'" placeholder="请输入贮存点层级"></el-input>
            <!--<el-select v-model="addForm.codeLink" :disabled="checkObj.type==='query'" clearable-->
                       <!--placeholder="请选择贮存点层级">-->
              <!--<el-option-->
                      <!--v-for="item in codeLinks"-->
                      <!--:key="item.id"-->
                      <!--:label="item.name"-->
                      <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="贮存点类型：" :prop="(checkObj.type==='query') ? '' : 'typeCode'" clearable>
            <el-select v-model="addForm.typeCode" :disabled="checkObj.type==='query'" clearable
                       placeholder="请选择贮存点类型">
              <el-option
                      v-for="item in storageType"
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
          <el-form-item label="面积：" :prop="(checkObj.type==='query') ? '' : 'size'">
            <el-input v-model="addForm.size" :disabled="checkObj.type==='query'" placeholder="请输入面积"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="容量：" :prop="(checkObj.type==='query') ? '' : 'capacity'">
            <el-input class="input-with-select" v-model.number="addForm.capacity" :disabled="checkObj.type==='query'" placeholder="请输入容量">
              <el-select slot="append" v-model="addForm.capacityUnit" :disabled="checkObj.type==='query'" clearable
                         placeholder="请选择计量单位">
                <el-option
                        v-for="item in capacityUnits"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="贮存工艺：" :prop="(checkObj.type==='query') ? '' : 'technology'" clearable>
            <el-select v-model="addForm.technology" :disabled="checkObj.type==='query'" clearable
                       placeholder="请选择贮存工艺">
              <el-option
                      v-for="item in storageTechnology"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!--<el-form-item label="负责人：" :prop="(checkObj.type==='query') ? '' : 'chargeEmp'" clearable>-->
            <!--<el-select v-model="addForm.chargeEmp" :disabled="checkObj.type==='query'" clearable-->
                       <!--placeholder="请选择负责人">-->
              <!--<el-option-->
                      <!--v-for="item in chargeEmps"-->
                      <!--:key="item.id"-->
                      <!--:label="item.name"-->
                      <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="联系电话：" :prop="(checkObj.type==='query') ? '' : 'tel'">
            <el-input v-model="addForm.tel" :disabled="checkObj.type==='query'" placeholder="请输入联系电话">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="备注：" :prop="(checkObj.type==='query') ? '' : 'remark'">
            <el-input type="textarea" v-model="addForm.remark" :disabled="checkObj.type==='query'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="24">
          <el-form-item label="">
            <div class="dialog-footer" v-if="checkObj.type!=='query'">
              <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
              <el-button @click="cancelForm">取 消</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { saveStorage, modifyStorage, getCodeAndNameDic } from '@/assets/js/API/api'

export default {
  name: 'addStoragePoint',
  data () {
    let validateContactWay = (rule, value, callback) => {
      if (!value) callback()
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
      let regTelephone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      //  ilnPhone = /^([0-9]|[-])+$/g;
      if (!regPhone.test(value) && !regTel.test(value) && !regTelephone.test(value)) {
        callback(
          new Error('电话号码' + this.$t('validate.format'))
        )
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '110px',
      addForm: {
        code: '',
        name: '',
        codeLink: '',
        typeCode: '',
        size: '',
        capacity: '',
        technology: '',
        capacityUnit: '',
        chargeEmp: '',
        tel: '',
        remark: ''
      },
      addFormRules: {
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { validator: validateContactWay, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入贮存点编号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入贮存点名称', trigger: 'change' }
        ],
        codeLink: [],
        typeCode: [
          { required: true, message: '请输入贮存点类型', trigger: 'change' }
        ],
        size: [
          { required: true, message: '请输入面积', trigger: 'change' }
        ],
        capacity: [
          { required: true, message: '请输入容量', trigger: 'change' }
        ]
      },
      storageType: [],
      storageTechnology: [],
      capacityUnits: [],
      chargeEmps: []
    }
  },
  mounted () {
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      this.addForm = this.checkObj.data
    } else if (this.checkObj.type === 'addChild') {
      this.addForm.codeLink = this.checkObj.data.code
    }
    this.getCodeAndNameDicCapacityUnit()
    this.getCodeAndNameDicStorageTechnology()
    this.getCodeAndNameDicStorageType()
  },
  props: ['checkObj'],
  methods: {
    submitDialog (formName) {
      // this.$emit('reloadPage', index)
      let _this = this
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            modifyStorage(postData)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add' || _this.checkObj.type === 'addChild') {
            saveStorage(postData)
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
    getCodeAndNameDicCapacityUnit () {
      let _this = this
      let postData = {
        typeCode: 'capacityUnit'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          // _this.addForm.capacityUnit || (_this.addForm.capacityUnit = res.data[0].name)
          _this.capacityUnits = res.data
        }).catch(() => {
        })
    },
    getCodeAndNameDicStorageTechnology () {
      let _this = this
      let postData = {
        typeCode: 'storageTechnology'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.technology || (_this.addForm.technology = res.data[0].name)
          _this.storageTechnology = res.data
        }).catch(() => {
        })
    },
    getCodeAndNameDicStorageType () {
      let _this = this
      let postData = {
        typeCode: 'storageType'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.typeCode || (_this.addForm.typeCode = res.data[0].code)
          _this.storageType = res.data
        }).catch(() => {
        })
    }
  }
}
</script>

<style scoped>
  .dialog-footer {
    padding: 10px 20px 20px 20px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }
</style>
