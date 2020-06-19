<template>
  <div class="bussiness-info">
      <el-form ref="form" :model="form" label-width="130px">
        <div class="bus-info-item">
          <div class="item-body">
            <el-row :gutter="100">
              <el-col :span="12">
                <el-form-item class="validity-term" label="许可证有效期:">
                  {{validityTerm.beginTime | formatDate}} - {{validityTerm.endTime | formatDate}}
                </el-form-item>
                <!--<el-form-item label="许可证有效期：" v-if="validityTermVisible">-->
                  <!--{{validityTerm.beginTime | formatDate}} - {{validityTerm.endTime | formatDate}}-->
                <!--</el-form-item>-->
              </el-col>
            </el-row>
            <el-row :gutter="100">
              <el-col :span="12">
                <el-form-item label="处置方式：" :prop="(checkObj.type==='query') ? '' : 'address'">
                  <el-select v-model="form.licenceType" :disabled="checkObj.type==='query'" clearable filterable
                             placeholder="请选择处置方式">
                    <el-option
                            v-for="item in licenceTypes"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                  </el-select>
                  <!--<el-input v-model="form.address" :disabled="checkObj.type==='query'" placeholder="请输入经营设施地址"></el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核准量：" :prop="(checkObj.type==='query') ? '' : 'approvedQuantity'">
                  <el-row :gutter="20" class="init-row-margin">
                    <el-col :span="18" class="padding-left-none">
                      <el-input v-model="form.approvedQuantity" :disabled="checkObj.type==='query'" placeholder="请输入核准量"></el-input>
                    </el-col>
                    <el-col :span="6" class="padding-left-none"><el-button @click="addRecords">添加处置方式</el-button></el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="bus-info-item">
          <div class="item-header">
            <div class="item-header-text"><span>项目信息</span></div>
          </div>
          <div class="item-body">
            <el-table
                    v-if="tableVisible"
                    :span-method="records.licenceYearVO.mergeCellInfoList && objectSpanMethod"
                    :data="records.licenceYearVO.licenceGroupYear"
                    style="width: 100%"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    row-key="id"
                    lazy>
              <el-table-column
                      prop="dispositionTypeText"
                      label="处置方式"
                      align="center"
                      :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                      prop="startTime"
                      label="开始日期"
                      align="center"
                      :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div>{{scope.row.startTime | formatDate}}</div>
                </template>
              </el-table-column>
              <el-table-column
                      prop="endTime"
                      label="结束日期"
                      align="center"
                      :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div>{{scope.row.endTime | formatDate}}</div>
                </template>
              </el-table-column>
              <el-table-column
                      prop="approvedQuantity"
                      label="核准量"
                      align="center"
                      :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.editFlag" v-model="scope.row.approvedQuantity" :disabled="checkObj.type==='query'" placeholder="请输入核准量"></el-input>
                  <span v-if="!scope.row.editFlag">{{scope.row.approvedQuantity}}</span>
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
                    <el-button type="text" @click="optContact(scope.row, 'addWaste', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">添加危废</el-button>
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
          </div>
        </div>
        <div class="bus-info-item">
          <div class="item-header">
            <div class="item-header-text">危废信息</div>
          </div>
          <div class="item-body">
            <el-table
                    v-if="tableVisible"
                    :data="records.wastes"
                    style="width: 100%"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    row-key="id"
                    lazy>
              <el-table-column
                      label="序号"
                      type="index">
              </el-table-column>
              <el-table-column
                      prop="dispositionTypeText"
                      label="处置方式"
                      align="center"
                      :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                      prop="wasteClassCode"
                      label="二位码"
                      align="center"
                      :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                      prop="wasteCode"
                      label="八位码"
                      align="center"
                      :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                      prop="wasteName"
                      label="危废俗称"
                      align="center"
                      :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                      prop="operation"
                      label="操作"
                      align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="optContactWaste(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="100" v-if="checkObj.type!=='query'">
              <el-col :span="24">
                <div class="save-btn-group">
                  <el-button type="primary" @click="saveData('form')">保存</el-button>
                  <el-button @click="cancelData">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div v-if="treeVisible">
        <el-dialog
                width="30%"
                :visible.sync="treeVisible"
                left>
              <span slot="title" class="title">
              </span>
          <v-tree ref="tree" :treeObj="treeObj" :defaultProps="treeProps" @getChooseTreeData="getChooseTreeDataP" @changeTreeVisible="changeTreeVisibleP"></v-tree>
        </el-dialog>
      </div>
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Tree from '@/components/tree'
import { getCodeAndNameDic, saveLicenceWaste, editLicenceWaste, licenceWaste, getClassCodeAndWasteCode, listDispositonByTypeCode } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      form: {
        licenceType: '',
        approvedQuantity: 1000
      },
      groupId: 0,
      records: {
        wastes: [],
        licenceYearVO: {
          licenceGroupYear: [],
          mergeCellInfoList: []
        }
      },
      oldRecords: [],
      tableVisible: false,
      tableHeight: 'calc(100% - 78px)',
      classCodes: [],
      licenceTypes: [],
      checkObj: {
        type: 'add'
      },
      validityTerm: {},
      validityTermVisible: false,
      // 树节点
      treeVisible: false,
      treeObj: {},
      treeProps: {
        label: 'name',
        children: 'wasteCodes',
        isLeaf: 'leaf'
      },
      // 当前添加处置方式类型
      addLicenceType: {}
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    }
  },
  // 组件
  components: {
    'v-tree': Tree
  },
  mounted () {
    this.getData()
    this.listDispositonByTypeCodeDispositionType()
  },
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
          id: this.$route.query.data
        }
        licenceWaste(postData)
          .then(res => {
            if (res.data.licenceYearVO.licenceGroupYear && res.data.licenceYearVO.licenceGroupYear.length) {
              res.data.licenceYearVO.licenceGroupYear.forEach(function (val, index) {
                val.editFlag = false
              })
              _this.records.licenceYearVO.licenceGroupYear = res.data.licenceYearVO.licenceGroupYear
              _this.oldRecords = JSON.parse(JSON.stringify(res.data.licenceYearVO.licenceGroupYear))
            }
            if (res.data.licenceYearVO.mergeCellInfoList && res.data.licenceYearVO.mergeCellInfoList.length) {
              _this.records.licenceYearVO.mergeCellInfoList = res.data.licenceYearVO.mergeCellInfoList
            }
            if (res.data.wastes && res.data.wastes.length) {
              _this.records.wastes = res.data.wastes
            }
            // res.data.wastes.length || (this.wastes = res.data.wastes)
            _this.validityTerm.beginTime = res.data.beginTime
            _this.validityTerm.endTime = res.data.endTime
            // _this.records = JSON.parse(JSON.stringify(res.data.licenceGroupYear))
            _this.tableVisible = true
            _this.validityTermVisible = true
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
    saveData (formName) {
      let _this = this
      let postData = this.records
      // postData.entId = localStorage.getItem('id')
      postData.id = this.$route.query.data
      // postData.wastes = JSON.parse(JSON.stringify(this.wastes))
      // postData.licenceYearVO.licenceGroupYear = JSON.parse(JSON.stringify(this.records))
      // postData.licenceYearVO.mergeCellInfoList = JSON.parse(JSON.stringify(this.mergeCellInfoList))
      console.log(postData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.checkObj.type === 'add') {
            saveLicenceWaste(postData)
              .then(res => {
                COMMONJS.showToast('新增成功')
                // _this.$refs[formName].resetFields()
                let obj = {}
                obj.type = 'update'
                obj.data = res.data.licenceId
                obj.activeName = 'licenseBaseInfo'
                this.$router.push({
                  path: '/licenseInfoAdd',
                  query: obj
                })
                // _this.form.latitude = ''
                // _this.form.longitude = ''
                // _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          } else if (_this.checkObj.type === 'update') {
            editLicenceWaste(postData)
              .then(res => {
                COMMONJS.showToast('保存成功')
                // _this.$refs[formName].resetFields()
                // _this.form.latitude = ''
                // _this.form.longitude = ''
                // _this.fileList = []
                _this.getData()
              }).catch(() => {
              })
          }
        // this.$refs['verificationModeForm'].resetFields()
        } else {
          return false
        }
      })
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
    listDispositonByTypeCodeDispositionType () {
      let _this = this
      let postData = {
        typeCode: 'dispositionType'
      }
      listDispositonByTypeCode(postData)
        .then(res => {
          _this.licenceTypes = res.data
        }).catch(() => {
        })
    },
    optContact (data, type, index) {
      let _this = this
      switch (type) {
        case 'add':
          // data.editFlag = false
          this.records.licenceYearVO.licenceGroupYear.forEach(function (val, i) {
            if (val.dispositionType === data.dispositionType) {
              val.editFlag = false
              _this.oldRecords.splice(i, 1, JSON.parse(JSON.stringify(val)))
            }
          })
          // this.records.splice(index, 1, data)
          // this.oldRecords.splice(index, 0, JSON.parse(JSON.stringify(data)))
          break
        case 'update':
          this.records.licenceYearVO.licenceGroupYear.forEach(function (val) {
            if (val.dispositionType === data.dispositionType) {
              val.editFlag = true
            }
          })
          // this.records[index].editFlag = true
          break
        case 'delete':
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (_this.records.wastes && _this.records.wastes.length) {
              for (var i = 0; i < _this.records.wastes.length; i++) {
                if (_this.records.wastes[i].dispositionType === data.dispositionType) {
                  _this.records.wastes.splice(i, 1)
                  i--
                }
              }
            }
            if (this.records.licenceYearVO.licenceGroupYear && this.records.licenceYearVO.licenceGroupYear.length) {
              for (var j = 0; i < this.records.licenceYearVO.licenceGroupYear.length; j++) {
                if (this.records.licenceYearVO.licenceGroupYear[j].dispositionType === data.dispositionType) {
                  this.records.licenceYearVO.licenceGroupYear.splice(j, 1)
                  j--
                }
              }
            }
          })
          break
        case 'cancel':
          this.records.licenceYearVO.licenceGroupYear.forEach(function (val, i) {
            if (val.dispositionType === data.dispositionType) {
              _this.oldRecords[i].editFlag = false
              _this.records.licenceYearVO.licenceGroupYear.splice(i, 1, JSON.parse(JSON.stringify(_this.oldRecords[i])))
            }
          })
          break
        case 'addLandfillData':
          let obj = {
            addLandfillWasteVisible: true,
            type: this.checkObj.type
          }
          this.$emit('addLandfillData', obj)
          break
        case 'addWaste':
          getClassCodeAndWasteCode()
            .then(res => {
              this.addLicenceType.dispositionType = data.dispositionType
              this.addLicenceType.dispositionTypeText = data.dispositionTypeText
              this.treeObj.data = res.data
              this.treeObj.type = this.checkObj.type
              this.treeVisible = true
            }).catch(() => {
            })
          break
      }
    },
    optContactWaste (data, type, index) {
      switch (type) {
        case 'delete':
          this.records.wastes.splice(index, 1)
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
    },
    cancelData () {
      this.$router.push({
        path: '/licenseInfo'
      })
    },
    addRecords () {
      let _this = this
      let addObj = {}
      if (this.form.licenceType) {
        if (this.licenceTypes.length) {
          this.licenceTypes.forEach(function (val) {
            if (val.code === _this.form.licenceType) {
              addObj.dispositionType = val.code
              addObj.dispositionTypeText = val.name
            }
          })
          if (this.records.licenceYearVO.licenceGroupYear.length) {
            for (var i = 0; i < this.records.licenceYearVO.licenceGroupYear.length; i++) {
              if (this.records.licenceYearVO.licenceGroupYear[i].dispositionType === this.form.licenceType) {
                COMMONJS.showToast('该处置方式已添加', 'warning')
                return false
              }
            }
          }
        }
        // 有效期分段逻辑
        if (this.validityTerm.beginTime && this.validityTerm.endTime) {
          let records = []
          let beginDate = new Date(this.validityTerm.beginTime.substring(0, 10))
          let endDate = new Date(this.validityTerm.endTime.substring(0, 10))
          let beginYear = beginDate.getFullYear()
          let endYear = endDate.getFullYear()
          let intervalYear = endYear - beginYear + 1
          if (intervalYear) {
            for (var j = 0; j < intervalYear; j++) {
              addObj.editFlag = false
              if (j) {
                addObj.startTime = JSON.parse(JSON.stringify((beginYear + j) + '-' + '01' + '-' + '01' + ' 00:00:00'))
                addObj.approvedQuantity = this.form.approvedQuantity
              } else {
                addObj.startTime = JSON.parse(JSON.stringify(this.validityTerm.beginTime))
                addObj.editFlag = true
              }
              if ((beginYear + j) < endYear) {
                if (COMMONJS.isLeapYear(beginYear + j)) {
                  addObj.endTime = JSON.parse(JSON.stringify((beginYear + j) + '-' + '12' + '-' + '31' + ' 00:00:00'))
                } else {
                  addObj.endTime = JSON.parse(JSON.stringify((beginYear + j) + '-' + '12' + '-' + '30' + ' 00:00:00'))
                }
              } else {
                addObj.endTime = JSON.parse(JSON.stringify(this.validityTerm.endTime))
                addObj.editFlag = true
                addObj.approvedQuantity = ''
              }
              addObj.approvedQuantity = JSON.parse(JSON.stringify(this.form.approvedQuantity))
              addObj.approvedQuantityYear = JSON.parse(JSON.stringify(this.form.approvedQuantity))
              records.push(JSON.parse(JSON.stringify(addObj)))
            }
          } else {
            addObj.startTime = JSON.parse(JSON.stringify(this.validityTerm.beginTime))
            addObj.endTime = JSON.parse(JSON.stringify(this.validityTerm.endTime))
            addObj.editFlag = true
            addObj.approvedQuantity = JSON.parse(JSON.stringify(this.form.approvedQuantity))
            addObj.approvedQuantityYear = JSON.parse(JSON.stringify(this.form.approvedQuantity))
            records.push(JSON.parse(JSON.stringify(addObj)))
          }
          let mergeCellDispositionTypeObj = {
            'firstRow': 2 + _this.records.licenceYearVO.licenceGroupYear.length,
            'lastRow': 2 + _this.records.licenceYearVO.licenceGroupYear.length + intervalYear - 1,
            'firstCol': 0,
            'lastCol': 0
          }
          let mergeCellOptObj = {
            'firstRow': 2 + _this.records.licenceYearVO.licenceGroupYear.length,
            'lastRow': 2 + _this.records.licenceYearVO.licenceGroupYear.length + intervalYear - 1,
            'firstCol': 4,
            'lastCol': 4
          }
          _this.records.licenceYearVO.mergeCellInfoList.push(mergeCellDispositionTypeObj)
          _this.records.licenceYearVO.mergeCellInfoList.push(mergeCellOptObj)
          records.forEach(function (val) {
            _this.records.licenceYearVO.licenceGroupYear.push(JSON.parse(JSON.stringify(val)))
            _this.oldRecords.push(JSON.parse(JSON.stringify(val)))
          })
        }
      } else {
        COMMONJS.showToast('请先选择处置方式', 'warning')
      }
    },
    changeTreeVisibleP (obj) {
      // this.treeData = obj.treeData
      this.treeVisible = obj.treeVisible
      this.treeObj = {
        data: obj.treeData,
        type: obj.type
      }
    },
    getChooseTreeDataP (obj) {
      this.treeVisible = obj.treeVisible
      for (var i = 0; i < obj.treeData.length; i++) {
        obj.treeData[i].dispositionType = this.addLicenceType.dispositionType
        obj.treeData[i].dispositionTypeText = this.addLicenceType.dispositionTypeText
        obj.treeData[i].wasteClassCode = obj.treeData[i].stdClassCode
        obj.treeData[i].wasteCode = obj.treeData[i].code
        obj.treeData[i].wasteName = obj.treeData[i].name
        this.records.wastes.push(obj.treeData[i])
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.records.licenceYearVO.mergeCellInfoList) {
        let mergeList = this.records.licenceYearVO.mergeCellInfoList
        for (let i = 0; i < mergeList.length; i++) {
          if (rowIndex === (mergeList[i].firstRow - 2)) {
            if ((columnIndex === mergeList[i].firstCol) && (columnIndex === mergeList[i].lastCol)) {
              return {
                rowspan: mergeList[i].lastRow - mergeList[i].firstRow + 1,
                colspan: 1
              }
            }
          } else if ((rowIndex > (mergeList[i].firstRow - 2)) && (rowIndex < (mergeList[i].lastRow - 1))) {
            if ((columnIndex === mergeList[i].firstCol) && (columnIndex === mergeList[i].lastCol)) {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .validity-term .el-form-item__content{
    text-align: left;
  }
</style>
