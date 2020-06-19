<template>
    <div class="form-format">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type.indexOf('query')!=-1" :label-width="formLabelWidth">
         
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="辅材名称" prop="auxiliaryName">
                        <el-input v-model="addForm.auxiliaryName" disabled  ></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="12">
                    <el-form-item label="当前库存量" prop="currentQuantity">
                        <el-input v-model="addForm.currentQuantity" disabled type="number"  ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="12" v-if="checkObj.type==='update'||checkObj.type==='query2'">
                    <el-form-item label="原出库量" prop="originalQuantity">
                        <el-input v-model="addForm.originalQuantity" disabled type="number"  ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="领用数量" prop="quantity" v-if="checkObj.type==='deposit'||checkObj.type==='query1'">
                        <el-input v-model="addForm.quantity"  type="number" placeholder="请输入领用数量" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="调整出库量" prop="quantity" v-if="checkObj.type==='update'||checkObj.type==='query2'">
                        <el-input v-model="addForm.quantity"  type="number"  ></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12"  v-if="checkObj.type==='deposit'||checkObj.type==='query1'">
                    <el-form-item label="领用后存量" prop="afterQuantity">
                        <el-input v-model="addForm.afterQuantity" disabled  type="number"  ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="checkObj.type==='update'||checkObj.type==='query2'">
                    <el-form-item label="差额" prop="diffQuantity">
                        <el-input v-model="addForm.afterQuantity" disabled  type="number"  ></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="领用人" prop="takerName">
                        <el-input v-model="addForm.takerName"  placeholder="请输入领用人" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="领用日期" prop="takeDate">
                        <el-date-picker  style="width:100%"  value-format="yyyy-MM-dd hh:mm:ss" v-model="addForm.takeDate" type="date" ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <div v-if="checkObj.type==='deposit'||checkObj.type==='query1'">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark" >
                            <el-input v-model="addForm.remark" type="textarea" :rows="2"  ></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                <div v-if="checkObj.type==='update'||checkObj.type==='query2'">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="historyRemark" >
                            <el-input v-model="addForm.historyRemark" disabled ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="调整原因" prop="remark">
                            <el-input v-model="addForm.remark" type="textarea" :rows="2"  placeholder="请输入调整原因"></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                
            </el-row>
            <el-row :gutter="100" v-if="checkObj.type == 'query2'" :name="3">
                <el-col :span="24">
                    <el-form-item label="操作记录" prop="remark" >
                        <el-table size="small" stripe  border  :data="operationOptions">
                            <el-table-column label="操作时间" prop="operateTime"></el-table-column>
                            <el-table-column label="操作人" prop="operateUserName"></el-table-column>
                            <el-table-column label="修改记录" >
                                <template slot-scope="scope">
                                    <div v-for="(item,index) in scope.row.records" :key="index">{{item}}</div>
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
import { formatDate } from '@/assets/js/date.js'
import { getDispCodeAndNameDic, getPurchaseInventoryById, getPurchaseInventoryOut, savePurchaseInventoryOut ,listPurchaseChangeRecords} from '@/assets/js/API/api'
export default {
    name: 'addPurchaseDepositInfo',
    data() {
        let validateQuantity = (rule, value, callback) => {
            if (!value) callback();
            if (parseFloat(value) > (parseFloat(this.addForm.currentQuantity) + parseFloat(this.addForm.originalQuantity))) {
                callback("出库量不能大于库存量");
            } else {
                callback();
            }
        };
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
                "id": "",
                "entId": localStorage.getItem('id'),
                "storageId": "",
                "storageName": "",
                "auxiliaryId": "",
                "auxiliaryName": "",
                "quantity": 0,
                "price": 0,
                "currentQuantity": 0,
                "takerName": "",
                "takeDate": "",
                "originalStorageId": "",
                "originalStorageName": "",
                "originalQuantity": 0,
                "originalPrice": 0,
                "originalTakerName": "",
                "originalTakeDate": "",
                "historyRemark": '',
                "remark": "",
            },
            operationOptions: [],
            auxiliaryOptions: [],
            addFormRules: {
                quantity: [
                    { required: true, message: '请输入具体数量', trigger: 'change' },
                    { validator: validateQuantity, required: true, trigger: "blur" },
                    { validator: validateNumber, required: true, trigger: "blur" }
                ],
                takerName: [
                    { required: true, message: '请输入领取人', trigger: 'change' }
                ],
                takeDate: [
                    { required: true, message: '请输入领取日期', trigger: 'change' }
                ],
                remark: [
                    { required: true, message: '请填写备注/调整原因', trigger: 'change' }
                ],
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

    },
    methods: {
        show: function (id) {
            this.dataId = id;
            this.picklistData();
            if (this.dataId) {
                this.getPurchaseInventoryById();
            }
            if (this.checkObj.type == "query2") {
                listPurchaseChangeRecords({ id: this.dataId })
                    .then(res => {
                        this.operationOptions = res.data;
                    })
            }
        },
        picklistData() {

        },
        getPurchaseInventoryById: function () {
            if (this.checkObj.type === 'deposit' || this.checkObj.type === 'query1') {
                getPurchaseInventoryById({ id: this.dataId })
                    .then(res => {
                        res.data.id = "";
                        this.addForm = Object.assign(this.addForm, res.data);
                    }).catch(() => { })
            }
            else {
                getPurchaseInventoryOut({ billId: this.dataId })
                    .then(res => {
                        res.data.historyRemark = res.data.remark;
                        res.data.remark = "";
                        this.addForm = Object.assign(this.addForm, res.data);
                    }).catch(() => { })
            }


        },
        saveAnnulus(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    savePurchaseInventoryOut(this.addForm)
                        .then(res => {
                            COMMONJS.showToast('操作成功', 'success');
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
