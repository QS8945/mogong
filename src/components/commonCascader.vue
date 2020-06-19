<template>
  <div>
    <el-cascader
            ref="cascaderAddr"
            :options="cantonOptions"
            v-model="cantonNameC"
            @change="changeCantonName"
            :props="props"
            :show-all-levels="showAllLevels"
            :clearable="clearable"
            :placeholder="cantonPlaceholder"
            :filterable="filterable"
            :change-on-select="changeOnSelect"
            :disabled="disabled"
    ></el-cascader>
  </div>
</template>

<script>
export default {
    name: 'upload',
    data() {
        return {
            cantonNameC: []
        }
    },
    props: {
        cantonName: {
            type: Array,
            default() {
                return []
            }
        },
        cantonOptions: {
            type: Array,
            default() {
                return []
            }
        },
        props: {
            type: Object,
            default() {
                return {
                    label: 'name',
                    value: 'id',
                    children: 'children',
                    expandTrigger: 'hover'
                }
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: 0
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
        changeOnSelect: {
            type: Boolean,
            default: false
        },
        cantonPlaceholder: {
            type: String,
            default: '请选择'
        }
    },
    mounted() {
        this.cantonNameC = this.cantonName
    },
    methods: {
        changeCantonName() {
            this.$emit('changeCantonName', this.cantonNameC, this.index)
        }
    }
}
</script>

<style scoped>
</style>
