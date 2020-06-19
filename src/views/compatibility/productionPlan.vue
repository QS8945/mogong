<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="计划单号">
          <el-input clearable v-model="queryForm.planNo" @keyup.enter.native="queryData" placeholder="请输入计划单号"></el-input>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker v-model="queryForm.startTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker v-model="queryForm.endTime" @change="checkTime" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" clearable placeholder="请选择生产计划状态">
            <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" icon="el-icon-plus" @click="addPlan">新增</el-button>
        <el-button :disabled="!(multipleSelection&&multipleSelection.length==1)" @click="editPlan(multipleSelection[0],'update')"
          icon="el-icon-edit">编辑</el-button>
        <el-button :disabled="!(multipleSelection&&multipleSelection.length>0)" @click="deletePlan" icon="el-icon-delete">删除</el-button>
      </div>
      <el-table size="mini" v-loading="loading" stripe border :header-cell-style="headClass" ref="multipleTable" :data="tableData"
        style="width: 100%" height="250" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        </el-table-column>
        <el-table-column align="center" prop="planNo" label=计划单号 width="150">
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="开始日期" width="120">
          <template slot-scope="scope">
            {{formatDate(scope.row.startTime)}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="结束日期" width="120">
          <template slot-scope="scope">
            {{formatDate(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="productionLine" label="生产线">
        </el-table-column>
        <el-table-column align="center" prop="planQty" label="计划用量（吨）" width="120">
        </el-table-column>
        <el-table-column align="center" prop="creater" label="创建人" width="120">
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='save'">已保存</span>
            <span v-else-if="scope.row.status==='commit'">已提交</span>
            <span v-else-if="scope.row.status==='precheck'">已初审</span>
            <span v-else-if="scope.row.status==='compatibility'">已配伍</span>
            <span v-else-if="scope.row.status==='finalcheck'">已终审</span>
            <span v-else-if="scope.row.status==='check'">已审核</span>
            <span v-else-if="scope.row.status==='refuse'">已驳回</span>
            <span v-else-if="scope.row.status==='stop'">已终止</span>
            <span v-else>状态异常</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="200">
          <template slot-scope="scope">
            <span class="operateBtnCls" @click="editPlan(scope.row, 'query')" type="text" size="small">
              查看
            </span>
            <span v-if="scope.row.status=='save'||scope.row.status=='refuse'" class="operateBtnCls" @click="editPlan(scope.row,'update')"
              type="text" size="small">
              编辑
            </span>
            <span v-if="scope.row.status=='save'||scope.row.status=='refuse'" class="operateBtnCls" @click="deleteSinglePlan(scope.row,'delete')"
              type="text" size="small">
              删除
            </span>
            <span v-if="scope.row.status=='save'||scope.row.status=='refuse'" class="operateBtnCls" @click="submitPlan(scope.row)" type="text"
              size="small">
              提交
            </span>
            <span v-if="scope.row.status=='commit'" class="operateBtnCls" @click="auditPlan(scope.row,'audit')" type="text" size="small">
              审核
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
            <span class="green-line"></span>{{dialogFormTitle}}生产计划</div>
        </div>
        <v-add-production-plan @refreshTable="getData" :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP"
          @reload="reloadP"></v-add-production-plan>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import AddProductionPlan from './components/addProductionPlan.vue'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    getCodeAndNameDic,
    pageProductionPlan,
    removeProductionPlan,
    startCompatibilityProcess,
    auditCompatibilityProcess,
    queryProductionPlan,
    cancelCompatibilityProcess
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
        loading: false,
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
        statusOptions: [],
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
      'v-add-production-plan': AddProductionPlan
    },
    created() {
      this.getData()
      this.getListContractStatus();
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
      checkTime(val) {
        var vm = this
        if (vm.queryForm.startTime && vm.queryForm.endTime) {
          var start = new Date(Date.parse(vm.queryForm.startTime));
          var end = new Date(Date.parse(vm.queryForm.endTime));
          if (start > end) {
            COMMONJS.showToast('开始日期不能晚于结束日期，请重新选择！', 'warning')
            return
          }
        }
      },
      getListContractStatus() {
        var vm = this;
        let postData = {
          typeCode: "production_plan_status"
        };
        getCodeAndNameDic(postData).then(res => {
          vm.statusOptions = res.data;
        }).catch(() => {});
      },
      formatDate(time) {
        if (!time) {
          return '-'
        }
        let date = new Date(time.substring(0, 10))
        return formatDate(date, 'yyyy-MM-dd')
      },
      headClass({
        row,
        rowIndex
      }) {
        return 'background:#F8F8F9;color:#8F99A2'
      },
      addPlan() {
        var vm = this;
        vm.checkObjP = {
          type: 'add',
          data: {
            "headGuid": vm.headId
          }
        }
        this.dialogFormVisible = true
      },
      sureCancelProcess(row) {
        var vm = this;
        queryProductionPlan(row.id)
          .then(res => {
            if (res.data != null) {
              cancelCompatibilityProcess({
                  guid: row.id,
                  procInsId: res.data.procInsId,
                  reason: '删除生产配伍，取消流程'
                })
                .then(res => {}).catch(() => {

                })
            }
          }).catch(() => {})
      },
      deletePlan(row) {
        let _this = this
        this.$confirm('确认删除所勾选的生产计划吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          let params = {
            ticket: localStorage.getItem('token')
          }
          _this.multipleSelection.forEach(element => {
            postData.push(element.id);
          });
          removeProductionPlan(postData, params).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      deleteSinglePlan(row) {
        let _this = this
        this.$confirm('确认删除生产计划【' + row.planNo + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [row.id];
          let params = {
            ticket: localStorage.getItem('token')
          }
          removeProductionPlan(postData, params).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      auditPlan(row, type) {
        var vm = this;
        vm.dialogFormTitle = "审核";
        queryProductionPlan(row.id)
          .then(res => {
            vm.checkObjP = {
              type: type,
              data: row.id
            }
            if (res.data != null) {
              vm.checkObjP.procInsId = res.data.procInsId
              vm.checkObjP.status = res.data.status
            }
            vm.dialogFormVisible = true
          }).catch(() => {})
      },
      submitPlan(row) {
        let _this = this
        this.$confirm('确认提交所生产计划【' + row.planNo + '】吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          startCompatibilityProcess(row).then(res => {
            COMMONJS.showToast('提交成功！')
            _this.loading = true
            setTimeout(() => {
              _this.getData()
            }, 2000);

          }).catch(() => {})
        })
      },
      editPlan(row, type) {
        var vm = this;
        if (type == "query") {
          vm.dialogFormTitle = "查看";
        } else {
          vm.dialogFormTitle = "编辑";
        }
        queryProductionPlan(row.id)
          .then(res => {
            vm.checkObjP = {
              type: type,
              data: row.id
            }
            if (res.data != null) {
              vm.checkObjP.procInsId = res.data.procInsId
              vm.checkObjP.status = res.data.status
            }
            vm.dialogFormVisible = true
          }).catch(() => {})
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
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        _this.loading = true;
        let postData = {
          ticket: localStorage.getItem('token'),
          planNo: _this.queryForm.planNo,
          startTime: _this.queryForm.startTime,
          endTime: _this.queryForm.endTime,
          status: _this.queryForm.status,
          current: this.page.current,
          size: this.page.size
        }
        pageProductionPlan(postData)
          .then(res => {
            _this.tableData = res.data.records
            _this.page.total = res.data.total
            _this.loading = false;
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
        var vm = this;
        vm.loading = true
        vm.dialogFormVisible = false
        setTimeout(() => {
          val && this.getData()
        }, 2000);
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
            // this.dialogFormTitle = '发起'
            // this.dialogFormVisible = true
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
