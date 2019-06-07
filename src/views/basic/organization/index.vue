<!--咨询本创建修改页面-->
<template>
  <div class="organization-wrap" ref="editConsult" v-loading="loading">
    <div class="breadcrumb cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>机构信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="organization-container">
      <el-form
        :model="organizationForm"
        label-position="top"
        :rules="organizationFormRules"
        ref="organizationForm"
        label-width="120px"
        size="mini">
        <p class="basic-info-title">基本信息</p>
        <el-form-item label="机构名称" prop="school_name" class="organization-name">
          <el-input v-model.trim="organizationForm.school_name" :maxlength="30" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="logo_url" class="logo-image">
          <setOneImg :images="logoImages" :type="1" v-on:imgs="addLogoImg" :store="'avatar'" :role="'teacher'" :size="5" placeholder="上传LOGO"></setOneImg>
        </el-form-item>
        <el-form-item label="背景图" prop="background_url" class="background-image" >
          <setOneImg :images="backImages" :type="1" v-on:imgs="addBackImg" :store="'avatar'" :role="'teacher'" :size="5" placeholder="上传背景图"></setOneImg>
        </el-form-item>
        <el-form-item label="机构简介" prop="school_desc" style="width:760px;">
          <el-input type="textarea" :maxlength="500" placeholder="请上传简介，不可涉及违规内容" :rows="6" v-model.trim="organizationForm.school_desc"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="organization-bottom">
      <el-button type="primary" size="small" @click="handleCancel" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      <el-button type="primary" size="small" @click='handleSubmit("organizationForm")' class="cac-button-one confirm_button" round>确 定</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SetOneImg from '@/components/platform/setOneImg.vue'
import organizationApi from '@/services/basic/organization'

export default {
  data () {
    return {
      loading: false,
      logoImages: [],
      backImages: [],
      organizationForm: {
        school_name: '',
        logo_url: '',
        background_url: '',
        school_desc: ''
      },
      organizationFormRules: {
        school_name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        logo_url: [
          { required: true, message: '请上传LOGO', trigger: 'change' }
        ],
        background_url: [
          { required: true, message: '请上传背景图', trigger: 'change' }
        ],
        school_desc: [
          { required: true, message: '请输入机构简介', trigger: 'blur' },
          { min: 0, max: 500, message: '超出字数限制，无法编辑', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    SetOneImg
  },
  computed: {
    // logoImages () {
    //   if (this.organizationForm.logo_url) {
    //     return [this.organizationForm.logo_url]
    //   } else {
    //     return []
    //   }
    // },
    // backImages () {
    //   if (this.organizationForm.background_url) {
    //     return [this.organizationForm.background_url]
    //   } else {
    //     return []
    //   }
    // }
  },
  watch: {
    organizationForm: {
      handler (oldVal, newVal) {
        console.log('lall')
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getDefaultData()
    },
    // 获取机构信息数据
    getDefaultData () {
      organizationApi.queryOrganizationList().then(res => {
        if (res.status_code === 200) {
          let data = res.data
          for (let key in this.organizationForm) {
            if (data[key]) {
              this.organizationForm[key] = data[key]
            }
          }
          if (this.organizationForm.logo_url) {
            this.logoImages = [{
              type: 1,
              maskVisible: false,
              urls: this.organizationForm.logo_url,
              url: this.organizationForm.background_url
            }]
          }
          if (this.organizationForm.background_url) {
            this.backImages = [{
              type: 1,
              maskVisible: false,
              urls: this.organizationForm.background_url,
              url: this.organizationForm.background_url
            }]
          }
        }
      })
    },
    // logo图片上传成功的回调
    addLogoImg (data) {
      this.logoImages = []
      var imgArr = []
      data.forEach(item => {
        this.logoImages.push(item)
        imgArr.push(item.urls)
      })
      this.organizationForm.logo_url = imgArr[0]
    },
    // 背景图片上传成功的回调
    addBackImg (data) {
      this.backImages = []
      var imgArr = []
      console.log(data)
      data.forEach(item => {
        this.backImages.push(item)
        imgArr.push(item.urls)
      })
      this.organizationForm.background_url = imgArr[0]
    },
    // 表单提交
    handleSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = this.organizationForm

          organizationApi.postOrganization(params).then(res => {
            this.loading = false
            if (res.status_code === 200) {
              this.$message({
                message: '恭喜你，保存成功',
                type: 'success'
              })
            }
          })
        } else {
        }
      })
    },
    // 取消
    handleCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
  .organization-wrap {
    width: 100%;
    text-align: left;
    overflow: hidden;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .upload-text {
        display: block;
        position: absolute;
        // content: '上传LOGO';
        font-size: 13px;
        color: #ABB9C6;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
      }
      .logo-reupload {
        display: inline-flex;
        flex-direction: column;
        color:#fff;
        transform: translate(-50%,-50%);

        > i {
          font-size: 30px;
        }
      }
    }
    .background-image .avatar-uploader .el-upload {
      img {
        position: relative;
      }
    }
    .el-upload__tip {
      color: #7A808D;
      margin: 0;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 140px;
      height: 105px;
      line-height: 90px;
      text-align: center;
    }
    .avatar {
      width: 140px;
      height: 105px;
      display: block;
    }
    .logo-image {
      .imgPage .images__item__wrap {
        width: 140px;
        height: 105px;
      }
      .imgPage .images {
        height: 105px;
      }
    }
    .background-image {
      .imgPage .images__item__wrap {
        width: 180px;
        height: 135px;
      }
      .background-image-show {
         width: 180px;
        height: 135px;
        display: block;
      }
    }
    .have-image {
      background: rgba(0, 0, 0, .6);
    }

    .organization-container {
      width: 100%;
      margin-top: 30px;
      color: #3E434C;

      .basic-info-title {
        font-size: 20px;
        padding-bottom: 20px;
      }
      .organization-name {
        .el-input__inner {
          width: 620px;
          height: 50px;
        }
      }
      .el-form-item__content {
        padding-top: 6px;
      }
    }
    .organization-bottom {
      padding-top: 50px;
    }
  }
</style>

