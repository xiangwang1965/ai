<template>
  <div class="createTeacher" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/platformTeacher' }">主讲管理</router-link>
        <el-breadcrumb-item>{{pageType == 'create'?'创建':'编辑'}}主讲</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createTeacherInfo">
      <el-form
        class="demo-teacherForm"
        ref="teacherForm"
        :model="teacherForm"
        :rules="teacherRules"
        size="mini"
        label-position="top">
        <p>基本信息</p>
        <div class="left">
          <el-form-item label="姓名" prop="name">
            <el-input :maxlength="20" placeholder="请输入姓名" v-model.trim="teacherForm.name"></el-input>
          </el-form-item>
          <!--<el-form-item label="所属教学产品：" prop="product_id">-->
            <!--<el-select v-model="teacherForm.product_id" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in product_list"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="手机号：" prop="telephone">
            <el-input :maxlength="11" placeholder="请输入手机号码" v-model.trim="teacherForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model.trim="teacherForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
            <!-- <el-select>
              <el-option
                v-for="item in gender_list"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
          <!-- <el-form-item label="学历：" prop="education">
            <el-select v-model.trim="teacherForm.education" placeholder="请选择">
              <el-option
                v-for="item in education_list"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="毕业院校：" prop="university">
            <el-input v-model.trim="teacherForm.university"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="备注：" prop="comment">
            <el-input type="textarea" autosize v-model.trim="teacherForm.comment"></el-input>
          </el-form-item> -->
          <el-form-item label="所属校区" prop="campus_id">
            <el-select v-model="teacherForm.campus_id" placeholder="请选择校区">
              <el-option
                v-for="item in campusList"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item prop="avatar_Rules">
            <div style="display:inline-block;" slot="label">主讲头像<span style="color:#ABB9C6;"> (主讲、面授老师上传的头像将会在app内展示)</span></div>
            <el-input v-show="false" v-model.trim="teacherForm.avatar"></el-input>
            <setOneImg :images="images" :type="1" v-on:imgs="addImg" :store="'avatar'" :role="'teacher'" placeholder="上传头像"></setOneImg>
            <p style="color:#7A808D;">只能上传jpg或png，且不超过2M</p>
          </el-form-item>
        </div>
        <p>角色管理</p>
        <el-form-item label="管辖校区" class="campus_item" prop="roleCampusList">
          <el-radio-group v-model="teacherForm.role_campus" @change="changeRoleCampus">
            <el-radio :label="0">全部校区</el-radio>
            <el-radio :label="1">指定校区</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="teacherForm.role_campus === 1" v-model="teacherForm.roleCampusList">
            <el-checkbox v-for="campus in campusList" :key="campus.key" :label="campus.key">{{campus.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <router-link :to="{ path: '/platformTeacher' }">
        <el-button type="primary" class="cac-button-two cancel-button cancel_button" size="small" round>取 消</el-button>
      </router-link>
      <el-button type="primary" class="cac-button-one" size="small" round @click="submitForm('teacherForm')">{{pageType == 'create'?'创 建':'确 定'}}</el-button>
    </div>
  </div>
</template>

<script>
  import teacherClassApi from '@/services/platform/teacher_class'
  import classroomApi from '@/services/classroom'
  import courseApi from '@/services/platform/course'
  import setOneImg from '@/components/platform/setOneImg.vue'

  export default {
    data () {
      return {
        loading: false,
        gender_list: [
          {
            name: '男',
            value: 1
          },
          {
            name: '女',
            value: 2
          }
        ],
        education_list: [
          {
            name: '大专'
          },
          {
            name: '本科'
          },
          {
            name: '硕士'
          },
          {
            name: '博士'
          }
        ],
        pageType: 'create',
        product_list: [],
        images: [],
        teacherForm: {
          name: '',
          telephone: '',
          gender: '',
          education: '',
          university: '',
          product_id: '',
          campus_id: '',
          role_campus: 0,
          avatar: '',
          avatar_Rules: '',
          comment: '',
          roleCampusList: []
        },
        teacherRules: {
          name: [
            { required: true, message: '请输入 20 个字符以内', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
          ],
          gender: [
            { required: false, message: '请选择性别', trigger: 'change' }
          ],
          education: [
            { required: true, message: '请选择学历', trigger: 'change' }
          ],
          university: [
            { required: true, message: '请输入毕业院校', trigger: 'blur' }
          ],
          product_id: [
            { required: true, message: '请选择所属教学产品', trigger: 'change' }
          ],
          campus_id: [
            { required: true, message: '请选择校区', trigger: 'change' }
          ],
          avatar: [
            { required: true, message: '请上传主讲头像', trigger: 'change' }
          ],
          roleCampusList: [
            {required: true, message: '请至少选择一个校区', trigger: 'change'}
          ]
        },
        campusList: [],
        defaultAvatar: '../../static/img/default_avatar.png',
        canSubmit: true
      }
    },
    components: {
      setOneImg
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/platformTeacher') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    watch: {
    },
    created () {
      this.getProductList()
      if (this.$route.query.type === 'edit') {
        teacherClassApi.LiveTeacherDetail({live_teacher_id: this.$route.query.live_teacher_id}).then(res => {
          if (res.data.role_campus * 1 === 0) {
            res.data.role_campus = 0
            res.data.roleCampusList = []
          } else {
            res.data.roleCampusList = []
            res.data.role_campus.split(',').map((v, index) => {
              res.data.roleCampusList.push(v * 1)
            })
            res.data.role_campus = 1
          }
          this.teacherForm = res.data
          this.images.push({
            url: res.data.avatar || this.defaultAvatar,
            type: 1
          })
        })
      }
    },
    mounted () {
      this.pageType = this.$route.query.type || 'create'
    },
    methods: {
      getProductList () {
        let params = {
          detail: 0
        }
        courseApi.getProductList(params).then(res => {
          if (res.ok) {
            this.product_list = res.data
            this.teacherForm.product_id = res.data[0] ? res.data[0].id : 0
          }
        })
        classroomApi.queryClassOption().then(res => {
          if (res.ok) {
            this.campusList = res.data.options.campus
          }
        })
      },
      addImg (data) {
        this.images = []
        var imgArr = []
        data.forEach(item => {
          this.images.push(item)
          imgArr.push(item.urls)
        })
        this.teacherForm.avatar = imgArr[0]
        if (imgArr.length > 0) {
          this.teacherForm.avatar_Rules = '哈哈哈，我是教案为空校验'
        } else {
          this.teacherForm.avatar_Rules = ''
        }
      },
      changeRoleCampus () {
        this.teacherForm.roleCampusList = [0]
      },
      submitForm (formName) {
        if (this.canSubmit) {
          this.canSubmit = false
          if (this.teacherForm.role_campus === 1) {
            if (this.teacherForm.roleCampusList.length === 0) {
              this.teacherRules.roleCampusList[0].required = true
            } else {
              if (this.teacherForm.roleCampusList[0] === 0) {
                this.teacherForm.roleCampusList.splice(0, 1)
              }
            }
          } else {
            this.teacherForm.roleCampusList.push(0)
          }
          this.loading = true
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {}
              if (this.$route.query.type === 'edit') {
                params = {
                  live_teacher_id: this.teacherForm.id,
                  name: this.teacherForm.name,
                  telephone: this.teacherForm.telephone,
                  campus_id: this.teacherForm.campus_id,
                  role_campus: this.teacherForm.role_campus,
                  gender: this.teacherForm.gender,
                  avatar: this.teacherForm.avatar
                }
                if (this.teacherForm.role_campus * 1 === 1) {
                  params.role_campus = this.teacherForm.roleCampusList.join(',')
                }
                teacherClassApi.editTeacher(params).then(res => {
                  this.loading = false
                  this.canSubmit = true
                  if (res.status_code === 200) {
                    this.$router.back()
                  }
                })
              } else {
                params = this.teacherForm
                teacherClassApi.addTeacher(params).then(res => {
                  this.loading = false
                  this.canSubmit = true
                  if (res.ok) {
                    this.$router.back()
                  }
                })
              }
            } else {
              this.loading = false
              this.canSubmit = true
              return false
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
.createTeacher {
  text-align: left;
  .createTeacherInfo {
    width: 100%;
    background-color: #fff;
    margin-top: 20px;
    .el-form {
      display: inline-block;
      vertical-align: top;
      &>p {
        font-size: 20px;
        font-weight: bold;
        height: 28px;
        line-height: 28px;
        margin-bottom: 30px;
      }
      .left {
        margin-right: 80px;
      }
      .left,.right {
        display: inline-block;
        vertical-align: top;
        width: 340px;
      }
      .el-form-item {
        width: 340px;
        .el-form-item__label {
          font-size: 13px;
          height: 28px;
          line-height: 28px;
          color: #7A808D;
        }
        .el-select {
          width: 100%;
        }
        input {
          height: 50px;
        }
        .el-checkbox {
          margin-left: 0;
          margin-right: 30px;
        }
      }
      .campus_item {
        width: 100%;
      }
    }
  }
  .bottom {
    padding-top: 30px;
  }
}
</style>
