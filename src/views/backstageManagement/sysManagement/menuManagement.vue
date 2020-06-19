<template>
    <div class="auth-management">
        <div class="auth-search">
            <div class="search-header">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <!-- <el-form-item>
                      <el-input v-model="searchForm.keyword" placeholder="请输入菜单名称"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item>
                      <el-button type="primary" icon="el-icon-plus" size="mini" @click="append('')">新增菜单</el-button>
                    </el-form-item> -->
                </el-form>
            </div>
            <div class="search-body">
                <div class="block">
                    <el-tree :data="menuTreeList" node-key="code" :default-expand-all="false" :expand-on-click-node="false"
                             :props="props">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span @click="() => edit(node)">{{ node.label }}</span>
              <span class="search-opt-icons">
                <el-button class="search-opt-icon" v-if="node.data.type==1" icon="el-icon-plus" circle
                           @click="() => append(node)"></el-button>
                <el-button class="search-opt-icon" v-if="node.level>1" icon="el-icon-edit" circle
                           @click="() => edit(node)"></el-button>
                <el-button class="search-opt-icon" v-if="node.level>1" icon="el-icon-delete" circle
                           @click="() => remove(node)"></el-button>
              </span>
            </span>
                    </el-tree>
                </div>
            </div>
        </div>
        <div class="auth-add" v-if="formOpt">
            <div class="title">{{formOpt === 'edit' ? '编辑菜单' : '添加菜单'}}</div>
            <div class="auth-form">
                <el-form :model="menuForm" :rules="menuFormRules" ref="menuForm" :label-width="formLabelWidth">
                    <el-form-item :label="$t('menuMange.sourceType')" prop="sourceType">
                        <el-radio-group v-model="menuForm.sourceType">
                            <el-radio v-for="item in sourceTypeOptions" :label="item.code" :key="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.nodePath')" prop="nodePath">
                        <el-cascader :options="routeTreeList" clearable change-on-select :show-all-levels="false"
                                     v-model="menuForm.nodePath"
                                     :placeholder="$t('elForm.select')+$t('menuMange.nodePath')"
                                     :props="props"></el-cascader>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.name')" prop="name">
                        <el-input v-model.trim="menuForm.name"
                                  :placeholder="$t('elForm.input')+$t('menuMange.name')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.englishName')" prop="englishName">
                        <el-input v-model="menuForm.englishName"
                                  :placeholder="$t('elForm.input')+$t('menuMange.englishName')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.menuType')" prop="menuType">
                        <el-radio-group v-model="menuForm.menuType" :disabled="formOpt=='edit'">
                            <el-radio v-for="item in  menuTypeOptions" :label="item.code" :key="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.url')" prop="url">
                        <el-input v-model="menuForm.url"
                                  :placeholder="$t('elForm.input')+$t('menuMange.url')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.img')" prop="img">
                        <el-input v-model="menuForm.img"
                                  :placeholder="$t('elForm.input')+$t('menuMange.img')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menuMange.sortNum')" prop="sort">
                        <el-input v-model="menuForm.sort" placehoder=""></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-btn">
                        <el-button :loading="loading" @click="resetData('menuForm')">{{$t('button.reset')}}</el-button>
                        <el-button :loading="loading" @click="cancelData('menuForm')">{{$t('button.cancel')}}
                        </el-button>
                        <el-button :loading="loading" type="primary" @click="saveData('menuForm')">
                            {{$t('button.save')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { sysMenuListModule, sysMenuDelete, sysTree, sysMenuFind, sysMenuAdd } from '@/assets/js/API/api'
export default {
  name: 'authManagement',
  data () {
    return {
      id: 1000,
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      loading: false,
      searchForm: { name: '' },
      routeTreeList: [],
      menuTreeList: [],
      sourceTypeOptions: [],
      menuTypeOptions: [{ code: 1, name: '节点' }, { code: 2, name: '按钮' }],
      menuForm: {
        sourceType: '',
        menuType: '',
        nodePath: [],
        parentId: '',
        name: '',
        englishName: '',
        url: '',
        id: '',
        img: '',
        sort: ''
      },
      menuFormRules: {
        sourceType: [{
          required: true,
          message: this.$t('elForm.select') + this.$t('menuMange.sourceType'),
          trigger: 'change'
        }],
        menuType: [{
          required: true,
          message: this.$t('elForm.select') + this.$t('menuMange.menuType'),
          trigger: 'blur'
        }],
        // nodePath: [{ required: true, message: '请选择节点路径', trigger: 'change' }],
        name: [{
          required: true,
          message: this.$t('elForm.input') + this.$t('menuMange.name'),
          trigger: 'blur'
        }]
      },
      // 编辑表单
      formLabelWidth: '140px',
      formOpt: ''
    }
  },
  mounted: function () {
    this.picklist()
    this.listMenuTree()
  },
  methods: {
    append (node) {
      this.formOpt = ''
      this.menuForm = {
        sourceType: '',
        menuType: '',
        nodePath: [],
        parentId: '',
        name: '',
        englishName: '',
        url: '',
        img: '',
        id: '',
        sort: ''
      }
      this.menuForm.nodePath = []

      this.getRoot(node, 'add')
      this.listMenuTreeByCondition('')
    },
    edit (node) {
      if (node.level === 1) { return }
      this.formOpt = ''
      if (this.$refs['menuForm']) { this.$refs['menuForm'].resetFields() }
      this.listMenuTreeByCondition(node.data.code)
      this.editMenu(node.data.code, node)
    },
    picklist: function () {
      this.listSysDictionary('menu_type', '')
    },
    // 字典服务
    listSysDictionary: function (dictionaryTypeCode, parentCode) {
      const params = { typeCode: dictionaryTypeCode, parentCode: parentCode }
      sysMenuListModule(params).then(res => {
        if (dictionaryTypeCode === 'menu_type') {
          this.sourceTypeOptions = res.data
        }
      }).catch(() => {
      })
      // v.menuManagementList(dictionaryTypeCode, parentCode).then(res => {
      //   if (dictionaryTypeCode === 'menu_type') {
      //     this.sourceTypeOptions = res.data
      //   }
      // })
    },
    getRoot (node, opt) {
      this.menuForm.nodePath.unshift(node.data.code)
      // this.menuForm.id = node.data.id;
      if (node.level === 1) {
        this.menuForm.sourceType = node.data.code
        this.formOpt = opt
      } else {
        this.getRoot(node.parent, opt)
      }
    },
    remove (node) {
      this.$confirm('确认删除该节点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let requestStr = 'sysMenu/delete'
        let queryForm = {
          id: node.data.code
        }
        sysMenuDelete(queryForm).then(res => {
          this.$message.success('删除成功')
          this.listMenuTree()
        }).catch(() => {
        })
        // v.post(requestStr, queryForm)
        //   .then(res => {
        //     this.$message.success('删除成功')
        //     this.listMenuTree()
        //   })
        //   .catch(error => {
        //     this.$message.error(error)
        //   })
      })
    },
    listMenuTree: function () {
      // let requestStr = 'sysMenu/tree'
      let queryForm = {
        sourceType: '', //  * 菜单来源类型  1 : WEB; 2: APP
        parentId: ''
      }
      sysTree(queryForm).then(res => {
        this.menuTreeList = res.data
        this.routeTreeList = this.handleList(res.data)
      }).catch(() => {
      })
      // v.post(requestStr, queryForm)
      //   .then(res => {
      //     this.menuTreeList = res.data
      //     this.routeTreeList = this.handleList(res.data)
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    listMenuTreeByCondition: function (id) {
      // let requestStr = 'sysMenu/tree'
      let queryForm = {
        sourceType: '', //  * 菜单来源类型  1 : WEB; 2: APP
        parentId: '',
        id: id
      }
      sysTree(queryForm).then(res => {
        this.routeTreeList = this.handleList(res.data)
      }).catch(() => {
      })
      // v.post(requestStr, queryForm)
      //   .then(res => {
      //     this.routeTreeList = this.handleList(res.data)
      //   })
      //   .catch(error => {
      //     this.loading = false
      //     this.$message.error(error)
      //   })
    },
    editMenu: function (id, node) {
      // let requestStr = 'sysMenu/find'
      let queryForm = {
        id: id
      }
      sysMenuFind(queryForm).then(res => {
        res.data.nodePath = []
        this.menuForm = res.data
        this.getRoot(node.parent, 'edit')
      }).catch(() => {
      })
      // v.post(requestStr, queryForm)
      //   .then(res => {
      //     res.data.nodePath = []
      //     this.menuForm = res.data
      //     this.getRoot(node.parent, 'edit')
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
    },
    handleList: function (array) {
      for (let arr of array) {
        if (arr.children && arr.children.length == 0) { arr.children = null }
        if (arr.children && arr.children.length > 0) { this.handleList(arr.children) }
      }
      return array
    },
    saveData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let requestStr = 'sysMenu/add'
          if (this.menuForm.nodePath.length > 0 && this.menuForm.nodePath[this.menuForm.nodePath.length - 1].length > 5) { this.menuForm.parentId = this.menuForm.nodePath[this.menuForm.nodePath.length - 1] } else { this.menuForm.parentId = '' }
          let params = this.menuForm
          this.loading = true
          sysMenuAdd(params).then(res => {
            this.loading = false
            this.menuForm.id = res.data
            this.formOpt = 'edit'
            this.$message.success('保存成功')
            this.listMenuTree()
          }).catch(() => {
            this.loading = false
          })
          // v.post(requestStr, params)
          //   .then(res => {
          //     this.loading = false
          //     this.menuForm.id = res.data
          //     this.formOpt = 'edit'
          //     this.$message.success('保存成功')
          //     this.listMenuTree()
          //   })
          //   .catch(error => {
          //     this.loading = false
          //     this.$message.error(error)
          //   })
        } else {

        }
      })
    },
    resetData (formName) {
      this.$refs[formName].resetFields()
      this.menuForm.nodePath = []
      this.menuForm.authType = ''
    },
    cancelData (formName) {
      this.formOpt = ''
      this.menuForm.nodePath = []
      this.menuForm.authType = ''
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
    .auth-management {
        padding: 16px;
        display: flex;
        height: 91vh;

        .auth-search {
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
            width: 307px;
            padding: 20px;
            margin-right: 15px;

            .search-header {
                .el-form {
                    display: flex;
                }
            }
            .search-body {
                .search-opt-icons {
                    opacity: 0;
                    margin-left: 10px;
                    .search-opt-icon {
                        height: 20px;
                        width: 20px;
                        min-height: 20px;
                        min-width: 20px;
                    }
                }
                .custom-tree-node {
                    font-size: 14px;
                }
                .el-tree-node__content {
                    &:hover {
                        .search-opt-icons {
                            opacity: 1;
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
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
            .search-opt-icons {
                .el-button {
                    width: 69px;
                    min-width: 69px;
                    height: 36px;
                    min-height: 36px;
                    padding: 0;
                }
            }
        }

        .auth-add {
            padding: 15px;
            flex-grow: 1;
            .el-form-item__content {
                text-align: left;
                .el-input {
                    width: 334px;
                    .el-input__inner {
                        height: 36px;
                    }
                }
            }
            .el-radio {
                margin-bottom: 0px;
            }
            .el-button {
                // width: 69px;
                min-width: 69px;
                height: 34px;
                min-height: 34px;
                padding: 0;
            }
            .title {
                padding-left: 15px;
                text-align: left;
                border-left: 2px solid #40c3ab;
            }
            .auth-form {
                padding-top: 30px;
            }
        }

        .auth-search,
        .auth-add {
            background: #fff;
        }
    }
</style>
