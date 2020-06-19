<template>
  <div class="view-total baseForm">
    <div class="table-form">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
        <el-form-item label="贮存点编号：">
          <el-input v-model="queryForm.storageCode" @keyup.enter.native="queryData" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="贮存点名称：">
          <el-input v-model="queryForm.storageName" @keyup.enter.native="queryData" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="queryData">查询</el-button>
        </el-form-item>
        <!--<el-form-item class="form-item-btn">-->
          <!--<el-button @click="queryData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="table-content">
      <div class="table-content-opt">
        <el-button type="primary" @click="addUserData">新增</el-button>
        <!--<el-button plain @click="delSection">删除</el-button>-->
      </div>
      <el-table
              :data="records.records"
              style="width: 100%"
              :height="tableHeight"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              row-key="id"
              lazy
              :load="load">
        <el-table-column
                prop="code"
                label="贮存点编码"
                width="180"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="name"
                label="贮存点名称"
                width="180"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="typeCode"
                label="贮存点类型"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="capacity"
                label="容量"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="size"
                label="面积"
                :show-overflow-tooltip="true"
                align="right">
        </el-table-column>
        <el-table-column
                prop="capacityUnit"
                label="计量单位"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="technology"
                label="贮存工艺"
                :show-overflow-tooltip="true"
                align="center">
        </el-table-column>
        <el-table-column
                prop="operation"
                label="操作"
                align="center">
          <template slot-scope="scope">
            <div class="opt-group">
                            <span class="opt-base"
                                  @click="operationP(scope.row, 'query')" type="text" size="small">
                              查看
                            </span>
              <span class="opt-base"
                    @click="operationP(scope.row, 'update')" type="text" size="small">
                                编辑
                            </span>
              <span class="opt-base"
                    @click="operationP(scope.row, 'delete')" type="text" size="small">
                                删除
                            </span>
              <span class="opt-base opt-more"
                    @click="operationP(scope.row, 'addChild')" type="text" size="small">
                                新增
                            </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<v-table :dataTable="records" :loadingTable="loadingTable" :selection="false" @operation="operationP"></v-table>-->
      <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                      @reloadSize="jumpSize"></v-pagination>
      </div>
    </div>
    <!--//添加危废信息-->
    <div v-if="dialogFormVisible">
      <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
        <div slot="title" class="dialog-title">
          <div><span class="green-line"></span>{{dialogFormTitle}}仓库</div>
        </div>
        <v-add-storage-point :checkObj="checkObjP" @changeDialogFormVisible="changeDialogFormVisibleP" @reload="reloadP"></v-add-storage-point>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import AddStoragePoint from '@/views/baseDataManagement/dialog/addStoragePoint'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { getStorage, deleteStorage } from '@/assets/js/API/api'

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
      tableHeight: '100%',
      queryForm: {
        storageCode: '',
        storageName: ''
      },
      checkObjP: {},
      dialogFormTitle: '添加',
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
      openDelay: 500,
      records: {},
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      },
      // dialog
      multipleSelection: [],
      dialogFormVisible: false,
      addForm: {
        tel: '',
        name: '',
        password: ''
      },
      addFormRules: {
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: validateContactWay, trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: checkPwd, trigger: 'change' }]
      },
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
  components: {
    // 'v-table': CustomTable,
    'v-pagination': Pagination,
    'v-add-storage-point': AddStoragePoint
  },
  created () {
    this.getData()
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
      let postData = {
        entId: localStorage.getItem('id'),
        current: this.page.current,
        size: this.page.size,
        storageCode: this.queryForm.storageCode,
        storageName: this.queryForm.storageName
      }
      getStorage(postData)
        .then(res => {
          // res.data.tableHead = [{
          //   'value': 'code',
          //   'name': '贮存点编码'
          // }, {
          //   'value': 'name',
          //   'name': '贮存点名称'
          // }, {
          //   'value': 'typeCode',
          //   'name': '贮存点类型'
          // }, {
          //   'value': 'capacity',
          //   'name': '容量'
          // }, {
          //   'value': 'size',
          //   'name': '面积'
          // }, {
          //   'value': 'capacityUnit',
          //   'name': '计量单位'
          // }, {
          //   'value': 'technology',
          //   'name': '贮存工艺'
          // }, {
          //   'value': 'operation',
          //   'name': '操作'
          // }]
          _this.records = res.data
          _this.page.total = res.data.total
        }).catch(() => {
        })
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
      // this.$emit('reload', 3)
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
      // this.$emit('reload', 3)
    },
    changeDialogFormVisibleP (val) {
      this.dialogFormVisible = val
    },
    reloadP (val) {
      val && this.getData()
      this.dialogFormVisible = false
    },
    operationP (data, opt) {
      switch (opt) {
        case 'query':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data))
          this.dialogFormTitle = '查看'
          this.dialogFormVisible = true
          break
        case 'update':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data))
          this.dialogFormTitle = '更新'
          this.dialogFormVisible = true
          break
        case 'addChild':
          this.checkObjP.type = opt
          this.checkObjP.data = JSON.parse(JSON.stringify(data))
          this.dialogFormTitle = '新增子'
          this.dialogFormVisible = true
          break
        case 'delete':
          this.delSection(data)
          break
      }
    },
    addUserData () {
      this.dialogFormTitle = '新增'
      this.checkObjP = {
        type: 'add',
        data: {}
      }
      this.dialogFormVisible = true
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
      console.log(row)
    },
    delSection (obj) {
      let _this = this
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          storageId: obj.id
        }
        console.log(postData)
        deleteStorage(postData).then(res => {
          COMMONJS.showToast('删除成功')
          _this.getData()
        }).catch(() => {
        })
      })
    },
    load (tree, treeNode, resolve) {
      console.log(tree)
      getStorage({
        entId: localStorage.getItem('id'),
        parentId: tree.id
      }).then(res => {
        var records = res.data.records
        resolve(records)
      }).catch(() => {
      })
      // resolve([{ 'id': '11a67e5154a3437d8164aca99d03a448', 'entId': '2065474926544896', 'name': '测试1', 'code': 'a', 'codeLink': '', 'parentId': ' ', 'rootId': ' ', 'capacity': null, 'description': null, 'address': null, 'typeCode': '仓库', 'size': null, 'sizeUnit': null, 'capacityConversion': null, 'capacityUnit': null, 'chargeEmpId': null, 'chargeEmp': null, 'tel': null, 'longitude': null, 'latitude': null, 'technology': null, 'allowZeroInventory': null, 'status': null, 'remark': null, 'createUserId': null, 'createTime': null, 'updateUserId': null, 'updateTime': null, 'valid': null, 'hasChildren': false }, { 'id': '1bd47f4ab7ab41048ea6695ac44351f7', 'entId': '2065474926544896', 'name': '测试2', 'code': 'c', 'codeLink': '', 'parentId': ' ', 'rootId': ' ', 'capacity': null, 'description': null, 'address': null, 'typeCode': '仓库', 'size': 2.0, 'sizeUnit': null, 'capacityConversion': null, 'capacityUnit': null, 'chargeEmpId': null, 'chargeEmp': null, 'tel': null, 'longitude': null, 'latitude': null, 'technology': null, 'allowZeroInventory': null, 'status': null, 'remark': null, 'createUserId': null, 'createTime': null, 'updateUserId': null, 'updateTime': null, 'valid': null, 'hasChildren': false }, { 'id': '68e767b8a838436c95d4d5187e7ca4dd', 'entId': '2065474926544896', 'name': '测试3', 'code': '1', 'codeLink': '', 'parentId': '', 'rootId': '', 'capacity': null, 'description': null, 'address': null, 'typeCode': '仓库', 'size': 1.0, 'sizeUnit': null, 'capacityConversion': null, 'capacityUnit': '1', 'chargeEmpId': null, 'chargeEmp': '1', 'tel': '18013179093', 'longitude': null, 'latitude': null, 'technology': '1', 'allowZeroInventory': null, 'status': null, 'remark': null, 'createUserId': null, 'createTime': null, 'updateUserId': null, 'updateTime': null, 'valid': null, 'hasChildren': false }, { 'id': '8047525f3d724fc59b2fc409452ac4da', 'entId': '2065474926544896', 'name': '垃圾分类场', 'code': 'b', 'codeLink': '', 'parentId': null, 'rootId': null, 'capacity': 700.0, 'description': null, 'address': null, 'typeCode': null, 'size': 700.0, 'sizeUnit': null, 'capacityConversion': null, 'capacityUnit': '吨', 'chargeEmpId': null, 'chargeEmp': '金旭东', 'tel': '0599-6105656', 'longitude': null, 'latitude': null, 'technology': null, 'allowZeroInventory': null, 'status': null, 'remark': null, 'createUserId': null, 'createTime': null, 'updateUserId': null, 'updateTime': null, 'valid': null, 'hasChildren': true }, { 'id': '8a4c07b27b2c425796e53b398a019212', 'entId': '2065474926544896', 'name': '危废贮存仓库', 'code': 'd', 'codeLink': '', 'parentId': null, 'rootId': null, 'capacity': 50.0, 'description': null, 'address': null, 'typeCode': null, 'size': 50.0, 'sizeUnit': null, 'capacityConversion': null, 'capacityUnit': '吨', 'chargeEmpId': null, 'chargeEmp': '丁伟明', 'tel': '18750952599', 'longitude': null, 'latitude': null, 'technology': null, 'allowZeroInventory': null, 'status': null, 'remark': null, 'createUserId': null, 'createTime': null, 'updateUserId': null, 'updateTime': null, 'valid': null, 'hasChildren': false }])
    }
  }
}
</script>

<style lang="scss">
  .form-format{
    .el-input-group__append .el-input {
      width: 130px;
    }
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
  }
</style>
