<template>
  <el-dialog left :visible.sync="dialogVisible" width="60vw">
    <div slot="title" class="dialog-title">
      <div><span class="green-line"></span>{{$t('orgMange.addOrg')}}</div>
    </div>
    <el-form :model="tableForm" :rules="formRules" ref="form" :label-width="formLabelWidth">
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.name')" prop="name">
            <el-input v-model="tableForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.code')" prop="code">
            <el-input v-model="tableForm.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.socialCreditCode')" >
            <el-input v-model="tableForm.creditCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.parentOrgName')" prop="parentId">
            <el-cascader :options="orgsTreeList" clearable change-on-select :show-all-levels="false" v-model="tableForm.upIds" placeholder="" :props="props" ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.category')" prop="category">
            <el-select v-model="tableForm.category" :placeholder="this.$t('elForm.select') + this.$t('orgMange.category')">
              <el-option v-for="item in categoryOptions" :key="item.code"  :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item :label="$t('orgMange.type')" prop="type">
            <el-select v-model="tableForm.type" :placeholder="this.$t('elForm.select') + this.$t('orgMange.type')">
              <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" >
          <el-form-item :label="$t('orgMange.remark')" prop="remark">
            <el-input v-model="tableForm.remark" type="textarea" :autosize='{ minRows: 2, maxRows: 4}'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog('form')">{{$t('messageBox.confirm')}}</el-button>
      <el-button @click="handleClose('form')">{{$t('button.cancel')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { sysOrgsFind, sysListDictionary, sysOrgsTree, sysOrgsAdd } from '@/assets/js/API/api'
export default {
  name: 'addOrganization',
  data () {
    return {
      dialogVisible: false,
      tableForm: {
        id: '',
        name: '',
        code: '',
        type: '0',
        creditCode: '',
        parentId: '',
        category: '',
        property: '',
        upIds: []
      },
      formLabelWidth: '120px',
      orgsTreeList: [],
      categoryOptions: [],
      typeOptions: [{ name: '普通机构', code: '0' }, { name: '系统机构', code: '1' }],
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      formRules: {
        name: [{ required: true, message: this.$t('elForm.input') + this.$t('orgMange.name'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('elForm.input') + this.$t('orgMange.type'), trigger: 'blur' }],
        code: [{ required: true, message: this.$t('elForm.input') + this.$t('orgMange.code'), trigger: 'blur' }],
        creditCode: [{ required: true, message: this.$t('elForm.input') + this.$t('orgMange.socialCreditCode'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 提供给父组件调用
    show (id) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.tableForm = {
          id: '',
          name: '',
          code: '',
          type: '0',
          creditCode: '',
          parentId: '',
          upIds: localStorage.getItem('userInfo') ? [JSON.parse(localStorage.getItem('userInfo')).orgId] : [],
          category: '',
          property: ''
        }
        this.picklist(id)
        if (id) {
          this.initData(id)
        }
      })
    },
    initData: function (id) {
      // let requestStr = 'sysOrgs/find'
      let queryForm = {
        id: id
      }
      sysOrgsFind(queryForm).then(res => {
        if (res.data.upIds == null) { res.data.upIds = [] }
        this.tableForm = res.data
      }).catch(() => {
      })
      // v.post(requestStr, queryForm)
      //   .then(res => {
      //     if (res.data.upIds == null) { res.data.upIds = [] }
      //     this.tableForm = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    picklist: function (id) {
      this.listSysDictionary('orgCategory', '')
      this.listOrgsTree(id)
    },
    // 字典服务
    listSysDictionary: function (dictionaryTypeCode, parentCode) {
      // v.listSysDictionaryNew(dictionaryTypeCode, parentCode).then(res => {
      //   if (dictionaryTypeCode == 'orgCategory') {
      //     this.categoryOptions = res.data
      //   }
      // })
      const params = { typeCode: dictionaryTypeCode, parentCode: parentCode }
      sysListDictionary(params).then(res => {
        if (dictionaryTypeCode === 'orgCategory') {
          this.categoryOptions = res.data
        }
      }).catch(() => {
      })
    },
    listOrgsTree: function (id) {
      // let requestStr = 'sysOrgs/tree'
      sysOrgsTree().then(res => {
        this.orgsTreeList = this.handleList(res.data)
      }).catch(() => {
      })
      // v.post(requestStr, { id: id })
      //   .then(res => {
      //     this.orgsTreeList = this.handleList(res.data)
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    handleList: function (array) {
      for (let arr of array) {
        if (arr.children && arr.children.length === 0) { arr.children = null }
        if (arr.children && arr.children.length > 0) { this.handleList(arr.children) }
      }
      return array
    },
    submitDialog (formName) {
      let _this = this
      _this.$refs[formName].validate(function (valid) {
        if (valid) {
          // let requestStr = 'sysOrgs/add'
          if (_this.tableForm.upIds.length > 0) { _this.tableForm.parentId = _this.tableForm.upIds[_this.tableForm.upIds.length - 1] } else { _this.tableForm.parentId = '' }
          let params = _this.tableForm
          _this.loading = true
          sysOrgsAdd(params).then(res => {
            _this.handleClose(formName)
            _this.loading = false
            _this.$message.success('保存成功')
            _this.$emit('reLoad')
          }).catch(() => {
            _this.loading = false
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     _this.handleClose(formName)
          //     _this.loading = false
          //     _this.$message.success('保存成功')
          //     _this.$emit('reLoad')
          //   })
          //   .catch(error => {
          //     _this.loading = false
          //     _this.$message.error(error)
          //   })
        }
      })
    },
    handleClose (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
</style>
