<template>
  <div>
    <el-upload
      class="business-license"
      :disabled="disabled"
      :headers="headers"
      :action="uploadServer"
      :file-list="fileList"
      :list-type="listType"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :on-exceed="handleExceed"
      :limit="limitFile"
      :multiple="true"
    >
      <el-button :disabled="disabled" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{tip1}}</div>
      <div slot="tip" class="el-upload__tip">{{tip2}}</div>
    </el-upload>
  </div>
</template>

<script>
import COMMONJS from "@/assets/js/common.js";
import GLB_CONSTANT from "@/assets/js/glb-constant";
export default {
  name: "upload",
  data() {
    return {
      limitFile: 10,
      fileList: [],
      uploadServer: GLB_CONSTANT.devUrl.fileServer + "/api/file/upload"
    };
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    tip1: {
      type: String,
      default: '支持jpg、jpeg、png、bmp格式'
    },
    tip2: {
      type: String,
      default: '图片小于5M（尺寸80*80像素），超过此尺寸会被压缩并降低质量'
    },
    listType: {
      type: String,
      default: 'picture'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Object,
      default: {}
    }
  },
  methods: {
    showFile(fileList) {
      this.fileList = []
      for (var i = 0; i < fileList.length; i++) {
        let fileName = fileList[i].split('/')[fileList[i].split('/').length - 1]
        if (fileList[i]) {
          this.fileList.push({
            id: fileList[i],
            name: fileName.split('_')[fileName.split('_').length - 1],
            url: GLB_CONSTANT.devUrl.fileServer + "/img/" + fileList[i]
            // url: fileList[i]
          })
        }
      }
      this.$emit("changeFiles", fileList);
    },
    handleCurrentChange(index) {
      this.$emit("reloadPage", index);
    },
    handleSizeChange(val) {
      this.$emit("reloadSize", val);
    },
    beforeAvatarUpload(file) {
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      // "application/msword"
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isPDF = file.type === "application/pdf";
      const isWord = (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.split('.')[file.name.split('.').length - 1] === 'doc' || file.name.split('.')[file.name.split('.').length - 1] === 'docx');
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG && !isPNG && !isPDF && !isWord) {
        // this.common.errorTip('上传图片必须是JPG/PNG 格式!')
        COMMONJS.showToast("上传文件必须是JPG/PNG/DOC/PDF 格式", "error");
      }
      if (!isLt2M) {
        // this.common.errorTip('上传图片大小不能超过 2MB!')
        COMMONJS.showToast("上传文件大小不能超过 10MB", "error");
      }
      return (isJPG || isPNG || isPDF || isWord) && isLt2M;
    },
    handleRemove(file, fileList) {
      this.$emit("changeFiles", this.getFilesList(fileList));
    },
    handlePictureCardPreview(file) {
      this.$emit("pictureCardPreview", {
        dialogImageUrl: file.response ? GLB_CONSTANT.devUrl.fileServer + "/img/" + file.response.data :file.url,
        dialogVisible: true
      })
      // this.dialogImageUrl = file.url
      // this.dialogVisible = true
    },
    handleAvatarSuccess(response, file, fileList) {
      let msg
      if (response.code === 0) {
        this.$emit("changeFiles", this.getFilesList(fileList));
      } else {
        msg = response.msg || "token失效，请重新登录";
        COMMONJS.showToast(msg, "error");
         if (response.code === 500210) {
          setTimeout(function() {
            COMMONJS.getLoginOut();
          }, 1000);
         }
      }
    },
    getFilesList(fileList) {
      let urls = [];
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response && fileList[i].response.data) {
          urls.push(fileList[i].response.data)
        } else {
          urls.push(fileList[i].id)
        }
      }
      // for (let i = 0; i < fileList.length; i++) {
      //   if (fileList[i].id) {
      //     urls.push({
      //       id: fileList[i].id
      //       // fileName: fileList[i].name
      //     });
      //   } else {
      //     urls.push({
      //       id: fileList[i].response.data.id
      //       // fileName: fileList[i].response.data.fileName
      //     });
      //   }
      // }
      return urls;
    },
    handleExceed(files, fileList) {
      COMMONJS.showToast(
        `当前限制选择 ${this.limitFile} 个文件`,
        "warning"
      );
      // COMMONJS.showToast(
      //   `当前限制选择 1 个文件，本次选择了 ${
      //     files.length
      //   } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      //   "warning"
      // );
    }
  }
};
</script>

<style scoped>
</style>
