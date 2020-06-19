<template>
    <div class="auth-management">
    </div>
</template>

<script>
export default {
  name: 'authManagement',
  data () {
    return {}
  },
  mounted: function () {
    this.initPage()
  },
  methods: {
    initPage () {
      let _this = this
      if (this.$route.query.token) {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {}
        userInfo.token = this.$route.query.token
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      }
      v.getmenuListNew('back')
        .then(res => {
          if (res.data.length === 0) {
            _this.$message.error('当前账号没有权限，请联系管理员')
          } else {
            _this.$router.push({
              path: _this.getFirstMenu(res.data)
            })
          }
        })
    },
    getFirstMenu (menu) {
      for (var i = 0; i < menu.length; i++) {
        if (menu[i].children && menu[i].children.length) {
          this.getFirstMenu(menu[i].children)
        } else {
          if (menu[i].url) {
            return menu[i].url
          }
        }
      }
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
