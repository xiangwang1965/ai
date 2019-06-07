<!--创建修改页面-->
<template>
  <div class="createStaffPage" ref="createStaffPage" v-loading="loading">
    <div class="breadcrumb cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/staff' }">员工管理</router-link>
        <el-breadcrumb-item>{{status=="edit"?"编辑员工":"创建员工"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 创建员工 -->
    <div class="createStaffContainer">
      <el-form
        :model="createForm"
        label-position="top"
        :rules="createFormRules"
        ref="createForm"
        label-width="100px"
        size="mini">
        <p>基本信息</p>
        <div class="left">
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="createForm.name" :maxlength="20" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号（用于登录）" prop="telephone">
            <el-input v-model.number="createForm.telephone" :maxlength="11" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="所属校区" prop="campus_id">
            <el-select v-model="createForm.campus_id" placeholder="请选择校区">
              <el-option
                v-for="item in campusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model.trim="createForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item prop="avatar_Rules">
            <div style="display:inline-block;" slot="label">员工头像<span
              style="color:#ABB9C6;">（主讲、辅导老师上传头像将会在app内展示）</span></div>
            <setOneImg :images="images" :type="1" v-on:imgs="addImg" :store="'avatar'" :role="'staff'"
                       placeholder="上传头像"></setOneImg>
            <p style="color:#7A808D;">只能上传jpg或png，且不超过2M</p>
          </el-form-item>
        </div>
        <p>角色管理</p>
        <el-form-item style="width:100%" label="管辖校区" prop="roleCampusList">
          <el-radio-group v-model="createForm.role_campus" @change="roleCampusChange">
            <el-radio :label="0">全部校区</el-radio>
            <el-radio :label="1">指定校区</el-radio>
          </el-radio-group>
          <el-checkbox-group class="campus_checkbox campus_Content" v-if="createForm.role_campus === 1" v-model="createForm.roleCampusList">
            <el-checkbox v-for="campus in campusList" :key="campus.id" :value="campus.id" :label="campus.id">{{campus.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="width:100%;" class="roleFormItem" label="角色" prop="checkRoleList">
          <div class="roleContent">
            <div class="roleList" :class="{'firstRoleList':index===0}" v-for="(role, index) in rolesList" :key="index">
              <p>{{role.name}}</p>
              <el-checkbox-group v-model="createForm.checkRoleList" @change="getPermissionGroup">
                <el-checkbox size="mini" @change="selectPermission(childRole.role_name)" v-for="childRole in role.data" :key="childRole.role_name" :label="childRole.role_name"></el-checkbox>
              </el-checkbox-group>
              <div class="buyClassWrap" v-if="showClass && teacherRoleIndex === index">
                <div class="selfCourseContent">
                  <p style="margin-left:6px;color: #7A808D;">已拥有课程</p>
                  <Course v-for="(item,index) in createForm.base_classes" :key="index" :baseClasses="item" class="course"></Course>
                </div>
                <Purchase @classes="getClasses"></Purchase>
              </div>
            </div>
          </div>
        </el-form-item>
        <!--展示-->
        <div class="permissionContent">
          <p class="tips">不同角色对应不同模块的权限（权限仅可查看）</p>
          <div class="permissionList" v-for="(permission, index) in permissionList" :key="index">
            <el-checkbox disabled :indeterminate="permission.checked===1" v-model="permission.checkedAll"
                         :label="permission.group_name"></el-checkbox>
            <el-checkbox-group v-model="permission.checkList">
              <el-checkbox disabled v-for="(childPermission,i) in permission.data" :key="i"
                           :label="childPermission.permission_name"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form>
    </div>
    <div class="createForm__bottom">
      <el-button type="primary" size="small" @click="doCancle" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      <el-button type="primary" size="small" @click='createStaff("createForm")' class="cac-button-one confirm_button" round>{{addtype===true?'创 建':'确 定'}}</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getObjectURL, RndNumber } from '@/utils'
  import PermissionApi from '@/services/permission'
  import receptionApi from '@/services/reception'
  import Course from '@/components/permission/course'
  import Purchase from '@/components/permission/purchase'
  import authUtils from '@/services/auth/utils'
  import setOneImg from '@/components/platform/setOneImg.vue'
  import staffApi from '@/services/internal/staff'
  import courseApi from '@/services/platform/course'

  export default {
    data () {
      return {
        status: this.$route.query.type,
        addtype: true,
        loading: false,
        campusList: [],
        rolesList: [],
        permissionList: [],
        createForm: {
          campus_id: '',
          role_campus: 0,
          name: '',
          telephone: '',
          roles: '',
          gender: 3,
          birthday: '',
          staff_type: '',
          university: '',
          experience: '',
          introduction: '',
          avatar: '',
          base_class_ids: [],
          base_classes: [],
          checkRoleList: [],
          roleCampusList: []
        },
        images: [],
        createFormRules: {
          campus_id: [
            {required: true, message: '请选择校区', trigger: 'change'}
          ],
          role_campus: [
            {required: true, message: '请选择管辖校区', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 1, max: 20, message: '请输入 20 个字符以内', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '请输入教师账号', trigger: 'blur'},
            {pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
          checkRoleList: [
            {required: true, message: '请至少选择一个角色', trigger: 'change'}
          ],
          roleCampusList: [
            { required: true, message: '请至少选择一个校区', trigger: 'change' }
          ],
          gender: [{required: false, message: '请选择性别', trigger: 'change'}],
          birthday: [
            {message: '请选择教师生日', trigger: 'change'}
          ],
          teacher_type: [
            {required: true, message: '请选择教师类型', trigger: 'change'}
          ],
          university: [
            {required: true, message: '请选择教师学历背景', trigger: 'change'}
          ],
          experience: [
            {min: 0, max: 50, message: '请输入 50 个字符以内', trigger: 'blur'}
          ],
          introduction: [
            {min: 0, max: 50, message: '请输入 50 个字符以内', trigger: 'blur'}
          ],
          avatar_Rules: [
            {required: false, message: '请上传员工头像', trigger: 'change'}
          ]
        },
        genderOptions: [{label: '男', value: 1}, {label: '女', value: 2}],
        dateOption: {
          disabledDate: (time) => {
            return time.getTime() > Date.now()
          }
        },
        staffTypeOptions: [
          {label: '全职', value: 1},
          {label: '兼职', value: 2}
        ],
        universityTypeOptions: [{label: '初中', value: 0}, {label: '高中', value: 1}, {label: '大专', value: 2}, {
          label: '本科',
          value: 3
        }, {label: '硕士', value: 4}, {label: '博士', value: 5}, {label: '其他', value: 6}],
        staffTip: false,
        editStaff: false,
        access: {},
        updataUrl: '',
        imgUrl: '',
        file: {},
        is_teach: 0,
        is_live: 1,
        is_content: 0,
        searchCourseConfig: {
          subject_id: '',
          grade_id: '',
          term_id: '',
          level: '',
          base_class_id: ''
        },
        courseTypeList: [],
        levelList: [],
        gradeList: [],
        viewSearchClass: true,
        showClass: false,
        defaultAvatar: '../../static/img/default_avatar.png',
        canSubmit: true
      }
    },
    components: {
      Course,
      Purchase,
      setOneImg
    },
    computed: {
      teacherRoleIndex () {
        var num = ''
        this.rolesList.map((v, i) => {
          v.data.map((o, j) => {
            if (o.role_name === '教师') {
              num = i
            }
          })
        })
        return num
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/staff') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    created () {
      staffApi.getCampusList({status: 1}).then(res => {
        this.campusList = res
      })
      staffApi.getRolesGroup({user_id: this.$route.query.id}).then(res => {
        this.rolesList = res
        let list = []
        this.rolesList.map((v, i) => {
          list = list.concat(v.checkRoleList)
        })
        this.createForm.checkRoleList = list
        this.getPermissionGroup()
      })
      this.getUser()
      this.$route.query.type === 'add'
        ? (this.addtype = true)
        : (this.addtype = false)
      if (!this.addtype) {
        this.getData()
      }
      this.init()
    },
    methods: {
      init () {
        this.getOptionsList()
      },
      // 获取课程类型、班型、年级、学科等
      getOptionsList () {
        receptionApi.getOptionsList().then(res => {
          this.levelList = res.data.class_type
          this.gradeList = res.data.grade
        })
      },
      // 切换全部校区或指定校区
      roleCampusChange () {
        this.createForm.roleCampusList = [0]
      },
      // 获取所有角色
      getUser () {
        this.is_teach = authUtils.getUser() && parseInt(authUtils.getUser().is_teach)
        this.is_live = authUtils.getUser() && parseInt(authUtils.getUser().is_live)
        this.is_content = authUtils.getUser() && parseInt(authUtils.getUser().is_content)
      },
      // 添加图片
      addImg (data) {
        this.images = []
        var imgArr = []
        data.forEach(item => {
          this.images.push(item)
          imgArr.push(item.urls)
        })
        this.createForm.avatar = imgArr[0]
      },
      // 获取用户信息
      getData () {
        let params = {
          user_id: this.$route.query.id
        }
        staffApi.getStaffDetail(params).then(res => {
          if (res.ok) {
            // 转角色为数组
            var temp = res.data.role_name === '' ? [] : res.data.role_name.split(',')
            if (temp !== '') {
              // 没有教师
              if (temp.indexOf('教师') === -1) {
                this.createForm.roles = temp
                this.createForm.campus_id = res.data.campus_id
                this.createForm.role_campus = res.data.role_campus * 1 === 0 ? 0 : 1
                this.createForm.gender = res.data.gender
                this.createForm.name = res.data.name
                this.createForm.telephone = res.data.telephone
                this.createForm.avatar = res.data.avatar
                this.createForm.avatar_url = res.data.avatar_url
                this.createForm.is_content_member = res.data.is_content_member
                this.createForm.roleCampusList = res.data.role_campus * 1 === 0 ? [] : res.data.role_campus.split(',')
                this.images.push({
                  url: this.createForm.avatar_url || this.defaultAvatar,
                  urls: this.createForm.avatar_url || this.defaultAvatar,
                  maskVisible: false,
                  type: 1
                })
                if (this.createForm.roleCampusList.length > 0) {
                  this.createForm.roleCampusList.map((v, i) => {
                    this.createForm.roleCampusList[i] = v * 1
                  })
                }
                this.imgUrl = res.data.avatar
              } else {
                // 包含教师
                // 含有教师时，只传新添加课程，没有传空数组
                this.editStaff = true
                for (var key in res.data) {
                  this.createForm[key] = res.data[key]
                }
                this.createForm.base_class_ids = []
                this.createForm.role_campus = res.data.role_campus * 1 === 0 ? 0 : 1
                this.createForm.roleCampusList = res.data.role_campus * 1 === 0 ? [] : res.data.role_campus.split(',')
                this.createForm.roles = temp
                if (this.createForm.roleCampusList.length > 0) {
                  this.createForm.roleCampusList.map((v, i) => {
                    this.createForm.roleCampusList[i] = v * 1
                  })
                }
                this.images.push({
                  url: this.createForm.avatar_url || this.defaultAvatar,
                  urls: this.createForm.avatar_url || this.defaultAvatar,
                  maskVisible: false,
                  type: 1
                })
                this.imgUrl = res.data.avatar
              }
            }
            this.createForm.user_id = res.data.id
          }
        })
      },
      // 主讲老师和辅导老师不可为同一人
      selectPermission (val) {
        console.log(val, this.createForm.checkRoleList)
        if (this.createForm.is_content_member && val === '面授主讲' && this.createForm.checkRoleList.indexOf('面授主讲') === -1) {
          this.createForm.checkRoleList.push('面授主讲')
          this.$message({
            message: '当前用户已有课程包，不可取消',
            type: 'warning',
            center: true
          })
        }
        if (this.createForm.checkRoleList.indexOf('双师主讲') !== -1 && val === '辅导老师') {
          this.createForm.checkRoleList = this.createForm.checkRoleList.join(',').replace('辅导老师', '').split(',')
          this.$message({
            message: '主讲和辅导不可同为一个老师',
            type: 'warning',
            center: true
          })
        }
        if (this.createForm.checkRoleList.indexOf('辅导老师') !== -1 && val === '双师主讲') {
          this.createForm.checkRoleList = this.createForm.checkRoleList.join(',').replace('双师主讲', '').split(',')
          this.$message({
            message: '主讲和辅导不可同为一个老师',
            type: 'warning',
            center: true
          })
        }
      },
      // 获取角色对应权限
      getPermissionGroup () {
        if (this.createForm.checkRoleList.indexOf('教师') !== -1) {
          this.showClass = true
          this.viewSearchClass = true
        } else {
          this.showClass = false
        }
        staffApi.getPermissionGroup({role: this.createForm.checkRoleList}).then(res => {
          this.permissionList = res
        })
      },
      // 取消
      doCancle () {
        this.$router.back()
      },
      // 创建员工
      createStaff (createForm) {
        console.log(1)
        if (this.canSubmit) {
          console.log(2)
          this.canSubmit = false
          if (this.createForm.role_campus === 1) {
            if (this.createForm.roleCampusList.length === 0) {
              this.createFormRules.roleCampusList[0].required = true
            } else {
              if (this.createForm.roleCampusList[0] === 0) {
                this.createForm.roleCampusList.splice(0, 1)
              }
            }
          } else {
            this.createForm.roleCampusList.push(0)
          }
          this.loading = true
          this.$refs[createForm].validate(valid => {
            if (valid) {
              this.isGoOnCreated()
            } else {
              this.canSubmit = true
              this.loading = false
            }
          })
        }
      },
      // 创建员工调接口
      isGoOnCreated () {
        var vm = this
        let params = {
          campus_id: vm.createForm.campus_id,
          name: vm.createForm.name,
          telephone: vm.createForm.telephone,
          avatar: vm.createForm.avatar
        }
        if (vm.createForm.user_id) {
          params.user_id = vm.createForm.user_id
        }
        if (vm.createForm.gender) {
          params.gender = vm.createForm.gender
        }
        params.roles = vm.createForm.checkRoleList.join(',')
        params.role_campus = this.createForm.role_campus * 1 === 0 ? '0' : this.createForm.roleCampusList.join(',')
        courseApi.getProductList({detail: 0}).then(res => {
          this.canSubmit = true
          if (res.ok || res.status_code === 200) {
            if (this.createForm.base_class_ids.length > 0) {
              params.base_class_ids = this.createForm.base_class_ids
            } else if (this.$route.query.type === 'edit') {
              params.base_class_ids = []
            }
            params.product_id = res.data[0] ? res.data[0].id : 0
            this.canSubmit = false
            if (this.$route.query.type === 'edit') {
              staffApi.editStaff(params).then(res => {
                this.loading = false
                this.canSubmit = true
                if (res.status_code === 200) {
                  vm.$router.back()
                }
              })
            } else {
              staffApi.createStaff(params).then(res => {
                this.loading = false
                this.canSubmit = true
                if (res.status_code === 200) {
                  if (res.key === '密码发送失败') {
                    this.$message({
                      message: res.message,
                      type: 'warning',
                      center: true
                    })
                  }
                  vm.$router.back()
                }
              })
            }
          }
        })
      },
      // 上传图像的格式
      beforeAvatarUpload (file) {
        const isIMG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isIMG) {
          this.$message({
            message: '上传头像图片必须是 JPG/PNG 格式!',
            type: 'warning',
            center: true
          })
        }
        if (!isLt2M) {
          this.$message({
            message: '上传头像图片大小不能超过 2MB!',
            type: 'warning',
            center: true
          })
        }
        return isIMG && isLt2M
      },
      // 上传图片到服务器
      doUpload (e) {
        this.file = e.target.files[0]
        var OSS = window.OSS
        if (this.beforeAvatarUpload(this.file)) {
          this.imgUrl = getObjectURL(this.file)
          let params = {
            'type': 'avatar'
          }
          let loadingInstance = this.$loading({
            text: '上传图片中...'
          })
          PermissionApi.queryOSS(params).then(res => {
            this.access = res.data
            var client = new OSS.Wrapper({
              accessKeyId: this.access.access_key_id,
              accessKeySecret: this.access.access_key_secret,
              stsToken: this.access.security_token,
              endpoint: this.access.endpoint,
              bucket: this.access.bucket
            })
            var vm = this
            var storeAs = this.access.prefix + new Date().getTime() + RndNumber(5) + '.png'
            this.createForm.avatar = storeAs
            client.multipartUpload(storeAs, this.file).then(function (result) {
              if (result.res.status === 200) {
                setTimeout(() => {
                  loadingInstance.close()
                  vm.$message({
                    message: '上传成功！',
                    type: 'success'
                  })
                }, 300)
              } else {
                setTimeout(() => {
                  loadingInstance.close()
                  vm.$message({
                    message: '上传失败！',
                    type: 'warning'
                  })
                }, 300)
              }
            }).catch(function (err) {
              console.log(err)
            })
          })
        }
      },
      // 从组件中获取选择的课程数组
      getClasses (data) {
        // this.createForm.base_class_ids = []
        let list = []
        data.forEach(item => {
          list.push(item.base_class_id)
        })
        this.createForm.base_class_ids = list
      }
    }
  }
</script>

<style lang="less">
  .createStaffPage {
    width: 100%;
    height: 100%;
    text-align: left;
    overflow: hidden;
    .createStaffContainer {
      width: 100%;
      margin-top: 30px;
      .el-form {
        width: 100%;
        & > p {
          font-size: 20px;
          font-weight: bold;
          height: 28px;
          line-height: 28px;
          margin-bottom: 30px;
        }
        .left, .right {
          display: inline-block;
          width: 340px;
          vertical-align: top;
        }
        .left {
          margin-right: 80px;
        }
      }
      .el-form-item {
        width: 340px;
        .el-form-item__label {
          font-size: 13px;
          color: #7A808D;
          margin-bottom: 6px;
        }
        .el-select {
          width: 100%;
        }
        input {
          height: 50px;
        }
        .campus_checkbox {
          margin-left: 0;
        }
        .roleContent {
          position: relative;
          .roleList {
            margin-top: 20px;
            & > P {
              color: #7A808D;
              font-size: 13px;
            }
          }
          .firstRoleList {
            margin-top: 0;
          }
          .buyClassWrap {
            width: 100%;
            padding: 24px;
            background-color: #F9FBFC;
            color: #ABB9C6;
            margin-bottom: 10px;
            .selfCourseContent {
              font-size: 14px;
              margin-bottom: 20px;
              .lessonName {
                height: 60px;
              }
              p {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
      .roleFormItem {
        width: 100%;
        .el-form-item__error {
          margin-top: -5px;
        }
      }
      .permissionContent {
        padding: 30px;
        background-color: #F9FBFC;
        .el-checkbox__label {
          font-size: 13px;
          color: #ABB9C6;
        }
        .el-checkbox__input.is-disabled.is-checked {
          .el-checkbox__inner {
            background-color: #ABB9C6;
          }
        }
        .el-checkbox__inner::after {
          color: #FFF;
          border-color: #FFF;
          font-weight: bold;
        }
        .permissionList {
          margin-bottom: 15px;
        }
      }
      .discountLabel {
        background-color: rgba(242, 145, 82, 1);
        color: #ffffff;
        font-weight: 500;
        border-radius: 3px;
        padding: 2px 5px;
      }
    }
    .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      border: 1px dashed #d9d9d9;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .fileinput-button {
      position: relative;
      display: inline-block;
      line-height: 32px;
      height: 32px !important;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      margin-left: 20px;
      input {
        position: absolute;
        right: 0px;
        top: 0px;
        height: 30px;
        opacity: 0;
      }
    }
    .el-upload__tip {
      position: relative;
      bottom: 0;
      width: 100%;
      display: inline-block;
      margin-top: 14px;
    }
    .fileinput-button:active,
    .fileinput-button:hover {
      opacity: 0.5;
    }
    .fileinput-button input:active,
    .fileinput-button input:hover {
      border: none;
      outline: none;
      cursor: pointer;
    }
    .imgWraper {
      border: 1px dashed #ccc;
      width: 136px;
      height: 136px;
      overflow: hidden;
      float: left;
    }
    .buttonWrap {
      width: 400px;
      margin: 46px 0 0 24px;
    }
    .imgWraper__img {
      width: 100%;
      height: 100%;
    }
    .courseWrap {
      display: block;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
    }
    .editStaff {
      background-color: #fff;
      padding: 0 0 60px 38px;
      margin-top: -60px;
    }
    .createForm__bottom {
      margin-top: 20px;
      .el-button {
        width: 110px;
        height: 40px;
      }
    }
  }

  .clearfix {
    clear: both;
  }

  .tips {
    margin-bottom: 20px;
  }

  .campus_Content {
    padding: 30px;
    background-color: #F9FBFC;
  }

  .el-checkbox + .el-checkbox {
    padding-right: 30px;
    margin-left: 0;
  }

  .el-checkbox.el-checkbox {
    padding-right: 30px;
  }

  .is_bug_content {
    font-size: 13px;
    u{
      cursor: pointer;
      margin: 0px 10px;
      color: #409EFF;
    }
  }
  .content_tips{
    background: rgba(255,141,65,0.1);
    height:36px;
    border-radius:3px;
    margin: 20px 0px;
    display: flex;
    align-items: center;
    img{
      margin: 0px 15px;
      width: 14px;
      height: 14px;
    }
    span{
      color: rgba(255,141,65,1);
      font-size:13px;
    }
  }
  .content_foot{
    height:36px;
    line-height: 36px;
    background:rgba(249,251,252,1);
    padding-left: 24px;
    font-size:13px;
    font-weight:400;
    color:rgba(122,128,141,1);
    border-radius: 3px;
  }
  .grade_item_style{
    display: flex;
    >span{
      font-size:13px;
      font-weight:400;
      color:rgba(122,128,141,1);
      margin-right: 15px;
    }
  }
  .content_title{
    font-size:16px;
    font-weight:500;
    color:rgba(62,67,76,1);
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .balance{
    border-radius: 3px;
    background:rgba(249,251,252,1);
    margin-bottom: 30px;
    height:36px;
    line-height: 36px;
    font-size:13px;
    font-weight:400;
    color:rgba(62,67,76,1);
    padding: 0px 30px;
    display: flex;
    justify-content: space-between;
  }
  .validity_time{
    margin-left: 10px;
    font-size:13px;
    font-weight:400;
    color:rgba(171,185,198,1);
  }
  .content_details .el-dialog__body{
    padding-bottom: 20px;
    padding-top: 15px;
    overflow-y: auto;
  }
  .pay_dialog{
    .title{
      text-align: center;
      font-size:20px;
      font-weight:500;
      color:rgba(62,67,76,1);
      span{
        color: #FF6968;
        font-weight: 500;
      }
    }
    .content{
      margin-top: 12px;
      p{
        text-align: center;
        margin-bottom: 8px;
        font-size:13px;
        font-weight:400;
        color:rgba(62,67,76,1);
        span{
          color: #3D75F6;
          font-weight: 500;
        }
      }
    }
  }
  .content_info{
    .title{
      height: 18px;
      display: flex;
      align-items: center;
      img{
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
      span{
        font-size: 18px;
        font-weight: 500;
      }
    }
    .description{
      margin-left: 24px;
      padding-top: 20px;
      .description_title{
        margin-bottom: 12px;
        font-size:16px;
        font-weight:500;
        color:rgba(62,67,76,1);
      }
      .description_content{
        margin-bottom: 20px;
        font-size:13px;
        font-weight:400;
        color:rgba(122,128,141,1);
        span{
          margin-right: 12px;
        }
        p{
          margin-top: 15px;
        }
      }
    }
    .class_code{
      padding-left: 24px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: row;
      img{
        width: 118px;
        height: 118px;
      }
      div{
        display: flex;
        align-items: flex-end;
        margin-left: 20px;
        width: 146px;
        font-size: 12px;
        line-height: 20px;
        font-weight:400;
        color:rgba(171,185,198,1);
      }
    }
    .book_img{
      padding-left: 24px;
      img{
        width: 280px;
        height: 184px;
      }
      div{
        width: 280px;
        text-align: center;
        margin-top: 12px;
        font-size: 12px;
        font-weight:400;
        color:rgba(171,185,198,1);
      }
    }
    .content_info_student{
      .title{
        color:rgba(58,218,217,1);
      }
    }
    .content_info_class{
      .title{
        color:rgba(96,204,255,1);
      }
    }
    .content_info_book{
      .title{
        color:rgba(162,148,253,1);
      }
    }
  }
</style>
