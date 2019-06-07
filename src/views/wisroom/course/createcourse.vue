<template>
  <div class="wisroomCreateCourse" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/wisroomCourse' }">课程</router-link>
        <el-breadcrumb-item>创建课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="radiogroup">
      <p>基本信息</p>
      <el-form class="courseForm" ref="courseForm" :model="courseForm" :rules="courseRules" label-position="top" inline size="mini">
        <el-form-item label="课件名称" prop="wisroom_courseware_id">
          <el-select v-model.trim="courseForm.wisroom_courseware_id" :disabled="$route.query.wareId" :popper-class="'coursewareSelect'" v-loadmore="loadMore" placeholder="请选择课件" @visible-change="getCourseWareListPage" @change="selectCourseWare">
            <el-option v-for="courseWare in courseWareList" :key="courseWare.id" :value="courseWare.id" :label="courseWare.name">
              <div>
                <span>{{courseWare.name}}</span>
                <span>{{courseWare.teacher_name}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model.trim="courseForm.courseType" disabled placeholder="请选择课件">
            <el-option v-for="courseType in courseTypeList" :key="courseType.courseTypeId" :value="courseType.courseTypeId" :label="courseType.courseTypeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="termId">
          <el-select v-model.trim="courseForm.termId" @visible-change="getTermList" placeholder="请选择学期">
            <el-option v-for="term in termList" :key="term.termId" :value="term.termId" :label="term.termName"></el-option>
          </el-select>
          <el-button type="primary" class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('term')">新增学期</el-button>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model.trim="courseForm.subjectId" disabled @visible-change="getSubjectList" placeholder="请选择课件">
            <el-option v-for="subject in subjectList" :key="subject.subjectId" :value="subject.subjectId" :label="subject.subjectName"></el-option>
          </el-select>
          <!-- <el-button type="primary" class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('subject')">新增学科</el-button> -->
        </el-form-item>
        <el-form-item label="班型" prop="classLevel">
          <el-select v-model.trim="courseForm.classLevel" disabled @visible-change="getClassLevelList" placeholder="请选择课件">
            <el-option v-for="classLevel in classLevelList" :key="classLevel.class_level_id" :value="classLevel.class_level_id" :label="classLevel.class_level_name"></el-option>
          </el-select>
          <!-- <el-button type="primary" class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('classLevel')">新增班型</el-button> -->
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model.trim="courseForm.gradeId" disabled @visible-change="getGradeList" placeholder="请选择课件">
            <el-option v-for="grade in gradeList" :key="grade.grade_id" :value="grade.grade_id" :label="grade.grade_name"></el-option>
          </el-select>
          <!-- <el-button type="primary" class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('grade')">新增年级</el-button> -->
        </el-form-item>
        <el-form-item label="课程名称" prop="wisroom_courseware_id">
          <el-input placeholder="请输入课程名称" v-model="courseForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="适用校区" class="full_item" prop="isAllCampus">
          <el-radio-group v-model="courseForm.isAllCampus" @change="changeCampusArea">
            <el-radio :label="0">全部校区</el-radio>
            <el-radio :label="1">指定校区</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="courseForm.isAllCampus === 1" v-model="formCampusList">
            <el-checkbox v-for="campus in campusList" v-if="campus.is_active" :key="campus.id" :label="campus.id" :value="campus.id">{{campus.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div class="chargeStandard" v-if="isCharge >= 0">
          <p>收费标准</p>
          <el-form-item label="收费模式" class="charge_method" prop="charge_method">
            <selectInputChargetype @change="selectChargeMethod"></selectInputChargetype>
          </el-form-item>
          <el-form-item label="收费标准" class="charge_standard" prop="amount">
            <InputNumber v-model="courseForm.amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'"></InputNumber><span style="margin-left: 5px;">元/人</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog class="addLessonDialog tipDialog" :title="addDialogConfig.title" top="38vh" width="560px" append-to-body @open="dialogOpen" :visible.sync="addDialogConfig.visible">
      <el-input style="width:300px;" :maxlength="8" :placeholder="addDialogConfig.placeholder" v-model.trim="addDialogConfig.value"></el-input>
      <div slot="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="addDialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="addDialogDone">创 建</el-button>
      </div>
    </el-dialog>
    <div class="bottom">
      <router-link :to="{ path: '/wisroomCourse' }">
        <el-button type="primary" size="small" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      </router-link>
      <el-button type="primary" size="small" class="cac-button-one confirm_button" round @click="submitForm">创 建</el-button>
    </div>
  </div>
</template>

<script>
  import courseApi from '@/services/platform/course'
  import staffApi from '@/services/internal/staff'
  import authUtil from '@/services/auth/utils'
  import wisroomApi from '@/services/wisroom'
  import selectInputChargetype from '@/components/selectInputChargetype'
  import InputNumber from '@/components/inputNumber'
  export default {
    props: ['source'],
    data () {
      return {
        loading: false,
        useList: [
          {
            name: '通用',
            value: 1
          },
          {
            name: '双师',
            value: 2
          },
          {
            name: '面授',
            value: 3
          }
        ],
        productList: [],
        optionsData: {
          years: [],
          subjects: [],
          grade: [],
          terms: [],
          levels: [],
          editions: []
        },
        type_id: Number(this.$route.query.type_id),
        courseForm: {
          courseType: '',
          termId: '',
          subjectId: '',
          classLevel: '',
          gradeId: '',
          wisroom_courseware_id: this.$route.query.wareId || '',
          lessons: [],
          courseName: '',
          period_time: '',
          isAllCampus: 0,
          charge_method: 1,
          amount: ''
        },
        courseRules: {
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],
          termId: [
            { required: false, message: '请选择学期', trigger: 'change' }
          ],
          subjectId: [
            { required: false, message: '请选择学科', trigger: 'change' }
          ],
          classLevel: [
            { required: false, message: '请选择班型', trigger: 'change' }
          ],
          gradeId: [
            { required: false, message: '请选择年级', trigger: 'change' }
          ],
          wisroom_courseware_id: [
            { required: true, message: '请选择课件', trigger: 'change' }
          ],
          isAllCampus: [
            { required: true, message: '请选择适用校区', trigger: 'change' }
          ],
          charge_method: [
            { required: this.isCharge >= 0 ? 'true' : 'false', message: '请选择收费模式', trigger: 'change' }
          ],
          amount: [
            { required: this.isCharge >= 0 ? 'true' : 'false', message: '请输入收费标准', trigger: 'blur' }
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        teaching_method_modifiable: false,
        schoolId: '',
        courseTypeList: [],
        termList: [],
        subjectList: [],
        classLevelList: [],
        gradeList: [],
        campusList: [],
        courseWareList: [],
        formCampusList: [],
        addDialogConfig: {
          title: '',
          visible: false,
          type: '',
          placeholder: '',
          value: ''
        },
        loadSign: false,
        pageConfig: {
          page: this.$route.query.page || 1,
          per_page: 8
        },
        canLoad: false,
        isCharge: authUtil.getUser().permissions.indexOf('enroll_charge')
      }
    },
    components: {
      selectInputChargetype,
      InputNumber
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/wisroomCourse') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    created () {
      this.getCourseType()
      this.getTermList()
      this.getSubjectList()
      this.getClassLevelList()
      this.getGradeList()
      if (this.$route.query.wareId) {
        this.getCourseWareListPage()
      } else {
        this.getCourseWareListPage()
        // this.getCourseWareList()
      }
    },
    mounted () {
      this.schoolId = authUtil.getUser().school_id
    },
    methods: {
      loadMore () {
        console.log(this.loadSign, this.canLoad)
        if (this.canLoad) {
          this.loadSign = false
          console.log(this.loadSign, this.canLoad)
        }
        if (!this.loadSign) {
          this.loadSign = true
          this.page++
          this.pageConfig.page ++
          this.getCourseWareListPage()
        }
      },
      getCourseName () {
        if (
          this.type_id === 1 && this.platformCourseForm.year !== '' && this.platformCourseForm.subject_id !== '' && this.platformCourseForm.grade_id !== '' && this.platformCourseForm.term_id !== '' && this.platformCourseForm.class_level !== '' && this.platformCourseForm.edition_id !== ''
        ) {
          let params = {
            year: this.platformCourseForm.year,
            subject_id: this.platformCourseForm.subject_id,
            product_id: this.platformCourseForm.product_id,
            grade_id: this.platformCourseForm.grade_id,
            term_id: this.platformCourseForm.term_id,
            class_level_id: this.platformCourseForm.class_level,
            edition_id: this.platformCourseForm.edition_id
          }
          courseApi.getCourseName(params).then(res => {
            if (res.ok) {
              this.$set(this.platformCourseForm, 'base_class_name', res.data)
            }
          })
        }
      },
      getCourseWareList () {
        wisroomApi.getCourseWareList().then(res => {
          if (res.ok) {
            this.courseWareList = res.data.data
            if (res.data.data.length > 0) {
              res.data.data.map((v, i) => {
                if (this.courseForm.wisroom_courseware_id === v.id) {
                  this.courseForm.courseWareName = v.name
                  this.courseForm.period_time = v.lesson_time
                  this.courseForm.courseType = v.course_type_id
                  this.courseForm.subjectId = v.subject_id
                  this.courseForm.classLevel = v.class_type_id
                  this.courseForm.gradeId = v.grade_id
                }
              })
            }
          }
        })
      },
      getCourseWareListPage () {
        wisroomApi.getCourseWareList({page: this.pageConfig.page, per_page: 8}).then(res => {
          if (res.ok) {
            res.data.data.map((v, i) => {
              let canPush = true
              this.courseWareList.map((o, j) => {
                if (o.id === v.id) {
                  canPush = false
                }
              })
              if (canPush) {
                this.courseWareList.push(v)
              }
              this.canLoad = true
            })
            if (res.data.data.length < 8) {
              this.canLoad = false
            }
            // this.courseWareList = res.data.data
            if (this.$route.query.wareId && res.data.data.length > 0) {
              res.data.data.map((v, i) => {
                if (this.courseForm.wisroom_courseware_id === v.id) {
                  this.courseForm.courseWareName = v.name
                  this.courseForm.period_time = v.lesson_time
                  this.courseForm.courseType = v.course_type_id
                  this.courseForm.subjectId = v.subject_id
                  this.courseForm.classLevel = v.class_type_id
                  this.courseForm.gradeId = v.grade_id
                }
              })
            }
          }
        })
      },
      selectChargeMethod (val) {
        this.params.charge_method = val
      },
      getCourseOptions () {
        let params = {
          product_id: this.platformCourseForm.product_id,
          course_type_id: this.type_id
        }
        courseApi.courseOptions(params).then(res => {
          if (res.ok) {
            this.optionsData = res.data
            var grade = []
            for (var gradeGroup in res.data.grade) {
              res.data.grade[gradeGroup].forEach(item => {
                grade.push(item)
              })
            }
            this.optionsData.grade = grade
          }
        })
      },
      getCourseType () {
        courseApi.courseType().then(res => {
          this.courseTypeList = res
          this.getCampusList()
        })
      },
      getTermList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getTermList(params).then(res => {
          this.termList = res
        })
      },
      getSubjectList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getSubjectList(params).then(res => {
          this.subjectList = res
        })
      },
      getClassLevelList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getClassLevelList(params).then(res => {
          this.classLevelList = res
        })
      },
      getGradeList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getGradeList(params).then(res => {
          this.gradeList = res
        })
      },
      viewAddDialog (type) {
        this.addDialogConfig.placeholder = '请输入8个字符以内'
        this.addDialogConfig.type = type
        switch (type) {
          case 'term':
            this.addDialogConfig.title = '新增学期'
            break
          case 'subject':
            this.addDialogConfig.title = '新增学科'
            break
          case 'grade':
            this.addDialogConfig.title = '新增年级'
            break
          case 'classLevel':
            this.addDialogConfig.title = '新增班型'
            break
          default:
            this.addDialogConfig.title = '新增'
        }
        this.addDialogConfig.visible = true
      },
      dialogOpen () {
        this.addDialogConfig.value = ''
      },
      addDialogDone () {
        let params = {}
        params.school_id = this.schoolId
        let type = this.addDialogConfig.type
        if (type === 'classLevel' || type === 'classType') {
          type = 'class_type'
          this.addDialogConfig.type = 'classType'
        }
        params[type + '_name'] = this.addDialogConfig.value
        courseApi[this.addDialogConfig.type + 'Add'](params).then(res => {
          if (res.ok) {
            this.addDialogConfig.value = ''
            this.addDialogConfig.visible = false
          }
        })
      },
      getCampusList () {
        let params = {
          status: 1
        }
        params.school_id = this.schoolId
        staffApi.getCampusList(params).then(res => {
          this.campusList = res
        })
      },
      changeCampusArea () {
        this.formCampusList = []
      },
      selectCourseWare (itemId) {
        this.courseWareList.map((v, i) => {
          if (v.id === itemId) {
            this.courseForm.courseWareName = v.name
            this.courseForm.period_time = v.lesson_time
            this.courseForm.lessons = v.lessons
            this.courseForm.courseType = v.course_type_id
            this.courseForm.subjectId = v.subject_id
            this.courseForm.classLevel = v.class_type_id
            this.courseForm.gradeId = v.grade_id
          }
        })
      },
      submitForm () {
        this.loading = true
        this.$refs.courseForm.validate((valid) => {
          if (valid) {
            let params = {}
            params.course_type_id = this.courseForm.courseType
            params.term_id = this.courseForm.termId
            params.subject_id = this.courseForm.subjectId
            params.class_type_id = this.courseForm.classLevel
            params.grade_id = this.courseForm.gradeId
            params.wisroom_courseware_name = this.courseForm.courseWareName
            params.base_class_name = this.courseForm.courseName
            params.period_time = this.courseForm.period_time
            params.lessons = this.courseForm.lessons
            params.wisroom_courseware_id = this.courseForm.wisroom_courseware_id
            params.campus_id = this.courseForm.isAllCampus
            params.school_id = this.schoolId
            params.amount = this.courseForm.amount
            params.charge_method = this.courseForm.charge_method
            if (this.courseForm.isAllCampus === 1) {
              if (this.formCampusList.length === 0) {
                this.$message({
                  message: '请至少选择一个指定校区',
                  type: 'warning',
                  center: true
                })
                this.loading = false
                return
              }
              params.campus_id = this.formCampusList.join(',')
            }
            courseApi.createFaceCourse(params).then(res => {
              this.loading = false
              if (res.ok) {
                this.$router.back()
              }
            })
          } else {
            this.loading = false
            return false
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .wisroomCreateCourse {
    text-align: left;
    .radiogroup {
      text-align: left;
      background-color: #fff;
      padding: 10px 0;
      margin-top: 20px;
      & > p {
        font-size: 20px;
        font-weight: bold;
        height: 28px;
        line-height: 28px;
        margin-bottom: 30px;
      }
      .el-form {
        width: 1100px;
        .el-form-item {
          width: 340px;
          .el-form-item__label {
            color: #7a808d;
          }
          .el-select {
            width: 340px;
          }
          input {
            width: 340px;
            height: 50px;
          }
        }
        .el-form-item:nth-of-type(odd) {
          margin-right: 80px;
        }
        .classNameItem {
          width: 600px;
        }
        .full_item {
          width: 100% !important;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }
        .el-checkbox {
          margin-right: 30px;
        }
      }
      .chargeStandard {
        display: block;
        width: 100%;
        &>p {
          font-size: 20px;
          font-weight: bold;
          height: 28px;
          line-height: 28px;
          margin-bottom: 30px;
        }
        .el-form-item {
          display: block;
          .el-form-item__label {
            line-height: 50px;
            margin-right: 5px;
          }
          .el-form-item__content {
            display: inline-block;
            .el-select, .el-input {
              width: 340px;
              & > input {
                width: 340px;
              }
            }
          }
        }
        .charge_standard {
          input {
            text-align: right;
          }
        }
      }
      .courseForm {
        .el-form-item {
          width: 480px;
          .el-button {
            margin-left: 20px;
          }
        }
      }
    }
    .bottom {
      .el-button {
        width: 110px;
      }
    }
  }
</style>
