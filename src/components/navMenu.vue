<template>
  <div class="navMenu">

    <template v-for="menuItemList in menuList">
      <!-- 最后一级菜单 -->
      <el-menu-item v-if="!menuItemList.children.length"
                    :key="menuItemList.id" :index="menuItemList.url">
        <i :class="'icon iconfont '+(menuItemList.img || 'el-icon-document')"></i>
        <span v-if="$i18n.locale =='zh'">{{menuItemList.name}}</span>
        <span v-else>{{menuItemList.englishName}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="menuItemList.children.length"
                  :key="menuItemList.id" :index="menuItemList.id">
        <template slot="title">
          <i :class="'icon iconfont '+(menuItemList.img || 'el-icon-document')"></i>
          <span v-if="$i18n.locale =='zh'">{{menuItemList.name}}</span>
          <span v-else>{{menuItemList.englishName}}</span>
        </template>
        <!-- 递归 -->
        <nav-menu :menuList="menuItemList.children"></nav-menu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'navMenu',
  data () {
    return {
    }
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
  .el-menu--collapse .el-menu-item span, .el-menu--collapse .el-submenu > .el-submenu__title span{
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .el-menu--collapse .el-menu-item .el-submenu__icon-arrow, .el-menu--collapse .el-submenu > .el-submenu__title .el-submenu__icon-arrow{
    display: none;
  }
</style>
