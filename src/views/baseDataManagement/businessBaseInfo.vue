<template>
  <div class="bussiness-info">
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">企业基本信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业编号：" :prop="(checkObj.type==='query') ? '' : 'code'">
                <el-input :disabled="flag==false" v-model="form.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区：" :prop="(checkObj.type==='query') ? '' : 'cantonName'">
                <!--<el-cascader-->
                        <!--:options="cantonOptions"-->
                        <!--v-model="form.cantonName"-->
                        <!--@active-item-change="handleItemChange"-->
                        <!--:props="props"-->
                <!--&gt;</el-cascader>-->
                <v-canton :disabled="flag==false" v-if="cantonVisible" :cantonName="form.cantonName" @changeCantonName="changeCantonNameP"></v-canton>
                <!--<el-input v-model.trim="form.cantonName"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业名称：" :prop="(checkObj.type==='query') ? '' : 'name'">
                <el-input :disabled="flag==false" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业简称：" :prop="(checkObj.type==='query') ? '' : 'abbreviation'">
                <el-input :disabled="flag==false" v-model="form.abbreviation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="社会信用代码：" :prop="(checkObj.type==='query') ? '' : 'socialCreditCode'">
                <el-input :disabled="flag==false" v-model="form.socialCreditCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工商注册地址：" :prop="(checkObj.type==='query') ? '' : 'address'">
                <el-input :disabled="flag==false" v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="bus-info-item">
        <div class="item-header">
          <div class="item-header-text">企业详细信息</div>
        </div>
        <div class="item-body">
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="法人代表：" :prop="(checkObj.type==='query') ? '' : 'legalPerson'">
                <el-input :disabled="flag==false" v-model="form.legalPerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经纬度：">
                <el-row :gutter="20" class="init-row-margin">
                  <el-col :span="9" class="padding-left-none">
                    <el-tooltip :disabled="!form.longitude" :content="form.longitude.toString()" placement="top" :enterable="false">
                      <el-input  v-model="form.longitude" :disabled="true">
                        <template slot="prepend">经度</template>
                      </el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="9">
                    <el-tooltip :disabled="!form.longitude" :content="form.latitude.toString()" placement="top" :enterable="false">
                      <el-input  v-model="form.latitude" :disabled="true">
                        <template slot="prepend">纬度</template>
                      </el-input>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6">
                    <el-button :disabled="flag==false" type="text" icon="icon iconfont iconaddress" @click="choosePosition" class="el-btn-address">地图选择</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="设施地址：" :prop="(checkObj.type==='query') ? '' : 'equipmentAddress'">
                <el-input :disabled="flag==false" v-model="form.equipmentAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮政编码：" :prop="(checkObj.type==='query') ? '' : 'postcode'">
                <el-input :disabled="flag==false" v-model="form.postcode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="联系人：" :prop="(checkObj.type==='query') ? '' : 'contacts'">
                <el-input :disabled="flag==false" v-model="form.contacts"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" :prop="(checkObj.type==='query') ? '' : 'contactsPhone'">
                <el-input :disabled="flag==false" v-model="form.contactsPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业电话：" :prop="(checkObj.type==='query') ? '' : 'telephone'">
                <el-input :disabled="flag==false" v-model="form.telephone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真：" :prop="(checkObj.type==='query') ? '' : 'fax'">
                <el-input :disabled="flag==false" v-model="form.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="归属地环保局：" :prop="(checkObj.type==='query') ? '' : 'epaName'">
                <el-input :disabled="flag==false" v-model="form.epaName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册资金：" :prop="(checkObj.type==='query') ? '' : 'registeredCapital'">
                <el-input :disabled="flag==false" v-model="form.registeredCapital">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="经营开始日期：" :prop="(checkObj.type==='query') ? '' : 'startTime'">
                <el-date-picker
                        :disabled="flag==false"
                        v-model="form.startTime"
                        type="date"
                        :editable="false"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业员工数：" :prop="(checkObj.type==='query') ? '' : 'staffNumber'">
                <el-input :disabled="flag==false" v-model="form.staffNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="企业性质：" :prop="(checkObj.type==='query') ? '' : 'property'">
                <!--<el-input v-model="form.property"></el-input>-->
                <el-select :disabled="flag==false" v-model="form.property" clearable filterable
                           placeholder="请选择企业性质">
                  <el-option
                          v-for="item in properties"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总投资：" :prop="(checkObj.type==='query') ? '' : 'investment'">
                <el-input :disabled="flag==false" v-model="form.investment">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="12">
              <el-form-item label="占地面积：" :prop="(checkObj.type==='query') ? '' : 'floorSpace'">
                <el-input :disabled="flag==false" v-model="form.floorSpace">
                  <template slot="append">m²</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年处置量：" :prop="(checkObj.type==='query') ? '' : 'yield'">
                <el-input :disabled="flag==false" v-model="form.yield">
                  <template slot="append">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="备注：" :prop="(checkObj.type==='query') ? '' : 'remark'">
                <el-input :disabled="flag==false" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="营业执照：">
                <!--<el-upload class="business-license"-->
                <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                <!--:file-list="fileList"-->
                <!--list-type="picture-card"-->
                <!--:on-preview="handlePictureCardPreview"-->
                <!--:on-remove="handleRemove"-->
                <!--:on-success="handleAvatarSuccess"-->
                <!--:multiple="true">-->
                <!--<i class="el-icon-plus"></i>-->
                <!--</el-upload>-->
                <v-upload v-if="fileVisible" :disabled="flag==false" class="business-license" :uploadList="fileList" @changeFiles="changeFilesP"
                          @pictureCardPreview="pictureCardPreviewP"></v-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item class="business-license" v-if="flag">
                <el-button type="primary" @click="saveData('form')">保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="mapVisible" :close-on-click-modal="false" :show-close="false" class="map-dialog">
      <span slot="title" class="title">
        <el-button icon="el-icon-close" size="mini" circle @click="closeMap"></el-button>
      </span>
      <v-map-search :searchKey="searchKeyP" @changePosition="changePositionP"></v-map-search>
    </el-dialog>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Upload from '@/components/upload'
