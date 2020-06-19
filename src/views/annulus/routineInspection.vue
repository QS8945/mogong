<template>
    <div class="view-total baseForm">
        <div class="table-form">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline" :label-position="'right'">
                <el-form-item label="巡检地点：">
                    <el-select v-model="queryForm.place"  clearable placeholder="请选择巡检地点">
                        <el-option v-for="item in placeOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡检内容：">
                    <el-input v-model="queryForm.content" @keyup.enter.native="queryData" placeholder="请输入培训主题" clearable></el-input>
                </el-form-item>
                <el-form-item label="巡检日期：">
                    <el-date-picker v-model="queryForm.checkDate" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
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
            <div><span class="green-line"></span>{{dialogFormTitle}}日常巡检</div>
            </div>
            <v-add-routineInspection :checkObj="checkObjP" ref="routineInspection" @reload="reload"></v-add-routineInspection>
        </el-dialog>
        </div>
    </div>
    
</template>

<script>
import CustomTable from '@/components/customTable'
import Pagination from '@/components/pagination'
import GLB_CONSTANT from '@/assets/js/glb-constant.js'
import COMMONJS from '@/assets/js/common.js'
import { getDispCodeAndNameDic, getSecurityCheckInfoList, deleteSecurityCheckInfoList } from '@/assets/js/API/api'
import AddRoutineInspection from '@/views/annulus/dialog/addRoutineInspection'
export default {
    name: 'routineInspection',
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
                place: '',
                content: '',
                endTime: "",
                beginTime: "",
                checkDate: ''
            },
            placeOptions: [],
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
        'v-add-routineInspection': AddRoutineInspection
    },
    created() {
        this.dataTable.tableHead = [{
            'value': 'checkDate',
            'name': '巡检日期'
        }, {
            'value': 'placeName',
            'name': '巡检地点'
        }, {
            'value': 'content',
            'name': '巡检内容'
        }, {
            'value': 'checkerId',
            'name': '巡检人'
        }, {
            'value': 'checkResult',
            'name': '巡检结果'
        }, {
            'value': 'dealResult',
            'name': '处理信息'
        }, {
            'value': 'dealerName',
            'name': '处理人'
        }, {
            'value': 'dealTime',
            'name': '处理日期'
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
                'option': 'deal',
                'name': '处理'
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
            getDispCodeAndNameDic({ typeCode: "checkPlace" })
                .then(res => {
                    this.placeOptions = res.data
                }).catch(() => { })
        },
        queryData() {
            if (this.queryForm.checkDate) {
                this.queryForm.beginTime = this.queryForm.checkDate[0];
                this.queryForm.endTime = this.queryForm.checkDate[1];
            }
            else {
                this.queryForm.beginTime = "";
                this.queryForm.endTime = "";
            }
            console.log(this.queryForm);
            this.page.current = GLB_CONSTANT.page.current;
            this.getData();
        },
        getData() {
            let _this = this;
            let postData = {
                current: this.page.current,
                size: this.page.size,
                place: this.queryForm.place,
                content: this.queryForm.content,
                beginTime: this.queryForm.beginTime,
                endTime: this.queryForm.endTime
            }
            getSecurityCheckInfoList(postData)
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
                        _this.$refs['routineInspection'].show(obj.data.id);
                    })
                    break
                case 'update':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '编辑'
                    this.dialogFormVisible = true
                    this.$nextTick(function () {
                        _this.$refs['routineInspection'].show(obj.data.id);
                    })
                    break
                case 'deal':
                    this.checkObjP.type = obj.operation
                    this.dialogFormTitle = '处理'
                    this.dialogFormVisible = true
                    this.$nextTick(function () {
                        _this.$refs['routineInspection'].show(obj.data.id);
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
                deleteSecurityCheckInfoList(postData)
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
                _this.$refs['routineInspection'].show('');
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
