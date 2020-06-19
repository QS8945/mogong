<template>
  <div class="form-format contacts-management">
    <div class="card-list">
      <el-card class="box-card" v-for="item in dataList" :key="item.contactName" :class="{'current-contact': item.id === contactId}">
        <div slot="header" class="clearfix link-point">
          <i v-if="item.principal === 1" class="el-icon-star-on" style="color:green;font-size:18px"></i>
          <span>{{(item.id === contactId) ? '主要' : ''}}联系人</span>
          <span class="btn-group">
            <el-button plain type="text">
              <i class="el-icon-delete" @click.stop="optContact('del', item.id)"></i>
            </el-button>
            <el-button plain type="text">
              <i class="el-icon-edit" @click.stop="optContact('update', item)"></i>
            </el-button>
          </span>
        </div>
        <div class="text item link-point">
          <el-tooltip :open-delay="700" :content="'联系人:'+item.customerContact" placement="top" :enterable="false">
            <div class="item-body">
              <span class="item-text">联系人:</span>{{item.customerContact}}
            </div>
          </el-tooltip>
          <el-tooltip :open-delay="700" :content="'联系电话:'+item.customerContactPhone" placement="top" :enterable="false">
            <div class="item-body">
              <span class="item-text">联系电话:</span>{{item.customerContactPhone}}
            </div>
          </el-tooltip>
          <el-tooltip :open-delay="700" :content="'邮箱:'+item.contactEmail" placement="top" :enterable="false">
            <div class="item-body">
              <span class="item-text">邮箱:</span>{{item.contactEmail}}
            </div>
          </el-tooltip>
          <el-tooltip :open-delay="700" :content="'所属部门:'+item.deptName" placement="top" :enterable="false">
            <div class="item-body">
              <span class="item-text">所属部门:</span>{{item.deptName}}
            </div>
          </el-tooltip>
          <el-tooltip :open-delay="700" :content="'职位:'+item.contactPosition" placement="top" :enterable="false">
            <div class="item-body">
              <span class="item-text">职位:</span>{{item.contactPosition}}
            </div>
          </el-tooltip>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="add-contact" @click="optContact('add')">
          <div class="add-icon">
            <i class="el-icon-plus"></i>
          </div>
          <div>新增联系人</div>
        </div>
      </el-card>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitDialog('addForm')">保存</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import COMMONJS from '@/assets/js/common.js'
  import {
    getCodeAndNameDic,
    getClassCode,
    getWasteCode,
    getCustomerContacts,
    deleteContacts,
    getCustomerContactsListPage,
    deleteCustomerContacts,
    setCustomerContactsPrincipal
  } from '@/assets/js/API/api'
  export default {
    name: 'addWaste',
    data() {
      return {
        dataList: [],
        contactId: '',
        currentUser: {}
      }
    },
    props: ['entRelationId', 'ownerEntId', 'entId'],
    mounted() {
      this.getData()
    },
    methods: {
      submitDialog(formName) {
        let _this = this
        // this.$emit('reloadPage', index)
        if (this.contactId) {
          let postData = {
            id: this.contactId
          }
          setCustomerContactsPrincipal(postData)
            .then(res => {
              COMMONJS.showToast('设置成功')
              this.$emit('changeContactsVisible', false)
              this.$emit('setCurrentContact', _this.currentUser)
            }).catch(() => {})
        } else {
          COMMONJS.showToast('请选择当前联系人', 'warning')
        }
      },
      getData() {
        let _this = this
        let postData = {
          entId: _this.entId, //客户企业
          ownerEntId: _this.ownerEntId, //主体企业,
          current: 1,
          size: 1000
        }
        getCustomerContactsListPage(postData)
          .then(res => {
            res.data.records.forEach(function (val) {
              if (val.principal === 1) {
                _this.contactId = val.id
                _this.setCustomerContactsPrincipal(val)
              }
            })
            this.dataList = res.data.records
          }).catch(() => {})
      },
      cancelForm() {
        this.$emit('changeContactsVisible', false)
      },
      getCodeAndNameDicWasteForm() {
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
      getCodeAndNameDicWasteFeatures() {
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
      getClassCode() {
        let _this = this
        getClassCode()
          .then(res => {
            _this.classCodes = res.data
          }).catch(() => {})
      },
      getWasteCode() {
        let _this = this
        getWasteCode()
          .then(res => {
            _this.wasteCodes = res.data
          }).catch(() => {})
      },
      getWasteCodes() {
        let _this = this
        this.addForm.wasteCode = ''
        // if (!_this.addForm.wasteCode) {
        getWasteCode({
          code: _this.addForm.classCode
        }).then(res => {
          _this.addForm.wasteCode = res.data.length ? res.data[0].code : ''
          _this.wasteCodes = res.data
          // console.log(res)
        }).catch(() => {})
        // }
      },
      getClassCodes() {
        let _this = this
        getClassCode({
          code: _this.addForm.wasteCode
        }).then(res => {
          _this.addForm.classCode = res.data[0].code
        }).catch(() => {})
      },
      optContact(type, data) {
        switch (type) {
          case 'add':
            this.$emit('optContact', 'add')
            break
          case 'update':
            this.$emit('optContact', 'update', data)
            break
          case 'del':
            let postData = {
              id: data
            }
            let _this = this
            this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              deleteCustomerContacts(postData).then(res => {
                COMMONJS.showToast('删除成功')
                _this.$emit('reload', true)
              }).catch(() => {})
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
            break
        }
      },
      setCustomerContactsPrincipal(item) {
        this.contactId = item.id
        this.currentUser.contacts = item.customerContact
        this.currentUser.contactsPhone = item.customerContactPhone
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

  .link-point {
    cursor: pointer;
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

  .box-card.current-contact {}

</style>
