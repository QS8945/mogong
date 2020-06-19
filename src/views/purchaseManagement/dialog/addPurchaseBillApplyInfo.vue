<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="申请单号" prop="code">
                        <el-input v-model="addForm.code" readonly  placeholder="保存后自动生成" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="申请辅材" prop="auxiliaryId">
                        <el-select filterable v-model="addForm.auxiliaryId"  clearable placeholder="请选择辅材">
                            <el-option v-for="item in auxiliaryOptions" :key="item.id"  :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请数量" prop="number">
                        <el-input v-model="addForm.number" type="number" placeholder="请输入申请数量" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="申请日期" prop="billTime">
                        <el-date-picker disabled style="width:100%" value-format="yyyy-MM-dd hh:mm:ss" v-model="addForm.billTime" type="date" ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人" prop="userName">
                        <el-input disabled v-model="addForm.userName" ></el-input>
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
import { formatDate } from '@/assets/js/date.js'
import { getDispCodeAndNameDic, getPurchaseBillApplyInfoById, savePurchaseBillApplyInfo, updatePurchaseBillApplyInfo, pagePurchaseAuxiliaryInfo } from '@/assets/js/API/api'
export default {
    name: 'addPurchaseBillApplyInfo',
    data() {
        
        return {
            dataId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            addForm: {
                id: '',
                entId: localStorage.getItem('id'),
                auxiliaryId: '',
                number: '',
                billTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                remark: '',
            },
            auxiliaryOptions: [],
            addFormRules: {
                auxiliaryId: [
                    { required: true, message: '请选择申请辅材', trigger: 'change' }
                ],
                number: [
                    { required: true, message: '请输入申请数量', trigger: 'change' }
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
    methods: {
        show: function (id) {
            this.dataId = id;
            this.picklistData();
            if (this.dataId) {
                this.getPurchaseBillApplyInfoById();
            }
        },
        picklistData() {
            let postData = {
                entId: localStorage.getItem('id'),
                current: 1,
                size: 100000
            };
            pagePurchaseAuxiliaryInfo(postData)
                .then(res => {
                    this.auxiliaryOptions = res.data.records;
                })
        },
        getPurchaseBillApplyInfoById: function () {
            getPurchaseBillApplyInfoById({ id: this.dataId })
                .then(res => {
                    this.addForm = res.data;
                }).catch(() => { })
        },
        saveAnnulus(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.id) {
                        updatePurchaseBillApplyInfo(this.addForm)
                            .then(res => {
                                COMMONJS.showToast('更新成功', 'success');
                                this.reload();
                            }).catch(() => { })
                    }
                    else {
                        savePurchaseBillApplyInfo(this.addForm)
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
