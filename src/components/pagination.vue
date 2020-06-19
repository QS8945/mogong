<template>
    <div>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="current"
                :page-sizes="sizes"
                :page-size="size"
                :layout="layout"
                :total="total"
                :pager-count="pagerCount"
                :prev-text="prevText"
                :next-text="nextText"
                background>
        </el-pagination>
    </div>
</template>

<script>
import GLB_CONSTANT from '@/assets/js/glb-constant'
export default {
  name: 'pagination',
  data () {
    return {}
  },
  props: {
    current: { // 默认当前页
      type: Number,
      default: GLB_CONSTANT.page.current
    },
    sizes: { // 默认容量分类
      type: Array,
      default () {
        return GLB_CONSTANT.page.sizes
      }
    },
    size: { // 默认容量
      type: Number,
      default: GLB_CONSTANT.page.size
    },
    layout: { // 默认排版
      type: String,
      default: GLB_CONSTANT.page.layout
    },
    prevText: { // 默认排版
      type: String,
      default: ''
    },
    nextText: { // 默认排版
      type: String,
      default: ''
    },
    pagerCount: { // 默认分页数
      type: Number,
      default: GLB_CONSTANT.page.pagerCount
    },
    total: { // 默认总数
      type: Number,
      default: GLB_CONSTANT.page.total
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.$emit('reloadPage', index)
    },
    handleSizeChange (val) {
      this.$emit('reloadSize', val)
    }
  }
}
</script>

<style scoped>

</style>
