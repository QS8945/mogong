<template>
  <div class="bussiness-info">
    <!--<el-button class="back-to-customer" type="text" @click="backToCustomer" plain>-->
      <!--<span class="icon iconfont iconfanhui"></span>返回</el-button>-->
    <el-form ref="form" :model="form" :rules="formRules" label-width="130px">
      <div class="bus-info-item">
        <div class="item-body">
          <el-row>
            <el-col :span="18">
              <el-form-item label="原业务经理：">
                <el-input v-model="form.oldSalesMan" disabled style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="新业务经理：" prop="newSalesManId">
                <el-select v-model="form.newSalesManId" filterable placeholder="请选择新的业务经理" style="width:100%">
                  <el-option v-for="item in newSalesMans" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item>
                <el-button :loading="saveLoading" type="primary" @click="saveData('form')">保存</el-button>
                <el-button @click="cancelData">取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import { getSysRoleEmploee, getChargeEmpbyId, setChargeEmp } from '@/assets/js/API/api'

export default {
  data () {
    return {
      saveLoading: false,
      newSalesMans: [],
      dialogFormVisible: false,
      form: {
        newSalesManId: '',
        oldSalesMan: ''
      },
      formRules: {
        newSalesManId: [{
          required: true,
          message: '请选择新的业务经理',
          trigger: 'change'
        }]
      }
    }
  },
  props: ['setCheckObj'],
  created () {
    this.getChargeEmpbyId()
    this.getSysRoleEmploee()
  },
  methods: {
    getChargeEmpbyId () {
      var _this = this
      let postData = {
        id: this.setCheckObj.id
      }
      getChargeEmpbyId(postData)
        .then(res => {
          if (res.data != null) {
            _this.form.oldSalesMan = res.data.salesName
          } else {
            _this.form.oldSalesMan = this.setCheckObj.salesman
          }
        }).catch(() => {})
    },
    backToCustomer () {
      this.$router.push({
        path: '/salesFunnel',
        query: {
          defaultTabName: 'activity'
        }
      })
    },
    getSysRoleEmploee () {
      var _this = this
      getSysRoleEmploee()
        .then(res => {
          _this.newSalesMans = res.data
        }).catch(() => {})
    },
    saveData (formName) {
      var _this = this
      let postData = this.form
      postData.id = _this.setCheckObj.id
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setChargeEmp(postData)
            .then(res => {
              COMMONJS.showToast('分配成功')
              this.$emit('reload', true)
            }).catch(() => {})
        } else {
          console.log('error submit!!')
        }
      })
    },
    cancelData () {
      this.$emit('changeAddContactsVisible', false)
    }
  }
}
</script>
<style lang="scss">

</style>
