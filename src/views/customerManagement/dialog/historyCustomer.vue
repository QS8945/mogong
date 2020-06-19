<template>
    <div class="form-format contacts-management">
      <v-table v-if="tableVisible" :height="tableHeight" :dataTable="records" :selection="false"></v-table>
    </div>
</template>

<script>
import CustomTable from '@/components/customTable'
import { getAllCustomerCharge } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      tableHeight: '100%',
      records: {},
      tableVisible: false
    }
  },
  mounted () {
    this.getData()
  },
  components: {
    'v-table': CustomTable
  },
  props: ['entRelationId'],
  methods: {
    getData () {
      let _this = this
      let postData = {
        entRelationId: _this.entRelationId
      }
      getAllCustomerCharge(postData)
        .then(res => {
          _this.records.tableHead = [{
            'value': 'empName',
            'name': '姓名'
          }, {
            'value': 'telephone',
            'name': '联系方式'
          }, {
            'value': 'createTime',
            'name': '开始负责时间'
          }, {
            'value': 'updateTime',
            'name': '结束负责时间'
          }, {
            'value': 'remark',
            'name': '备注'
          }]
          _this.records.records = res.data
          _this.tableVisible = true
          // _this.page.total = res.data.total
          // _this.tableData = res.data
        }).catch(() => {
        })
    },
    cancelForm () {
      this.$emit('changeContactsVisible', false)
    }
  }
}
</script>

<style>
  .contacts-management .dialog-footer{
    padding: 10px 20px 20px 10px;
  }
  .contacts-management{
    height: 100%;
  }
  .contacts-management .customTable .el-table{
    height: 100% !important;
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
</style>
