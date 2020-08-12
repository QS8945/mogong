<template>
  <div class="bussiness-info">
    <el-dialog
      class="img-dialog"
      :visible.sync="dialogImgVisible"
    >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-form ref="form" :model="form" :rules="formRules" label-width="20%">
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">企业基本信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="20">
              <el-form-item label="企业号：">
                <div>{{form.businessCode}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="企业logo：" :prop="(checkObj.type==='query') ? '' : 'businessLogo'">
                <v-upload
                  :headers="headers"
                  clearable
                  :disabled="checkObj.type === 'query'"
                  ref="businessLogo"
                  @changeFiles="changeFilesBusinessLogo"
                  @pictureCardPreview="pictureCardPreviewP"
                ></v-upload>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="企业名称：" :prop="(checkObj.type==='query') ? '' : 'businessName'">
                  <el-input
                    :disabled="
                      checkObj.type === 'query'
                    "
                    clearable
                    placeholder="请输入企业名称"
                    v-model="form.businessName"
                  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="企业简称：" :prop="(checkObj.type==='query') ? '' : 'businessAbbre'">
                  <el-input
                    :disabled="
                      checkObj.type === 'query'
                    "
                    clearable
                    placeholder="请输入企业简称"
                    v-model="form.businessAbbre"
                  ></el-input>
                  <div style="color: rgba(166, 166, 166, 1)">注：系统上显示简称</div>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="企业电话：" :prop="(checkObj.type==='query') ? '' : 'businessPhone'">
                  <el-input
                    :disabled="
                      checkObj.type === 'query'
                    "
                    clearable
                    placeholder="请输入企业电话"
                    v-model="form.businessPhone"
                  ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="item-body-footer">
            <el-button type="primary" @click="saveData('form')">保存</el-button>
            <!-- <el-button>取消</el-button> -->
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Upload from '@/components/uploadFile'
import { } from '@/assets/js/API/api'

export default {
  name: 'businessBaseInfo',
  data () {
    let validatePhoneTwo = (rule, value, callback) => {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/
      if (value == '' || value == undefined || value == null) {
        callback()
      } else {
        if ((!reg.test(value)) && value != '') { 
          callback(new Error('请输入正确的电话号码或者固话号码')); 
        } else {
          callback(); 
        }
      }
    }
    return {
      headers: { Authorization: sessionStorage.getItem("token") },
      form: {
        businessCode: 'HXZJ',
        businessLogo: [],
        businessName: '',
        businessAbbre: '',
        businessPhone: ''
      },
      formRules: {
        businessLogo: [{ required: true, message: '请输入', trigger: 'blur' }],
        businessName: [
          { required: true, message: '请输入', trigger: 'change' },
          { min: 30, max: 30, message: '长度在 30 个字符', trigger: 'blur' }],
        businessAbbre: [{ required: true, message: '请输入', trigger: 'change' }],
        businessPhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { validator: validatePhoneTwo, trigger: 'change' }],
      },
      checkObj: {},
      dialogImgVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
    // this.getListStorageInfo()
    // console.log('init')
    // this.getData()
    // // this.getSysCanton()
    // this.getCodeAndNameDicEntProperty()
    // this.getFlag()
  },
  components: {
    "v-upload": Upload
  },
  methods: {
    changeFilesBusinessLogo(obj) {
      this.form.businessLogo = JSON.parse(JSON.stringify(obj));
      this.$refs.form.clearValidate('businessLogo')
    },



    getFlag(){
      isEntInfoManger().then(res =>{
        this.flag = res.data
      })
    },
    getData () {
      let _this = this
      // this.fileList = [{
      //   name: 'food.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      // }, {
      //   name: 'food2.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/101'
      // }]
      let postData = {
        entId: localStorage.getItem('id')
      }
      getEnterpriseAndEnterpriseDetail(postData)
        .then(res => {
          if (res.data) {
            _this.editType = 'update'
            if (res.data.businessLicence) {
              _this.fileList = []
              _this.fileList = JSON.parse(res.data.businessLicence)
              // _this.fileList = [{ id: '7674dcfaf2d94fec8a87c29d717f422b' }]
            }
            _this.fileVisible = true
            res.data.longitude = res.data.longitude || ''
            res.data.latitude = res.data.latitude || ''
            if (res.data.cantonName) {
              res.data.cantonName = JSON.parse(res.data.cantonName)
            } else {
              res.data.cantonName = []
            }
            _this.form = res.data
            this.cantonVisible = true
          } else {
            _this.editType = 'add'
          }
        }).catch(() => {
        })
    },

    saveData (formName) {
      let _this = this
      let postData = JSON.parse(JSON.stringify(this.form))
      postData.businessLicence = JSON.stringify(this.fileList)
      // postData.businessLicence = this.fileList
      postData.cantonName = JSON.stringify(this.form.cantonName)
      postData.entId = localStorage.getItem('id')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.editType === 'add') {
            saveEnterpriseAndEnterpriseDetail(postData)
              .then(res => {
                COMMONJS.showToast('新增成功')
                _this.$refs[formName].resetFields()
                _this.form.latitude = ''
                _this.form.longitude = ''
                _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          } else if (_this.editType === 'update') {
            modifyEnterpriseAndEnterpriseDetail(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                _this.$refs[formName].resetFields()
                _this.form.latitude = ''
                _this.form.longitude = ''
                _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          }
          // this.$refs['verificationModeForm'].resetFields()
        } else {
          return false
        }
      })
      // console.log(this.form)
    },
    changeFilesP (obj) {
      this.fileList = JSON.parse(JSON.stringify(obj))
      // console.log(obj)
    },
    pictureCardPreviewP (obj) {
      let fileArray = obj.dialogImageUrl.split('.')
      if (fileArray[fileArray.length-1] === 'jpg' || fileArray[fileArray.length-1] === 'png') {
        this.dialogImageUrl = obj.dialogImageUrl;
        this.dialogImgVisible = obj.dialogVisible;
      } else if (fileArray[fileArray.length-1] === 'pdf' || fileArray[fileArray.length-1] === 'doc' || fileArray[fileArray.length-1] === 'docx') {
        window.open(obj.dialogImageUrl);
      } else {
        this.dialogImageUrl = obj.dialogImageUrl;
        this.dialogImgVisible = obj.dialogVisible;
      }
    },
    choosePosition () {
      if (this.chooseArea) {
        let searchKeyP = {
          value: this.form.name,
          lat: this.form.latitude,
          lng: this.form.longitude
        };
        // let searchKeyP = {
        //   value: this.form.name
        // };
        (searchKeyP.lat && searchKeyP.lng) || (searchKeyP.range = this.chooseArea)
        this.searchKeyP = searchKeyP
        this.mapVisible = true
      } else {
        COMMONJS.showToast('请您先选择行政区', 'warning')
      }
      //   .value = this.form.businessName
      // this.searchKeyP.value = this.form.businessName
      // this.searchKeyP.value = this.form.businessName
      // this.searchKeyP.value = this.form.businessName
    },
    closeMap () {
      this.mapVisible = false
    },
    changePositionP (obj) {
      this.form.longitude = obj.lng
      this.form.latitude = obj.lat
      this.mapVisible = false
    },
    getCodeAndNameDicEntProperty () {
      let _this = this
      let postData = {
        typeCode: 'entProperty'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.form.property || (_this.form.property = res.data[0].code)
          _this.properties = res.data
        }).catch(() => {
        })
    },
    changeCantonNameP (val, area) {
      this.chooseArea = area
      this.form.cantonName = val
    }
  }
}
</script>

<style lang="scss" scope>
  .bussiness-info {
    background: #fff;
    padding: 0 30px;
    flex-grow: 1;
    overflow: scroll;
    .el-form-item{
      text-align: left;
      .el-upload__tip{
        line-height: 12px;
      }
    }
    .item-header {
      padding: 13px 0;
      border-bottom: 1px solid #EEEEEE;
      .item-header-text {
        text-align: left;
        color: #555D66;
        font-size: 16px;
      }
    }
    .item-body {
        padding: 30px 50px;
        .item-body-footer{
          text-align: center;
        }
    }
  }
</style>
