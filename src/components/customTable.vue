<!--组件说明&#45;&#45;&#45;&#45;type:{-->
  <!--Date  日期格式化-->
  <!--DateTime  日期时间格式化-->
  <!--Time  时间格式化-->
  <!--Number  数字保留两位小数格式化-->
  <!--YesOrNo  boolean是否格式化-->
<!--}-->
<!--操作栏btn逻辑过于复杂不建议使用本组件-->
<!--{-->
<!--'type': [{-->
      <!--'option': 'query',-->
      <!--'name': '查看'-->
    <!--}, {-->
      <!--'option': 'update',-->
      <!--'name': '编辑'-->
    <!--}, {-->
      <!--'option': 'delete',-->
      <!--'name': '删除'-->
  <!--}]-->
<!--}-->
<template>
  <div class="customTable">
    <el-table
            ref="dataTable"
            size="small"
            :data="dataTable.records"
            v-loading="loadingTable"
            :stripe="stripe"
            :border="border"
            :summary-method="getSummaries"
            :span-method="dataTable.mergeCellInfoList && objectSpanMethod"
            @selection-change="handleSelectionChange"
            :height="tableHeight"
            :show-summary="showSummary"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss">
      <!--多项选择-->
      <el-table-column label="序号" v-if="selection && dataTable.tableHead.length"
                       type="selection">
      </el-table-column>
      <!--自定义扩展字段-->
      <!--<template v-if="dataTable.isExpand">-->
      <!--<el-table-column type="expand">-->
      <!--<template slot-scope="props">-->
      <!--<el-form label-position="left" inline class="demo-table-expand">-->
      <!--<el-form-item v-for="item in dataTable.pageResult.expandTableHead" :label="item.name"-->
      <!--:key="item.entId">-->
      <!--<span>{{ props.row[item.value] }}</span>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</template>-->
      <!--自定义表格元素-->
      <template v-for="bodyItem in dataTable.tableHead">
        <!--日期格式化-->
        <el-table-column v-if="bodyItem.type === 'Date'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value] | formatDate}}
          </template>
        </el-table-column>
        <!--时间格式化-->
        <el-table-column v-else-if="bodyItem.type === 'Time'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value] | formatTime}}
          </template>
        </el-table-column>
        <!--时间格式化-->
        <el-table-column v-else-if="bodyItem.type === 'DateTime'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value] | formatDateTime}}
          </template>
        </el-table-column>
        <!--保留两位-->
        <el-table-column v-else-if="bodyItem.type === 'Number'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="right">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value] | formatNum}}
          </template>
        </el-table-column>
        <!--是否-->
        <el-table-column v-else-if="bodyItem.type === 'YesOrNo'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value] ? '是' : '否'}}
          </template>
        </el-table-column>
        <!--停用启用-->
        <el-table-column v-else-if="bodyItem.type === 'enabled'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row[bodyItem.value] ? '启用' : '停用'" placement="top">
              <el-switch
                      @change="optInfo(scope.row, 'enabled')"
                      v-model="scope.row[bodyItem.value]"
                      active-color="#40C3AB"
                      inactive-color="#E0F2EF"
                      :active-value="1"
                      :inactive-value="0">
              </el-switch>
            </el-tooltip>
            <!--<div :class="{'text-orange':scope.row.status==='0'}">{{scope.row.statusName}}</div>-->
          </template>
        </el-table-column>
        <!--超链接跳转-->
        <el-table-column v-else-if="bodyItem.type === 'button'" :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope" style="cursor: pointer;">
             <el-button type="text" @click="viewEntDetail(scope.row[bodyItem.pathId],bodyItem.value)">{{scope.row[bodyItem.value]}}</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column-->
                <!--prop="statusName"-->
                <!--align="center"-->
                <!--label="状态">-->
          <!--<template slot-scope="scope">-->
            <!--<el-tooltip :content="scope.row.statusName" placement="top">-->
              <!--<el-switch-->
                      <!--v-model="scope.row.status"-->
                      <!--active-color="#409EFF"-->
                      <!--inactive-color="#E0F2EF"-->
                      <!--active-value="1"-->
                      <!--inactive-value="0">-->
              <!--</el-switch>-->
            <!--</el-tooltip>-->
            <!--&lt;!&ndash;<div :class="{'text-orange':scope.row.status==='0'}">{{scope.row.statusName}}</div>&ndash;&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--操作-->
        <el-table-column v-else-if="bodyItem.value === 'operation'"
                         :prop="bodyItem.value"
                         :key="bodyItem.value"
                         :label="bodyItem.name"
                         align="center">
          <template slot-scope="scope">
            <div class="opt-group"
                 :class="{'text-red':(scope.row[bodyItem.name]>0),'text-green':(scope.row[bodyItem.name]<0)}">
              <!--<span v-if="licenceBtn" class="opt-base"-->
              <!--@click="optInfo(scope.row, 'licence')" type="text" size="small">-->
              <!--许可证明细-->
              <!--</span>-->
              <!--<span v-for="item in bodyItem.type" :key="item.option">-->
                <span v-for="item in bodyItem.type" :key="item.option" class="opt-base" v-if="!item.showConditon||(scope.row[item.showConditon.split('=')[0]]==item.showConditon.split('=')[1])"  @click="optInfo(scope.row, item.option)" type="text" size="small">
                  {{item.name}}
                </span>
              <!--</span>-->

              <!--<span class="opt-base"-->
                    <!--@click="optInfo(scope.row, 'query')" type="text" size="small">-->
                              <!--查看-->
                            <!--</span>-->
              <!--<span class="opt-base" v-if="(!btnVisible) || (scope.row.isNotOverdue)"-->
                    <!--@click="optInfo(scope.row, 'update')" type="text" size="small">-->
                                <!--编辑-->
                            <!--</span>-->
              <!--<span v-if="deleteBtn" class="opt-base"-->
                    <!--@click="optInfo(scope.row, 'delete')" type="text" size="small">-->
                                <!--删除-->
                            <!--</span>-->
              <!--<span class="opt-base" v-if="enableBtn && ((!btnVisible) || (scope.row.isNotOverdue || scope.row.name))"-->
                    <!--@click="optInfo(scope.row, 'enable')" type="text" size="small">-->
                                <!--{{scope.row.enabled ? '停用' : '启用'}}-->
                            <!--</span>-->
              <!--<span class="opt-base opt-more" type="text" size="small">-->
              <!--<el-dropdown @command="handleCommand">-->
              <!--<span class="el-dropdown-link">-->
              <!--<span>更多</span>-->
              <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right">-->
              <!--</i>-->
              <!--</span>-->
              <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item-->
              <!--:command="{row:scope.row,act:'on'}">{{scope.row.status === '0' ? '启用' : '停用'}}</el-dropdown-item>-->
              <!--<el-dropdown-item :command="{row:scope.row,act:'resetPwd'}">重置密码</el-dropdown-item>-->
              <!--<el-dropdown-item :command="{row:scope.row,act:'setAdmin'}">设为管理员</el-dropdown-item>-->
              <!--</el-dropdown-menu>-->
              <!--</el-dropdown>-->
              <!--</span>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else :prop="bodyItem.value" :key="bodyItem.value"
                         :label="bodyItem.name"
                         :show-overflow-tooltip="true"
                         align="center">
          <template slot-scope="scope">
            {{scope.row[bodyItem.value]||scope.row[bodyItem.value]==0?scope.row[bodyItem.value] : '-'}}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { formatDate } from '@/assets/js/date.js'

