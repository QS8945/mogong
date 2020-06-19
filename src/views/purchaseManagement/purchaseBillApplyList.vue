<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="申请单号:">
                    <el-input v-model="queryForm.code" @keyup.enter.native="queryData" placeholder="请输入申请单号" clearable></el-input>
                </el-form-item>
                <el-form-item label="申请日期：">
                    <el-date-picker v-model="queryForm.applyDate" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请辅材:">
                    <el-input v-model="queryForm.name" @keyup.enter.native="queryData" placeholder="请输入申请辅材" clearable></el-input>
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
        <div v-if="dialogFormVisible">
        <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}采购申请单</div>
            </div>
            <v-add-purchaseBillApplyInfo :checkObj="checkObjP" ref="addAnnulus" @reload="reload"></v-add-purchaseBillApplyInfo>
        </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { pagePurchaseBillApplyInfo, deletePurchaseBillApplyInfo, getDispCodeAndNameDic } from '@/assets/js/API/api'
import AddPurchaseBillApplyInfo from '@/views/purchaseManagement/dialog/addPurchaseBillApplyInfo'
import { debuglog } from 'util';
export default {
    name: 'purchaseBillApplyList',
    data() {
        return {
            queryForm: {
                entId: localStorage.getItem('id'),
                type: '',
                name: '',
                status: '',
                applyDate:''
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
        'v-add-purchaseBillApplyInfo': AddPurchaseBillApplyInfo
    },
    created() {
        this.dataTable.tableHead = [{
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
            'name': '状态',
        },
        {
            'value': 'operation',
            'name': '操作',
            'type': [{
                'option': 'query',
                'name': '查看'
            }, {
                'option': 'update',
                'name': '编辑',
                'showConditon':"status=0"
            }, {
                'option': 'delete',
                'name': '删除',
                'showConditon':"status=0"
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
            getDispCodeAndNameDic({ typeCode: "purchaseBillStatus" })
                .then(res => {
                    this.statusOptions = res.data
                }).catch(() => { })
        },
        queryData() {
            this.page.current = GLB_CONSTANT.page.current;
            if (this.queryForm.applyDate) {
                this.queryForm.startTime = this.queryForm.applyDate[0];
                this.queryForm.endTime = this.queryForm.applyDate[1];
            }
            else {
                this.queryForm.startTime = "";
                this.queryForm.endTime = "";
            }
            this.getData();
        },
        getData() {
            let _this = this;
            this.queryForm.current = this.page.current;
            this.queryForm.size = this.page.size;
            pagePurchaseBillApplyInfo(this.queryForm)
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
                case 'submit':
                    // this.enableSection(obj.data);
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
