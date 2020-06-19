<template>
  <div id="msgDialog">
    <el-form :inline="true" :model="form" :label-width="labelWidth" class="msgDialog">
      <el-row>
        <el-col :span="12">
          <el-form-item label="信息重要程度：" :required="true">
            <span>{{form.type}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布状态：" :required="true">
            <span>{{form.status}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新版本号：" :required="true">
            <span>{{form.version}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="信息内容：" prop="content">
            <table style="width:600px;margin-top: -43px;margin-left: 125px;">
              <tr>
                <td v-html="form.content" colspan="3">{{form.content}}</td>
              </tr>
            </table>
<!--            <el-input  v-html="form.content" type="textarea">{{form.content}}</el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <div class="msgButton">
        <el-checkbox-group v-model="form.dialogSwitch" :max="1">
<!--          <el-checkbox label="true" @change="changeRadio">不再显示</el-checkbox>-->
          <el-button @click="changeRadio" type="primary">不再显示</el-button>
          <el-button @click="confirmButton" type="primary">确定</el-button>
        </el-checkbox-group>
      </div>
      <el-form-item class="msgButton">
        <!--          <span>是否不再提示：</span>-->
        <!--          <el-radio v-model="form.dialogSwitch" @change="changeRadio" label="true" border type="primary">是</el-radio>-->
        <!--          <el-radio v-model="form.dialogSwitch" label="true" border @click="goChange">不再显示</el-radio>-->

        <!--          <el-radio v-model="form.dialogSwitch" @change="changeRadio" label="false">否</el-radio>-->

      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { getDialogData } from '@/assets/js/API/api'
  export default {
    name: 'addWaste',
    data(){
      return {
        form:{
          id:'',
          type:'普通',
          status:'已发布',
          version:'20191019',
          content:'<div>1、系统主题皮肤样式优化</div><div>2、更多的列表新增了联单号、产废单位、八位码等标准查询</div><div>3、更多的列表新增了导出excel功能</div>',
          dialogSwitch:'无数据',
        },
        labelWidth:'130px'
      }
    },
    methods:{
      confirmButton(){
        this.$emit('changeDialogForm',false)
      },
      changeRadio(){
        this.$emit('changeDialog',true)
        this.$emit('changeDialogForm',false)
      },
      getDialogDatas(){
        let self=this;
        let postData=self.form.id;
        getDialogData(postData).then(res=>{
          self.form=res.data;
        }).catch(()=>{})
      },
    }
  }

</script>

<style>
  #msgDialog .msgDialog{
    text-align:left;
  }
  #msgDialog .msgDialog .msgButton{
    text-align:center;
  }

</style>
