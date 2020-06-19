<template>
  <div class="customer-manage bussiness-info">
    <el-button class="back-to-customer" type="text" @click="backToCustomer" plain><span class="icon iconfont iconfanhui"></span>返回</el-button>
    <el-tabs v-model="activeName" type="card" :before-leave="beforeClick">
      <el-tab-pane label="许可证基本信息" name="licenseBaseInfo">
        <v-license-base-info></v-license-base-info>
      </el-tab-pane>
      <el-tab-pane label="许可证危废信息" name="licenseWasteInfo" :lazy="true">
        <v-license-waste-info></v-license-waste-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import LicenseBaseInfo from '@/views/baseDataManagement/components/licenseBaseInfo'
import LicenseWasteInfo from '@/views/baseDataManagement/components/licenseWasteInfo'
import { saveEnterpriseAndEnterpriseDetail, getEnterpriseAndEnterpriseDetail, modifyEnterpriseAndEnterpriseDetail, getSysCanton, getCodeAndNameDic } from '@/assets/js/API/api'

export default {
  name: 'businessBaseInfo',
  data () {
    return {
      activeName: 'companyInfo',
      fileList: [],
      dialogImageUrl: '',
      // 预览
      dialogVisible: false,
      // 地图
      mapVisible: false,
      searchKeyP: {},
      form: {
        code: '',
        cantonName: [],
        name: '',
        abbreviation: '',
        socialCreditCode: '',
        address: '',
        legalPerson: '',
        financialSystemCode: '',
        equipmentAddress: '',
        longitude: '',
        latitude: '',
        contacts: '',
        contactsPhone: '',
        telephone: '',
        fax: '',
        postcode: '',
        startTime: '',
        property: '',
        epaName: '',
        floorSpace: '',
        staffNumber: '',
        registeredCapital: '',
        investment: '',
        openingBank: '',
        bankAccount: '',
        financialSystemNumber: '',
        yield: '',
        remark: ''
      },
      formRules: {
        businessNo: [{ required: true, message: '请输入', trigger: 'change' }],
        code: [{ required: true, message: '请输入', trigger: 'change' }],
        cantonName: [{ required: true, message: '请输入', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'change' }],
        socialCreditCode: [{ required: true, message: '请输入', trigger: 'change' }],
        equipmentAddress: [{ required: true, message: '请输入', trigger: 'change' }],
        epaName: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      props: {
        label: 'name',
        value: 'id',
        children: 'cities'
      },
      properties: [],
      cantonOptions: [],
      editType: '',
      chooseArea: '',
      fileVisible: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }]
      }
    }
  },
  mounted () {
    this.activeName = this.$route.query.activeName
    // this.getListStorageInfo()
    // this.getData()
    // this.getSysCanton()
    // this.getCodeAndNameDicEntProperty()
  },
  components: {
    'v-license-base-info': LicenseBaseInfo,
    'v-license-waste-info': LicenseWasteInfo
  },
  methods: {
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
            res.data.cantonName = res.data.cantonName || []
            if (!res.data.cantonName.length) {
              res.data.cantonName = []
            } else {
              res.data.cantonName = JSON.parse(res.data.cantonName)
            }
            _this.form = res.data
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
      this.dialogImageUrl = obj.dialogImageUrl
      this.dialogVisible = obj.dialogVisible
    },
    choosePosition () {
      if (this.chooseArea) {
        let searchKeyP = {
          value: this.form.name,
          lat: this.form.latitude,
          lng: this.form.longitude
        };
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
    getSysCanton () {
      // { parentId: 'c3e3e089-77d2-11e9-9917-60eb6907d626' }
      // let cantonName = this.form.cantonName
      this.getAreaRange('', 0)
    },
    getAreaRange (val, level) {
      let _this = this
      getSysCanton({ parentId: val })
        .then(res => {
          if (level === 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].level !== 3) {
                res.data[i].cities = []
              }
            }
            _this.cantonOptions = res.data
          }
          if (level === 1) {
            for (var j = 0; j < res.data.length; j++) {
              if (res.data[j].level !== 3) {
                res.data[j].cities = []
              }
            }
            for (var k = 0; k < _this.cantonOptions.length; k++) {
              if (_this.cantonOptions[k].id === val) {
                _this.cantonOptions[k].cities = res.data
              }
            }
          }
          if (level === 2) {
            for (var l = 0; l < _this.cantonOptions.length; l++) {
              for (var m = 0; m < _this.cantonOptions[l].cities.length; m++) {
                if (_this.cantonOptions[l].cities[m].id === val) {
                  _this.chooseArea = _this.cantonOptions[l].cities[m].name
                  _this.cantonOptions[l].cities[m].cities = res.data
                }
              }
            }
          }
          level++
          if (_this.form.cantonName.length > level && (level < 3)) {
            _this.getAreaRange(_this.form.cantonName[level - 1], level)
          }
        }).catch(() => {
        })
    },
    handleItemChange (val) {
      let _this = this
      let parentId = val[1] || val[0]
      getSysCanton({ parentId: parentId })
        .then(res => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].level !== 3) {
              res.data[i].cities = []
            }
          }
          // console.log(res)
          for (var j = 0; j < _this.cantonOptions.length; j++) {
            if (val.length > 1) {
              for (var k = 0; k < _this.cantonOptions[j].cities.length; k++) {
                if (_this.cantonOptions[j].cities[k].id === parentId) {
                  _this.chooseArea = _this.cantonOptions[j].cities[k].name
                  _this.cantonOptions[j].cities[k].cities = res.data
                }
              }
            } else {
              if (_this.cantonOptions[j].id === parentId) {
                _this.cantonOptions[j].cities = res.data
              }
            }
          }
        }).catch(() => {
        })
    },
    beforeClick (activeName, oldActiveName) {
      if (this.$route.query.type === 'add') {
        if (activeName === 'licenseWasteInfo') {
          COMMONJS.showToast('请先许可证基本信息', 'warning')
          return false
        }
      } else {
        let checkObjP = {}
        checkObjP.type = this.$route.query.type
        checkObjP.data = this.$route.query.data
        checkObjP.activeName = activeName
        this.$router.push({
          path: '/licenseInfoAdd',
          query: checkObjP
        })
      }
    },
    backToCustomer () {
      this.$router.push({
        path: '/licenseInfo'
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../../element-variables.scss';

  .customer-manage{
    .el-tabs{
      height: 100%;
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__content{
        height: calc(100% - 41px);
        overflow: auto;
        /*border-right: 1px solid #E4E7ED;*/
        /*border-left: 1px solid #E4E7ED;*/
        /*border-bottom: 1px solid #E4E7ED;*/
        .el-tab-pane{
          height: 100%;
        }
      }
    }
  }
  .bussiness-info {
    position: relative;
    background: #fff;
    padding: 17px 30px;
    flex-grow: 1;
    overflow: scroll;
    .back-to-customer{
      position: absolute;
      right: 110px;
      top: 22px;
      padding: 5px 10px;
      z-index: 1;
    }
    /*.el-form-item{*/
      /*margin-bottom: 16px;*/
    /*}*/
    .el-btn-address{
      .iconaddress{
        font-size: 24px;
      }
    }
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
    .el-cascader,.el-date-editor{
      width: 100%;
    }
    .map-address{
      position: absolute;
      left: 60px;
      top: 67px;
      color: #455A70;
      text-align: left;
      padding: 15px 20px;
      white-space: nowrap;
      background: #fff;
      .map-form-item{
        padding: 5px;
        font-size:14px;
      }
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
    form {
      .el-button {
        min-height: 36px;
        height: 36px;
        line-height: 36px;
        padding: 0 19px;
      }

      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }

    .map-dialog.el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dialog {
        margin: auto !important;

        .el-dialog__header {
          padding: 0;
          position: relative;
          .title{
            position: absolute;
            right: -26px;
            top: -21px;
          }
        }
      }
    }

    .map-dialog {
      .el-dialog {
        width: 50%;
        height: 70%;
        display: flex;
        flex-direction: column;

        .el-dialog__body {
          flex-grow: 1;
        }
      }

      .el-dialog__body {
        padding: 0;
      }
    }

    .init-row-margin {
      margin: 0 !important;
    }

    .bus-info-item {
      .item-header {
        padding: 13px 0;
        border-bottom: 1px solid #EEEEEE;

        .item-header-text {
          text-align: left;
          padding-left: 20px;
          border-left: 2px solid $--color-primary;
          color: #555D66;
          font-size: 16px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }

      .item-body {
        padding: 30px 50px;

        .el-input {
          .el-input-group__prepend{
            border-radius: 4px 0px 0px 4px !important;
          }
          .el-input-group__append,.el-input-group__prepend {
            padding: 0 13px;
          }
        }

        .business-license {
          text-align: left;
        }
      }
    }
  }
  .contacts-management{
    .el-card__header{
      background: rgb(246, 246, 246);
      padding: 8px 20px;
      color: #455A70;
    }
    .el-tooltip{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
