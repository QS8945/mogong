<template>
    <el-dialog :title="$t('elForm.add')+$t('dicMange.dicType')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
        <el-form ref="tableForm" :model="tableForm" label-width="120px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('dicMange.typeName')+':'" prop="name">
                        <el-input v-model="tableForm.name" :placeholder="$t('elForm.input')+$t('dicMange.typeName')"></el-input>
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('dicMange.typeCode')+':'" prop="code">
                        <el-input v-model="tableForm.code" :placeholder="$t('elForm.input')+$t('dicMange.typeCode')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item :label="$t('dicMange.remark')+':'" prop="remark">
                        <el-input v-model="tableForm.remark" type="textarea" :placeholder="$t('elForm.input')+$t('dicMange.remark')"></el-input>
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
import { saveSysDictionaryType, getSysDictionaryType } from '@/assets/js/API/api'
export default {
  name: 'dicType',
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
        code: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('dicMange.typeCode'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('dicMange.typeName'),
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
    show: function (id) {
      this.dialogVisible = true
      this.tableForm = {
        code: '',
        custom: 1,
        enabled: 1,
        id: '',
        name: ''
      }
      this.$nextTick(() => {
        if (id) {
          this.dataId = id
          this.initData()
        }
      })
    },
    initData: function () {
      // var requestStr = 'sysDictionaryType/getSysDictionaryType'
      var params = { id: this.dataId }
      getSysDictionaryType(params).then(res => {
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
          // var requestStr = 'sysDictionaryType/saveSysDictionaryType'
          saveSysDictionaryType(self.tableForm).then(res => {
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
