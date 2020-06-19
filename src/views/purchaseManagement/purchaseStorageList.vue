<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <div v-if="activeName == 'await'">
                    <el-form-item label="申请单号:">
                        <el-input v-model="queryForm.code" @keyup.enter.native="queryData" placeholder="请输入申请单号" ></el-input>
                    </el-form-item>
                    <el-form-item label="申请日期：">
                        <el-date-picker v-model="queryForm.applyDate" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="申请辅材:">
                        <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入申请辅材" ></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button @click="queryData">查询</el-button>
                    </el-form-item>
                </div>
                <div v-if="activeName == 'already'">
                    <el-form-item label="采购单号:">
                        <el-input v-model="queryForm.code" @keyup.enter.native="queryData" placeholder="请输入申请单号" ></el-input>
                    </el-form-item>
                    <el-form-item label="采购日期：">
                        <el-date-picker v-model="queryForm.applyDate" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="采购辅材：">
                        <el-input v-model="queryForm.auxiliaryName" @keyup.enter.native="queryData" placeholder="请输入采购辅材" ></el-input>
                    </el-form-item>
                    <el-form-item label="供应商：">
                        <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入供应商名称" ></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button @click="queryData">查询</el-button>
                    </el-form-item>
                </div>
                <div v-if="activeName == 'putstorage'">
                    <el-form-item label="采购辅材：">
                        <el-input v-model="queryForm.auxiliaryName" @keyup.enter.native="queryData" placeholder="请输入采购辅材" ></el-input>
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
                <el-tab-pane label="待采购清单" name="await">
                    <v-table :dataTable="dataTable" :selection="false" @operation="operationP"></v-table>
                    <div class="block">
                        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                                    @reloadSize="jumpSize"></v-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="采购清单" name="already">
                    <v-table :dataTable="dataAlreadyTable" :selection="false"  @customFunction="customFunction"  @operation="operationP2"></v-table>
                    <div class="block">
                        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                                    @reloadSize="jumpSize"></v-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="入库清单" name="putstorage">
                    <v-table :dataTable="dataPutTable" :selection="false"  @customFunction="customFunction"  @operation="operationP3"></v-table>
                    <div class="block">
                        <v-pagination :current="page.current" :size="page.size" :total="page.total" @reloadPage="jumpPage"
                                    @reloadSize="jumpSize"></v-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-if="dialogFormVisible">
            <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
                <div slot="title" class="dialog-title">
                <div><span class="green-line"></span>{{dialogFormTitle}}采购申请单</div>
                </div>
                <v-add-purchaseBillDeatail :checkObj="checkObjP" ref="purchase" @reload="reload"></v-add-purchaseBillDeatail>
            </el-dialog>
        </div>
        <el-dialog left :visible.sync="dialogFormVisible1" :close-on-click-modal="false" width="64%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}</div>
            </div>
            <v-add-storageInfo :checkObj="checkObjP" ref="storage" @reload="reload"></v-add-storageInfo>
        </el-dialog>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { pagePurchaseBillApplyInfo, deletePurchaseBillApplyInfo, getDispCodeAndNameDic, pagePurchaseBillInfo, pagePurchaseInventoryIn, listStorage1 } from '@/assets/js/API/api'
