<template>
  <div class="view-total baseForm form-format contacts-management">
    <div class="table-content">
      <el-table v-loading="loading" v-if="tableVisible" :data="records" style="width: 100%" :height="tableHeight" element-loading-background="rgba(0, 0, 0, 0.8)"
        row-key="id" lazy>
        <el-table-column align="center" type="index" label="顺序">
        </el-table-column>
        <el-table-column align="center" prop="classCode" label="二位码">
          <template slot-scope="scope">
            <el-select v-if="scope.row.editFlag" v-model="scope.row.classCode" clearable filterable>
              <el-option v-for="item in classCodes" :key="item.code" :label="item.code" :value="item.code">
              </el-option>
            </el-select>
            <span v-if="!scope.row.editFlag">{{scope.row.classCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wasteCode" label="八位码">
          <template slot-scope="scope">
            <el-select v-if="scope.row.editFlag" v-model="scope.row.wasteCode" clearable filterable>
              <el-option v-for="item in wasteCodes" :key="item.code" :label="item.code" :value="item.code">
              </el-option>
            </el-select>
            <span v-if="!scope.row.editFlag">{{scope.row.wasteCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="entWasteName" label="危废俗称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" v-model="scope.row.entWasteName" placeholder="请输入危废俗称"></el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.entWasteName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="wasteProductionAmt" label="年产废量">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" v-model="scope.row.wasteProductionAmt" placeholder="请输入年产废量"></el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.wasteProductionAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="wasteStorageAmt" label="危废贮存量">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editFlag" v-model="scope.row.wasteStorageAmt" placeholder="请输入危废贮存量"></el-input>
            <span v-if="!scope.row.editFlag">{{scope.row.wasteStorageAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="wasteStorageAmt" label="处置方式">
          <template slot-scope="scope">
            <el-cascader v-if="scope.row.editFlag" @change="dealTypeChange" v-model="scope.row.dealType" :options="dealTypeList" :props="{ multiple: false,value:'id',label:'name'}"
              filterable placeholder="请选择处置方式" collapse-tags clearable>
            </el-cascader>
            <span v-if="!scope.row.editFlag">{{scope.row.dealTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="valid" label="状态">
          <template slot-scope="scope">
            <span v-html="getWasteStatus(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" v-if="checkObj.type!=='query'">
          <template slot-scope="scope">
            <div v-if="!scope.row.editFlag">
              <span class="operateBtnCls" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">
                编辑
              </span>
              <span class="operateBtnCls" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">
                删除
              </span>
              <span class="operateBtnCls" @click="optContact(scope.row, 'sampleBill', scope.$index)" type="text" size="small">
                查看送样单
              </span>
            </div>
            <div v-if="scope.row.editFlag">
              <span class="operateBtnCls" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">
                保存
              </span>
              <span class="operateBtnCls" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">
                取消
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer-btn">
        <el-row :gutter="100" v-if="checkObj.type!=='query'">
          <el-col :span="24">
            <el-button type="primary" @click="addWasteFlag('form')">添加</el-button>
            <el-button @click="cancelData">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="detailInfoVisible" :close-on-click-modal="false" :show-close="false" class="map-dialog">
      <span slot="title" class="title">
        <el-button icon="el-icon-close" size="mini" circle @click="closeDetailInfo"></el-button>
      </span>
      <iframe class="iframe-config" :src="detailInfoUrl"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import {
  saveEnterpriseWaste,
  modifyEnterpriseWaste,
  getCodeAndNameDic,
  getClassCode,
  getWasteCode,
  getAllCustomerCharge,
  getDisClassCode,
  getDisWasteCode,
  getFinacialInformation,
  addCustomerWaste,
  getWaste,
  deleteCustomerWaste,
  editCustomerWaste,
  getCodeAndNameDicTree,
  getCustomerWasteListPage,
  getSampleAnalysisParam,
  getCustomerEnterpriseDetail
} from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      dealTypeList: [],
      records: [],
      page: {
        current: GLB_CONSTANT.page.current,
        size: 10,
        total: 0,
        sizes: [5, 10, 50]
      },
      oldRecords: [],
      tableVisible: false,
      tableHeight: '500',
      wasteCodes: [],
      classCodes: [],
      checkObj: {
        type: 'add'
      },
      detailInfoVisible: false,
      detailInfoUrl: '',
      detailInfoUrlParams: {
        action: 'query',
        status: 'agree',
        id: "",
        sampleId: "",
        templateId: "",
        ticket: localStorage.getItem('token')
      }
    }
  },
  mounted () {
    this.getData()
    this.getDealTypeList()
    this.getDisClassCode()
    this.getDisWasteCode()
  },
  // props: ['entRelationId'],
  methods: {
    cancelData () {
      this.$router.push({
        path: '/salesFunnel'
      })
    },
    getWasteStatus (row) {
      if (row.valid === 1) {
        return '正常'
      } else if (row.valid === 0) {
        return "<c style='color:red;'>已删除</c>"
      } else {
        return ''
      }
    },
    dealTypeChange (data) {
      let vm = this
      // vm.addForm.dealTypeId = ''
      // if (data.length > 0) {
      //   vm.addForm.dealTypeId = data[data.length - 1]
      // } else {
      //   vm.addForm.dealTypeId = ''
      // }
    },
    getDealTypeList () {
      var vm = this
      getCodeAndNameDicTree({
        typeCode: 'dealType'
      })
        .then(res => {
          vm.dealTypeList = res.data
        }).catch(() => {})
    },
    getData () {
      let _this = this
      _this.loading = true
      switch (this.$route.query.type) {
        case 'query':
          _this.checkObj.type = _this.$route.query.type
          break
        case 'update':
          _this.checkObj.type = _this.$route.query.type
          break
        case 'add':
          _this.loading = false
          _this.checkObj.type = _this.$route.query.type
          break
      }
      if (this.$route.query.type !== 'add') {
        let postData = {
          entId: _this.$route.query.data,
          current: _this.page.current,
          size: 1000
        }
        getCustomerWasteListPage(postData)
          .then(res => {
            if ((!res.data.records.length) && (_this.checkObj.type !== 'query')) {
              var addObj = {
                classCode: '',
                wasteCode: '',
                entWasteName: '',
                editFlag: true
              }
              res.data.records.push(addObj)
            } else {
              res.data.records.forEach(function (val, index) {
                val.editFlag = false
              })
            }
            _this.records = JSON.parse(JSON.stringify(res.data.records))
            _this.oldRecords = JSON.parse(JSON.stringify(res.data.records))
            _this.tableVisible = true
            _this.loading = false
          }).catch(() => {})
      }
    },
    getCodeAndNameDicWasteForm () {
      let _this = this
      let postData = {
        typeCode: 'wasteForm'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.form = res.data[0].code
          _this.wasteForm = res.data
        }).catch(() => {})
    },
    getCodeAndNameDicWasteFeatures () {
      let _this = this
      let postData = {
        typeCode: 'wasteFeatures'
      }
      getCodeAndNameDic(postData)
        .then(res => {
          _this.addForm.features = res.data[0].code
          _this.wasteFeatures = res.data
        }).catch(() => {})
    },
    getDisClassCode () {
      let _this = this
      getClassCode()
        .then(res => {
          _this.classCodes = res.data
        }).catch(() => {})
    },
    getDisWasteCode () {
      let _this = this
      getWasteCode()
        .then(res => {
          _this.wasteCodes = res.data
        }).catch(() => {})
    },
    optContact (data, type, index) {
      let _this = this
      switch (type) {
        case 'add':
          if (data.id) {
            data.editFlag = false
            let postData = {
              id: data.id,
              entId: _this.$route.query.data,
              classCode: data.classCode,
              wasteCode: data.wasteCode,
              entWasteName: data.entWasteName,
              wasteStorageAmt: data.wasteStorageAmt,
              wasteProductionAmt: data.wasteProductionAmt
            }
            if (typeof data.dealType === 'string') {
              postData.dealType = data.dealType
            }
            if (typeof data.dealType === 'object') {
              postData.dealType = data.dealType[data.dealType.length - 1]
            }

            editCustomerWaste(postData)
              .then(res => {
                _this.getData()
              })
          } else {
            if (!data.classCode) {
              COMMONJS.showToast('请先选择二位码', 'warning')
              return false
            } else if (!data.classCode) {
              COMMONJS.showToast('请先选择八位码', 'warning')
              return false
            } else if (!data.entWasteName) {
              COMMONJS.showToast('请先填写危废俗称', 'warning')
              return false
            } else {
              data.editFlag = false
              let postData = {
                entId: _this.$route.query.data,
                classCode: data.classCode,
                wasteCode: data.wasteCode,
                entWasteName: data.entWasteName,
                wasteStorageAmt: data.wasteStorageAmt,
                dealType: data.dealType[data.dealType.length - 1],
                wasteProductionAmt: data.wasteProductionAmt
              }
              addCustomerWaste(postData)
                .then(res => {
                  _this.getData()
                })
            }
          }
          break
        case 'update':
          this.records[index].editFlag = true
          break
        case 'delete':
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let postData = {
              id: data.id
            }
            deleteCustomerWaste(postData)
              .then(res => {
                _this.getData()
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        case 'cancel':
          if (index < this.oldRecords.length) {
            this.records.splice(index, 1, JSON.parse(JSON.stringify(this.oldRecords[index])))
            // this.records[index] = this.oldRecords[index]
          } else {
            this.records.splice(index, 1)
            // this.records[index] = {
            //   classCode: '',
            //   wasteCode: '',
            //   entWasteName: '',
            //   editFlag: true
            // }
          }
          // this.records[index].editFlag = false
          break
        case 'sampleBill':
          let postData={
            entId:_this.$route.query.data,
            wasteCode:data.wasteCode,
            entWasteName:data.entWasteName
          }
          let params = {
            ticket: localStorage.getItem('token')
          }
          debugger
          getSampleAnalysisParam(postData, params).then(res =>{
            if (res.data.length>0) {
              this.detailInfoUrlParams.sampleId = res.data[0].sampleId
              this.detailInfoUrlParams.id = res.data[0].id
              this.detailInfoUrlParams.templateId = res.data[0].templateId
              let params = this.param(this.detailInfoUrlParams)
              this.detailInfoVisible = true
              this.detailInfoUrl = GLB_CONSTANT.devUrl.childIframeAddress + '/web/lab/sampleAnalysisBill/analysisBillAndDetailInfoErp.htm?' + params
            } else {
              this.$message({
                type: 'info',
                message: '该危废没有送样单'
              })
            }
          })
          break
      }
    },

    param(data) {
      let url = "";
      for (let k in data) {
        let value = data[k] != undefined ? data[k] : "";
        url += `&${k}=${encodeURIComponent(value)}`;
      }
      return url ? url.substring(1) : "";
    },
    closeDetailInfo () {
      this.detailInfoVisible = false
    },
    addWasteFlag () {
      if (this.records[this.records.length - 1].editFlag) {
        COMMONJS.showToast('请先保存添加项', 'warning')
      } else {
        let addObj = {
          classCode: '',
          wasteCode: '',
          entWasteName: '',
          editFlag: true
        }
        // this.records.splice(this.records.length, 0, addObj)
        this.records.push(addObj)
      }
    }
  }
}

</script>

<style>
  .contacts-management .dialog-footer {
    padding: 10px 20px 20px 10px;
  }

  .form-format {
    padding-right: 30px;
    text-align: left;
  }

  .form-format .el-radio-group {
    padding-left: 10px;
  }

  .contacts-management .dialog-footer .el-button {
    min-height: 36px;
    height: 36px;
    line-height: 36px;
    padding: 0 19px;
  }

  .btn-group {
    float: right;
  }

  .btn-group .el-button--text {
    padding: 0;
    color: #8D8D8D;
  }

  .view-total .el-dialog .dialog-footer {
    margin-left: 0;
  }

  .contacts-management .box-card {
    width: 30%;
    margin-right: 3%;
    margin-bottom: 23px;
  }

  .contacts-management .box-card .el-card__body {
    height: 100%;
  }

  .contacts-management .box-card .item-body {
    line-height: 25px;
    color: #8D8D8D;
  }

  .contacts-management .box-card .add-contact {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999999;
    cursor: pointer;
  }

  .contacts-management .box-card .add-contact .add-icon {
    margin-bottom: 20px;
  }

  .contacts-management .box-card .add-contact .el-icon-plus {
    font-size: 38px;
    font-weight: bold;
    color: rgba(204, 204, 204, 1);
  }

  .contacts-management .box-card .item-body .item-text {
    width: 70px;
    padding-right: 10px;
    display: inline-block;
    text-align: right;
  }

  .contacts-management .box-card .el-dialog__header {
    background: #E5E5E5;
    padding: 8px 20px;
  }

  .contacts-management .card-list {
    display: flex;
    flex-wrap: wrap;
  }

  .contacts-management .footer-btn {
    padding: 20px;
  }

  .operateBtnCls {
    cursor: pointer;
    color: #40C3AB;
  }
  .el-table__body-wrapper{
    height: auto !important;
  }

  .iframe-config{
    border: none;
    height: 100%;
    width: 100%;
  }
  .el-dialog__header .el-button{
    min-height: 28px;
     height: 28px;
     line-height: 16px;
  }
</style>
