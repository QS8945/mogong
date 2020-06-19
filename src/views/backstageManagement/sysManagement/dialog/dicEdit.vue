<template>
    <el-dialog :title="$t('elForm.add')+$t('dicMange.dicName')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="100px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('dicMange.code')+':'" prop="code">
                        <el-input v-model="tableForm.code" :placeholder="$t('elForm.input')+$t('dicMange.code')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('dicMange.name')+':'" prop="name">
                        <el-input v-model="tableForm.name" :placeholder="$t('elForm.input')+$t('dicMange.name')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('dicMange.sortNum')+':'" prop="sortNum">
                        <el-input v-model="tableForm.sortNum"
                                  :placeholder="$t('elForm.input')+$t('dicMange.sortNum')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('dicMange.remark')+':'" prop="remark">
                        <el-input v-model="tableForm.remark" :placeholder="$t('elForm.input')+$t('dicMange.remark')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="saveData('tableForm')">{{$t('button.save')}}</el-button>
                <el-button @click="handleClose">{{$t('button.cancel')}}</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import { saveSysDictionary, getSysDictionary } from '@/assets/js/API/api'
export default {
  name: 'dic',
  data () {
    return {
      dialogVisible: false,
      dataId: '',
      tableForm: {
        code: '',
        custom: 1,
        enabled: 1,
        id: '',
        name: '',
        typeCode: ''
      },
      rules: {
        code: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('dicMange.typecode'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('dicMange.typename'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {},
  mounted: function () { },
  methods: {
    // 提供给父组件调用
    show: function (id, code) {
      this.dialogVisible = true
      this.tableForm = {
        code: '',
        custom: 1,
        enabled: 1,
        id: '',
        name: '',
        typeCode: ''
      }
      this.$nextTick(() => {
        this.tableForm.typeCode = code
        if (id) {
          this.dataId = id
          this.initData()
        }
      })
    },
    initData: function () {
      // var requestStr = 'sysDictionary/getSysDictionary'
      var params = { id: this.dataId }
      getSysDictionary(params).then(res => {
        this.tableForm = res.data
      }).catch(() => {
      })
      // v.get(requestStr, params)
      //   .then(res => {
      //     this.tableForm = res.data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    saveData: function (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          // var requestStr = 'sysDictionary/saveSysDictionary'
          saveSysDictionary(self.tableForm).then(res => {
            COMMONJS.showToast(self.$t('validate.saveSuccess'))
            self.handleClose()
            self.$emit('reLoad', self.tableForm)
          }).catch(() => {
          })
          // v.post(requestStr, self.tableForm)
          //   .then(res => {
          //     v.showSuccessToast(self.$t('validate.saveSuccess'))
          //     self.$emit('reLoad', self.tableForm)
          //     self.handleClose()
          //   })
          //   .catch(error => {
          //     self.$message.error(error)
          //   })
        }
      })
    },
    handleClose: function () {
      this.dialogVisible = false
      this.$refs.tableForm.resetFields()
    }
  }
}
</script>

<style>
</style>
