<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="培训类型：">
                    <el-select v-model="queryForm.type"  clearable placeholder="请选择培训类型">
                        <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="培训主题：">
                    <el-input v-model="queryForm.theme" @keyup.enter.native="queryData" placeholder="请输入培训主题" clearable></el-input>
                </el-form-item>
                <el-form-item label="培训日期：">
                    <el-date-picker v-model="queryForm.trainDate" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
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
         <!--//添加企业安环制度-->
        <div v-if="dialogFormVisible">
        <el-dialog left :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="60%">
            <div slot="title" class="dialog-title">
            <div><span class="green-line"></span>{{dialogFormTitle}}培训记录</div>
            </div>
            <v-add-trainRecords :checkObj="checkObjP" ref="trainRecords" @reload="reload"></v-add-trainRecords>
        </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { getDispCodeAndNameDic, getSecurityTrainInfoList, deleteSecurityTrainInfo } from '@/assets/js/API/api'
import AddTrainRecords from '@/views/annulus/dialog/addTrainRecords'
export default {
    name: 'trainRecordsList',
    data() {
        return {
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
            queryForm: {
                type: '',
                theme: '',
                endDate: "",
                startDate: "",
                trainDate: ''
            },
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
        'v-add-trainRecords': AddTrainRecords
    },
    created() {
        this.dataTable.tableHead = [{
            'value': 'trainDate',
            'name': '培训日期',
        }, {
            'value': 'startTime',
            'name': '开始时间'
        }, {
            'value': 'endTime',
            'name': '结束时间'
        }, {
            'value': 'typeName',
            'name': '培训类型'
        }, {
            'value': 'address',
            'name': '培训地点'
        }, {
            'value': 'theme',
            'name': '培训主题'
        }, {
            'value': 'operation',
            'name': '操作',
            'type': [{
                'option': 'query',
                'name': '查看'
            }, {
                'option': 'update',
                'name': '编辑'
            }
            , {
                'option': 'delete',
                'name': '删除'
            }]
        }];
        this.picklistData();
        this.getData();
    },
    methods: {
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "trainType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
        },
        queryData() {
            if (this.queryForm.trainDate) {
                this.queryForm.startDate = this.queryForm.trainDate[0];
                this.queryForm.endDate = this.queryForm.trainDate[1];
            }
            else {
                this.queryForm.startDate = "";
                this.queryForm.endDate = "";
            }
            console.log(this.queryForm);
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        getData() {
            let _this = this;
            let postData = {
                type: this.queryForm.type,
                current: this.page.current,
                size: this.page.size,
                theme: this.queryForm.theme,
                startDate: this.queryForm.startDate,
                endDate: this.queryForm.endDate
            }
            getSecurityTrainInfoList(postData)
                .then(res => {
                    _this.$set(_this.dataTable, 'records', res.data.records)
                    _this.page.total = res.data.total
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
                        _this.$refs['trainRecords'].show(obj.data.id);
                    })
                    break
                case 'update':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '编辑'
                    this.dialogFormVisible = true
                    this.$nextTick(function () {
                        _this.$refs['trainRecords'].show(obj.data.id);
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
                deleteSecurityTrainInfo(postData)
                    .then(res => {
                        COMMONJS.showToast(`删除成功`);
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
                _this.$refs['trainRecords'].show('');
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
