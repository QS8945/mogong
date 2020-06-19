<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="辅材类型：">
                    <el-select v-model="queryForm.type"  clearable placeholder="请选择辅材类型">
                        <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="辅材名称：">
                    <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入辅材名称" clearable></el-input>
                </el-form-item>
                 <el-form-item label="状态：">
                    <el-select v-model="queryForm.status"  clearable placeholder="请选择状态">
                        <el-option v-for="item in statusOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="queryData">查询</el-button>
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
         <!--//添加原辅料-->
        <div v-if="dialogFormVisible">
        <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}原辅料</div>
            </div>
            <v-add-purchaseAuxiliaryInfo :checkObj="checkObjP" ref="addAnnulus" @reload="reload"></v-add-purchaseAuxiliaryInfo>
        </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { pagePurchaseAuxiliaryInfo, updatePurchaseAuxiliaryInfo, deletePurchaseAuxiliaryInfoById, getDispCodeAndNameDic } from '@/assets/js/API/api'
import AddPurchaseAuxiliaryInfo from '@/views/purchaseManagement/dialog/addPurchaseAuxiliaryInfo'
import { debuglog } from 'util';
export default {
    name: 'purchaseAuxiliaryList',
    data() {
        return {
            queryForm: {
                type: '',
                name: '',
                status: ''
            },
            typeOptions: [],
            statusOptions: [],
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
        'v-add-purchaseAuxiliaryInfo': AddPurchaseAuxiliaryInfo
    },
    created() {
        console.log(this.$route.path,1111);
        this.dataTable.tableHead = [{
            'value': 'code',
            'name': '辅材编号'
        }, {
            'value': 'type',
            'name': '辅材类型'
        },
        {
            'value': 'name',
            'name': '辅材名称'
        }, {
            'value': 'unitName',
            'name': '单位'
        },
        {
            'value': 'status',
            'name': '状态',
            'type': 'enabled'
        },
        {
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
            getDispCodeAndNameDic({ typeCode: "auxiliaryType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })

            this.statusOptions = [{ "name": '启用', 'code': 1 }, { "name": '停用', 'code': 0 }];
        },
        queryData() {
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        getData() {
            let _this = this;
            this.queryForm.current = this.page.current;
            this.queryForm.size = this.page.size;
            this.queryForm.entId = localStorage.getItem('id');
            pagePurchaseAuxiliaryInfo(this.queryForm)
                .then(res => {
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
                    this.delSection(obj.data.id);
                    break
                case 'enabled':
                    this.enableSection(JSON.parse(JSON.stringify(obj.data)));
                    break
            }
        },
        delSection: function (id) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let postData = { id: id };
                deletePurchaseAuxiliaryInfoById(postData)
                    .then(res => {
                        COMMONJS.showToast('删除成功', 'success');
                        this.getData();
                    }).catch(() => {

                    })
            })
                .catch(function () { })
        },
        enableSection(obj) {
            let _this = this;
            let postData = { id: obj.id, status: obj.status };
            updatePurchaseAuxiliaryInfo(postData).then(res => {
                let msg = obj.status ? '启用' : '停用'
                COMMONJS.showToast(`${msg}成功`)
                _this.getData()
            }).catch(() => { })
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
        reload: function () {
            this.dialogFormVisible = false;
            this.queryData();
        }
    }
}
</script>

<style>
</style>
