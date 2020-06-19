<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="模板名称">
          <el-input clearable v-model="queryForm.templateName" @keyup.enter.native="queryData" placeholder="请输入您要查询的模板名称"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" icon="el-icon-plus" @click="addTemplate">新增</el-button>
        <el-button :disabled="!(multipleSelection&&multipleSelection.length==1)" @click="editTemplate(multipleSelection[0])" icon="el-icon-edit">编辑</el-button>
        <el-button :disabled="!(multipleSelection&&multipleSelection.length>0)" @click="deleteTemplate" icon="el-icon-delete">删除</el-button>
      </div>
      <el-table stripe border :header-cell-style="headClass" ref="multipleTable" :data="tableData" style="width: 100%" height="250"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" type="index" label="顺序" width="80"></el-table-column>
        <el-table-column align="center" type="selection" width="80">
        </el-table-column>
        <el-table-column align="center" prop="planNo" label="模板名称">
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="创建日期" width="150">
        </el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="200">
          <template slot-scope="scope">
            <span class="operateBtnCls" @click="editTemplate(scope.row, 'query')" type="text" size="small">
              查看
            </span>
            <span class="operateBtnCls" @click="editTemplate(scope.row,'update')" type="text" size="small">
              编辑
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!-- 新增生产计划 -->
    <div v-if="dialogFormVisible">
      <el-dialog append-to-body left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div>
            <span class="green-line"></span>{{dialogFormTitle}}配伍模板</div>
        </div>
        <v-add-compatibility-template @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
          @reload="reloadP"></v-add-compatibility-template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import AddCompatibilityTemplate from './components/addCompatibilityTemplate.vue'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageFileList,
    getContractInfoOfSalesMan,
    getToDoList
  } from '@/assets/js/API/api'

  export default {
    data() {
      let validateContactWay = (rule, value, callback) => {
        if (!value) callback()
        let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
        let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPhone.test(value) && !regTel.test(value)) {
          callback(
            new Error(this.$t('enterprise_info.link_phone') + this.$t('validate.format'))
          )
        } else {
          callback()
        }
      }
      let checkPwd = (rule, value, callback) => {
        if (!value) callback()
        let regPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,64}$/
        //  ilnPhone = /^([0-9]|[-])+$/g;
        if (!regPwd.test(value)) {
          callback(
            new Error('由字母、数字、符号组成，长度不能少于8位')
          )
        } else {
          callback()
        }
      }
      return {
        tableData: [],
        queryForm: {
          valid: false,
          classCode: '',
          wasteCode: '',
          entWasteName: ''
        },
        checkObjP: {},
        dialogFormTitle: '新增',
        queryFormRules: {
          tel: [{
            validator: validateContactWay,
            trigger: 'change'
          }]
        },
        statusOptions: [{
          label: '启动',
          value: '1'
        }, {
          label: '停用',
          value: '2'
        }],
        openDelay: 500,
        records: {},
        page: {
          current: GLB_CONSTANT.page.current,
          size: 10,
          total: 0,
          sizes: [5, 10, 50]
        },
        multipleSelection: [],
        dialogFormVisible: false,
        addForm: {
          tel: '',
          name: '',
          password: ''
        },
        addFormRules: {
          tel: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'change'
            },
            {
              validator: validateContactWay,
              trigger: 'change'
            }
          ],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'change'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              validator: checkPwd,
              trigger: 'change'
            }
          ]
        },
        resetPwdFormVisible: false,
        resetPwdForm: {
          newPassword: ''
        },
        resetPwdFormRules: {
          newPassword: [{
              required: true,
              message: '请输入密码',
              trigger: 'change'
            },
            {
              validator: checkPwd,
              trigger: 'change'
            }
          ]
        }
      }
    },
    // 组件
    components: {
      'v-pagination': Pagination,
      'v-add-compatibility-template': AddCompatibilityTemplate
    },
    created() {
      this.getData()
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      addTemplate() {
        var vm = this;
        vm.checkObjP = {
          type: 'add',
          data: {
            "headGuid": vm.headId
          }
        }
        this.dialogFormVisible = true
      },
      submitTemplate(row) {
        let _this = this
        this.$confirm('确认提交生产计划【' + row.planNo + '】吗？', '提示', {
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
      deleteTemplate() {
        let _this = this
        this.$confirm('确认删除所勾选的生产计划吗？', '提示', {
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
      editTemplate(row, type) {
        var vm = this;
        if (type == "query") {
          vm.dialogFormTitle = "查看";
        } else {
          vm.dialogFormTitle = "编辑";
        }
        vm.checkObjP = {
          type: type,
          data: vm.multipleSelection[0]
        }
        this.dialogFormVisible = true
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      queryData() {
        let postData = {
          id: 'fanhj'
        }
        getToDoList(postData)
          .then(res => {
            console.log(JSON.stringify(res.data));
          }).catch(() => {})
        return;
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          current: this.page.current,
          size: this.page.size,
          sourceId: this.headId,
          sourceType: 'contract',
          wasteName: this.queryForm.fileName,
          startDate: this.queryForm.startDate,
          endDate: this.queryForm.endDate
        }
        pageFileList(postData)
          .then(res => {
            _this.tableData = [{
              planNo: '001'
            }, {
              planNo: '002'
            }];
            _this.page.total = res.data.total
          }).catch(() => {})
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
      changeDialogFormVisibleP(val) {
        this.dialogFormVisible = val
      },
      reloadP(val) {
        val && this.getData()
        this.dialogFormVisible = false
      },
      operationP(obj) {
        switch (obj.operation) {
          case 'query':
            this.$alert('nothing！');
            break
          case 'update':
            console.log(obj);
            this.checkObjP.type = obj.operation
            this.checkObjP.data = obj.data
            window.open("http://localhost:8082/jsite/a/act/task/form?procDefId=" + obj.data.id);
            break
          case 'delete':
            this.$alert('nothing！');
            break
        }
      }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }

</style>
