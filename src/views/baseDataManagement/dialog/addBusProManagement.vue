<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
          <div class="item-header">
            <div class="item-header-text"><span class="green-line"></span>项目信息</div>
          </div>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="addForm.name" :disabled="checkObj.type==='query'" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营方式" prop="dispositionType">
                <el-select v-model="addForm.dispositionType" :disabled="checkObj.type==='query'" clearable filterable
                           placeholder="请选择经营方式">
                  <el-option
                          v-for="item in dispositionTypes"
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
              <el-form-item label="年处理能力" prop="quantity">
                <el-input v-model="addForm.quantity" :disabled="checkObj.type==='query'" placeholder="请输入年处理能力"></el-input>
              </el-form-item>
            </el-col>
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
                <!--<el-input v-model="addForm.form" :disabled="checkObj.type==='query'" placeholder="请输入危废形态"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <div class="item-header">
            <div class="item-header-text"><span class="green-line"></span>危废信息<el-button class="opt-btn" type="text" @click="optContact('', 'add')">{{checkObj.type==='query' ? '查看可' : ''}}新增危废</el-button></div>
          </div>
          <el-table
                  v-if="tableVisible"
                  :data="addForm.wastes"
                  style="width: 100%"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  row-key="id"
                  lazy>
            <el-table-column
                    type="index">
            </el-table-column>
            <el-table-column
                    prop="stdClassCode"
                    label="二位码">
            </el-table-column>
            <el-table-column
                    prop="stdWasteCode"
                    label="八位码">
            </el-table-column>
            <el-table-column
                    prop="wasteName"
                    label="危废俗称">
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
            <el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>
            <el-button @click="cancelForm">取 消</el-button>
        </div>

        <!--<el-dialog :visible.sync="treeVisible" :close-on-click-modal="false" :show-close="false" class="map-dialog">-->
          <!--<v-tree :data="treeData"></v-tree>-->
          <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button type="primary" @click="treeVisible = true">保存</el-button>-->
            <!--<el-button @click="treeVisible = false">取 消</el-button>-->
          <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { listDispositonTypes, listCapacityUnit, listProjectDetail, getClassCodeAndWasteCode, saveProject, updateProject } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      formLabelWidth: '110px',
      addForm: {
        name: '',
        dispositionType: '',
        quantity: '',
        unit: '',
        wastes: []
      },
      tableVisible: false,
      units: [],
      dispositionTypes: [],
      addFormRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        dispositionType: [
          { required: true, message: '请选择经营方式', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入年处理能力', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '请选择计量单位', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // 处置方式选择下拉框
    this.listDispositonTypes()
    // 计量单位选择下拉框
    this.listCapacityUnit()
    if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
      let postData = {
        id: this.checkObj.data.id
      }
      listProjectDetail(postData)
        .then(res => {
          this.addForm = res.data
          this.tableVisible = true
        }).catch(() => {
        })
      // this.addForm = this.checkObj.data
    } else {
      this.tableVisible = true
    }
  },
  props: ['checkObj', 'chooseRecords'],
  watch: {
    chooseRecords: function (newValue, oldValue) {
      let _this = this
      for (var i = 0; i < _this.addForm.wastes.length; i++) {
        for (var j = 0; j < newValue.length; j++) {
          if (_this.addForm.wastes[i].id === newValue[j].id) {
            newValue.splice(j, 1)
            j--
          }
        }
      }
      newValue.forEach(function (val) {
        _this.addForm.wastes.push(val)
      })
    }
  },
  methods: {
    submitDialog (formName) {
      let _this = this
      // this.$emit('reloadPage', index)
      let postData = this.addForm
      postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'update') {
            updateProject(postData)
              .then(res => {
                COMMONJS.showToast('更新成功')
                this.$emit('reload', true)
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'add') {
            saveProject(postData)
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
    listDispositonTypes () {
      let _this = this
      listDispositonTypes()
        .then(res => {
          _this.addForm.dispositionType || (_this.addForm.dispositionType = res.data[0].code)
          _this.dispositionTypes = res.data
        }).catch(() => {
        })
    },
    listCapacityUnit () {
      let _this = this
      listCapacityUnit()
        .then(res => {
          _this.addForm.unit || (_this.addForm.unit = res.data[0].code)
          _this.units = res.data
        }).catch(() => {
        })
    },
    optContact (data, type, index) {
      switch (type) {
        case 'delete':
          this.addForm.wastes.splice(index, 1)
          break
        case 'add':
          getClassCodeAndWasteCode()
            .then(res => {
              let obj = {
                treeData: res.data,
                treeVisible: true,
                type: this.checkObj.type
              }
              this.$emit('changeTreeVisible', obj)
            }).catch(() => {
            })
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
