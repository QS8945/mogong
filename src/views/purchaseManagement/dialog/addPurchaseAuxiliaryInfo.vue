<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="辅材编号" prop="code">
                        <el-input v-model="addForm.code" readonly  placeholder="保存后自动生成" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="辅材类型" prop="type">
                        <el-select v-model="addForm.type"  clearable placeholder="请选择辅材类型">
                            <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="辅材名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入辅材名称" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单位" prop="unitName">
                        <el-input v-model="addForm.unitName" placeholder="请输入单位" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="addForm.remark" type="textarea" :rows="2" placeholder="请输入备注" ></el-input>
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
import { getDispCodeAndNameDic, getPurchaseAuxiliaryInfoById, savePurchaseAuxiliaryInfo, updatePurchaseAuxiliaryInfo } from '@/assets/js/API/api'
export default {
    name: 'addPurchaseAuxiliaryInfo',
    data() {
        return {
            dataId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            addForm: {
                id: '',
                entId:localStorage.getItem('id')
            },
            typeOptions: [],
            addFormRules: {
                type: [
                    { required: true, message: '请选择辅材类型', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入辅材名称', trigger: 'change' },
                ],
                remark: [
                    { required: true, message: '请输入备注', trigger: 'change' },
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
            this.getPurchaseAuxiliaryInfoById();
        }
    },
    methods: {
        show: function (id) {
            this.dataId = id;
            this.picklistData();
            if (this.dataId) {
                this.getPurchaseAuxiliaryInfoById();
            }
        },
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "auxiliaryType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
        },
        getPurchaseAuxiliaryInfoById: function () {
            getPurchaseAuxiliaryInfoById({ id: this.dataId })
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
                    if (this.addForm.id) {
                        updatePurchaseAuxiliaryInfo(this.addForm)
                            .then(res => {
                                COMMONJS.showToast('更新成功', 'success');
                                this.reload();
                            }).catch(() => { })
                    }
                    else {
                        savePurchaseAuxiliaryInfo(this.addForm)
                            .then(res => {
                                COMMONJS.showToast('创建成功', 'success');
                                this.reload();
                            }).catch(() => { })
                    }

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
