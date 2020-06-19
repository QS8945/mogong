<template>
    <div class="view-total baseForm contacts-management">
      <div class="table-content">
        <el-table
        v-if="tableVisible"
        :data="records"
        style="width: 100%"
        :height="tableHeight"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column
        prop="name"
        label="项目名称"
        :show-overflow-tooltip="true"
        align="center">
        </el-table-column>
        <el-table-column
        prop="dispositionTypeText"
        label="处置方式"
        :show-overflow-tooltip="true"
        align="center">
        </el-table-column>
        <el-table-column
        prop="quantity"
        label="年处理能力"
        :show-overflow-tooltip="true"
        align="center">
        <template slot-scope="scope">
        {{scope.row.quantity | formatNum}}
        </template>
        </el-table-column>
        <el-table-column
        prop="unit"
        label="计量单位"
        :show-overflow-tooltip="true"
        align="center">
        </el-table-column>
        <el-table-column
        prop="status"
        label="状态"
        :show-overflow-tooltip="true"
        align="center">
        <template slot-scope="scope">
        {{(scope.row.status==='1') ? '启用' : '停用'}}
        </template>
        </el-table-column>
        <el-table-column
        prop="operation"
        label="操作"
        align="center">
        <template slot-scope="scope">
        <div class="opt-group">
        <span class="opt-base"
        @click="operationP({data: scope.row, operation: 'query'})" type="text" size="small">
        查看
        </span>
        <span class="opt-base"
        @click="operationP({data: scope.row, operation: 'update'})" type="text" size="small">
        编辑
        </span>
        <span class="opt-base"
        @click="operationP({data: scope.row, operation: 'enable'})" type="text" size="small">
        {{scope.row.status==='1' ? '停用' : '启用'}}
        </span>
        <span v-if="scope.row.status==='1'" class="opt-base"
        @click="operationP({data: scope.row, operation: 'delete'})" type="text" size="small">
        删除
        </span>
        <!--<span class="opt-base" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'update', scope.$index)" type="text" size="small">编辑</span>-->
        <!--<span class="opt-base opt-more" :disabled="checkObj.type==='query'" @click="optContact(scope.row, 'delete', scope.$index)" type="text" size="small">删除</span>-->
        </div>
        </template>
        </el-table-column>
        </el-table>
        <div class="block">
        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
        @reloadSize="jumpSize"></v-pagination>
        </div>
      </div>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
import { formatDate } from '@/assets/js/date.js'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import { projectListProject } from '@/assets/js/API/api'
export default {
  name: 'addWaste',
  data () {
    return {
      tableHeight: '100%',
      tableVisible: false,
      records: [],
      queryForm: {},
      page: {
        current: GLB_CONSTANT.page.current,
        size: GLB_CONSTANT.page.size,
        total: 0
      }
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      let date = new Date(time.substring(0, 10))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  // 组件
  components: {
    'v-pagination': Pagination
  },
  mounted () {
    this.getData()
  },
  methods: {
    queryData (queryForm) {
      this.page.current = GLB_CONSTANT.page.current
      this.queryForm = queryForm
      this.getData()
    },
    getData () {
      console.log(this.queryForm)
      let _this = this
      let postData = {
        entId: localStorage.getItem('id'),
        current: this.page.current,
        size: this.page.size/*,
        deletedWaste: this.queryForm.deletedWaste,
        classCode: this.queryForm.classCode,
        wasteCode: this.queryForm.wasteCode,
        entWasteName: this.queryForm.entWasteName,
        valid: this.queryForm.valid ? 0 : 1 */
      }
      projectListProject(postData)
        .then(res => {
          _this.records = res.data.records
          _this.page.total = res.data.total
          _this.tableVisible = true
        }).catch(() => {
        })
    },
    jumpPage (index) {
      this.page.current = index
      this.getData()
      // this.$emit('reload', 3)
    },
    jumpSize (val) {
      this.page.size = val
      this.page.current = 1
      this.getData()
      // this.$emit('reload', 3)
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
