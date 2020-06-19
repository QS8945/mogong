<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
            <el-row :gutter="100">
                <el-col :span="12">
                <el-form-item label="制度类型" prop="type">
                    <el-select v-model="addForm.type"   clearable placeholder="请选择制度类型">
                        <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="addForm.title"  placeholder="请输入标题" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label=" " prop="">
                        <div style=" text-align: left;">
                            <el-button type="primary" @click="addWasteFlag">添加</el-button>
                        </div>
                        <el-table border size="mini"  :data="addForm.securityRuleDetailInfos" style="width: 100%" :height="tableHeight" element-loading-background="rgba(0, 0, 0, 0.8)" row-key="id" lazy>
                            <el-table-column prop="sortNum" width="80" label="顺序">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.sortNum" ></el-input>
                                    <span v-else>{{scope.row.sortNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="classCode" label="内容">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.content" placeholder="请输入内容"></el-input>
                                    <span v-else>{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="operation" label="操作" width="170" align="center">
                                <template slot-scope="scope">
                                <div v-if="!scope.row.editFlag">
                                    <el-button type="text" @click="optContact(scope.row, 'update', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">编辑</el-button>
                                    <el-button type="text" @click="optContact(scope.row, 'delete', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">删除</el-button>
                                </div>
                                <div v-if="scope.row.editFlag">
                                    <el-button type="text" @click="optContact(scope.row, 'add', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">保存</el-button>
                                    <el-button type="text" @click="optContact(scope.row, 'cancel', scope.$index)" :disabled="checkObj.type==='query'" class="el-btn-address">取消</el-button>
                                </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label=" " >
                        <div style=" text-align: left;">
                            <el-button type="primary" @click="saveAnnulus('addForm')">保存</el-button>
                            <el-button @click="reload" >退出</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
     </div>
</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import { getDispCodeAndNameDic, getSecurityRuleInfoDetail, addOrEditSecurityRuleInfo } from '@/assets/js/API/api'
export default {
    name: 'addEnterpriseannulusSystem',
    data() {
        return {
            dataId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            addForm: {
                id: '',
                type: '',
                title: '',
                securityRuleDetailInfos: []
            },
            typeOptions: [],
            addFormRules: {
                type: [
                    { required: true, message: '请选择制度类型', trigger: 'change' },
                ],
                title: [
                    { required: true, message: '请输入标题', trigger: 'change' },
                ]
            }
        }
    },
    props: {
        checkObj: {
            type: Object,
            default: { type: 'add' }
        }
    },
    created() {
        this.picklistData();
        if (this.checkObj.dataId) {
            this.getSecurityRuleInfoDetail();
        }
    },
    methods: {
        show: function (id) {
            this.dataId = id;
            this.picklistData();
            if (this.dataId) {
                this.getSecurityRuleInfoDetail();
            }
        },
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "ruleType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
        },
        getSecurityRuleInfoDetail: function () {
            getSecurityRuleInfoDetail({ id: this.dataId })
                .then(res => {
                    if (res.data.securityRuleDetailInfos && res.data.securityRuleDetailInfos.length > 0) {
                        for (let s of res.data.securityRuleDetailInfos) {
                            s.editFlag = false;
                        }
                    }
                    this.addForm = res.data;
                }).catch(() => { })
        },
        addWasteFlag() {
            if (this.addForm.securityRuleDetailInfos.length > 0 && this.addForm.securityRuleDetailInfos[this.addForm.securityRuleDetailInfos.length - 1].editFlag) {
                COMMONJS.showToast('请先保存添加项', 'warning')
            } else {
                let addObj = {
                    sortNum: this.addForm.securityRuleDetailInfos.length ? parseInt(this.addForm.securityRuleDetailInfos[this.addForm.securityRuleDetailInfos.length - 1].sortNum) + 1 : 1,
                    content: '',
                    editFlag: true
                }
                this.addForm.securityRuleDetailInfos.push(addObj)
            }
        },
        optContact(data, type, index) {
            let _this = this
            switch (type) {
                case 'add':
                    if (!data.content) {
                        COMMONJS.showToast('请先输入内容', 'error')
                        return false
                    }
                    this.addForm.securityRuleDetailInfos[index].editFlag = false
                    break
                case 'update':
                    this.addForm.securityRuleDetailInfos[index].editFlag = true
                    break
                case 'delete':
                    this.addForm.securityRuleDetailInfos.splice(index, 1)
                    break
                case 'cancel':
                    this.addForm.securityRuleDetailInfos.splice(index, 1)
                    break
            }
        },
        saveAnnulus(formName) {
            console.log(this.addForm);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.securityRuleDetailInfos.length > 0 && this.addForm.securityRuleDetailInfos[this.addForm.securityRuleDetailInfos.length - 1].editFlag) {
                        COMMONJS.showToast('请先保存添加项', 'warning')
                        return;
                    }

                    addOrEditSecurityRuleInfo(this.addForm)
                        .then(res => {
                            COMMONJS.showToast('保存成功', 'success');
                            this.reload();
                        }).catch(() => { })
                }
            })
        },
        reload: function () {
            this.$emit('reload');
        }

    }

}
</script>

<style>
</style>
