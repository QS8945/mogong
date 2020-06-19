<template>
    <el-dialog class="simple-dialog" :title="$t('elForm.query')+$t('appUpdateManagement.remark')" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
        <div slot="title" class="dialog-title"></div>
        <el-form ref="tableForm" :model="tableForm" label-width="100px" label-position="right" :rules="rules">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item :label="$t('appUpdateManagement.remark')+':'" prop="remark">
                        <el-input :disabled="true" v-model="tableForm.remark" type="textarea" :rows="2" :placeholder="$t('elForm.input')+$t('appUpdateManagement.remark')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import { editSysAppUpdatePage, addSysAppUpdatePage } from '@/assets/js/API/api'
export default {
  name: 'dic',
  data () {
    return {
      dialogVisible: false,
      fileVisible: false,
      dataId: '',
      tableForm: {
        version: '',
        description: '',
        remark: '',
        release: 0,
        currentVersion: 0,
        forcedUpdate: 0,
        address: ''
      },
      rules: {
        version: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('appUpdateManagement.version'),
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message:
                            this.$t('elForm.input') +
                            this.$t('appUpdateManagement.description'),
            trigger: 'blur'
          }
        ]
      },
      dataparams: {},
      fileType: ['apk'],
      dialogform: {
        attachmentList: []
      }
    }
  },
  props: {},
  mounted: function () { },
  methods: {
    // 提供给父组件调用
    show: function (item, code) {
      this.dialogVisible = true
      this.tableForm = {
        version: '',
        description: '',
        remark: '',
        release: 0,
        currentVersion: 0,
        forcedUpdate: 0,
        address: ''
      }
      this.$nextTick(() => {
        this.tableForm.typeCode = code
        if (item) {
          // this.dataId = id;
          // this.initData();
          this.tableForm = JSON.parse(JSON.stringify(item))
          let file = {
            id: JSON.parse(JSON.stringify(item.address)),
            fileName: '安装包'
          }
          this.dialogform.attachmentList[0] = JSON.parse(JSON.stringify(file))
          this.fileVisible = true
        } else {
          this.fileVisible = true
        }
      })
    },
    getUploadList: function (val) {
      this.dialogform.attachmentList = val
    },
    // initData: function () {
    //     var requestStr = "sysDictionary/getSysDictionary";
    //     var params = { id: this.dataId };
    //     v.get(requestStr, params)
    //         .then(res => {
    //             this.tableForm = res.data;
    //         })
    //         .catch(error => {
    //             this.$message.error(error);
    //         });
    // },
    saveData: function (formName) {
      var self = this
      self.$refs[formName].validate(function (valid) {
        if (valid) {
          self.dialogform.attachmentList[0] && (self.tableForm.address = self.dialogform.attachmentList[0].id)
          // console.log(this.dialogform.attachmentList.id)
          // self.tableForm.address = dialogform.attachmentList
          // var requestStr
          if (self.tableForm.id) {
            editSysAppUpdatePage(self.tableForm).then(res => {
              COMMONJS.showToast(self.$t('validate.saveSuccess'))
              self.$emit('reLoad', self.tableForm)
              self.handleClose()
            }).catch(() => {
            })
          } else {
            addSysAppUpdatePage(self.tableForm).then(res => {
              COMMONJS.showToast(self.$t('validate.saveSuccess'))
              self.$emit('reLoad', self.tableForm)
              self.handleClose()
            }).catch(() => {
            })
          }
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
      this.dialogform.attachmentList = []
      this.$refs.tableForm.resetFields()
    }
  }
}
</script>

<style>
    .simple-dialog .el-dialog__header{
        border-bottom: none;
    }
</style>
