<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm"  :label-width="formLabelWidth">

            <el-collapse v-model="activeName" >
                <el-collapse-item title="巡检信息" :disabled="checkObj.type==='query'||checkObj.type==='query'"  :name="1">
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="巡检日期" prop="checkDate" >
                                <el-date-picker style="width:100%" :disabled="checkObj.type==='query'||checkObj.type==='deal'" value-format="yyyy-MM-dd HH:mm:ss" v-model="addForm.checkDate" type="date" placeholder="请选择巡检日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="巡检人" prop="checkerId" >
                                <el-input v-model="addForm.checkerId"  :disabled="checkObj.type==='query'||checkObj.type==='deal'" placeholder="请输入巡检人" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="巡检地点" prop="place" >
                                <el-select v-model="addForm.place" :disabled="checkObj.type==='query'||checkObj.type==='deal'"  clearable placeholder="请选择巡检地点">
                                    <el-option v-for="item in placeOptions" :key="item.code"  :label="item.name" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="24">
                            <el-form-item label="巡检内容" prop="content">
                                <el-input v-model="addForm.content" :disabled="checkObj.type==='query'||checkObj.type==='deal'"  placeholder="请输入巡检内容" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="24">
                            <el-form-item label="巡检结果" prop="checkResult" >
                                <el-input v-model="addForm.checkResult" :disabled="checkObj.type==='query'||checkObj.type==='deal'" type="textarea" :rows="2" placeholder="请输入巡检结果"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="处理信息" v-if="checkObj.type==='deal'" :name="2">
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="处理人" prop="dealerId" >
                                 <el-select v-model="addForm.dealerId"  clearable placeholder="请选择处理人">
                                    <el-option v-for="item in empIdsOptions" :key="item.id"  :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="处理时间" prop="dealTime">
                                <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="addForm.dealTime" type="datetime" placeholder="请选择处理时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="24">
                            <el-form-item label="处理结果" prop="dealResult">
                                <el-input v-model="addForm.dealResult" type="textarea" :rows="2" placeholder="请输入培训内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
            
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label=" " >
                        <div style=" text-align: left;">
                            <el-button type="primary" :disabled="checkObj.type==='query'" @click="saveRoutineInspection('addForm')">保存</el-button>
                            <el-button @click="reload" :disabled="checkObj.type==='query'" >退出</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            
        </el-form>
    </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import Upload from '@/components/upload'
import { getDispCodeAndNameDic, getSecurityCheckInfoDetail, addOrEditSecurityCheckInfoList ,getSysRoleEmployee } from '@/assets/js/API/api'
export default {
    name: 'addTrainRecords',
    data() {
        return {
            activeName:[1,2],
            dataId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            addForm: {
                id: ''
            },
            placeOptions: [],
            empIdsOptions:[],
            addFormRules: {
                checkDate: [
                    { required: true, message: '请选择巡检日期', trigger: 'change' }
                ],
                checkerId: [
                    { required: true, message: '请输入巡检人', trigger: 'change' },
                ],
                place: [
                    { required: true, message: '请选择巡检地点', trigger: 'change' },
                ],
                content: [
                    { required: true, message: '请选择巡检内容', trigger: 'change' },
                ],
                checkResult: [
                    { required: true, message: '请选择巡检结果', trigger: 'change' },
                ],
                dealerId: [
                    { required: true, message: '请选择处理人', trigger: 'change' },
                ],
                dealTime: [
                    { required: true, message: '请选择处理时间', trigger: 'change' },
                ],
                dealResult: [
                    { required: true, message: '请选择处理结果', trigger: 'change' },
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
    components: {
        'v-upload': Upload
    },
    methods: {
        show: function (id) {
            this.dataId = id;
            this.picklistData();
            if (this.dataId) {
                this.getSecurityCheckInfoDetail();
            }
        },
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "checkPlace" })
                .then(res => {
                    this.placeOptions = res.data
                }).catch(() => { })
            getSysRoleEmployee()
                .then(res => {
                    this.empIdsOptions = res.data;
                }).catch(() => { })
        },
        getSecurityCheckInfoDetail: function () {
            getSecurityCheckInfoDetail({ id: this.dataId })
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
                    sortNum: '',
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
        changeFilesP(obj) {
            this.addForm.fileList = JSON.parse(JSON.stringify(obj))
            // console.log(obj)
        },
        saveRoutineInspection(formName) {
            console.log(this.addForm);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addOrEditSecurityCheckInfoList(this.addForm)
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
