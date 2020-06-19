<template>
  <div class="view-total baseForm">
    <div>
      <div class="attachOperate">
        <el-upload class="upload-demo" :action="uploadServer" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
          multiple :limit="100" :before-upload="beforeUpload" :on-exceed="handleExceed" :on-success="handleSuccess" :file-list="fileList"
          :show-file-list="false">
          <el-button type="text" icon="el-icon-plus">上传文件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传以下格式的文件：doc|docx|xls|xlsx|ppt|pptx|jpg|jpeg|gif|png|bmp|pdf|txt|zip|rar</div> -->
        </el-upload>
        <div style="margin-left:10px;">
          <el-button type="text" :disabled="!isEditFileDesc" icon="el-icon-edit" @click="saveFileDesc">保存描述</el-button>
          <!-- <el-button type="text" icon="el-icon-search">查看</el-button> -->
          <el-button type="text" :disabled="!(multipleSelection&&multipleSelection.length>0)" @click="deleteFiles" icon="el-icon-delete">删除</el-button>
        </div>
        <div style="float:right">
          <el-date-picker style="width:150px;" v-model="queryForm.startDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期" :picker-options="pickerOptions">
          </el-date-picker>
          <el-date-picker style="width:150px;" v-model="queryForm.endDate" type="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
          <el-input style="width:150px;margin-left:5px;" v-model="queryForm.fileName" @keyup.enter.native="queryData" placeholder="请输入文件名称"></el-input>
          <el-button style="margin-left:5px;" type="primary" @click="queryData">查询</el-button>
        </div>
      </div>
      <el-table size="mini" @cell-click="cellClick" ref="multipleTable" :data="tableData" style="width: 100%" height="250" @selection-change="handleSelectionChange">
        <el-table-column label="顺序" type="index" width="50">
        </el-table-column>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称" width="220">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p> {{ scope.row.fileName}}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" @click="downLoadFile(scope.row.id)">
                  {{ scope.row.fileName }}
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" label="业务类型" width="120">
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" width="120">
        </el-table-column>
        <el-table-column prop="fileDesc" label="文件描述">
          <template slot-scope="scope">
            <div v-if="isEditFileDesc">
              <el-input maxlength=50 type="textarea" v-model="scope.row.fileDesc">
              </el-input>
            </div>
            <div v-else>{{scope.row.fileDesc}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createUserName" label="创建人" width="120">
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建日期" width="180">
        </el-table-column>
        </el-table-column>
      </el-table>
      <div class="block">
        <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import AddWaste from '@/views/baseDataManagement/dialog/addWaste'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    formatDate
  } from '@/assets/js/date.js'
  import {
    pageFileList,
    saveFileList,
    deleteFileList
  } from '@/assets/js/API/api'

  export default {
    name: 'signAttachList',
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
        isEditFileDesc: false,
        fileDesc: '',
        fileList: [],
        uploadServer: GLB_CONSTANT.devUrl.fileServer + 'uploadFile',
        tableData: [],
        queryForm: {
          valid: false,
          classCode: '',
          wasteCode: '',
          entWasteName: ''
        },
        checkObjP: {},
        dialogFormTitle: '添加',
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
      'v-pagination': Pagination
    },
    created() {
      this.uploadServer += "?sourceType=contract&sourceId=" + this.headId;
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
      }
    },
    methods: {
      deleteFiles() {
        let _this = this
        this.$confirm('确认删除所勾选的文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          _this.multipleSelection.forEach(element => {
            postData.push(element.id);
          });
          deleteFileList(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      saveFileDesc() {
        let postData = this.tableData;
        saveFileList(postData)
          .then(res => {
            this.getData();
            COMMONJS.showToast('保存成功');
            this.isEditFileDesc = false;
          }).catch(() => {})
      },
      cellClick(row, column, cell, event) {
        this.isEditFileDesc = true;
      },
      downLoadFile(fileId) {
        window.open(GLB_CONSTANT.devUrl.fileServer + 'downloadFile?fileId=' + fileId);
      },
      beforeUpload(file) {},
      handleSuccess(response, file, fileList) {
        COMMONJS.showToast('上传成功');
        this.getData();
        this.getFilesList(fileList);
      },
      getFilesList(fileList) {
        let urls = []
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].id) {
            urls.push({
              id: fileList[i].id
              // fileName: fileList[i].name
            })
          } else {
            urls.push({
              id: fileList[i].response.data.id
              // fileName: fileList[i].response.data.fileName
            })
          }
        }
        return urls
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
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
            // this.dialogFormTitle = '发起'
            // this.dialogFormVisible = true
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

  .attachOperate div {
    float: left
  }

</style>
