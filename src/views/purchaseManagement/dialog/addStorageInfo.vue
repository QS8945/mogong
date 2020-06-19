<template>
    <div class="form-format">
        <el-form  :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
            <el-collapse v-model="activeNames" >
                <el-collapse-item title="当前库存" :name="1">
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="辅材名称" prop="auxiliaryName">
                                <el-input v-model="addForm.auxiliaryName" disabled  ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="采购总数量" prop="purchaseTotalQuantity">
                                <el-input v-model="addForm.purchaseTotalQuantity" disabled  ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="当前库存量" prop="totalQuantity">
                                <el-input v-model="addForm.totalQuantity" disabled type="number"  ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="平均单价" prop="averagePrice">
                                <el-input v-model="addForm.averagePrice" disabled type="number" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="入库信息" :name="2">
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="仓库" prop="storageId">
                                <el-select filterable  v-model="addForm.storageId"  clearable placeholder="请选择仓库">
                                    <el-option v-for="item in storageOptions" :key="item.id"  :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="入库数量" prop="quantity">
                                <el-input v-model="addForm.quantity" type="number" placeholder="请输入入库数量" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单价" prop="price">
                                <el-input v-model="addForm.price"  placeholder="请输入单价" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="100">
                        <el-col :span="12">
                            <el-form-item label="入库后库存量" prop="allQuantity">
                                <el-input v-model="allQuantity" type="number" disabled ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="入库后平均单价" prop="allAvgPrice">
                                <el-input v-model="allAvgPrice" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <div v-show="false">
                             <el-col :span="12">
                                <el-form-item  prop="originalQuantity"></el-form-item>
                                <el-form-item  prop="originalPrice"></el-form-item>
                                <el-form-item  prop="originalStorageId"></el-form-item>
                                <el-form-item  prop="originalStorageName"></el-form-item>
                            </el-col>
                        </div>
                       
                    </el-row>
                </el-collapse-item>
                <el-collapse-item title="操作记录" v-if="checkObj.type == 'query'" :name="3">
                    <el-table size="small" stripe  border  :data="operationOptions">
                        <el-table-column label="操作时间" prop="operateTime"></el-table-column>
                        <el-table-column label="操作人" prop="operateUserName"></el-table-column>
                        <el-table-column label="修改记录" >
                            <template slot-scope="scope">
                                <div v-for="(item,index) in scope.row.records" :key="index">{{item}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
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
import { getDispCodeAndNameDic, listStorage1, listPurchaseProviderInfoByAuxiliaryId, getPurchaseInventoryInfo, savePurchaseInventoryIn, getPurchaseBillInfoByApplyId, getPurchaseInventoryIn, listPurchaseChangeRecords } from '@/assets/js/API/api'
import { debuglog } from 'util';
export default {
    name: 'addStorageInfo',
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
            billId: '',
            formLabelWidth: '110px',
            tableHeight: '30vh',
            activeNames: [1, 2, 3],
            addForm: {
                id: '',
                entId: localStorage.getItem('id'),
                auxiliaryId: '',
                auxiliaryName: '',
                storageId: '',
                price: 0,
                quantity: 0,
                averagePrice: 0,
                allQuantity: 0,
                allAvgPrice: 0,
                purchaseTotalQuantity: 0,
                totalQuantity: 0,
                originalQuantity: 0,
                originalPrice: 0
            },
            auxiliaryOptions: [],
            storageOptions: [],
            operationOptions: [],
            addFormRules: {
                storageId: [
                    { required: true, message: '请选择仓库', trigger: 'change' },
                ],
                quantity: [
                    { required: true, message: '请输入入库数量', trigger: 'change' },
                     { validator: validateNumber, required: true, trigger: "blur" }
                ],
                price: [
                    { required: true, message: '请输入单价', trigger: 'change' },
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
    computed: {
        allQuantity: function () {
            this.addForm.allQuantity = parseFloat(this.addForm.quantity) + parseFloat(this.addForm.totalQuantity) - parseFloat(this.addForm.originalQuantity ? this.addForm.originalQuantity : 0);
            return this.addForm.allQuantity;
        },
        allAvgPrice: function () {
            if (!this.addForm.quantity || !this.addForm.price)
                return "";
            this.addForm.allAvgPrice = (parseFloat(this.addForm.totalPrice) - parseFloat(this.addForm.originalQuantity) * parseFloat(this.addForm.originalPrice) + parseFloat(this.addForm.quantity) * parseFloat(this.addForm.price)) / (this.addForm.allQuantity ? this.addForm.allQuantity : 1);
            return this.addForm.allAvgPrice;
        }
    },
    methods: {
        show: function (id, auxiliaryId, applyId) {
            this.$refs.addForm.resetFields();
            console.log(this.addForm);
            if (this.checkObj.type == "storage") {
                this.billId = id;
                this.dataId = "";
                getPurchaseBillInfoByApplyId({applyId:applyId})
                    .then(res => {
                        this.addForm.purchaseTotalQuantity = res.data.buyAmt;
                    })
            }
            else {
                this.dataId = id;
                if (this.checkObj.type == "query") {
                    listPurchaseChangeRecords({ id: this.dataId })
                        .then(res => {
                            this.operationOptions = res.data;
                        })
                }

            }

            this.picklistData();
            this.getPurchaseInventoryInfo(auxiliaryId);

        },
        picklistData() {
            let postData = {
                entId: localStorage.getItem('id'),
                auxiliaryId: '',
            };
            listStorage1({ entId: localStorage.getItem('id') })
                .then(res => {
                    this.storageOptions = res.data;
                })
            listPurchaseProviderInfoByAuxiliaryId(postData)
                .then(res => {
                    this.auxiliaryOptions = res.data.records;
                })
        },
        getPurchaseInventoryInfo: function (auxiliaryId) {
            getPurchaseInventoryInfo({ entId: localStorage.getItem('id'), auxiliaryId: auxiliaryId })
                .then(res => {
                    res.data.billId = this.billId;
                    res.data.averagePrice = res.data.totalPrice / (res.data.totalQuantity == 0 ? 1 : res.data.totalQuantity);
                    this.addForm = Object.assign(this.addForm, res.data);
                    if (this.dataId) {
                        getPurchaseInventoryIn({ entId: localStorage.getItem('id'), billId: this.dataId })
                            .then(res => {
                                this.addForm = Object.assign(this.addForm, res.data);
                            }).catch(() => { })
                    }
                }).catch(() => { })
        },
        saveAnnulus(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    savePurchaseInventoryIn(this.addForm)
                        .then(res => {
                            COMMONJS.showToast('入库成功', 'success');
                            this.reload();
                        }).catch(() => { })
                }
            })
        },
        reload: function () {
            this.$refs.addForm.resetFields();
            this.$emit('reload');
        }

    }

}
</script>

<style>
</style>
