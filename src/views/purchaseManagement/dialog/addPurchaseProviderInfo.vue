<template>
    <div class="form-format">
        <el-tabs type="border-card" :before-leave="changeInfo" v-model="tabName">
            <el-tab-pane label="供应商信息" name="providerInfo">
                <el-form :model="addForm" :rules="addFormRules" ref="addForm" :disabled="checkObj.type==='query'" :label-width="formLabelWidth">
                    <el-collapse v-model="activeName">
                        <el-collapse-item title="基本信息"  :name="1">
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="供应商编号" prop="code">
                                        <el-input v-model="addForm.code"  placeholder="请输入供应商编号" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="供应商" prop="name">
                                        <el-input v-model="addForm.name"  placeholder="请输入供应商" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="供应类别" prop="type">
                                        <el-select v-model="addForm.type"  clearable placeholder="请选择供应类别">
                                            <el-option v-for="item in typeOptions" :key="item.code"  :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="联系人" prop="contacts">
                                        <el-input v-model="addForm.contacts" placeholder="请输入联系人" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系电话" prop="contactNumber">
                                        <el-input v-model="addForm.contactNumber" placeholder="请输入联系电话" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="100">
                                <el-col :span="24">
                                    <el-form-item label="所在地" prop="cantonName">
                                        <v-common-cascader v-if="cascaderVisable"  class="mycantonName" :disabled="checkObj.type==='query'" :cantonName="addForm.cantonName" 
                                        :cantonOptions="cantonOptions" :showAllLevels="true" :clearable="true" 
                                        :filterable="true"   @changeCantonName="changeCantonNameP">
                                        </v-common-cascader>
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
                        </el-collapse-item>
                        <el-collapse-item title="财务信息"  :name="2">
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="财务编号" prop="financeCode">
                                        <el-input v-model="addForm.financeCode"   placeholder="请输入财务编号" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="开户银行" prop="openingBank">
                                        <el-select v-model="addForm.openingBank"  clearable placeholder="请选择开户银行">
                                            <el-option v-for="item in bankOptions" :key="item.code"  :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="银行账号" prop="account">
                                        <el-input v-model="addForm.account"   placeholder="请输入银行账号" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="100">
                                <el-col :span="12">
                                    <el-form-item label="开户人" prop="accountHolder">
                                        <el-input v-model="addForm.accountHolder"   placeholder="请输入开户人" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="结算方式" prop="payment">
                                        <el-select v-model="addForm.payment"  clearable placeholder="请选择结算方式">
                                            <el-option v-for="item in settlementMethodOptions" :key="item.code"  :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
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
            </el-tab-pane>
            <el-tab-pane label="供应物品" name="providergoods">
               <div style=" text-align: left;">
                    <el-button type="primary" @click="addWasteFlag">添加供应物品</el-button>
                </div>
                <el-table border size="mini"  :data="goodsData" style="width: 100%" :height="tableHeight" element-loading-background="rgba(0, 0, 0, 0.8)" row-key="id" lazy>
                    <el-table-column prop="auxiliaryId" label="物品名称">
                        <template slot-scope="scope">
                            <el-select filterable @change="goodschange(scope.row, scope.$index)"  v-if="scope.row.editFlag" v-model="scope.row.auxiliaryId"  clearable placeholder="请选择物品名称">
                                <el-option v-for="item in auxiliaryOptions" :key="item.id"  :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-else>{{getGoodsName(scope.row.auxiliaryId)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="物品类型"></el-table-column>
                    <el-table-column prop="unitName" label="单位"></el-table-column>
                    <el-table-column prop="isAgent" label="是否代理">
                        <template slot-scope="scope">
                            <el-select filterable  v-if="scope.row.editFlag" v-model="scope.row.isAgent"  clearable >
                                <el-option  label="是" :value="1"></el-option>
                                <el-option  label="否" :value="0"></el-option>
                            </el-select>
                            <span v-else>{{scope.row.isAgent?'是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payment" label="结算方式">
                        <template slot-scope="scope">
                            <el-select  v-if="scope.row.editFlag" v-model="scope.row.payment"  clearable placeholder="请选择结算方式">
                                <el-option v-for="item in settlementMethodOptions" :key="item.code"  :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                             <span v-else>{{getpayName(scope.row.payment)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价">
                        <template slot-scope="scope">
                            <el-input  v-if="scope.row.editFlag" v-model="scope.row.price" ></el-input>
                           <span v-else>￥{{scope.row.price}}</span>
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
            </el-tab-pane>
        </el-tabs>
        
     </div>
</template>
<script>
import COMMONJS from '@/assets/js/common.js'
import {    getDispCodeAndNameDic, getPurchaseProviderInfoVOById, savePurchaseProviderInfo, updatePurchaseProviderInfo, getAllSySCanton, savePurchaseProviderItemsInfoVO, updatePurchaseProviderItemsInfoVO,
    listPurchaseProviderItemsInfoVO, pagePurchaseAuxiliaryInfo, deletePurchaseProviderItemsInfoVO} from '@/assets/js/API/api'
import CommonCascader from '@/components/commonCascader'
export default {
    name: 'addPurchaseProviderInfo',
    data() {
        let validateContactWay = (rule, value, callback) => {
            if (!value) callback();
            let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
            let regTel = /^0?1[3|4|5|8][0-9]\d{8}$/;
            //  ilnPhone = /^([0-9]|[-])+$/g;
            if (!regPhone.test(value) && !regTel.test(value)) {
                callback(
                    new Error("联系电话格式不正确")
                );
            } else {
                callback();
            }
        };
        return {
            dataId: '',
            tabName: 'providerInfo',
            activeName: [1, , 2],
            formLabelWidth: '110px',
            tableHeight: '30vh',
            addForm: {
                id: '',
                entId: localStorage.getItem('id'),
                cantonName: ''
            },
            cascaderVisable: false,
            cantonOptions: [],
            typeOptions: [],
            bankOptions: [],
            settlementMethodOptions: [],
            props: {
                label: 'fillLocation',
                value: 'id',
                children: 'children',
                leaf: 'isLeaf',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            addFormRules: {
                code: [
                    { required: true, message: '请输入供应商编号', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入供应商', trigger: 'change' },
                ],
                type: [
                    { required: true, message: '请选择供应类别', trigger: 'change' },
                ],
                contacts: [
                    { required: true, message: '请输入联系人', trigger: 'change' },
                ],
                contactNumber: [
                    { required: true, message: '请输入联系电话', trigger: 'change' },
                    { validator: validateContactWay, required: true, trigger: "blur" }
                ],
                cantonName: [
                    { required: true, message: '请选择所在地', trigger: 'change' }
                ],
                financeCode: [
                    { required: true, message: '请输入财务编号', trigger: 'change' },
                ],
                openingBank: [

                ]
            },
            goodsData: []
        }
    },
    components: {
        'v-common-cascader': CommonCascader
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
                this.getPurchaseProviderInfoVOById();
            }
            else {
                this.cascaderVisable = true;
            }
        },
        picklistData() {
            getDispCodeAndNameDic({ typeCode: "auxiliaryType" })
                .then(res => {
                    this.typeOptions = res.data
                }).catch(() => { })
            getDispCodeAndNameDic({ typeCode: "openingBank" })
                .then(res => {
                    this.bankOptions = res.data
                }).catch(() => { })
            getDispCodeAndNameDic({ typeCode: "settlementMethod" })
                .then(res => {
                    this.settlementMethodOptions = res.data
                }).catch(() => { })
            let postData = {
                entId: localStorage.getItem('id'),
            }
            getAllSySCanton()
                .then(res => {
                    this.cantonOptions = res.data
                }).catch(() => {
                })
        },
        getPurchaseProviderInfoVOById: function () {
            getPurchaseProviderInfoVOById({ id: this.dataId })
                .then(res => {
                    res.data.cantonName = JSON.parse(res.data.cantonName);
                    this.addForm = res.data;
                    this.cascaderVisable = true;
                }).catch(() => { })
        },
        changeCantonNameP(val) {
            this.addForm.cantonName = val;
        },
        goodschange: function (row, index) {
            for (let goods of this.auxiliaryOptions) {
                if (goods.id == row.auxiliaryId) {
                    this.goodsData[index].type = goods.type;
                    this.goodsData[index].unitName = goods.unitName;
                }
            }
        },
        getGoodsName: function (id) {
            for (let goods of this.auxiliaryOptions) {
                if (id == goods.id)
                    return goods.name;
            }
        },
        getpayName: function (id) {
            for (let s of this.settlementMethodOptions) {
                if (id == s.code)
                    return s.name;
            }
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
        saveAnnulus(formName) {
            console.log(this.addForm);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addForm.cantonName = JSON.stringify(this.addForm.cantonName);
                    if (this.addForm.id) {
                        updatePurchaseProviderInfo(this.addForm)
                            .then(res => {
                                COMMONJS.showToast('更新成功', 'success');
                                // this.reload();
                                this.getPurchaseProviderInfoVOById();
                            }).catch(() => { })
                    }
                    else {
                        savePurchaseProviderInfo(this.addForm)
                            .then(res => {
                                COMMONJS.showToast('创建成功', 'success');
                                this.dataId = res.data;
                                // this.reload();
                                this.getPurchaseProviderInfoVOById();
                            }).catch(() => { })
                    }

                }
            })
        },
        changeInfo: function (newName) {
            if (newName == 'providergoods') {
                if (!this.dataId) {
                    COMMONJS.showToast('请先保存供应商信息', 'warning')
                    return false;
                }
                else {
                    let postData = {
                        entId: localStorage.getItem('id'),
                        providerId: this.dataId,
                        current: 1,
                        size: 100000
                    };
                    pagePurchaseAuxiliaryInfo(postData)
                        .then(res => {
                            this.auxiliaryOptions = res.data.records;
                            listPurchaseProviderItemsInfoVO({ providerId: this.dataId })
                                .then(res => {
                                    for (let s of res.data) {
                                        s.editFlag = false;
                                    }
                                    this.goodsData = res.data;
                                }).catch(() => {

                                })
                        }).catch(() => {

                        })

                }
            }

        },
        addWasteFlag() {
            if (this.goodsData.length > 0 && this.goodsData[this.goodsData.length - 1].editFlag) {
                COMMONJS.showToast('请先保存添加项', 'warning')
            } else {
                let addObj = {
                    auxiliaryId: '',
                    id: '',
                    providerId: this.dataId,
                    type: '',
                    isAgent: '',
                    price: 0,
                    editFlag: true
                }
                this.goodsData.push(addObj)
            }
        },
        optContact(data, type, index) {
            let _this = this
            switch (type) {
                case 'add':
                    if (!data.auxiliaryId) {
                        COMMONJS.showToast('请先选择物品名称', 'error')
                        return false
                    }
                    for (let i in this.goodsData) {
                        if (i != index) {
                            if (this.goodsData[i].auxiliaryId == data.auxiliaryId) {
                                COMMONJS.showToast('物品名称已存在', 'error')
                                return false
                            }
                        }
                    }
                    if (!data.isAgent && data.isAgent != 0) {
                        COMMONJS.showToast('请先选择是否代理', 'error')
                        return false
                    }
                    if (!data.payment) {
                        COMMONJS.showToast('请先选择付款方式', 'error')
                        return false
                    }
                    if (!data.price) {
                        COMMONJS.showToast('请先输入单价', 'error')
                        return false
                    }
                    let reg = /^(\d{1,16}|\d{1,16}\.\d{1,4})$/;
                    if (!reg.test(data.price)) {
                        COMMONJS.showToast('单价格式错误', 'error')
                        return false
                    }

                    this.goodsData[index].editFlag = false;
                    if (data.id) {
                        updatePurchaseProviderItemsInfoVO(this.goodsData[index])
                            .then(res => {
                                COMMONJS.showToast('保存成功', 'success');

                            }).catch(() => { })
                    }
                    else {
                        savePurchaseProviderItemsInfoVO(this.goodsData[index])
                            .then(res => {
                                COMMONJS.showToast('保存成功', 'success');
                                listPurchaseProviderItemsInfoVO({ providerId: this.dataId })
                                    .then(res => {
                                        for (let s of res.data) {
                                            s.editFlag = false;
                                        }
                                        this.goodsData = res.data;
                                    }).catch(() => { })
                            }).catch(() => { })
                    }
                    break
                case 'update':
                    this.goodsData[index].editFlag = true;
                    break
                case 'delete':
                    deletePurchaseProviderItemsInfoVO({ id: data.id })
                        .then(res => {
                            COMMONJS.showToast('删除成功', 'success')
                            this.goodsData.splice(index, 1);
                        }).catch(() => { })
                    break
                case 'cancel':
                    this.goodsData.splice(index, 1)
                    break
            }
        },
        reload: function () {
            this.$emit('reload');
        }
    }
}

</script>

<style>
.mycantonName {
    width: 100%;
    text-align: left;
}
.mycantonName .el-cascader {
    width: 100%;
}
</style>
