<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <div v-if="activeName == 'store'">
                    <el-form-item label="采购辅材：">
                        <el-input v-model="queryForm.auxiliaryName" @keyup.enter.native="queryData" placeholder="请输入辅材名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="仓库" prop="storageId">
                        <el-select filterable  v-model="queryForm.storageId"  clearable placeholder="请选择仓库">
                            <el-option v-for="item in storageOptions" :key="item.id"  :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button @click="queryData">查询</el-button>
                    </el-form-item>
                 </div>
                 <div v-else>
                    <el-form-item label="出库日期：">
                        <el-date-picker v-model="queryForm.depositDate" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="采购辅材：">
                        <el-input v-model="queryForm.auxiliaryName" @keyup.enter.native="queryData" placeholder="请输入辅材名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="仓库" prop="storageId">
                        <el-select filterable  v-model="queryForm.storageId"  clearable placeholder="请选择仓库">
                            <el-option v-for="item in storageOptions" :key="item.id"  :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button @click="queryData">查询</el-button>
                    </el-form-item>
                </div>
                
            </el-form>
        </div>
        <div class="table-content">
             <el-tabs v-model="activeName" @tab-click="tabclick" type="border-card">
                <el-tab-pane label="库存清单" name="store">
                    <v-table :dataTable="storeTable" :selection="false" @operation="operationP1"></v-table>
                    <div class="block">
                        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                                    @reloadSize="jumpSize"></v-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="出库清单"  name="deposit">
                    <v-table :dataTable="depositTable" :selection="false"  @operation="operationP2"></v-table>
                    <div class="block">
                        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                                    @reloadSize="jumpSize"></v-pagination>
                    </div>
                </el-tab-pane>
                
            </el-tabs>
        </div>
         <!--//添加原辅料-->
        <div v-if="dialogFormVisible">
            <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
                <div slot="title" class="dialog-title">
                <div><span class="green-line"></span>{{dialogFormTitle}}出库清单</div>
                </div>
                <v-add-purchaseDepositInfo :checkObj="checkObjP" ref="deposit" @reload="reload"></v-add-purchaseDepositInfo>
            </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { pagePurchaseInventoryOut, pagePurchaseInventory, getDispCodeAndNameDic, listStorage1 } from '@/assets/js/API/api'
import AddPurchaseDepositInfo from '@/views/purchaseManagement/dialog/addPurchaseDepositInfo'
import { debuglog } from 'util';
export default {
    name: 'purchaseDepositList',
    data() {
        return {
            queryForm: {
                auxiliaryName: '',
                depositDate: '',
                storageId: '',
                entId: localStorage.getItem("id")
            },
            activeName: 'store',
            storageOptions: [],
            checkObjP: {},
            depositTable: {},
            storeTable: {},
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            page: {
                current: GLB_CONSTANT.page.current,
                size: GLB_CONSTANT.page.size,
                total: 0
            },
            dialogFormTitle: '添加',
            dialogFormVisible: false,
            dialogFormVisible1: false
        }
    },
    // 组件
    components: {
        'v-table': CustomTable,
        'v-pagination': Pagination,
        'v-add-purchaseDepositInfo': AddPurchaseDepositInfo
    },
    created() {
        this.storeTable.tableHead = [
            {
                'value': 'storageName',
                'name': '仓库'
            },
            {
                'value': 'auxiliaryName',
                'name': '辅材名称'
            }, {
                'value': 'totalQuantity',
                'name': '当前库存'
            },
            {
                'value': 'unitName',
                'name': '单位'
            },
            {
                'value': 'price',
                'name': '平均单价'
            },
            {
                'value': 'operation',
                'name': '操作',
                'type': [{
                    'option': 'query1',
                    'name': '查看'
                }, {
                    'option': 'deposit',
                    'name': '出库'
                }]
            }
        ];
        this.depositTable.tableHead = [
            {
                'value': 'storageName',
                'name': '仓库'
            },
            {
                'value': 'auxiliaryName',
                'name': '辅材名称'
            },
            {
                'value': 'quantity',
                'name': '出库数量'
            }, {
                'value': 'unitName',
                'name': '单位'
            },
            {
                'value': 'takerName',
                'name': '领用人',
            },
            {
                'value': 'takeDate',
                'name': '领用日期',
                'type': 'Date'
            },
            {
                'value': 'residueQuantity',
                'name': '出库后存量',
            },
            {
                'value': 'operation',
                'name': '操作',
                'type': [{
                    'option': 'query2',
                    'name': '查看'
                }, {
                    'option': 'update',
                    'name': '编辑'
                }]
            }
        ];

        this.picklistData();
        this.getData();
    },
    methods: {
        picklistData() {
            listStorage1({ entId: localStorage.getItem('id') })
                .then(res => {
                    this.storageOptions = res.data;
                })
        },
        queryData() {
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        getData() {
            let _this = this;
            this.queryForm.current = this.page.current;
            this.queryForm.size = this.page.size;

            if (this.activeName == 'deposit') {
                if (this.queryForm.depositDate) {
                    this.queryForm.startTime = this.queryForm.depositDate[0];
                    this.queryForm.endTime = this.queryForm.depositDate[1];
                }
                else {
                    this.queryForm.startTime = "";
                    this.queryForm.endTime = "";
                }
                pagePurchaseInventoryOut(this.queryForm)
                    .then(res => {
                        _this.$set(_this.depositTable, 'records', res.data.records)
                        _this.page.total = res.data.total;
                    }).catch(() => { })
            }
            else {
                
                pagePurchaseInventory(this.queryForm)
                    .then(res => {
                        _this.$set(_this.storeTable, 'records', res.data.records)
                        _this.page.total = res.data.total;
                    }).catch(() => { })
            }

        },
        tabclick: function () {
            if (this.activeName == 'deposit') {

            }
            else {

            }
            this.getData();
        },
        operationP1(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query1':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['deposit'].show(obj.data.id);
                    })
                    break
                case 'deposit':
                    this.checkObjP.type = obj.operation;
                    this.dialogFormTitle = '编辑'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['deposit'].show(obj.data.id);
                    })
                    break
            }
        },
        operationP2(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query2':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['deposit'].show(obj.data.id);
                    })
                    break
                case 'update':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '编辑'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['deposit'].show(obj.data.id);
                    })
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
            let _this = this
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
                _this.$refs['deposit'].show('');
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
