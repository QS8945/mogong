<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <!--<el-form-item label="手机号码：">-->
          <!--<el-input suffix-icon="el-icon-date" v-model="queryForm.tel" placeholder="请输入手机号码"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="机构名称：">
          <el-input suffix-icon="el-icon-date" v-model="queryForm.organization" placeholder="请输入机构姓名"></el-input>
        </el-form-item>
        <el-form-item label="编码：">
          <el-input suffix-icon="el-icon-date" v-model="queryForm.name" placeholder="请输入机构编码"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="queryForm.organizationType" placeholder="请选择机构类型">
            <el-option
              v-for="item in organizationTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="邮箱：">-->
          <!--<el-input suffix-icon="el-icon-date" v-model="queryForm.email" placeholder="请输入邮箱"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData">新增</el-button>
        <el-button plain @click="delSection">删除</el-button>
      </div>
      <el-table
        ref="dataTable"
        :data="records"
        @selection-change="handleSelectionChange"
        v-loading="loadingTable"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :height="tableHeight"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="organization"
          align="left"
          label="机构名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="code"
          align="left"
          label="机构编码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="creditCode"
          align="left"
          label="信用代码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="parentOrganization"
          align="left"
          label="上级机构"
          show-overflow-tooltip>
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.hasRiskReport ? '有' : '无'}}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="organizationType"
          align="left"
          label="机构类型"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="depthEvaluationTime"-->
        <!--align="center"-->
        <!--label="最终报告生成时间"-->
        <!--show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
        <!--{{scope.row.depthEvaluationTime | formatDate}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="organizationNature"
          align="left"
          label="机构性质"
          show-overflow-tooltip>
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.depthEvaluationTime | formatDate}}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="statusName"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <div :class="{'text-orange':scope.row.status==='0'}">{{scope.row.statusName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="操作">
          <template slot-scope="scope">
            <!--<el-tooltip class="item" effect="dark" content="编辑" :open-delay="openDelay" placement="top-start">-->
                <span class="opt-base"
                      @click="lookInfo(scope.row)" type="text" size="small">
                  查看
                  <!--<i class="el-icon-edit-outline"></i>-->
                </span>
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" content="修改" :open-delay="openDelay" placement="top-start">-->
              <span class="opt-base"
                    @click="editInfo(scope.row)" type="text" size="small">
                修改
                <!--<i class="el-icon-delete"></i>-->
              </span>
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" content="更多" :open-delay="openDelay" placement="top-start">-->
              <span class="opt-base opt-more" type="text" size="small">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <span>更多</span>
                    <i class="el-icon-arrow-down el-icon--right">
                    </i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{row:scope.row,act:'on'}">{{scope.row.status === '0' ? '启用' : '停用'}}</el-dropdown-item>
                    <el-dropdown-item :command="{row:scope.row,act:'resetPwd'}">重置密码</el-dropdown-item>
                    <el-dropdown-item :command="{row:scope.row,act:'setAdmin'}">设为管理员</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--<i class="el-icon-view"></i>-->
              </span>
            <!--</el-tooltip>-->
            <!--<el-button type="text" size="small">编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <!--<span class="demonstration">完整功能</span>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="page.sizes"
          :page-size="page.size"
          :layout="page.layout"
          :total="page.total"
          :pager-count="page.pagerCount"
          background>
        </el-pagination>
      </div>
    </div>
    <!--//添加机构-->
    <!--<el-dialog left :visible.sync="dialogFormVisible" width="624px">-->
      <!--<div slot="title" class="dialog-title">-->
        <!--<div><span class="green-line"></span>添加机构</div>-->
      <!--</div>-->
      <!--<el-form :model="addForm" :rules="addFormRules" ref="addForm" :label-width="formLabelWidth">-->
        <!--<el-form-item label="手机号码" prop="tel">-->
          <!--<el-input v-model="addForm.tel"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="姓名" prop="name">-->
          <!--<el-input v-model="addForm.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="密码" prop="password">-->
          <!--<el-input v-model="addForm.password"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="submitDialog('addForm')">确 定</el-button>-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
    <v-addOrganization ref="addOrganization" @reLoad="getData"></v-addOrganization>
    <!--//重置密码-->
    <!--<el-dialog left :visible.sync="resetPwdFormVisible" width="543px">-->
      <!--<div slot="title" class="dialog-title">-->
        <!--<div><span class="green-line"></span>重置密码</div>-->
      <!--</div>-->
      <!--<el-form class="resetPwdForm" :model="resetPwdForm" :rules="resetPwdFormRules" ref="resetPwdForm" :label-width="formLabelWidth">-->
        <!--<el-form-item label="新密码" prop="newPassword">-->
          <!--<el-input v-model="resetPwdForm.newPassword"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="submitResetDialog('resetPwdForm')">确 定</el-button>-->
        <!--<el-button @click="resetPwdFormVisible = false">取 消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { formatDate } from '@/assets/js/date.js'
import { getOrganizationalInfo } from '@/assets/js/API/api'
import AddOrganization from './dialog/addOrganization'

export default {
  name: 'enterpriseList',
  data () {
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
      tableHeight: 'calc(100% - 130px)',
      queryForm: {
        tel: '',
        name: '',
        organization: '',
        email: '',
        organizationType: '',
        status: ''
      },
      queryFormRules: {
        tel: [
          { validator: validateContactWay, trigger: 'change' }
        ]
      },
      statusOptions: [{
        label: '启动',
        value: '1'
      }, {
        label: '停用',
        value: '2'
      }],
      organizationTypes: [{
        label: '机构类型1',
        value: '1'
      }, {
        label: '机构类型2',
        value: '2'
      }],
      openDelay: 500,
      records: [],
      loadingTable: false,
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        sizes: GLB_CONSTANT.page.sizes,
        prevText: GLB_CONSTANT.page.prevText,
        nextText: GLB_CONSTANT.page.nextText,
        layout: GLB_CONSTANT.page.layout,
        pagerCount: GLB_CONSTANT.page.pagerCount,
        total: 0
      },
      // dialog
      multipleSelection: [],
      dialogFormVisible: false,
      resetPwdFormVisible: false,
      resetPwdForm: {
        newPassword: ''
      },
      resetPwdFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      }
    }
  },
  created () {
    this.getData()
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  components: {
    'v-addOrganization': AddOrganization
  },
  methods: {
    enterpriseEntry () {
      this.$router.push(
        { path: '/enterpriseEntry' }
      )
    },
    queryData () {
      this.page.current = GLB_CONSTANT.page.current
      this.getData()
    },
    getData () {
      let _this = this
      // let url = 'enterpriseInfo/pageEnterpriseInfo'
      this.queryForm.current = this.page.current
      this.queryForm.size = this.page.size
      this.loadingTable = true
      getOrganizationalInfo(this.queryForm)
        .then(res => {
          _this.loadingTable = false
          this.page.total = res.data.data.total
          this.records = res.data.data.records
        }).catch(err => {
          _this.loadingTable = false
        })
    },
    addUserData () {
      // this.dialogFormVisible = true
      this.$refs.addOrganization.show('')
    },
    handleCurrentChange (index) {
      this.page.current = index
      this.getData()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
    },
    lookInfo (row) {
    },
    delSection () {
      if (this.multipleSelection.length) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let rows = this.multipleSelection
          let _this = this
          if (rows) {
            rows.forEach(row => {
              _this.records.forEach((val, index) => {
                if (row.id === val.id) {
                  _this.records.splice(index, 1)
                }
              })
            })
            rows = []
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        COMMONJS.showToast('请先选择删除选项', 'info')
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    submitDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handleCommand (command) {
      if (command.act === 'on') {
        this.enableONOFF(command.row)
        // COMMONJS.getLoginOut()
      } else if (command.act === 'resetPwd') {
        this.resetPwdFormVisible = true
        // this.$router.push('/changePassword')
      } else if (command.act === 'setAdmin') {
      }
    },
    submitResetDialog (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetPwdFormVisible = false
        } else {
          return false
        }
      })
    },
    enableONOFF (rowData) {
      if (rowData) {
        this.$confirm('确认' + (rowData.status === '0' ? '启用' : '停用') + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rowData.status = rowData.status === '0' ? '1' : '0'
          rowData.statusName = rowData.status === '1' ? '启用' : '停用'
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
