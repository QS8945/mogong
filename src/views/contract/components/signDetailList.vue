<template>
  <div class="view-total baseForm">
    <div>
      <div>
        <el-button type="text" icon="el-icon-plus" @click="addSignDetail">增加</el-button>
        <el-button type="text" :disabled="!(multipleSelection&&multipleSelection.length==1)" icon="el-icon-edit" @click="editSignDetail">修改</el-button>
        <el-button type="text" :disabled="!(multipleSelection&&multipleSelection.length>0)" icon="el-icon-delete" @click="deleteSign">删除</el-button>
        <el-button type="text" :disabled="!(multipleSelection&&multipleSelection.length==1)" icon="el-icon-document-copy">关联送样单</el-button>
        <el-button type="text" :disabled="!(multipleSelection&&multipleSelection.length==1)" icon="el-icon-close">清除送样单</el-button>
        <span class="hetongCodeSpan">
          <el-tag>合同编号：{{hetongCode}}</el-tag>
        </span>
      </div>
      <el-table size="mini" ref="multipleTable" :data="tableData" style="width: 100%" height="300" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="100">
        </el-table-column>
        <el-table-column prop="sampleStatus" label="送样状态" width="150">
        </el-table-column>
        <el-table-column prop="statusName" label="是否暂停" width="120">
        </el-table-column>
        <el-table-column prop="baseMatClassClassCode" label="二位码" width="120">
        </el-table-column>
        <el-table-column prop="baseMaterialMatCode" label="八位码" width="120">
        </el-table-column>
        <el-table-column prop="saorderHeadHetongCode" label="经营合同编码" width="300">
        </el-table-column>
        <el-table-column prop="baseMaterialMatName" label="危废俗称" width="120">
        </el-table-column>
        <el-table-column prop="packageTypeName" label="包装类型" width="120">
        </el-table-column>
        <el-table-column prop="qty" label="合同量" width="120">
        </el-table-column>
        <el-table-column prop="unitId" label="单位" width="120">
        </el-table-column>
        <el-table-column prop="recQty" label="已入库数量" width="120">
        </el-table-column>
        <el-table-column prop="price" label="单价" width="120">
        </el-table-column>
        <el-table-column prop="amt" label="金额" width="120">
        </el-table-column>
        <el-table-column prop="baseDealTypeName" label="处置方式" width="120">
        </el-table-column>
        <el-table-column prop="actResName" label="派车方式" width="120">
        </el-table-column>
        <el-table-column prop="cpTypeName" label="收付类型" width="120">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
      <div v-if="dialogFormVisible">
        <el-dialog append-to-body @close="queryData" left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
          <div slot="title" class="dialog-title">
            <div>
              <span class="green-line"></span>{{dialogFormTitle}}经营合同详细信息</div>
          </div>
          <v-add-sign-detail :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-add-sign-detail>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import AddSignDetail from './addSignDetail'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    queryMSWMSAOrderLineByHeadID,
    delMSWMSAOrderLineByIDs
  } from '@/assets/js/API/api'

  export default {
    name: 'signDetailList',
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
        dialogFormTitle: '增加',
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
          size: 5,
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
      'v-add-sign-detail': AddSignDetail,
      'v-pagination': Pagination
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
    props: {
      headId: { // 默认数据
        type: String
      },
      hetongCode: { // 默认数据
        type: String
      },
    },
    methods: {
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      addSignDetail() {
        this.checkObjP = {
          type: 'add',
          data: {
            "headGuid": this.headId
          }
        }
        this.dialogFormVisible = true
      },
      deleteSign() {
        let _this = this
        this.$confirm('确认删除所勾选的详细信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          _this.multipleSelection.forEach(element => {
            postData.push(element.guid);
          });
          delMSWMSAOrderLineByIDs(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      editSignDetail() {
        var vm = this;
        vm.dialogFormTitle = "编辑";
        this.checkObjP = {
          type: 'update',
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
      submit() {
        startProcess();
      },
      chushen() {
        alert(2);
      },
      fushen() {
        alert(3);
      },
      enterpriseEntry() {
        this.$router.push({
          path: '/enterpriseEntry'
        })
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          "headId": _this.headId,
          "size": _this.page.size,
          "current": _this.page.current
        }
        queryMSWMSAOrderLineByHeadID(postData)
          .then(res => {
            console.log(res);
            _this.tableData = res.data.records;
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
      },
      addUserData() {
        this.checkObjP = {
          type: 'add',
          data: {}
        }
        this.dialogFormVisible = true
      },
      handleCurrentChange(index) {
        this.page.current = index
        this.getData()
      },
      handleSizeChange(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      lookInfo(row) {
        console.log(row)
      },
      delSection(obj) {
        let _this = this
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            enterpriseWasteId: obj.id
          }
          deleteEnterpriseWaste(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleCommand(command) {
        if (command.act === 'on') {
          console.log(command.row)
          this.enableONOFF(command.row)
          // COMMONJS.getLoginOut()
        } else if (command.act === 'resetPwd') {
          this.resetPwdFormVisible = true
          console.log(command.row)
          // this.$router.push('/changePassword')
        } else if (command.act === 'setAdmin') {
          console.log(command.row)
          this.setAdmin(command.row)
        }
      },
      submitResetDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.resetPwdFormVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      enableONOFF(rowData) {
        if (rowData) {
          this.$confirm('确认' + (rowData.status === '0' ? '启用' : '停用') + '？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(rowData.status === '0' ? '启用' : '停用')
            rowData.status = rowData.status === '0' ? '1' : '0'
            rowData.statusName = rowData.status === '1' ? '启用' : '停用'
          })
        }
      },
      setAdmin(rowData) {
        if (rowData) {
          this.$confirm('确认设为管理员？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {})
        }
      }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

  .hetongCodeSpan {
    display: table-cell;
    line-height: 36px;
    vertical-align: middle;
    text-align: center;
    float: right;
  }

</style>
