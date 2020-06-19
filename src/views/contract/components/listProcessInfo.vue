<template>
  <el-table size="mini" :data="tableData" style="width: 100%">
    <el-table-column label="顺序" type="index" width="50">
    </el-table-column>
    <el-table-column prop="hisActInsActName" label="执行环节" width="100">
    </el-table-column>
    <el-table-column prop="assigneeName" label="执行人" width="120">
    </el-table-column>
    <el-table-column prop="createTime" label="开始时间" width="200">
    </el-table-column>
    <el-table-column prop="endTime" label="结束时间" width="200">
    </el-table-column>
    <el-table-column prop="comment" label="提交意见">
    </el-table-column>
    <el-table-column prop="hisActInsDuTime" label="任务历时" width="120">
    </el-table-column>
  </el-table>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    listHistoicFlow,
    getPrimaryKeyByProcInsId
  } from '@/assets/js/API/api'

  export default {
    name: 'listProcessInfo',
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
        checkObjP: {},
        statusOptions: [{
          label: '启动',
          value: '1'
        }, {
          label: '停用',
          value: '2'
        }],
        openDelay: 500,
        tableData: [],
        page: {
          current: GLB_CONSTANT.page.current,
          size: GLB_CONSTANT.page.size,
          total: 0
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
    components: {},
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
      procInsId: { // 默认数据
        type: String
      },
    },
    methods: {
      enterpriseEntry() {
        this.$router.push({
          path: '/enterpriseEntry'
        })
      },
      selectChange(data) {
        this.selectItems = data;
      },
      selectWaste() {
        this.$emit('changeSelDialogVisible', this.selectItems)
      },
      queryData() {
        this.page.current = GLB_CONSTANT.page.current
        this.getData()
      },
      getData() {
        let _this = this
        let postData = {
          procInsId: _this.procInsId
        }
        listHistoicFlow(postData)
          .then(res => {
            _this.tableData = res.data
            _this.tableData.forEach(element => {
              if (element.comment == '' || element.comment == null) {
                if (element.hisActInsActName == '开始') {
                  element.comment = '请审批';
                }
                if (element.hisActInsActName == '结束') {
                  element.comment = '完成审批';
                }
              }
            });
          }).catch(() => {})
      }
    }
  }

</script>

<style lang="scss">
  .el-form-item.is-success .el-input__inner {
    border: 1px solid #DCDFE6;
  }

</style>
