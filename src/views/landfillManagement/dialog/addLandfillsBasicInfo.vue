<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-form-item label="填埋场:" prop="parentIds">
        <v-common-cascader v-if="cantonVisible" :disabled="checkObj.type==='query'" :cantonName="addForm.parentIds" :cantonOptions="cantonOptions" :showAllLevels="true" :clearable="true" :filterable="true" :changeOnSelect="true" :props="props" @changeCantonName="changeCantonNameP"></v-common-cascader>
      </el-form-item>
      <el-form-item label="填埋场名称:" prop="fillLocation">
        <el-input v-model="addForm.fillLocation" :disabled="checkObj.type==='query'" @keyup.enter.native="submitDialog('addForm')" placeholder="请输入填埋场名称"></el-input>
      </el-form-item>
      <el-form-item label="计划填埋量:" prop="planFillWeight">
        <el-input v-number-input.float v-model="addForm.planFillWeight" :disabled="checkObj.type==='query'" @keyup.enter.native="submitDialog('addForm')" placeholder="请输入计划填埋量">
          <template slot="append">吨</template>
        </el-input>
      </el-form-item>
      <el-form-item label="已填埋量:" prop="finishFillWeight">
        <el-input v-number-input.float v-model="addForm.finishFillWeight" :disabled="checkObj.type==='query'" @keyup.enter.native="submitDialog('addForm')" placeholder="请输入已填埋量">
          <template slot="append">吨</template>
        </el-input>
      </el-form-item>
      <el-form-item label="计划填埋体积:" prop="planFillArea">
        <el-input v-number-input.float v-model="addForm.planFillArea" :disabled="checkObj.type==='query'" @keyup.enter.native="submitDialog('addForm')" placeholder="请输入计划填埋体积">
          <template slot="append">m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="已填埋体积:" prop="finishFillArea">
        <el-input v-number-input.float v-model="addForm.finishFillArea" :disabled="checkObj.type==='query'" @keyup.enter.native="submitDialog('addForm')" placeholder="请输入已填埋体积">
          <template slot="append">m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="" v-if="checkObj.type!=='query'">
        <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import CommonCascader from '@/components/commonCascader'
import {
  getFilBaseInfoById,
  addFillBaseInfo,
  updateFillBaseInfo,
  listBaseInfo
} from '@/assets/js/API/api'

export default {
  name: 'addWaste',
  data () {
    return {
      formLabelWidth: '150px',
      addForm: {
        fillLocation: '',
        planFillWeight: '',
        finishFillWeight: '',
        planFillArea: '',
        finishFillArea: '',
        parentIds: []
      },
      cantonVisible: false,
      cantonOptions: [],
      classCodes: [],
      wasteCodes: [],
      wasteForm: [],
      wasteFeatures: [],
      addFormRules: {
        fillLocation: [
          { required: true, message: '请输入填埋位置', trigger: 'change' }
        ],
        planFillWeight: [
          { required: true, message: '请输入计划填埋量', trigger: 'change' }
        ],
        finishFillWeight: [
          { required: true, message: '请输入已填埋量', trigger: 'change' }
        ],
        planFillArea: [
          { required: true, message: '请输入计划填埋体积', trigger: 'change' }
        ],
        finishFillArea: [
          { required: true, message: '请输入已填埋体积', trigger: 'change' }
        ]
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
  mounted () {
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      // this.addForm = this.checkObj.data
      this.getFilBaseInfoById()
      this.getListBaseInfo(this.checkObj.data)
    } else {
      this.getListBaseInfo()
    }
  },
  // 组件
  components: {
    'v-common-cascader': CommonCascader
  },
  props: ['checkObj'],
  methods: {
    getFilBaseInfoById () {
      let _this = this
      let postData = {
        id: this.checkObj.data
      }
      getFilBaseInfoById(postData)
        .then(res => {
        // _this.addForm.capacityUnit || (_this.addForm.capacityUnit = res.data[0].name)
          _this.addForm = res.data
        }).catch(() => {
        })
    },
    submitDialog (formName) {
      let _this = this
      // this.$emit('reloadPage', index)
      let postData = this.addForm
      // postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            updateFillBaseInfo(postData)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add') {
            postData.entId = localStorage.getItem('id')
            addFillBaseInfo(postData)
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
    changeCantonNameP (val) {
      this.addForm.parentIds = val
    },
    getListBaseInfo (id) {
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        selfId: id
      }
      listBaseInfo(postData)
        .then(res => {
          // _this.addForm.capacityUnit || (_this.addForm.capacityUnit = res.data[0].name)
          _this.cantonOptions = _this.getTreeData(res.data)
          _this.cantonVisible = true
        }).catch(() => {
        })
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

<style scoped>
  .dialog-footer {
    padding: 10px 20px 20px 20px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
    padding-bottom: 10px;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }
</style>
