<template>
  <div>
    <el-cascader
            :options="cantonOptions"
            v-model="cantonNameC"
            @change="changeCantonName"
            :props="props"
            :show-all-levels="showAllLevels"
            :clearable="clearable"
            :placeholder="cantonPlaceholder"
            :filterable="filterable"
            :disabled="disabled"
    ></el-cascader>
  </div>
</template>

<script>
import { getSysCanton } from '@/assets/js/API/api'
export default {
  name: 'canton',
  data () {
    return {
      cantonNameC: [],
      cantonOptions: []
    }
  },
  props: {
    cantonName: {
      type: Array,
      default () {
        return []
      }
    },
    props: {
      type: Object,
      default () {
        return {
          label: 'name',
          value: 'id',
          children: 'cities',
          leaf: 'isleaf',
          lazy: true,
          lazyLoad (node, resolve) {
            let parentId = node.data && node.data.id
            getSysCanton({ parentId: parentId })
              .then(res => {
                let nodes = res.data
                resolve(nodes)
              }).catch(() => {
              })
          }
        }
      }
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    cantonPlaceholder: {
      type: String,
      default: '请选择'
    }
  },
  mounted () {
    if (this.cantonName.length) {
      this.cantonNameC = this.cantonName
    }
    this.getCanton()
  },
  methods: {
    getCanton () {
      this.getAreaRange('', 0)
    },
    getAreaRange (val, level) {
      let _this = this
      getSysCanton({ parentId: val })
        .then(res => {
          if (level === 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].level !== 3) {
                res.data[i].cities = []
              }
            }
            _this.cantonOptions = res.data
          }
          if (level === 1) {
            for (var j = 0; j < res.data.length; j++) {
              if (res.data[j].level !== 3) {
                res.data[j].cities = []
              }
            }
            for (var k = 0; k < _this.cantonOptions.length; k++) {
              if (_this.cantonOptions[k].id === val) {
                _this.cantonOptions[k].cities = res.data
              }
            }
          }
          if (level === 2) {
            for (var l = 0; l < _this.cantonOptions.length; l++) {
              for (var m = 0; m < _this.cantonOptions[l].cities.length; m++) {
                if (_this.cantonOptions[l].cities[m].id === val) {
                  // if (_this.cantonOptions[l].cities[m].name !== '市辖区' && _this.cantonOptions[l].cities[m].name !== '县') {
                  //   _this.chooseArea = _this.cantonOptions[l].cities[m].name
                  // } else {
                  //   _this.chooseArea = ''
                  // }
                  _this.chooseArea = _this.cantonOptions[l].cities[m].name
                  _this.cantonOptions[l].cities[m].cities = res.data
                  _this.$emit('changeCantonName', this.cantonNameC, this.chooseArea)
                }
              }
            }
          }
          level++
          if (_this.cantonNameC.length > level && (level < 3)) {
            _this.getAreaRange(_this.cantonNameC[level - 1], level)
          }
        }).catch(() => {
        })
    },
    handleItemChange (val) {
      let _this = this
      let parentId = val[1] || val[0]
      getSysCanton({ parentId: parentId })
        .then(res => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].level !== 3) {
              res.data[i].cities = []
            }
          }
          for (var j = 0; j < _this.cantonOptions.length; j++) {
            if (val.length > 1) {
              for (var k = 0; k < _this.cantonOptions[j].cities.length; k++) {
                if (_this.cantonOptions[j].cities[k].id === parentId) {
                  // if (_this.cantonOptions[j].cities[k].name !== '市辖区' && _this.cantonOptions[j].cities[k].name !== '县') {
                  //   _this.chooseArea = _this.cantonOptions[j].cities[k].name
                  // } else {
                  //   _this.chooseArea = ''
                  // }
                  _this.chooseArea = _this.cantonOptions[j].cities[k].name
                  _this.cantonOptions[j].cities[k].cities = res.data
                }
              }
            } else {
              if (_this.cantonOptions[j].id === parentId) {
                _this.cantonOptions[j].cities = res.data
              }
            }
          }
        }).catch(() => {
        })
    },
    changeCantonName (list) {
      let parentId = list[0]
      let level = 1
      this.getEmitVal(list, parentId, level)
    },
    getEmitVal (list, parentId, level) {
      let _this = this
      getSysCanton({ parentId: parentId })
        .then(res => {
          let nodes = res.data
          for (var i = 0; i < nodes.length; i++) {
            if (list[level] === nodes[i].id) {
              if (nodes[i].name === '市辖区' || nodes[i].name === '县') {
                level--
                _this.getEmitVal(list, '', level)
                return false
              } else {
                _this.$emit('changeCantonName', _this.cantonNameC, nodes[i].name)
                return false
              }
            }
          }
        }).catch(() => {
        })
    }
  }
}
</script>

<style scoped>

</style>
