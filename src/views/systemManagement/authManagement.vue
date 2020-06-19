<template>
  <div class="auth-management">
    <div class="auth-search">
      <div class="search-header">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="searchForm.name" placeholder="请输入权限名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-body">
        <div class="block">
          <!--<p>使用 scoped slot</p>-->
          <el-tree
            :data="data5"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
              <span class="search-opt-icons">
                <el-button class="search-opt-icon" icon="el-icon-plus" circle @click="() => append(node)"></el-button>
                <el-button class="search-opt-icon" icon="el-icon-edit" circle @click="() => edit(node)"></el-button>
                <el-button class="search-opt-icon" icon="el-icon-delete" circle @click="() => remove(node)"></el-button>
                <!--<el-button-->
                  <!--type="text"-->
                  <!--size="mini"-->
                  <!--@click="() => append(data)">-->
                  <!--<i class="el-icon-circle-plus"></i>-->
                <!--</el-button>-->
                <!--<el-button-->
                  <!--icon="el-icon-edit"-->
                  <!--type="text"-->
                  <!--size="mini"-->
                  <!--@click="() => append(data)">-->
                <!--</el-button>-->
                <!--<el-button-->
                  <!--icon="el-icon-delete"-->
                  <!--type="text"-->
                  <!--size="mini"-->
                  <!--@click="() => remove(node, data)">-->
                <!--</el-button>-->
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="auth-add" v-if="formOpt">
      <div class="title">{{formOpt === 'edit' ? '编辑权限' : '添加权限'}}</div>
      <div class="auth-form">
        <el-form :model="authForm" :rules="authFormRules" ref="authForm" :label-width="formLabelWidth">
          <el-form-item label="类型：" prop="findMode">
            <el-radio-group v-model="authForm.authType">
              <el-radio label="WEB端"></el-radio>
              <el-radio label="APP端"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="节点路径：" prop="nodePath">
            <!--<el-select v-model="authForm.nodePath" placeholder="请选择节点路径">-->
              <!--<el-option-->
                <!--v-for="item in nodePaths"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-cascader
              :options="data4"
              :show-all-levels="false"
              v-model="authForm.nodePath"
              placeholder="请选择节点路径"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="模块名称：" prop="moduleName">
            <el-input v-model="authForm.moduleName" placehoder="请输入模块名称"></el-input>
          </el-form-item>
          <el-form-item label="模块编码：" prop="moduleCode">
            <el-input v-model="authForm.moduleCode" placehoder="请输入模块编码"></el-input>
          </el-form-item>
          <el-form-item class="form-item-btn">
            <el-button @click="resetData('authForm')">重置</el-button>
            <el-button @click="cancelData('authForm')">取消</el-button>
            <el-button type="primary" @click="saveData('authForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authManagement',
  data () {
    const data = [{
      id: 1,
      value: 1,
      label: 'WEB端',
      children: [{
        id: 3,
        value: 3,
        label: '用户管理',
        children: [{
          id: 7,
          value: 7,
          label: '用户使用率',
          children: [{
            id: 11,
            value: 11,
            label: '查看'
          }]
        }, {
          id: 8,
          value: 8,
          label: '用户列表',
          children: [{
            id: 12,
            value: 12,
            label: '新增'
          }, {
            id: 13,
            value: 13,
            label: '修改'
          }, {
            id: 14,
            value: 14,
            label: '删除'
          }, {
            id: 15,
            value: 15,
            label: '查看'
          }]
        }]
      }, {
        id: 4,
        value: 4,
        label: '机构管理',
        children: [{
          id: 9,
          value: 9,
          label: '组织列表',
          children: [{
            id: 16,
            value: 16,
            label: '添加'
          }]
        }, {
          id: 10,
          value: 10,
          label: '组织申请管理',
          children: [{
            id: 17,
            value: 17,
            label: '审核'
          }]
        }]
      }]
    }, {
      id: 2,
      value: 2,
      label: 'APP端',
      children: [{
        id: 5,
        value: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        value: 6,
        label: '二级 2-2'
      }]
    }]
    return {
      id: 1000,
      searchForm: {
        name: ''
      },
      data4: JSON.parse(JSON.stringify(data)),
      data5: JSON.parse(JSON.stringify(data)),
      authForm: {
        authType: '',
        nodePath: [],
        moduleName: '',
        moduleCode: '',
        nodePaths: []
      },
      authFormRules: {
        nodePath: [{ required: true, message: '请选择节点路径', trigger: 'change' }],
        moduleName: [{ required: true, message: '请输入节点名称', trigger: 'change' }]
      },
      // 编辑表单
      formLabelWidth: '120px',
      formOpt: ''
    }
  },
  methods: {
    onSubmit () {
      console.log(this.searchForm)
    },
    append (node) {
      this.authForm.nodePath = []
      this.getRoot(node, 'add')
      // console.log(rootId)
      // console.log()
      // console.log(data.parent)
      // const newChild = { id: this.id++, label: 'testtest', children: [] }
      // if (!data.children) {
      //   this.$set(data, 'children', [])
      // }
      // data.children.push(newChild)
    },
    getRoot (node, opt) {
      this.authForm.nodePath.unshift(node.data.id)
      if (node.level === 1) {
        if (node.data.id === 1) {
          this.authForm.authType = 'WEB端'
        } else if (node.data.id === 2) {
          this.authForm.authType = 'APP端'
        }
        this.formOpt = opt
        console.log(this.authForm.nodePath)
        // return node.data.id
        return ''
      } else {
        return this.getRoot(node.parent, opt)
      }
    },
    remove (node) {
      this.$confirm('确认删除该节点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(node)
      })
      // debugger
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
    },

    edit (node) {
      this.authForm.nodePath = []
      this.getRoot(node, 'edit')
    },
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //     <span>{node.label}</span>
    //     <span>
    //     <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
    //   <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
    //   </span>
    //   </span>);
    // }
    saveData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          console.log(this[formName])
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetData (formName) {
      this.$refs[formName].resetFields()
      this.authForm.nodePath = []
      this.authForm.authType = ''
    },
    cancelData (formName) {
      this.formOpt = ''
      this.authForm.nodePath = []
      this.authForm.authType = ''
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
  .auth-management {
    display: flex;
    height: 100%;

    .auth-search {
      width: 307px;
      padding: 20px;
      margin-right: 15px;

      .search-header {
        .el-form {
          display: flex;
        }
      }
      .search-body{
        .search-opt-icons{
          opacity: 0;
          margin-left: 10px;
          .search-opt-icon{
            height: 20px;
            width: 20px;
            min-height: 20px;
            min-width: 20px;
          }
        }
        .custom-tree-node{
          font-size: 14px;
        }
        .el-tree-node__content{
          &:hover{
            .search-opt-icons{
              opacity: 1;
              -webkit-transition: all .3s;
              -moz-transition: all .3s;
              -ms-transition: all .3s;
              -o-transition: all .3s;
              transition: all .3s;
            }
          }
        }
      }
      .el-input {
        width: 191px;

        .el-input__inner {
          height: 38px;
        }
      }

      .el-button {
        height: 36px;
        min-height: 36px;
        padding: 0 19px;
      }
    }

    .auth-add {
      padding: 15px;
      flex-grow: 1;
      .el-form-item__content{
        text-align: left;
        .el-input{
          width: 334px;
          .el-input__inner{
            height: 36px;
          }
        }
      }
      .el-button {
         height: 34px;
         min-height: 34px;
         padding: 0 19px;
       }
      .title{
        padding-left: 15px;
        text-align: left;
        border-left: 2px solid #40C3AB;
      }
      .auth-form{
        padding-top: 30px;
      }
    }

    .auth-search, .auth-add {
      background: #fff;
    }
  }
</style>