export default {
  name: 'customTable',
  // data () {
  //   return {}
  // },
  props: {
    dataTable: { // 默认数据
      type: Object,
      default () {
        return {
          tableHead: []
        }
      }
    },
    tableHeight: { // 默认高度
      type: String,
      default: '100%'
    },
    showSummary: { // 默认高度
      type: Boolean,
      default: false
    },
    loadingTable: { // 默认loading
      type: Boolean,
      default: false
    },
    selection: { // 默认打开选择功能
      type: Boolean,
      default: true
    }, // ['dataTable', 'tableHeight', 'loadingTable', 'selection'],
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return '-'
      }
      (time.indexOf('年') !== -1) && (time = time.replace(/年/, '-'));
      (time.indexOf('月') !== -1) && (time = time.replace(/月/, '-'));
      (time.indexOf('日') !== -1) && (time = time.replace(/日/, ' '));
      (time.indexOf('时') !== -1) && (time = time.replace(/时/, ':'));
      (time.indexOf('分') !== -1) && (time = time.replace(/分/, ':'));
      (time.indexOf('秒') !== -1) && (time = time.replace(/秒/, ''))
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatTime (time) {
      if (!time) {
        return '-'
      }
      (time.indexOf('年') !== -1) && (time = time.replace(/年/, '-'));
      (time.indexOf('月') !== -1) && (time = time.replace(/月/, '-'));
      (time.indexOf('日') !== -1) && (time = time.replace(/日/, ' '));
      (time.indexOf('时') !== -1) && (time = time.replace(/时/, ':'));
      (time.indexOf('分') !== -1) && (time = time.replace(/分/, ':'));
      (time.indexOf('秒') !== -1) && (time = time.replace(/秒/, ''))
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'hh:mm:ss')
    },
    formatDateTime (time) {
      if (!time) {
        return '-'
      }
      (time.indexOf('年') !== -1) && (time = time.replace(/年/, '-'));
      (time.indexOf('月') !== -1) && (time = time.replace(/月/, '-'));
      (time.indexOf('日') !== -1) && (time = time.replace(/日/, ' '));
      (time.indexOf('时') !== -1) && (time = time.replace(/时/, ':'));
      (time.indexOf('分') !== -1) && (time = time.replace(/分/, ':'));
      (time.indexOf('秒') !== -1) && (time = time.replace(/秒/, ''))
      let date = new Date(time.substring(0, 19))
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatNum (num) {
      return parseFloat(parseFloat(num || 0).toFixed(2))
    }
  },
  mounted () {
    // console.log(this.dataTable)
    // this.getData()
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('reloadSelect', val)
    },
    // 判断停用启用
    enableFlag (rowData) {
      let enableList = ['enabled']
      for (var i = 0; i < enableList.length; i++) {
        if (rowData[enableList[i]]) {
          if (rowData[enableList[i]] === '0') {
            return parseInt(rowData[enableList[i]])
          } else {
            return rowData[enableList[i]]
          }
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.dataTable.mergeCellInfoList) {
        let mergeList = this.dataTable.mergeCellInfoList
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
    },
    optInfo (rowData, type) {
      let obj = {
        operation: type,
        data: JSON.parse(JSON.stringify(rowData))
      }
      this.$emit('operation', obj)
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return parseFloat(parseFloat((prev + curr) || 0).toFixed(2))
            } else {
              return parseFloat(parseFloat(prev || 0).toFixed(2))
            }
          }, 0)
        } else {
          sums[index] = '-'
        }
      })
      // sums = parseFloat(parseFloat(sums || 0).toFixed(2))
      return sums
    },
    viewEntDetail (id, value) {
      this.$emit('customFunction', id, value)
      // var vm = this;
      // vm.checkObjP = {};
      // vm.checkObjP.dataId = pathId;
      // vm.checkObjP.type = 'query'
      // vm.$router.replace({
      //     path: path,
      //     query: vm.checkObjP //不建议用query 后面要优化
      // })
    }
  }
}
</script>

<style scoped>
</style>
