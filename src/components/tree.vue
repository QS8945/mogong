<template>
  <div>
    <el-tree
            ref="tree"
            :data="treeObj.data"
            show-checkbox
            node-key="id"
            :props="defaultProps">
    </el-tree>
    <div slot="footer" class="dialog-footer" v-if="treeObj.type!=='query'">
      <el-button type="primary" @click="getChooseTreeData()">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'canton',
  data () {
    return {
    }
  },
  props: {
    treeObj: {
      type: Object,
      default () {
        return {}
      }
    },
    defaultProps: {
      type: Object,
      default () {
        return {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    getChooseTreeData () {
      let chooseTreeData = this.$refs.tree.getCheckedNodes()
      for (var i = 0; i < chooseTreeData.length; i++) {
        if (chooseTreeData[i].isLeaf) {
          chooseTreeData.splice(i, 1)
          i--
        } else {
          chooseTreeData[i].stdClassCode = chooseTreeData[i].parentCode
          chooseTreeData[i].stdWasteCode = chooseTreeData[i].code
        }
      }
      let obj = {
        treeData: chooseTreeData,
        treeVisible: false
      }
      this.$emit('getChooseTreeData', obj)
    },
    cancelForm () {
      let obj = {
        data: '',
        treeVisible: false,
        type: this.treeObj.type
      }
      this.$emit('changeTreeVisible', obj)
    }
  }
}
</script>

<style scoped>
  .dialog-footer{
    padding-top: 20px;
  }
</style>
