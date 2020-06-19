<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="供应商：">
                    <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入供应商" clearable></el-input>
                </el-form-item>
                <el-form-item label="供应类别：">
                    <el-select v-model="queryForm.type"  clearable placeholder="请选择供应类别">
                        <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
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
        <div v-if="dialogFormVisible">
        <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}供应商</div>
            </div>
            <v-add-purchaseProviderInfo :checkObj="checkObjP" ref="addAnnulus" @reload="reload"></v-add-purchaseProviderInfo>
        </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { listPurchaseProviderInfoVO, updatePurchaseProviderInfo, deletePurchaseProviderInfo, getDispCodeAndNameDic } from '@/assets/js/API/api'
import AddPurchaseProviderInfo from '@/views/purchaseManagement/dialog/addPurchaseProviderInfo'
import { debuglog } from 'util';
export default {
    name: 'purchaseProviderList',
    data() {
        return {
            queryForm: {
                type: '',
                name: '',
                status: '',
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
        'v-add-purchaseProviderInfo': AddPurchaseProviderInfo
    },
    created() {
        this.dataTable.tableHead = [{
            'value': 'code',
            'name': '编号'
        }, {
            'value': 'name',
            'name': '供应商'
        }, {
            'value': 'type',
            'name': '供应类别'
        }, {
            'value': 'cantonName',
            'name': '所在地'
        }, {
            'value': 'contacts',
            'name': '联系人'
        },
        {
            'value': 'contactNumber',
            'name': '联系电话'
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
            listPurchaseProviderInfoVO(this.queryForm)
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
                    this.delSection(obj.data.id);
                    break
                case 'enabled':
                    this.enableSection(obj.data);
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
                deletePurchaseProviderInfo(postData)
                    .then(res => {
                        COMMONJS.showToast('删除成功', 'success');
                        this.getData();
                    }).catch(() => {

                    })
            })
                .catch(function () { })
        },
        enableSection(obj) {
            let _this = this
            let postData = { id: obj.id, status: obj.status};
            updatePurchaseProviderInfo(postData).then(res => {
                let msg = obj.status ? '启用' : '停用'
                COMMONJS.showToast(`${msg}成功`)
                _this.getData();
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
