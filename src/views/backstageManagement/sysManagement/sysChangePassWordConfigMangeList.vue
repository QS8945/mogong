<template>
    <div class="eil_list_main" style="margin-top:14px">
        <el-table v-loading="loading" border  ref="tableData" :data="tableData" size="medium"
                  @row-click='productRowToggleSelection' :height="tableHeight">
            <el-table-column :label="$t('sysChangePasswordConfigManage.frequency')" show-overflow-tooltip prop="frequency"></el-table-column>
            <el-table-column :label="$t('sysChangePasswordConfigManage.unit')" show-overflow-tooltip prop="unit"></el-table-column>
            <el-table-column :label="$t('sysChangePasswordConfigManage.allowRepeatCountOfYear')" show-overflow-tooltip prop="allowRepeatCountOfYear"></el-table-column>
            <el-table-column :label="$t('sysChangePasswordConfigManage.createTime')" show-overflow-tooltip prop="createTime"></el-table-column>
            <el-table-column :label="$t('sysChangePasswordConfigManage.updateTime')" show-overflow-tooltip prop="updateTime"></el-table-column>
            <el-table-column :label="$t('button.operation')" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="starnd_color">
                        <span class="Margin_font"  @click="handleEdit(scope.row,scope.$index)">{{$t('button.edit')}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div style="height:7vh"></div>
        <sysChangePasswordConfigEdit ref="passWordConfig" @reLoad="initData"></sysChangePasswordConfigEdit>
    </div>
</template>
<script>
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import sysChangePasswordConfigEdit from './dialog/sysChangePasswordConfigEdit.vue'
import { sysChangePasswordList } from '@/assets/js/API/api'

export default {
  data () {
    return {
      loading: false,
      keyword: '',
      tableData: [],
      current: '',
      size: '',
      getRowKeys (row) {
        return row.id
      },
      expands: [],
      /*  //分页
                  pageIndex: GLOBAL_CONFIG.page.current,
                  pageSize: GLOBAL_CONFIG.page.size,
                  pageSizes: GLOBAL_CONFIG.page.sizes,
                  totalRecord: 0, */
      layout: GLB_CONSTANT.page.layout,
      tableHeight: '70vh'
    }
  },
  components: {
    sysChangePasswordConfigEdit
  },
  mounted: function () {
    this.initData()
  },
  methods: {
    initData: function () {
      this.getList()
    },
    queryForm: function () {
      this.initData()
    },
    handleEdit: function (row, index) {
      this.$refs.passWordConfig.show(row.id)
    },
    handleDiscontinue: function (row, index) {},
    productRowToggleSelection: function (row) {
      this.$refs.tableData.toggleRowSelection(row)
    },
    getList: function () {
      // var requestStr = 'sysChangePasswordConfig/list.do'
      var params = {}
      sysChangePasswordList(params).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      }).catch(() => {
      })
      // return v.get(requestStr, queryParam)
      //   .then(res => {
      //     if (res.data) {
      //       this.tableData = res.data
      //     }
      //     this.loading = false
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    }
  }
}
</script>
<style>
.Margin_font {
    margin-right: 5px;
}
</style>
