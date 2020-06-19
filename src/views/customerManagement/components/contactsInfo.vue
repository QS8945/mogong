<template>
    <div class="view-total baseForm form-format contacts-management">
      <div class="table-content">
        <el-table
                v-if="tableVisible"
                :data="records"
                style="width: 100%"
                :height="tableHeight"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                row-key="id"
                lazy>
          <el-table-column
                  type="index">
          </el-table-column>
          <el-table-column
                  prop="classCode"
                  label="二位码">
            <template slot-scope="scope">
              <el-select v-if="scope.row.editFlag" v-model="scope.row.classCode" clearable filterable>
                <el-option
                        v-for="item in classCodes"
                        :key="item.code"
                        :label="item.code"
                        :value="item.code">
                </el-option>
              </el-select>
              <span v-if="!scope.row.editFlag">{{scope.row.classCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="wasteCode"
                  label="八位码">
            <template slot-scope="scope">
              <el-select v-if="scope.row.editFlag" v-model="scope.row.wasteCode" clearable filterable>
                <el-option
                        v-for="item in wasteCodes"
                        :key="item.code"
                        :label="item.code"
                        :value="item.code">
                </el-option>
              </el-select>
              <span v-if="!scope.row.editFlag">{{scope.row.wasteCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="entWasteName"
                  label="危废俗称">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editFlag" v-model="scope.row.entWasteName" placeholder="请输入危废俗称"></el-input>
              <span v-if="!scope.row.editFlag">{{scope.row.entWasteName}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="operation"
                  label="操作"
                  align="center">
            <template slot-scope="scope">
              <div v-if="!scope.row.editFlag">
                <el-button type="text" @click="optContact(scope.row, 'update', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">编辑</el-button>
                <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
                <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
                <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
              </div>
              <div v-if="scope.row.editFlag">
                <el-button type="text" @click="optContact(scope.row, 'add', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">保存</el-button>
                <el-button type="text" @click="optContact(scope.row, 'cancel', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">取消</el-button>
                <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'add', scope.$index)" type="text" size="small">保存</span>-->
                <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'cancel', scope.$index)" type="text" size="small">取消</span>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer-btn">
          <el-row :gutter="100" v-if="checkObj.type!=='query'">
            <el-col :span="24">
              <el-button type="primary" @click="addWasteFlag('form')">添加</el-button>
              <!--<el-button @click="cancelData">取消</el-button>-->
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import COMMONJS from '@/assets/js/common.js'
import { saveEnterpriseWaste, modifyEnterpriseWaste, getCodeAndNameDic, getClassCode, getWasteCode, getAllCustomerCharge, getDisClassCode, getDisWasteCode, getFinacialInformation, addWaste, getWaste, deleteWaste, editWaste } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      records: [],
      oldRecords: [],
      tableVisible: false,
      tableHeight: 'calc(100% - 78px)',
      wasteCodes: [],
      classCodes: [],
      checkObj: {
        type: 'add'
      }
    }
  },
  mounted () {
    this.getData()
    this.getDisClassCode()
    this.getDisWasteCode()
  },
  props: ['entRelationId'],
  methods: {

    getData () {
      let _this = this
      switch (this.$route.query.type) {
        case 'query':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'update':
          // this.form = JSON.parse(this.$route.query.data)
          this.checkObj.type = this.$route.query.type
          break
        case 'add':
          this.checkObj.type = this.$route.query.type
          break
      }
      if (this.$route.query.type !== 'add') {
        let postData = {
          entRelationId: this.$route.query.data
        }
        getWaste(postData)
          .then(res => {
            console.log(res)
            // res = { 'status': 'Success', 'data': [{ 'classCode': 'peter', 'wasteCode': '789' }, { 'classCode': 'peter2', 'wasteCode': null, 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'david', 'wasteCode': '123', 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'peter', 'wasteCode': '789' }, { 'classCode': 'peter2', 'wasteCode': null, 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }, { 'classCode': 'david', 'wasteCode': '123', 'entWasteName': null }, { 'classCode': 'jack', 'wasteCode': '456', 'entWasteName': null }], 'msg': null, 'code': 1 }
            if ((!res.data.length) && (_this.checkObj.type !== 'query')) {
              var addObj = {
                classCode: '',
                wasteCode: '',
                entWasteName: '',
                editFlag: true
              }
              res.data.push(addObj)
            } else {
              res.data.forEach(function (val, index) {
                val.editFlag = false
              })
            }
            _this.records = JSON.parse(JSON.stringify(res.data))
            _this.oldRecords = JSON.parse(JSON.stringify(res.data))
            _this.tableVisible = true
          }).catch(() => {
          })
        // if (Object.prototype.toString.call(this.form.areaCode) !== '[object Array]') {
        //   this.form.areaCode = JSON.parse(this.form.areaCode)
        // }
        // if (Object.prototype.toString.call(this.form.cantonName) !== '[object Array]') {
        //   this.form.cantonName = JSON.parse(this.form.cantonName)
        // }
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
        }).catch(() => {
        })
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
        }).catch(() => {
        })
    },
    getDisClassCode () {
      let _this = this
      getClassCode()
        .then(res => {
          _this.classCodes = res.data
        }).catch(() => {
        })
    },
    getDisWasteCode () {
      let _this = this
      getWasteCode()
        .then(res => {
          _this.wasteCodes = res.data
        }).catch(() => {
        })
    },
    optContact (data, type, index) {
      let _this = this
      switch (type) {
        case 'add':
          if (data.id) {
            data.editFlag = false
            let postData = {
              id: data.id,
              classCode: data.classCode,
              wasteCode: data.wasteCode,
              entWasteName: data.entWasteName
            }
            editWaste(postData)
              .then(res => {
                console.log(res)
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
                entRelationId: this.$route.query.data,
                classCode: data.classCode,
                wasteCode: data.wasteCode,
                entWasteName: data.entWasteName
              }
              addWaste(postData)
                .then(res => {
                  console.log(res)
                  _this.getData()
                })
            }
          }
          break
        case 'update':
          this.records[index].editFlag = true
          // if (index < this.oldRecords.length) {
          //   this.oldRecords[index] = data
          // }
          break
        case 'delete':
          // this.records.splice(index, 1)
          // if (index < this.oldRecords.length) {
          //   this.oldRecords.splice(index, 1)
          // }

          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let postData = {
              enterpriseWasteId: data.id
            }
            deleteWaste(postData)
              .then(res => {
                console.log(res)
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
          }/* else {
            this.records[index] = {
              classCode: '',
              wasteCode: '',
              entWasteName: '',
              editFlag: true
            }
          } */
          // this.records[index].editFlag = false
          break
      }
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
  .contacts-management .dialog-footer{
    padding: 10px 20px 20px 10px;
  }
  .form-format{
    padding-right: 30px;
    text-align: left;
  }
  .form-format .el-radio-group{
    padding-left: 10px;
  }
  .contacts-management .dialog-footer .el-button {
    min-height: 36px;
    height: 36px;
    line-height: 36px;
    padding: 0 19px;
  }
  .btn-group{
    float: right;
  }
  .btn-group .el-button--text{
    padding: 0;
    color: #8D8D8D;
  }
  .view-total .el-dialog .dialog-footer{
    margin-left: 0;
  }
  .contacts-management .box-card{
    width: 30%;
    margin-right: 3%;
    margin-bottom: 23px;
  }
  .contacts-management .box-card .el-card__body{
    height: 100%;
  }
  .contacts-management .box-card .item-body{
    line-height: 25px;
    color: #8D8D8D;
  }
  .contacts-management .box-card .add-contact{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999999;
    cursor: pointer;
  }
  .contacts-management .box-card .add-contact .add-icon{
    margin-bottom: 20px;
  }
  .contacts-management .box-card .add-contact .el-icon-plus{
    font-size: 38px;
    font-weight: bold;
    color: rgba(204, 204, 204, 1);
  }
  .contacts-management .box-card .item-body .item-text{
    width: 70px;
    padding-right: 10px;
    display: inline-block;
    text-align: right;
  }
  .contacts-management .box-card .el-dialog__header{
    background: #E5E5E5;
    padding: 8px 20px;
  }
  .contacts-management .card-list{
    display: flex;
    flex-wrap: wrap;
  }
  .contacts-management .footer-btn{
    padding: 20px;
  }
</style>
