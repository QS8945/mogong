<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="制度类型：">
                    <el-select v-model="queryForm.type"  clearable placeholder="请选择制度类型">
                        <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="queryForm.type" @keyup.enter.native="queryData" placeholder="请输入二位码" clearable></el-input> -->
                </el-form-item>
                <el-form-item label="标题：">
                    <el-input v-model="queryForm.title" @keyup.enter.native="queryData" placeholder="请输入标题" clearable></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="queryData">查询</el-button>
                    <el-button @click="getSecurityRuleInfoForWord" type="primary" >导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <div class="table-content-opt">
                <el-button type="primary" @click="addData">新增</el-button>
            </div>
            <v-table :dataTable="dataTable" :selection="false" @operation="operationP"></v-table>
            <div class="block">
                <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                            @reloadSize="jumpSize"></v-pagination>
            </div>
        </div>
         <!--//添加企业安环制度-->
        <div v-if="dialogFormVisible">
        <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}企业安环制度</div>
            </div>
            <v-add-annulus :checkObj="checkObjP" ref="addAnnulus" @reload="reload"></v-add-annulus>
        </el-dialog>
        </div>
    </div>

</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { getSecurityRuleInfoList, getDispCodeAndNameDic, deleteSecurityRuleInfo, getSecurityRuleInfoForWord } from '@/assets/js/API/api'
import AddEnterpriseannulusSystem from '@/views/annulus/dialog/addEnterpriseannulusSystem'
import { debuglog } from 'util';
export default {
    name: 'enterpriseSafeRingSystem',
    data() {
        return {
            queryForm: {},
            typeOptions: [],
            checkObjP: {},
            dataTable: {},
            page: {
                current: GLB_CONSTANT.page.current,
                size: GLB_CONSTANT.page.size,
                total: 0
            },
            dialogFormTitle: '添加',
            dialogFormVisible: false
        }
    },
    // 组件
    components: {
        'v-table': CustomTable,
        'v-pagination': Pagination,
        'v-add-annulus': AddEnterpriseannulusSystem
    },
    created() {
        this.dataTable.tableHead = [{
            'value': 'typeName',
            'name': '制度类型'
        }, {
            'value': 'title',
            'name': '标题'
        }, {
            'value': 'operation',
            'name': '操作',
            'type': [{
                'option': 'query',
                'name': '查看'
            }, {
                'option': 'update',
                'name': '编辑'
            }, {
                'option': 'delete',
                'name': '删除'
            }]
        }];
        this.picklistData();
        this.getData();
    },
    methods: {
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "ruleType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
        },
        queryData() {
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        getData() {
            let _this = this;
            let postData = {
                type: this.queryForm.type,
                current: this.page.current,
                size: this.page.size,
                title: this.queryForm.title
            }
            getSecurityRuleInfoList(postData)
                .then(res => {
                    // _this.dataTable.records = res.data.records;
                    _this.$set(_this.dataTable, 'records', res.data.records)
                    _this.page.total = res.data.total;
                }).catch(() => {

                })
        },
        operationP(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['addAnnulus'].show(obj.data.id);
                    })
                    break
                case 'update':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '编辑'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['addAnnulus'].show(obj.data.id);
                    })
                    break
                case 'delete':
                    this.delSection(JSON.parse(JSON.stringify(obj.data.id)))
                    break
            }
        },
        delSection: function (id) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let postData = { ids: [id] };
                deleteSecurityRuleInfo(postData)
                    .then(res => {
                        COMMONJS.showToast('删除成功', 'success');
                        this.getData();
                    }).catch(() => {

                    })
            })
                .catch(function () { })
        },
        addData: function () {
            this.checkObjP = {
                type: 'add',
                data: {}
            }
            this.dialogFormVisible = true;
            let _this = this;
            this.$nextTick(function () {
                _this.$refs['addAnnulus'].show('');
            })
        },
        jumpPage(index) {
            this.page.current = index
            this.getData()
        },
        jumpSize(val) {
            this.page.size = val
            this.page.current = 1
            this.getData()
        },
      getSecurityRuleInfoForWord: function () {
        window.open(GLB_CONSTANT.devUrl.serviceSiteRootUrl+'/web/disposition/securityRuleInfo/exportWord?fileName=安环制度.doc');
            // getSecurityRuleInfoForWord()
            //     .then(res => {
            //
            //       COMMONJS.showToast('文件导出成功', 'success');
            //     }).catch(() => {
            //
            //     })
        },
        reload: function () {
            this.dialogFormVisible = false;
            this.queryData();
        }
    }
}
</script>

<style>
</style>