import AddPurchaseBillDeatail from '@/views/purchaseManagement/dialog/addPurchaseBillDeatail'
import AddStorageInfo from '@/views/purchaseManagement/dialog/addStorageInfo'
import { debuglog } from 'util';
export default {
    name: 'purchaseStorageList',
    data() {
        return {
            activeName: 'await',
            queryForm: {
                entId: localStorage.getItem('id'),
            },
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
            typeOptions: [],
            statusOptions: [],
            storageOptions: [],
            checkObjP: {},
            dataTable: {},
            dataAlreadyTable: {},
            dataPutTable: {},
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
        'v-add-purchaseBillDeatail': AddPurchaseBillDeatail,
        'v-add-storageInfo': AddStorageInfo
    },
    created() {
        this.dataTable.tableHead = [
            {
                'value': 'code',
                'name': '申请单号'

            }, {
                'value': 'name',
                'name': '申请辅材'
            },
            {
                'value': 'unitName',
                'name': '单位'
            }, {
                'value': 'number',
                'name': '申请数量'
            },
            {
                'value': 'billTime',
                'name': '申请日期',
                type: 'Date'
            }, {
                'value': 'userName',
                'name': '申请人'
            },
            {
                'value': 'statusName',
                'name': '状态'
            },
            {
                'value': 'operation',
                'name': '操作',
                'type': [{
                    'option': 'query',
                    'name': '查看'
                }, {
                    'option': 'purchase',
                    'name': '采购'
                }]
            }];
        this.dataAlreadyTable.tableHead = [
            {
                'value': 'applyCode',
                'name': '申请单号',
                'type': 'button',//类型
                'pathId': 'applyId'//需要参数
            }, {
                'value': 'code',
                'name': '采购单号'
            }, {
                'value': 'auxiliaryName',
                'name': '采购辅材'
            },
            {
                'value': 'unitName',
                'name': '单位'
            }, {
                'value': 'buyAmt',
                'name': '采购数量'
            }, {
                'value': 'name',
                'name': '供应商'
            }, {
                'value': 'price',
                'name': '采购单价'
            }, {
                'value': 'totalPrice',
                'name': '采购总价'
            },
            {
                'value': 'billTime',
                'name': '采购日期',
                type: 'Date'
            }, {
                'value': 'userName',
                'name': '采购人'
            },
            {
                'value': 'statusName',
                'name': '状态'
            },
            {
                'value': 'operation',
                'name': '操作',
                'type': [{
                    'option': 'query',
                    'name': '查看'
                }, {
                    'option': 'storage',
                    'name': '入库',
                    "showConditon": "status=2"
                }]
            }
        ];
        this.dataPutTable.tableHead = [
            
             {
                'value': 'billCode',
                'name': '采购清单号'
            },
            {
                'value': 'storageName',
                'name': '仓库'
            }, {
                'value': 'auxiliaryName',
                'name': '采购辅材'
            },
            {
                'value': 'unitName',
                'name': '单位'
            }, {
                'value': 'price',
                'name': '单价'
            },
            {
                'value': 'quantity',
                'name': '数量'
            },
            {
                'value': 'operation',
                'name': '操作',
                'type': [{
                    'option': 'query',
                    'name': '查看'
                },
                {
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
            getDispCodeAndNameDic({ typeCode: "auxiliaryType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
            getDispCodeAndNameDic({ typeCode: "purchaseBillStatus" })
                .then(res => {
                    this.statusOptions = res.data
                }).catch(() => { })
            listStorage1({ entId: localStorage.getItem('id') })
                .then(res => {
                    this.storageOptions = res.data;
                })
        },
        queryData() {
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        tabclick: function (val) {
            if (this.activeName == 'await') {
                this.queryForm = {
                    entId: localStorage.getItem('id'),
                    code: '',
                    applyDate: '',
                    name: ''
                };
            }
            else if (this.activeName == "already") {
                this.queryForm = {
                    entId: localStorage.getItem('id'),
                    code: '',
                    applyDate: '',
                    name: '',
                    auxiliaryName: ''
                };
            }
            else {
                this.queryForm = {
                    entId: localStorage.getItem('id'),
                    auxiliaryName: '',
                    storageId: '',
                };
            }
            this.getData();
        },
        getData() {
            let _this = this;
            this.queryForm.current = this.page.current;
            this.queryForm.size = this.page.size;
            if (this.queryForm.applyDate) {
                this.queryForm.startTime = this.queryForm.applyDate[0];
                this.queryForm.endTime = this.queryForm.applyDate[1];
            }
            else {
                this.queryForm.startTime = "";
                this.queryForm.endTime = "";
            }
            if (this.activeName == 'await') {
                this.queryForm.statusList = [0];
                pagePurchaseBillApplyInfo(this.queryForm)
                    .then(res => {
                        _this.$set(_this.dataTable, 'records', res.data.records)
                        _this.page.total = res.data.total;
                    }).catch(() => { })
            }
            else if (this.activeName == "already") {
                pagePurchaseBillInfo(this.queryForm)
                    .then(res => {
                        _this.$set(_this.dataAlreadyTable, 'records', res.data.records)
                        _this.page.total = res.data.total;
                    }).catch(() => { })
            }
            else if (this.activeName == "putstorage") {
                pagePurchaseInventoryIn(this.queryForm)
                    .then(res => {
                        _this.$set(_this.dataPutTable, 'records', res.data.records)
                        _this.page.total = res.data.total;
                    }).catch(() => { })
            }

        },
        operationP(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['purchase'].show(obj.data.id);
                    })
                    break
                case 'purchase':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = ''
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['purchase'].show(obj.data.id);
                    })
                    break
            }
        },
        operationP2(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看采购清单'
                    this.dialogFormVisible = true;
                    this.$nextTick(function () {
                        _this.$refs['purchase'].show(obj.data.applyId);
                    })
                    break
                case 'storage':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '采购清单入库'
                    this.dialogFormVisible1 = true;
                    this.$nextTick(function () {
                        _this.$refs['storage'].show(obj.data.id, obj.data.auxiliaryId,obj.data.applyId);
                    })
                    break
            }
        },
        operationP3(obj) {
            let _this = this;
            switch (obj.operation) {
                case 'query':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '查看入库信息'
                    this.dialogFormVisible1 = true;
                    this.$nextTick(function () {
                        _this.$refs['storage'].show(obj.data.id, obj.data.auxiliaryId);
                    })
                    break
                case 'update':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '修改入库信息'
                    this.dialogFormVisible1 = true;
                    this.$nextTick(function () {
                        _this.$refs['storage'].show(obj.data.id, obj.data.auxiliaryId);
                    })
                    break
            }
        },
        customFunction: function (id, code) {
            let _this = this;
            if (code == "applyCode") {
                this.checkObjP.type = "query"
                this.dialogFormTitle = '查看'
                this.dialogFormVisible = true;
                this.$nextTick(function () {
                    _this.$refs['purchase'].show(id);
                })
            }
        },
        delSection: function (id) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let postData = { id: id };
                deletePurchaseBillApplyInfo(postData)
                    .then(res => {
                        COMMONJS.showToast('删除成功', 'success');
                        this.getData();
                    }).catch(() => {

                    })
            })
                .catch(function () { })
        },
        // enableSection(obj) {
        //     let _this = this
        //     let postData = { id: obj.id, status: obj.status };
        //     updatePurchaseAuxiliaryInfo(postData).then(res => {
        //         let msg = obj.status ? '启用' : '停用'
        //         COMMONJS.showToast(`${msg}成功`)
        //         _this.getData()
        //     }).catch(() => { })
        // },
        addData: function () {
            this.checkObjP = {
                type: 'add',
                data: {}
            }
            this.dialogFormVisible = true;
            let _this = this;
            this.$nextTick(function () {
                _this.$refs['purchase'].show('');
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
            this.dialogFormVisible1 = false;
            this.queryData();
        }
    }
}
</script>

<style>
</style>
