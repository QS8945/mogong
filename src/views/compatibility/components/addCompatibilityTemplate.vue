<template>
  <div class="form-format">
    <el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="模板名称" :prop="checkObj.type==='query'?'':'templateName'">
            <el-input v-model="addForm.templateName" :disabled="checkObj.type==='query'" clearable placeholder="请输入计划单号">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="创建人">
            <el-input v-model="addForm.createUserName" disabled>
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
    </el-form>
    <div class="table-content">
      <div style="text-align:left;">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addParam">新增</el-button>
        <el-button icon="el-icon-close" :disabled="!(multipleSelection&&multipleSelection.length>0)" size="mini" @click="deleteParam">删除</el-button>
      </div>
      <el-table :header-cell-style="headClass" stripe ref="multipleTable" :data="records" style="width: 100%" height="250" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="80">
        </el-table-column>
        <el-table-column align="center" prop="sortNum" label="排序">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" v-model="scope.row.sortNum" clearable>
            </el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.sortNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="paramName" label="参数名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" placeholder="请选择参数名称" v-model="scope.row.paramName" clearable>
            </el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.paramName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="valueType" label="值类型">
          <template slot-scope="scope">
            <el-select v-if="scope.row.editFlag" v-model="scope.row.valueType" placeholder="请选择值类型">
            </el-select>
            <span v-if="!scope.row.editFlag">{{scope.row.valueTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="unitType" label="单位类型">
          <template slot-scope="scope">
            <el-select v-if="scope.row.editFlag" v-model="scope.row.unitType" placeholder="请选择单位类型">
            </el-select>
            <span v-if="!scope.row.editFlag">{{scope.row.unitType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" prop="statusName" label="状态">
        </el-table-column>
        <el-table-column align="center" label="操作" width="188">
          <template slot-scope="scope">
            <div v-if="!scope.row.editFlag">
              <span class="operateBtnCls" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">
                编辑
              </span>
              <span class="operateBtnCls" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">
                删除
              </span>
            </div>
            <div v-if="scope.row.editFlag">
              <span class="operateBtnCls" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">
                保存
              </span>
              <span class="operateBtnCls" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">
                取消
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" v-if="checkObj.type!=='query'">
      <el-button type="primary" @click="submitDialog('addForm')">保 存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    saveContractPrice,
  } from '@/assets/js/API/api'
  export default {
    name: 'addCompatibilityTemplate',
    data() {
      return {
        records: [{
          paramName: '001'
        }],
        oldRecords: [],
        page: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        },
        multipleSelection: [],
        formLabelWidth: '110px',
        dialogVisible: false,
        addForm: {
          id: '',
          templateName: '',
          createUserName: '',
          createTime: '',
          remark: ''
        },
        addFormRules: {
          templateName: [{
            required: true,
            message: '请输入模板名称',
            trigger: 'change'
          }]
        }
      }
    },
    components: {},
    mounted() {
      if (this.checkObj.type === 'query' || this.checkObj.type === 'update') {
        this.addForm = this.checkObj.data
      } else {
        this.addForm.createTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.addForm.createUserName = localStorage.getItem('userName');
      }
    },
    props: ['checkObj'],
    methods: {
      addParam() {

      },
      deleteParam() {
        let _this = this
        this.$confirm('确认删除所勾选的参数吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          _this.multipleSelection.forEach(element => {
            postData.push(element.id);
          });
          removeContractPrice(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      optContact(data, type, index) {
        let _this = this
        switch (type) {
          case 'add':
            break
          case 'update':
            this.records[index].editFlag = true
            break
          case 'cancel':
            if (index < this.oldRecords.length) {
              this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
            }
            break
        }
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      changeDialogFormVisibleP(data) {
        var vm = this;
        vm.dialogVisible = false;
        if (vm.selCode == 8) {
          vm.addForm.wasteClassCode = data[0].classCode;
          vm.addForm.wasteCode = data[0].wasteCode;
          vm.addForm.wasteId = data[0].id;
          vm.addForm.wasteName = data[0].entWasteName;
        } else if (vm.selCode == 2) {
          if (vm.addForm.wasteClassCode != data[0].code) {
            vm.addForm.wasteClassCode = data[0].code;
            vm.addForm.wasteCode = '';
            vm.addForm.wasteId = '';
            vm.addForm.wasteName = '';
          }
        }

      },
      submitDialog(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            saveContractPrice(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                this.$emit('reload', true)
              }).catch(() => {})
          }
        })
      },
      cancelForm() {
        this.$emit('changeDialogFormVisible', false)
      }
    }
  }

</script>

<style scoped>
  .dialog-footer {
    text-align: center;
    padding: 10px 20px 20px 250px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

</style>
