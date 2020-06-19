<template>
  <div class="bussiness-info">
    <el-upload multiple class="upload-demo" :action="uploadServer" :on-preview="handlePreview" :on-remove="handleRemove"
      :on-exceed="handleExceed" :on-success="handleSuccess" :file-list="fileList" list-type="picture">
      <el-button size="small" icon="el-icon-upload" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过1M</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="70%" :src="dialogImageUrl" alt="">
      <el-button icon="el-icon-download" type="text" @click="downLoadFile(dialogImageUrl)">下载</el-button>
    </el-dialog>
    <div class="block" v-if="fileList&&fileList.length>0">
      <v-pagination :current="page.current" :sizes="page.sizes" :size="page.size" :total="page.total" @reloadPage="jumpPage" @reloadSize="jumpSize"></v-pagination>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/pagination'
  import COMMONJS from '@/assets/js/common.js'
  import GLB_CONSTANT from '@/assets/js/glb-constant.js'
  import {
    pageFileList,
    saveFileList,
    deleteFileList
  } from '@/assets/js/API/api'

  export default {
    name: 'attachInfo',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: [],
        uploadServer: GLB_CONSTANT.devUrl.fileServer + 'uploadFile',
        checkObj: {
          type: 'add'
        },
        optType: 'add',
        page: {
          current: GLB_CONSTANT.page.current,
          size: 5,
          total: 0,
          sizes: [5, 10, 50]
        }
      }
    },
    components: {
      'v-pagination': Pagination
    },
    created() {
      this.uploadServer += "?sourceType=customer&sourceId=" + this.sourceId;
      this.getData()
    },
    props: {
      sourceId: { // 默认数据
        type: String
      }
    },
    methods: {
      jumpPage(index) {
        this.page.current = index
        this.getData()
      },
      jumpSize(val) {
        this.page.size = val
        this.page.current = 1
        this.getData()
      },
      handleRemove(file, fileList) {
        let _this = this
        this.$confirm('确认删除' + file.name + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = [];
          postData.push(file.id);
          deleteFileList(postData).then(res => {
            COMMONJS.showToast('删除成功')
            _this.getData()
          }).catch(() => {})
        })
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      downLoadFile(url) {
        window.open(url);
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 1;

        if (!isJPG && !isPng) {
          this.$message.error('上传头像图片只能是 JPG 或Png格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return isJPG && isPng && isLt2M;
      },
      handleSuccess(response, file, fileList) {
        COMMONJS.showToast('上传成功');
        this.getData();
      },
      getFilesList(fileList) {
        let urls = []
        var vm = this;
        fileList.forEach(element => {
          urls.push({
            id: element.id,
            name: element.fileName,
            // url: GLB_CONSTANT.fileServer + 'downloadFile?fileId=' + element.id
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          })
        });
        return urls
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      getData() {
        switch (this.$route.query.type) {
          case 'query':
            this.checkObj.type = this.$route.query.type
            break
          case 'update':
            this.checkObj.type = this.$route.query.type
            break
          case 'add':
            this.checkObj.type = this.$route.query.type
            break
        }
        let _this = this
        let postData = {
          current: this.page.current,
          size: this.page.size,
          sourceId: this.sourceId,
          sourceType: 'customer'
        }
        pageFileList(postData)
          .then(res => {
            _this.fileList = _this.getFilesList(res.data.records);
            _this.page.total = res.data.total
          }).catch(() => {})
      }
    }
  }

</script>

<style lang="scss">
  @import '../../../element-variables.scss';

  .bussiness-info {
    .el-dialog__header .dialog-title {
      text-align: left;
    }
  }

  .add-dialog-footer {
    margin-left: 120px;
  }

  .padding-left-none {
    padding-left: 0 !important;
  }

</style>