import MapSearch from '@/components/map/mapPosition'
import Canton from '@/components/canton'
import { isEntInfoManger,saveEnterpriseAndEnterpriseDetail, getEnterpriseAndEnterpriseDetail, modifyEnterpriseAndEnterpriseDetail, getSysCanton, getCodeAndNameDic } from '@/assets/js/API/api'

export default {
  name: 'businessBaseInfo',
  data () {
    return {
      fileList: [],
      dialogImageUrl: '',
      // 预览
      dialogVisible: false,
      // 地图
      mapVisible: false,
      searchKeyP: {},
      flag: true,
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
        // 2019-6-20 16:52:28zhangr修正必填
        abbreviation: [{ required: true, message: '请输入', trigger: 'change' }],
        cantonName: [{ required: true, message: '请输入', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'change' }],
        socialCreditCode: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      checkObj: {
        type: 'add'
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
      },
      cantonVisible: false
    }
  },
  created () {
    // this.getListStorageInfo()
    console.log('init')
    this.getData()
    // this.getSysCanton()
    this.getCodeAndNameDicEntProperty()
    this.getFlag()
  },
  components: {
    'v-upload': Upload,
    'v-map-search': MapSearch,
    'v-canton': Canton
  },
  methods: {


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

<style lang="scss">
  @import '../../element-variables';

  .bussiness-info {
    background: #fff;
    padding: 17px 30px;
    flex-grow: 1;
    overflow: scroll;
    /*.el-form-item{*/
      /*margin-bottom: 16px;*/
    /*}*/
    .padding-left-none{
      padding-left: 0 !important;
    }
    .el-btn-address{
      .iconaddress{
        font-size: 24px;
      }
    }
    .el-form-item.is-success .el-input__inner{
      border: 1px solid #DCDFE6;
    }
    .el-cascader,.el-date-editor{
      width: 100% !important;
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
</style>
