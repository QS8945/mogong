<!-- 密码配置-->
<template>
    <el-dialog :title="$t('elForm.edit')+$t('sysChangePasswordConfigManage.name')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="120px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('sysChangePasswordConfigManage.frequency')+':'" prop="frequency">
                        <el-input v-model="tableForm.frequency" :placeholder="$t('elForm.input')+$t('sysChangePasswordConfigManage.frequency')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('sysChangePasswordConfigManage.unit')+':'" prop="unit">
                        <el-select v-model="tableForm.unit">
                            <el-option :label="$t('sysChangePasswordConfigManage.D')" value="D"></el-option>
                            <el-option :label="$t('sysChangePasswordConfigManage.M')" value="M"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('sysChangePasswordConfigManage.allowRepeatCountOfYear')+':'" prop="allowRepeatCountOfYear">
                        <el-input v-model="tableForm.allowRepeatCountOfYear" :placeholder="$t('elForm.input')+$t('sysChangePasswordConfigManage.allowRepeatCountOfYear')"></el-input>
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
import { sysChangePasswordConfigGet, sysChangePasswordConfigSave } from '@/assets/js/API/api'
export default {
  name: 'passWordConfig',
  data () {
    return {
      dialogVisible: false,
      dataId: '',
      tableForm: {
        code: '',
        custom: 1,
        enabled: 1,
        id: '',
        name: ''
      },
      rules: {
        frequency: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('sysChangePasswordConfigManage.frequency'),
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('sysChangePasswordConfigManage.unit'),
            trigger: 'blur'
          }
        ],
        allowRepeatCountOfYear: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t(
                              'sysChangePasswordConfigManage.allowRepeatCountOfYear'
                            ),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {},
  mounted: function () {},
  methods: {
    // 提供给父组件调用
    show: function (id) {
      this.dialogVisible = true
      this.$nextTick(() => {
        if (id) {
          this.dataId = id
          this.initData()
        }
      })
    },
    initData: function () {
      // var requestStr = 'sysChangePasswordConfig/get'
      var params = { id: this.dataId }
      sysChangePasswordConfigGet(params).then(res => {
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
          // var requestStr = 'sysChangePasswordConfig/save'
          sysChangePasswordConfigSave(self.tableForm).then(res => {
            COMMONJS.showToast(self.$t('validate.saveSuccess'))
            self.$emit('reLoad')
            self.handleClose()
          }).catch(() => {
          })
          // v.post(requestStr, self.tableForm)
          //   .then(res => {
          //     v.showSuccessToast(self.$t('validate.saveSuccess'))
          //     self.$emit('reLoad')
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
