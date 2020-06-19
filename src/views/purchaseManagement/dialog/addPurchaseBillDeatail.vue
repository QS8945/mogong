<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="申请信息" :name="1">
                     <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="申请单号" prop="code">
                                <el-input v-model="addForm.code" disabled readonly  placeholder="保存后自动生成" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="申请辅材" prop="auxiliaryId">
                                <el-select filterable v-model="addForm.auxiliaryId" disabled  clearable placeholder="请选择辅材">
                                    <el-option v-for="item in auxiliaryOptions" :key="item.id"  :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请数量" prop="number">
                                <el-input v-model="addForm.number" disabled type="number" placeholder="请输入申请数量" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="申请日期" prop="billTime">
                                <el-date-picker disabled style="width:100%"  value-format="yyyy-MM-dd hh:mm:ss" v-model="addForm.billTime" type="date" ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请人" prop="userName">
                                <el-input disabled v-model="addForm.userName"  ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="addForm.remark" disabled type="textarea" :rows="2" placeholder="请输入备注" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="采购信息" :name="2">
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="供应商" prop="providerId">
                                <el-select filterable v-model="addForm.providerId" @change="getproviderInfo(addForm.providerId)" clearable placeholder="请选择供应商">
                                    <el-option v-for="item in providerOptions" :key="item.id"  :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单价" prop="price">
                                <el-input v-model="addForm.price" disabled ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="实际采购量" prop="buyAmt">
                                <el-input v-model="addForm.buyAmt" type="number" placeholder="请输入实际采购量" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="总价" prop="totalPrice">
                                <el-input v-model="totalPrice"  readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="24">
                            <el-form-item label="备注" prop="billRemark">
                                <el-input v-model="addForm.billRemark" type="textarea" :rows="2" placeholder="请输入备注" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
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
import { listPurchaseProviderInfoByAuxiliaryId, getDispCodeAndNameDic, getPurchaseBillInfoByApplyId, savePurchaseBillInfo, pagePurchaseAuxiliaryInfo } from '@/assets/js/API/api'
export default {
    name: 'addPurchaseBillDeatail',
    data() {
        let validateNumber = (rule, value, callback) => {
            if (!value) callback();
            let reg = /^(\d{1,16}|\d{1,16}\.\d{1,4})$/;
            if (!reg.test(value)) {
                callback(this.$t("validate.format"));
            } else {
                callback();
            }
        };
        return {
            dataId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            activeNames: [1, 2],
            addForm: {
                id: '',
                entId: localStorage.getItem('id'),
                auxiliaryId: '',
                price: '',
                buyAmt: '',
                billTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                totalPrice: 0
            },
            auxiliaryOptions: [],
            providerOptions: [],
            addFormRules: {
                providerId: [
                    { required: true, message: '请选择供应商', trigger: 'change' }
                ],
                // price: [
                //     { required: true, message: '请输入单价', trigger: 'change' },
                //     { validator: validateNumber, required: true, trigger: "blur" }
                // ],
                buyAmt: [
                    { required: true, message: '请输入实际采购量', trigger: 'change' },
                     { validator: validateNumber, required: true, trigger: "blur" }
                ],
                billRemark: [
                    { required: true, message: '请输入备注', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        totalPrice: function () {
            if (!this.addForm.price || !this.addForm.buyAmt) {
                this.addForm.totalPrice = 0
                return 0;
            }
            this.addForm.totalPrice = this.addForm.price * this.addForm.buyAmt;
            return this.addForm.totalPrice;
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
                this.getPurchaseBillInfoByApplyId();
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
        getPurchaseBillInfoByApplyId: function () {
            getPurchaseBillInfoByApplyId({ applyId: this.dataId })
                .then(res => {
                    res.data.entId = localStorage.getItem('id');
                    this.addForm = res.data;
                    let postData = {
                        entId: localStorage.getItem('id'),
                        auxiliaryId: this.addForm.auxiliaryId
                    };
                    listPurchaseProviderInfoByAuxiliaryId(postData)
                        .then(res => {
                            this.providerOptions = res.data;
                        })
                }).catch(() => { })
        },
        getproviderInfo: function (providerId) {
            for (let pro of this.providerOptions) {
                if (providerId == pro.id) {
                    this.addForm.price = pro.price;
                }
            }
        },
        saveAnnulus(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    savePurchaseBillInfo(this.addForm)
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
