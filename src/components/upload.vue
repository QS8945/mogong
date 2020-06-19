<template>
  <div>
    <el-upload class="business-license"
               :disabled="disabled"
               :action="uploadServer"
               accept="image/png, image/jpeg"
               :file-list="fileList"
               list-type="picture-card"
               :before-upload="beforeAvatarUpload"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               :on-success="handleAvatarSuccess"
               :limit="13"
               :on-exceed="handleExceed"
               :multiple="true">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import COMMONJS from '@/assets/js/common.js'
import GLB_CONSTANT from '@/assets/js/glb-constant'
export default {
  name: 'upload',
  data () {
    return {
      fileList: [],
      uploadServer: GLB_CONSTANT.devUrl.fileServer + 'uploadFile'
    }
  },
  props: {
    uploadList: { // 默认当前页
      type: Array,
      default () {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    for (var i = 0; i < this.uploadList.length; i++) {
      this.fileList.push({
        id: this.uploadList[i].id,
        url: GLB_CONSTANT.devUrl.fileServer + 'downloadFile?fileId=' + this.uploadList[i].id
      })
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.$emit('reloadPage', index)
    },
    handleSizeChange (val) {
      this.$emit('reloadSize', val)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        // this.common.errorTip('上传图片必须是JPG/PNG 格式!')
        COMMONJS.showToast('上传图片必须是JPG/PNG 格式', 'error')
      }
      if (!isLt2M) {
        // this.common.errorTip('上传图片大小不能超过 2MB!')
        COMMONJS.showToast('上传图片大小不能超过 2MB', 'error')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleRemove (file, fileList) {
      this.$emit('changeFiles', this.getFilesList(fileList))
    },
    handlePictureCardPreview (file) {
      this.$emit('pictureCardPreview', {
        dialogImageUrl: file.url,
        dialogVisible: true
      })
      // this.dialogImageUrl = file.url
      // this.dialogVisible = true
    },
    handleAvatarSuccess (response, file, fileList) {
      this.$emit('changeFiles', this.getFilesList(fileList))
    },
    getFilesList (fileList) {
      let urls = []
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].id) {
          urls.push({
            id: fileList[i].id
            // fileName: fileList[i].name
          })
        } else {
          urls.push({
            id: fileList[i].response.data.id
            // fileName: fileList[i].response.data.fileName
          })
        }
      }
      return urls
    },
    handleExceed (files, fileList) {
      COMMONJS.showToast(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`, 'warning')
    }
  }
}
</script>

<style scoped>

</style>
